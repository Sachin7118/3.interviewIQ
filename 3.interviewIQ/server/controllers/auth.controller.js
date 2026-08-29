import crypto from "crypto";
import genToken from "../config/token.js"
import User from "../models/user.model.js"

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex")
}

const setAuthCookie = (res, userId) => {
    const token = genToken(userId)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

const sanitizeUser = (user) => {
    const userObj = user.toObject ? user.toObject() : { ...user }
    delete userObj.password
    return userObj
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." })
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." })
        }

        const user = await User.create({
            name: name || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            password: hashPassword(password)
        })

        setAuthCookie(res, user._id)
        return res.status(201).json(sanitizeUser(user))
    } catch (error) {
        return res.status(500).json({ message: `Signup error: ${error.message}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." })
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const user = await User.findOne({ email: normalizedEmail }).select("+password")

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const isPasswordValid = user.password && hashPassword(password) === user.password

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        setAuthCookie(res, user._id)
        return res.status(200).json(sanitizeUser(user))
    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error.message}` })
    }
}

export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        setAuthCookie(res, user._id)
        return res.status(200).json(sanitizeUser(user))
    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}
