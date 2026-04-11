const { Schema, model, mongoose } = require('mongoose')

const shareSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    receiverEmail: {
        type: String,
        required: true
    }, 
    file: {
        type: mongoose.Types.ObjectId,
        ref: 'File',
        required: true
    },
    filename: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'failed'],
        default: 'sent'
    }

}, {timestamps: true})

const ShareModel = model('Share', shareSchema)

module.exports = ShareModel
