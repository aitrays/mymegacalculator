const fs = require('fs');
const path = require('path');

const adsenseRegex = /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4399808216500182" crossorigin="anonymous"><\/script>/;

function testFile(filename, shouldHaveAdsense) {
    const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    const hasAdsense = adsenseRegex.test(content);
    if (hasAdsense !== shouldHaveAdsense) {
        console.error(`FAIL: ${filename} (Expected AdSense: ${shouldHaveAdsense}, Got: ${hasAdsense})`);
    } else {
        console.log(`PASS: ${filename} (AdSense: ${shouldHaveAdsense})`);
    }
}

// Test normal pages
testFile('index.html', true);
testFile('age-calculator.html', true);

// Test thin/category pages
testFile('404.html', false);
testFile('ar/categories/index.html', false);
testFile('ar/countries/algeria.html', false);
testFile('contact.html', false);

// Test svg in ar/age-calculator.html
const ageAr = fs.readFileSync(path.join(__dirname, 'ar', 'age-calculator.html'), 'utf8');
if (ageAr.includes('time.svg')) {
    console.error(`FAIL: ar/age-calculator.html still has time.svg`);
} else if (ageAr.includes('date.svg')) {
    console.log(`PASS: ar/age-calculator.html uses date.svg`);
}

// Test author identity
const authorPage = fs.readFileSync(path.join(__dirname, 'author-alex-morgan.html'), 'utf8');
if (authorPage.includes('MyMegaCalculator Team') && !authorPage.includes('<title>Alex Morgan')) {
    console.log(`PASS: author-alex-morgan.html has MyMegaCalculator Team`);
} else {
    console.error(`FAIL: author-alex-morgan.html team standardisation`);
}
