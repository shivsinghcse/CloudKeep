const UserModel = require('../model/user.model')
const bcrypt = require('bcrypt')

const signup = async (req, res) => {
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

const login = async (req, res) => {
    try
    {
        const {email, password} = req.body
        const user = await UserModel.findOne({email: email})
        
        if(!user)
        {
            return res.status(404).json({message: 'user does not exist'})
        }

        const isLogin =  bcrypt.compareSync(password, user.password)
        
        if(!isLogin)
        {
            return res.status(401).json({message: 'incorrect password'})
        }

        res.status(200).json({message: 'Login Success'})
    }
    catch(err)
    {
         res.status(500).json({message: err.message})
    }
}

module.exports = {
    signup,
    login
}