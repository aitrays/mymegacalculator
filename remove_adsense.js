const fs = require('fs');
const path = require('path');

const dataStr = fs.readFileSync(path.join(__dirname, 'audit_utf8.json'), 'utf8');
const jsonStr = dataStr.charCodeAt(0) === 0xFEFF ? dataStr.slice(1) : dataStr;
const data = JSON.parse(jsonStr);

const toRemove = data.filter(d => {
    // 404
    if (d.type === '404') return true;
    // Category pages
    if (d.type === 'CATEGORY') return true;
    // Country pages with thin content (< 300 words usually)
    if (d.type === 'COUNTRY' && d.wordCount < 300) return true;
    // VERY THIN globally
    if (d.contentQuality === 'VERY THIN') return true;
    // Contact page (purely navigational/thin)
    if (d.url.includes('contact.html')) return true;
    
    return false;
});

const adsenseRegex = /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4399808216500182" crossorigin="anonymous"><\/script>/g;

let modifiedCount = 0;

toRemove.forEach(item => {
    const filePath = path.join(__dirname, item.url);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    if (adsenseRegex.test(content)) {
        content = content.replace(adsenseRegex, '');
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Removed AdSense from: ${item.url}`);
    }
});

console.log(`Total files modified: ${modifiedCount}`);
