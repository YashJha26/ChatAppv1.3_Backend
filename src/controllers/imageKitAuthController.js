import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import { deleteImageKitFileRoute } from "../models/imageKitModel.js";

dotenv.config();
export const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
    publicKey: 'public_eDPcEkM04Bg0/be1+mhes/G0DZo=',
    privateKey: 'private_fJ9x9Ri+ZWW6Z3tCl7NaztjpT8g=',
});

const imageKitAuthController = express.Router();

imageKitAuthController.get("/auth",(req,res)=>{
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

imageKitAuthController.delete("/delete",deleteImageKitFileRoute);
export default imageKitAuthController;