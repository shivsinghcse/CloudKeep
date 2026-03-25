const UserModel = require('../model/user.model')

const signUp = async (req, res) => {
    try
    {
        await UserModel.create(req.body)
        res.status(200).json({message: 'Signup successfully'})
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    signUp
}