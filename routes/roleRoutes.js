const Joi = require('joi')
const { createRole, getAllRoles } = require('../controllers/roleController')

const router = require('express').Router()

// Create role validation
const createRoleValidation = (req, res, next) => {
    const createRoleSchema = Joi.object({
        name: Joi.string().min(2).max(64).required(),
    }).options({ abortEarly: false })
    const { error } = createRoleSchema.validate(req.body)
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

// create role
router.post("/", createRoleValidation, createRole)
// get all roles
router.get("/", getAllRoles)



module.exports = router