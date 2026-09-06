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

let canonicalsExist = true;
const missingCanonicals = [];

for (const rel of duplicateFiles) {
    const canonPath = path.join(rootDir, rel.replace('/index.html', '.html'));
    if (!fs.existsSync(canonPath)) {
        canonicalsExist = false;
        missingCanonicals.push(rel.replace('/index.html', '.html'));
    }
}

if (canonicalsExist) {
    console.log("PASS: All .html canonical pages still exist.");
} else {
    console.error("FAIL: Missing canonicals:", missingCanonicals);
}

// Check for references to the deleted paths
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

const allHtmlFiles = getAllFiles(rootDir, ['.html', '.xml', '.js', '.json']);
let referencesFound = 0;

for (const file of allHtmlFiles) {
    if (file.endsWith('verify_post_deletion.js') || file.endsWith('delete_duplicates.js') || file.endsWith('verify_duplicates.js') || file.endsWith('audit.json') || file.endsWith('audit_utf8.json') || file.endsWith('analyze_duplicates.js') || file.endsWith('audit.js')) continue;
    const content = fs.readFileSync(file, 'utf8');
    for (const rel of duplicateFiles) {
        if (content.includes(rel)) {
            console.error(`FAIL: Found reference to ${rel} in ${file}`);
            referencesFound++;
        }
    }
}

if (referencesFound === 0) {
    console.log("PASS: No references to deleted files found in project files.");
} else {
    console.error(`FAIL: Found ${referencesFound} references.`);
}

const sitemapStat = fs.statSync(path.join(rootDir, 'sitemap.xml'));
console.log(`PASS: sitemap.xml exists (size: ${sitemapStat.size} bytes).`);
