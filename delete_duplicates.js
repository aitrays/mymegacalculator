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

let deletedCount = 0;
let failedCount = 0;

for (const relPath of duplicateFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
            console.log(`DELETED: ${relPath}`);
            deletedCount++;
        } catch (e) {
            console.error(`FAILED TO DELETE: ${relPath}`, e);
            failedCount++;
        }
    } else {
        console.log(`NOT FOUND: ${relPath}`);
    }
}

console.log(`Total deleted: ${deletedCount}, Total failed: ${failedCount}`);
