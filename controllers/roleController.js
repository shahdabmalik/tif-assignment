const Role = require("../models/role")
const { Snowflake } = require('@theinternetfolks/snowflake')

//---------------------------------------------- Create Role ----------------------------------------------
const createRole = async (req, res) => {

    try {
        const { name } = req.body
        // create role
        const role = await Role.create({
            id: Snowflake.generate(),
            name: name
        })
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: role.id,
                    name: role.name,
                    created_at: role.created_at,
                    updated_at: role.updated_at
                }
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." })
        console.log(error);
    }
}

//---------------------------------------------- Get all Role ----------------------------------------------
const getAllRoles = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

        // Count total roles in the collection
        const totalRoles = await Role.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalRoles / itemsPerPage);

        // Calculate skip value
        const skip = (page - 1) * itemsPerPage;

        // Retrieve roles for the current page
        const roles = await Role.find()
            .skip(skip)
            .limit(itemsPerPage)
            .select("-_id -__v");

        // sending response
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalRoles,
                    pages: totalPages,
                    page
                },
                data: roles
            }
        });

    } catch (error) {
        res.status(500).json({ message: "An error occurred please try again." });
        console.error(error);
    }
}

module.exports = {
    createRole,
    getAllRoles
}