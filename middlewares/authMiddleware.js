const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Authorization middleware
const protect = async (req, res, next) => {

    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({
                status: false,
                errors: [{
                    message: "You need to sign in to proceed.",
                    code: "NOT_SIGNEDIN"
                }]
            })
        }
        // verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // find user
        const user = await User.findOne({ id: verified.userId }).select("id name email created_at _id")
        if (!user) {
            return res.status(401).json({
                status: false,
                errors: [{
                    message: "You need to sign in to proceed.",
                    code: "NOT_SIGNEDIN"
                }]
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            status: false,
            errors: [{
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
            }]
        })
        console.log(error);
    }

}

module.exports = protect