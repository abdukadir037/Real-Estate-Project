import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer' 

import express from 'express'



dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

// Sign Up - POST
export const signup = async (req, res, next) => {
    try {
        const {name, email, role, avatar, password} = req.body

        const user = await userModel.findOne({email})

        if(user) {
            return res.status(409).json({status: 409, message: "User email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            avatar,
            name,
            email,
            role,
            password: hashedPassword
        })

        if(!newUser) {
            return res.status(400).json({status: 400, message: "User was not created!"})
        }

        await newUser.save()

        res.status(201).json({status: 201, message: "User created successfully"})
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// Login - POST
export const login = async (req, res) => {
    try {
        const {email, password } = req.body

        const user = await userModel.findOne({email})

        if(!user) {
            return res.status(404).json({status: 404, message: "User email not found"})
        }

        if(!password) {
            return res.status(400).json({status: 400, message: "Password required field missing!"})
        }

        if(!email) {
            return res.status(400).json({status: 400, message: "Email required field missing!"})
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)

        if(!isCorrectPassword) {
            return res.status(401).json({status: 401, message: "Password is not correct!"})
        }

        const token = jwt.sign({id: user._id, role: user.role}, SECRET_KEY, {expiresIn: "7d"})

        res.status(200).json({status: 200, message: "User logged in successfully", token})
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// Users - GET
export const users = async (req, res) => {
    try {

        const users = await userModel.find().select("-password")

        if(users.length === 0) {
           return res.status(404).json({status: 404, message: "Users not found"})
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User - GET
export const user = async (req, res) => {
    try {

        const user = await userModel.findById(req.user.id).select("-password")

        if(!user) {
            return res.status(404).json({status: 404, message: "User not found"})
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User Update - PUT
export const userUpdate = async (req, res) => {
    try {

        const userId = req.user.id
        const {name, email, avatar} = req.body

        const updatedUser = await userModel.findByIdAndUpdate(
            {_id: userId},
            {
                name: name,
                email: email,
                avatar: avatar
            },
            { new: true } 
        )

        if(!updatedUser) {
            return res.status(400).json({status: 400, message: "User was not updated!"})
        }

        res.status(200).json({status: 200, message: "User updated successfully"})

    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User Delete - DELETE
export const userDelete = async (req, res) => {
    try {
        const userId = req.user.id

        const deletedUser = await userModel.findByIdAndDelete({_id: userId})

        if(!deletedUser) {
            return res.status(400).json({status: 400, message: "User was not deleted!"})
        }

        res.status(200).json({status: 200, message: "User deleted successfully"})

    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}




//  Forget - Password




// export const forgotPassword = async (req, res) => {
//     const {email} = req.body;
//     userModel.findOne({email: email})
//     .then(user => {
//         if(!user) {
//             return res.status(404).json({status: 404, message: "User not found"})
//         } 
//         const token = jwt.sign({id: user._id}, SECRET_KEY, {expiresIn: "1d"})
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'mafiobio700@gmail.com',
//               pass: 'aolp patj oxni vuwe'
//             }
//           });
          
//           var mailOptions = {
//             from: 'youremail@gmail.com',
//             to: 'user email@gmail.com',
//             subject: 'Reset Password Link',
//             text: `http://localhost:5173/reset_password/${user._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               return res.status(200).json({status: 200, message: "Email sent successfully"});            }
//           });
//     })
// };





// User Forgot - Password

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ status: 404, message: "User not existed" })
            }
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1d" })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mafiobio700@gmail.com',
                    pass: 'aolp patj oxni vuwe'
                }
            });

            // header email
            const header = `<header style="background: #1E88E5; padding: 10px; text-align: center; color: white;"><h1>Real Estate MarketPlace</h1></header>`;
            // footer email
            const footer = `<footer style="background: #1E88E5; padding: 10px; text-align: center; color: white;"><h5>Real Estate MarketPlace</h5><br/> <p>© 2023 Real Estate MarketPlace - All rights reserved</p></footer>`;
            // email body
            const emailBody = `http://localhost:5173/reset_password/${user._id}/${token}`;
            // full emailContent
            const emailContent = `${header}<div style="padding: 20px;">${emailBody}</div>${footer}`;

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: user.email,
                subject: 'Reset Password Link',
                html: emailContent
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200).json({ status: 200, message: "Email sent successfully" });
                }
            });
        })
};




// User Reset - Password

export const resetPassword = async (req, res) => {
   
        const {id, token} = req.params
        const {password} = req.body
    
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if(err) {
                return res.status(404).json({status: 404, message: "Error with token"})
            } else {
                bcrypt.hash(password, 10)
                .then(hash => {
                    userModel.findByIdAndUpdate({_id: id}, {password: hash})
                    .then(() =>  res.status(200).json({status: 200, message: "Password updated successfully"}))
                    .catch(err => res.send({Status: err}))
                })
                .catch(err => res.send({Status: err}))
            }
        })
    }

