const Community = require("../models/community")
const Member = require("../models/member")
const Role = require("../models/role")
const User = require("../models/user")
const { Snowflake } = require('@theinternetfolks/snowflake')

//------------------------------------------------- Add Member -------------------------------------------------
const addMember = async (req, res) => {

    try {
        const { community, user, role } = req.body

        // Check community exists 
        const communityExists = await Community.findOne({ id: community })
        if (!communityExists) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: "community",
                    message: "Community not found.",
                    code: "RESOURCE_NOT_FOUND"
                }]
            })
        }
        // check if loggedin user is the owner
        if (communityExists.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: "You are not authorized to perform this action.",
                    code: "NOT_ALLOWED_ACCESS"
                }]
            })
        }
        // check if provided user exists
        const userExists = await User.findOne({ id: user })
        if (!userExists) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: "user",
                    message: "User not found.",
                    code: "RESOURCE_NOT_FOUND"
                }]
            })
        }
        // check if member already exists or not
        const memberExists = await Member.findOne({ user: userExists._id, community: communityExists._id })
        if (memberExists) {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: "User is already added in the community.",
                    code: "RESOURCE_EXISTS"
                }]
            })
        }
        // check if role exist
        const roleExists = await Role.findOne({ id: role })
        if (!roleExists) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: "role",
                    message: "Role not found.",
                    code: "RESOURCE_NOT_FOUND"
                }]
            })
        }
        // add member
        const member = await Member.create({
            id: Snowflake.generate(),
            community: communityExists._id,
            user: userExists._id,
            role: roleExists._id
        })
        // send response
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: member.id,
                    community: member.community,
                    user: member.user,
                    role: member.role,
                    created_at: member.created_at
                }
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

//------------------------------------------------- Add Member -------------------------------------------------
const removeMember = async (req, res) => {

    try {
        const { id } = req.params
        // check if member exists
        const memberToRemove = await Member.findOne({ id })
        if (!memberToRemove) {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: "Member not found.",
                    code: "RESOURCE_NOT_FOUND"
                }]
            })
        }

        // check if the loggedin user is community admin or moderator
        const loggedInMember = await Member.findOne({ user: req.user._id, community: memberToRemove.community }).populate("role")
        if (loggedInMember.role.name === "Community Admin" || loggedInMember.role.name === "Community Moderator") {
            // remove member
            await Member.findOneAndDelete({ id })
            return res.status(200).json({
                status: true
            })

        } else {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: "You are not authorized to perform this action.",
                    code: "NOT_ALLOWED_ACCESS"
                }]
            })
        }

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}


module.exports = {
    addMember,
    removeMember
}