import express from "express";
import {prisma} from "../socket/prisma.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const generateToken = (user) =>{
    const accessToken = jwt.sign({
        email:user?.email,
        id:user?.id,
        name:user?.name,
        imageUrl:user?.imageUrl
    },process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
    return accessToken;
}

export const signup = async (req ,res) =>{
    const {email,password,name,imageUrl} = req?.body;
    if (!email) {
        return res.json({ message: "Email is required" });
      }
      if (!password) {
        return res.json({ message: "Password is required" });
      }
      if (!name) {
        return res.json({ message: "Name is required" });
      }

      try {
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.json({ message: "Email is already in use" });
        }
        if(!existingUser){
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = await prisma.user.create({
                data: { email, name, imageUrl, password: hashedPassword },
            });


            //res.cookie("token", await generateToken(newUser));
            const token=await generateToken(existingUser);
            return res.json({
                message: "Signed up successfully",
                token: token,
                user: {
                  email: newUser?.email,
                  id: newUser?.id,
                  name: newUser?.name,
                  imageUrl: newUser?.imageUrl,
                },
            });
        }
      } catch (error) {
        console.log(error);
        return res.json({ error: error?.toString() });  
      }
} 

export const login = async (req,res) => {
    const { email, password } = req?.body;
    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!password) {
      return res.json({ message: "Password is required" });
    }
  
    try {
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (!existingUser) {
        return res.json({ message: "Couldn't find the user" });
      }
      if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser?.password
        );
        if (!isPasswordValid) {
          return res.json({ message: "Invalid password" });
        }
        const token=await generateToken(existingUser);
        //res.cookie("token", token);
        return res.json({
          message: "Logged in successfully",
          token:token,
          user: {
            email: existingUser?.email,
            id: existingUser?.id,
            name: existingUser?.name,
            imageUrl: existingUser?.imageUrl,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({ error: error?.toString() });
    }
};

export const verifyUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log("token ",token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: decoded?.email },
    });

    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      isAuthenticated: true,
      user: {
        email: existingUser?.email,
        id: existingUser?.id,
        name: existingUser?.name,
        imageUrl: existingUser?.imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

