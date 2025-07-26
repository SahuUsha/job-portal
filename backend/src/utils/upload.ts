import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'resumes',
    resource_type: 'raw',
    public_id: `${Date.now()}-${file.originalname}`,
    format: 'pdf' // optional, or omit to auto-detect
  }),
});

const upload = multer({ storage });

export default upload;
