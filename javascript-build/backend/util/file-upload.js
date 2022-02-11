const cloudinary = require('cloudinary').v2;

async function sendToCloudinary(filePath) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true,
  });

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'places-project-javascript',
  });

  return result.secure_url;
}

module.exports = sendToCloudinary;
