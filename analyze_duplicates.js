const fs = require('fs');
const path = require('path');

const dataStr = fs.readFileSync(path.join(__dirname, 'audit_utf8.json'), 'utf8');
const jsonStr = dataStr.charCodeAt(0) === 0xFEFF ? dataStr.slice(1) : dataStr;
const data = JSON.parse(jsonStr);

const duplicates = data.filter(d => d.duplicate !== 'NO');

console.log("Analyzing Duplicate Pairs...");

const toDelete = [];
const checked = new Set();

duplicates.forEach(d => {
    if (checked.has(d.url)) return;
    
    // Find the pair
    const matchMatch = d.duplicate.match(/matches (.*)\)/);
    if (!matchMatch) return;
    const pairUrl = matchMatch[1];
    checked.add(d.url);
    checked.add(pairUrl);
    
    const file1 = path.join(__dirname, d.url);
    const file2 = path.join(__dirname, pairUrl);
    
    let can1 = 'UNKNOWN', can2 = 'UNKNOWN';
    if (fs.existsSync(file1)) {
        const c1 = fs.readFileSync(file1, 'utf8');
        const m1 = c1.match(/<link rel="canonical" href="([^"]+)"/);
        if (m1) can1 = m1[1];
    }
    if (fs.existsSync(file2)) {
        const c2 = fs.readFileSync(file2, 'utf8');
        const m2 = c2.match(/<link rel="canonical" href="([^"]+)"/);
        if (m2) can2 = m2[1];
    }
    
    console.log(`\nPair: ${d.url} VS ${pairUrl}`);
    console.log(`Canonical 1: ${can1}`);
    console.log(`Canonical 2: ${can2}`);
    
    // Logic to determine deletion
    // If canonical URL ends with .html and not /index.html, then the /index.html file should be deleted.
    const isCan1Index = can1.endsWith('/index.html');
    const isCan2Index = can2.endsWith('/index.html');
    
    // We assume the canonical URL is the same for both, which is typical if it was copied.
    let targetCanonical = can1 !== 'UNKNOWN' ? can1 : can2;
    if (targetCanonical !== 'UNKNOWN') {
        const parsed = new URL(targetCanonical);
        const canonPath = parsed.pathname;
        if (canonPath === d.url) {
            toDelete.push(pairUrl);
            console.log(`-> Keep: ${d.url} (matches canonical)`);
            console.log(`-> Delete: ${pairUrl}`);
        } else if (canonPath === pairUrl) {
            toDelete.push(d.url);
            console.log(`-> Keep: ${pairUrl} (matches canonical)`);
            console.log(`-> Delete: ${d.url}`);
        } else {
            // Check without trailing slash or specific cases
            const withoutTrailing = canonPath.replace(/\/$/, '');
            if (withoutTrailing === d.url.replace(/\.html$/, '')) {
                 // e.g. /blog canonical is /blog, which means /blog.html
                 console.log(`-> Canon path matches: ${d.url} implicitly. (Canon: ${canonPath})`);
                 toDelete.push(pairUrl);
            } else {
                 console.log(`-> Unclear canonical relation. Canon is ${canonPath}`);
            }
        }
    }
});

console.log(`\n\nPROPOSED DELETIONS:\n${toDelete.join('\n')}`);
