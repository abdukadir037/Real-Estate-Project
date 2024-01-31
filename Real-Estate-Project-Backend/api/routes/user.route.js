import express from 'express'
import {   forgotPassword, login, resetPassword, signup, user, userDelete, userUpdate, users } from '../controllers/user.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateUser from '../middleware/validateUser.js'

const router = express.Router()

// router endpoints
router.post("/signup", validateUser, signup)
router.post("/login", login)

router.get("/", users)
router.get("/user", verifyToken, user)
router.put("/update", verifyToken, userUpdate)
router.delete("/delete", verifyToken, userDelete)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:id/:token", resetPassword)




export default router