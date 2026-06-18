require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Using env:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

const localPath = 'public/uploads/1781690331005-47482761.avif';

cloudinary.uploader.upload(localPath, { folder: 'kilo-biryani/test' })
  .then((res) => {
    console.log('Upload success:', res.secure_url);
  })
  .catch((err) => {
    console.error('Upload failed:', err);
  });
