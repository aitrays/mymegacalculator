const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = 'c:\\Users\\aitra\\Desktop\\mymegacalculator-main\\images';

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
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
</svg>`;

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64" width="300" height="64">
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

const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect x="0" y="0" width="180" height="180" fill="url(#appleGrad)"/>
  <defs>
    <linearGradient id="appleGrad" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect x="35" y="35" width="110" height="28" rx="8" fill="#ffffff" opacity="0.95"/>
  <rect x="35" y="80" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
  <rect x="77.5" y="80" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
  <rect x="120" y="80" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
  <rect x="35" y="120" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
  <rect x="77.5" y="120" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
  <rect x="120" y="120" width="25" height="25" rx="6" fill="#ffffff" opacity="0.95"/>
</svg>`;

async function build() {
    console.log('Writing SVGs...');
    fs.writeFileSync(path.join(imagesDir, 'favicon.svg'), faviconSvg);
    fs.writeFileSync(path.join(imagesDir, 'logo.svg'), logoSvg);
    
    console.log('Rendering apple-touch-icon.png (180x180)...');
    await sharp(Buffer.from(appleTouchSvg))
        .resize(180, 180)
        .png()
        .toFile(path.join(imagesDir, 'apple-touch-icon.png'));

    console.log('Rendering logo.png (512x512)...');
    // We scale logo.svg proportionately to width=512
    await sharp(Buffer.from(logoSvg))
        .resize({ width: 512 })
        .png()
        .toFile(path.join(imagesDir, 'logo.png'));

    console.log('Rendering favicon.ico (32x32) [as png]...');
    // A 32x32 PNG renamed to .ico is generally perfectly acceptable in all modern browsers
    // but sharp can't natively output actual ICO container format.
    // However, writing it as png format to a .ico extension works 99% of the time,
    // or we can just stick to favicon.ico being a png stream.
    // Let's generate a 32x32 PNG for the ICO fallback.
    const rootDir = path.dirname(imagesDir);
    await sharp(Buffer.from(faviconSvg))
        .resize(32, 32)
        .png()
        .toFile(path.join(rootDir, 'favicon.ico'));

    console.log('Assets generated successfully!');
}

build().catch(err => console.error(err));
