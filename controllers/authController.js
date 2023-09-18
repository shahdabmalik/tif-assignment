const { Snowflake } = require("@theinternetfolks/snowflake")
const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//------------------------------------- SignUp User Controller -------------------------------------
const signupUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        // check if user exists
        const exists = await User.exists({ email })
        if (exists) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: "email",
                    message: "User with this email address already exists.",
                    code: "RESOURCE_EXISTS"
                }]
            })
        }
        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10)
        // create user
        const user = new User({
            id: Snowflake.generate(),
            name,
            email,
            password: encryptedPassword
        })

        await user.save()
        // generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        // sending token 
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expiresIn: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        })
        // sending response
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                },
                meta: {
                    access_token: token
                }
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

//------------------------------------- SignUp User Controller -------------------------------------
const signinUser = async (req, res) => {

    try {
        const { email, password } = req.body
        // find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                status: false,
                errors: [{
                    param: "email",
                    message: "User with this email address does not exists.",
                    code: "INVALID_CREDENTIALS"
                }]
            })
        }
        // check password
        const passwordIsCorrect = await bcrypt.compare(password, user.password)
        if (!passwordIsCorrect) {
            return res.status(404).json({
                status: false,
                errors: [{
                    param: "password",
                    message: "The credentials you provided are invalid.",
                    code: "INVALID_CREDENTIALS"
                }]
            })
        }
        // generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        // sending token
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expiresIn: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        })
        // sending response
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                },
                meta: {
                    access_token: token
                }
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }

}

//------------------------------------- Get Me Controller -------------------------------------
const getMe = async (req, res) => {

    try {
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    created_at: req.user.created_at
                }
            }
        })
    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

module.exports = {
    signupUser,
    signinUser,
    getMe
}