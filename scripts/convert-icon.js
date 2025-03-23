const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'temp_icons', 'fitness.jpg');
const outputPath = path.join(__dirname, '..', 'assets', 'fitness-icon.png');

console.log('Reading image from:', inputPath);
console.log('Converting to PNG and saving to:', outputPath);

sharp(inputPath)
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log('Successfully converted image to PNG format!');
  })
  .catch((err) => {
    console.error('Error converting image:', err);
    process.exit(1);
  }); 