// Reduce las capturas a lo que el PDF necesita (se ven a ~1280 px de ancho)
const sharp = require('sharp');
const fs = require('fs');
const m = require('./manifest.json');
fs.mkdirSync('pdfshots', { recursive: true });
(async () => {
  for (const [device, list] of Object.entries(m)) for (const { file } of list) {
    await sharp('shots/' + file).resize({ width: device === 'desktop' ? 1920 : 660 }).jpeg({ quality: 80, mozjpeg: true }).toFile('pdfshots/' + file);
  }
  const total = fs.readdirSync('pdfshots').reduce((a, f) => a + fs.statSync('pdfshots/' + f).size, 0);
  console.log('MB', (total / 1048576).toFixed(1));
})();
