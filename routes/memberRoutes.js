const Joi = require('joi')
const protect = require('../middlewares/authMiddleware')
const { addMember, removeMember } = require('../controllers/memberController')

const router = require('express').Router()


// add member validation
const addMemberValidation = (req, res, next) => {
    const addMemberSchema = Joi.object({
        community: Joi.string().required(),
        user: Joi.string().required(),
        role: Joi.string().required()
    }).options({ abortEarly: false })
    const { error } = addMemberSchema.validate(req.body)
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

// add member
router.post("/", protect, addMemberValidation, addMember)
// remove member
router.delete("/:id", protect, removeMember)



module.exports = router