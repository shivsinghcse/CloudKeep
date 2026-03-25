const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    mobile: {
        type: String,
        trim: true,
        required: true
    }, 
    email: {
        type: String,
        trim: true,
        required: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email'
        ]
    }, 
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

userSchema.pre('save', async function() {
    const count = await model('User').countDocuments({mobile: this.mobile})

    if(count > 0)
    {
        throw new Error('Mobile number already registered')
    }

})

userSchema.pre('save', async function() {
    const count = await model('User').countDocuments({email: this.email})
;
    if(count > 0)
    {
        throw new Error('User already registered')
    }

})

userSchema.pre('save', async function(){
    const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
    this.password = encryptedPassword
})

const UserModel = model('User', userSchema)

module.exports = UserModel