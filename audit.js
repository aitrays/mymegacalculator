const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            // skip some dirs if needed, e.g. node_modules, .git
            if (f !== 'node_modules' && f !== '.git') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

const audit = [];

walkDir(__dirname, (filePath) => {
    if (!filePath.endsWith('.html')) return;
    
    const relativeUrl = filePath.replace(__dirname, '').replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // AdSense check
    const hasAdSenseCode = content.includes('pagead2.googlesyndication.com') || content.includes('adsbygoogle') || content.includes('ca-pub-4399808216500182');
    
    // Type check (calc, blog, country, util)
    let type = 'OTHER';
    if (relativeUrl.includes('/blog')) type = 'BLOG';
    else if (relativeUrl.includes('/countries')) type = 'COUNTRY';
    else if (relativeUrl.includes('calculator')) type = 'CALCULATOR';
    else if (relativeUrl.includes('404')) type = '404';
    else if (relativeUrl.includes('/categories')) type = 'CATEGORY';
    
    // Content quality / thin content check
    // Very rough heuristic: remove head, scripts, styles, html tags, count words.
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const body = bodyMatch ? bodyMatch[1] : content;
    const textOnly = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                         .replace(/<[^>]+>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
    
    const wordCount = textOnly.split(' ').length;
    let contentQuality = 'OK';
    if (wordCount < 100) contentQuality = 'VERY THIN';
    else if (wordCount < 300) contentQuality = 'THIN';
    
    // Indexable check
    const hasNoIndex = content.includes('noindex');
    const indexable = !hasNoIndex;
    
    // Check for duplicates
    // Specifically looking for /page.html vs /page/index.html patterns
    // We will do this after collecting all URLs.
    
    // Check for known broken assets like the time.svg
    const hasBrokenTimeSvg = content.includes('/ar/assets/illustrations/time.svg');
    
    audit.push({
        url: relativeUrl,
        type,
        contentQuality,
        wordCount,
        hasAdSenseCode,
        indexable,
        hasBrokenTimeSvg,
        hasNoIndex
    });
});

// Post-process for duplicates
const urlSet = new Set(audit.map(a => a.url));
audit.forEach(item => {
    let duplicate = 'NO';
    if (item.url.endsWith('/index.html')) {
        const potentialDup = item.url.replace('/index.html', '.html');
        if (urlSet.has(potentialDup)) {
            duplicate = `YES (matches ${potentialDup})`;
        }
    } else if (item.url.endsWith('.html') && item.url !== '/index.html') {
        const potentialDup = item.url.replace('.html', '/index.html');
        if (urlSet.has(potentialDup)) {
            duplicate = `YES (matches ${potentialDup})`;
        }
    }
    item.duplicate = duplicate;
});

// Output
console.log(JSON.stringify(audit, null, 2));
