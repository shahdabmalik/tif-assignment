const router = require('express').Router()
const { signupUser, signinUser, getMe } = require('../controllers/authController')
const Joi = require('joi')
const protect = require('../middlewares/authMiddleware')
const validater = require('express-joi-validation').createValidator({})

// signup validation
const signupValidation = (req, res, next) => {
    const signupSchema = Joi.object({
        name: Joi.string().min(2).max(64).required(),
        email: Joi.string().email().max(128).required(),
        password: Joi.string().min(6).max(64).required()
    }).options({ abortEarly: false })
    const { error } = signupSchema.validate(req.body)
    if (error) {
        let errors = error.details.map((e) => {
            return {
                param: e.path[0],
                message: e.message.replace(/"/g, ''),
                code: "INVALID_INPUT"
            }
        })
        res.status(400).json({ status: false, errors, })
    } else {
        next()
    }
}
// signin validation
const signinValidation = (req, res, next) => {
    const signinSchema = Joi.object({
        email: Joi.string().email().max(128).required(),
        password: Joi.string().min(6).max(64).required()
    }).options({ abortEarly: false })
    const { error } = signinSchema.validate(req.body)
    if (error) {
        let errors = error.details.map((e) => {
            return {
                param: e.path[0],
                message: e.message.replace(/"/g, ''),
                code: "INVALID_INPUT"
            }
        })
        res.status(400).json({ status: false, errors, })
    } else {
        next()
    }
}

// signup route
router.post("/signup", signupValidation, signupUser)
// signin route
router.post("/signin", signinValidation, signinUser)
// get me route
router.get("/me", protect, getMe)


module.exports = router