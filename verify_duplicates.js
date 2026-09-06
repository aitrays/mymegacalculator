const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const duplicateFiles = [
    '/ar/countries/bahrain/index.html',
    '/ar/countries/jordan/index.html',
    '/ar/countries/kuwait/index.html',
    '/ar/countries/morocco/index.html',
    '/ar/countries/oman/index.html',
    '/ar/countries/qatar/index.html',
    '/ar/countries/saudi-arabia/index.html',
    '/ar/countries/tunisia/index.html',
    '/ar/countries/uae/index.html',
    '/ar/countries/egypt/index.html',
    '/ar/countries/algeria/index.html'
];

function getAllFiles(dir, exts, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (filepath.includes('node_modules') || filepath.includes('.git')) continue;
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            getAllFiles(filepath, exts, fileList);
        } else {
            const ext = path.extname(filepath);
            if (exts.includes(ext) || exts.includes('.*')) {
                fileList.push(filepath);
            }
        }
    }
    return fileList;
}

const allHtmlFiles = getAllFiles(rootDir, ['.html', '.xml']);
const allJsJsonFiles = getAllFiles(rootDir, ['.js', '.json']);

const results = [];

for (const relPath of duplicateFiles) {
    const fullPath = path.join(rootDir, relPath);
    const publicUrlWithIndex = relPath;
    const publicUrlDir = relPath.replace('/index.html', '/');
    const publicUrlClean = relPath.replace('/index.html', '');
    const canonicalAlt = relPath.replace('/index.html', '.html');
    
    let internalLinks = 0;
    let canonicalLinks = 0;
    let hreflangLinks = 0;
    let sitemapRef = 0;
    let jsJsonRef = 0;
    
    const searches = [publicUrlWithIndex, publicUrlDir, publicUrlClean];

    for (const file of allHtmlFiles) {
        const content = fs.readFileSync(file, 'utf8');
        
        // internal links
        if (content.match(new RegExp(`href=["'](${publicUrlWithIndex}|${publicUrlDir}|${publicUrlClean})["']`, 'gi'))) {
            // Exclude links inside the file itself if they are canonical/hreflang, but wait, let's just count them.
            // Actually, we want to know if OTHER files link to it, or if it links to itself.
            if (!file.endsWith(relPath.replace('/', path.sep))) {
                if (file.endsWith('sitemap.xml')) {
                    sitemapRef++;
                } else {
                    internalLinks++;
                }
            }
        }
        
        // canonical
        if (content.match(new RegExp(`rel=["']canonical["'].*href=["'].*(${publicUrlWithIndex}|${publicUrlDir}|${publicUrlClean})["']`, 'gi'))) {
             canonicalLinks++;
        }
        
        // hreflang
        if (content.match(new RegExp(`hreflang=.*href=["'].*(${publicUrlWithIndex}|${publicUrlDir}|${publicUrlClean})["']`, 'gi'))) {
             hreflangLinks++;
        }
    }
    
    for (const file of allJsJsonFiles) {
        if (file.endsWith('verify_duplicates.js') || file.endsWith('audit.json') || file.endsWith('audit_utf8.json') || file.endsWith('analyze_duplicates.js')) continue;
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(publicUrlWithIndex) || content.includes(publicUrlDir) || content.includes(publicUrlClean)) {
            jsJsonRef++;
        }
    }
    
    results.push({
        file: relPath,
        fullPath,
        publicUrlWithIndex,
        canonicalAlt,
        internalLinks,
        canonicalLinks,
        hreflangLinks,
        sitemapRef,
        jsJsonRef
    });
}

console.log(JSON.stringify(results, null, 2));
