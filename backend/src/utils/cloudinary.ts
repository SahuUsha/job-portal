// backend/src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });
cloudinary.config({
  cloud_name:"ddig2vbo9" ,
  api_key: "779398456185175",
  api_secret: "C_e96x79AxfoTU7SPvf2WvHIsho",
});

export default cloudinary;
