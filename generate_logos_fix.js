const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = 'c:\\Users\\aitra\\Desktop\\mymegacalculator-main\\images';

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 64" width="380" height="64">
  <g transform="translate(0, 0)">
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#emeraldGrad)"/>
    <defs>
      <linearGradient id="emeraldGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>
    </defs>
    <rect x="12" y="12" width="40" height="12" rx="4" fill="#ffffff" opacity="0.95"/>
    <rect x="12" y="30" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
    <rect x="27" y="30" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
    <rect x="42" y="30" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
    <rect x="12" y="45" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
    <rect x="27" y="45" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
    <rect x="42" y="45" width="10" height="10" rx="3" fill="#ffffff" opacity="0.95"/>
  </g>
  
  <text x="74" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="900" fill="#0f172a" letter-spacing="-0.025em">MyMega<tspan fill="#10b981">Calculator</tspan></text>
</svg>`;

async function build() {
    console.log('Writing updated logo.svg...');
    fs.writeFileSync(path.join(imagesDir, 'logo.svg'), logoSvg);
    
    console.log('Rendering updated logo.png (800 width proportionate)...');
    await sharp(Buffer.from(logoSvg))
        .resize({ width: 800 })
        .png()
        .toFile(path.join(imagesDir, 'logo.png'));

    console.log('Logos fixed and generated successfully!');
}

build().catch(err => console.error(err));
