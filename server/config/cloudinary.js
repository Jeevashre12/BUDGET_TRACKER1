import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary only if env variables are present
const hasCloudinaryEnv = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (hasCloudinaryEnv) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

export const cloudinaryConfigured = hasCloudinaryEnv
export default cloudinary




