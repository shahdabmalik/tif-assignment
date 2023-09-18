const Joi = require('joi')
const { createCommunity, getAllCommunity, getOwnCommunity, getAllMembers, getJoinedCommunity } = require('../controllers/communityController')
const protect = require('../middlewares/authMiddleware')

const router = require('express').Router()

// create community validation
const createCommunityValidation = (req, res, next) => {
    const createCommunitySchema = Joi.object({
        name: Joi.string().min(2).max(128).required(),
    }).options({ abortEarly: false })
    const { error } = createCommunitySchema.validate(req.body)
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

// create community route
router.post("/", protect, createCommunityValidation, createCommunity)
// get all communities route
router.get("/", getAllCommunity)
// get all members route
router.get("/:id/members", getAllMembers)
// get my owned communities route
router.get("/me/owner", protect, getOwnCommunity)
// get my joined community route
router.get("/me/member", protect, getJoinedCommunity)


module.exports = router