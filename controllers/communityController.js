const Community = require("../models/community")
const { Snowflake } = require('@theinternetfolks/snowflake')
const Member = require("../models/member")
const Role = require("../models/role")

//-------------------------------------------- Create community --------------------------------------------
const createCommunity = async (req, res) => {

    try {
        const { name } = req.body
        // create community
        const community = await Community.create({
            id: Snowflake.generate(),
            name: name,
            owner: req.user._id
        })
        // get role
        const role = await Role.findOne({ name: "Community Admin" })
        // make user first member of community with a role of admin
        const member = await Member.create({
            id: Snowflake.generate(),
            community: community._id,
            user: req.user._id,
            role: role._id
        })
        // send response
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.created_at,
                    updated_at: community.updated_at,
                }
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }

}

//-------------------------------------------- get all community --------------------------------------------
const getAllCommunity = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;

        // Count total communities in the collection
        const totalCommunities = await Community.countDocuments().exec();

        // Calculate total pages
        const totalPages = Math.ceil(totalCommunities / itemsPerPage);

        // Calculate skip value
        const skip = (page - 1) * itemsPerPage;

        // Find the communities for the current page
        const communities = await Community.find()
            .skip(skip)
            .limit(itemsPerPage)
            .populate({
                path: "owner",
                select: "id name -_id",
                model: "User"
            })
            .select("id name slug created_at updated_at -_id")
            .exec();

        // send response
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCommunities,
                    pages: totalPages,
                    page: page
                },
                data: communities
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }

}

//-------------------------------------------- Get all members of community --------------------------------------------
const getAllMembers = async (req, res) => {
    try {
        // get page number
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        // id from params
        const { id } = req.params
        // find community
        const community = await Community.findOne({ id })
        if (!community) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: "community",
                    message: "Community not found.",
                    code: "RESOURCE_NOT_FOUND"
                }]
            })
        }
        // calculate skip value
        const skip = (page - 1) * itemsPerPage
        // total members
        const totalMember = await Member.countDocuments({ community: community._id })
        // calculate total pages
        const totalPages = Math.ceil(totalMember / itemsPerPage)
        // find members
        const members = await Member.find({ community: community._id })
            .skip(skip)
            .limit(itemsPerPage)
            .populate("user", "id name -_id")
            .populate("role", "id name -_id")
            .select("id community created_at -_id")

        // send response
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalMember,
                    pages: totalPages,
                    page: page
                },
                data: members
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

//-------------------------------------------- Get owned community --------------------------------------------
const getOwnCommunity = async (req, res) => {

    try {
        // get page number
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;

        // Calculate the number of documents to skip
        const skip = (page - 1) * itemsPerPage

        // Query to get the total count of communities by this owner
        const totalCommunities = await Community.countDocuments({ owner: req.user._id });

        // Calculate the total number of pages based on the total count and perPage
        const totalPages = Math.ceil(totalCommunities / itemsPerPage);

        // Query the Community collection for communities with the specified owner ID
        const communities = await Community.find({ owner: req.user._id })
            .skip(skip)
            .limit(itemsPerPage)
            .select("-_id -__v")
            .exec();
        // send response
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCommunities,
                    pages: totalPages,
                    page: page
                },
                data: communities
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

//-------------------------------------------- Get owned community --------------------------------------------
const getJoinedCommunity = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;

        // get member role
        const memberRole = await Role.findOne({ name: "Community Member" })
        // find member
        const member = await Member.find({ user: req.user._id, role: memberRole._id })
        // get community ids where i am a member
        const communityIds = member.map((m) => m.community.toString())

        // Calculate skip value based on page and itemsPerPage
        const skip = (page - 1) * itemsPerPage;
        // find communties
        const communities = await Community.find({ _id: { $in: communityIds } })
            .skip(skip)
            .limit(itemsPerPage)
            .select("-_id -__v")
            .populate("owner", "id name -_id")

        // total documents
        const totalCommunties = communities.length
        // total pages
        const totalPages = Math.ceil(totalCommunties / itemsPerPage)

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCommunties,
                    pages: totalPages,
                    page: page
                },
                data: communities
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}


module.exports = {
    createCommunity,
    getAllCommunity,
    getAllMembers,
    getOwnCommunity,
    getJoinedCommunity
}