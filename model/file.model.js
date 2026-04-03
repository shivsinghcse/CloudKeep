const {Schema, model} = require('mongoose')

const fileSchema = new Schema({
    filename: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    url: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    resource_type : {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

const FileModel = model("File", fileSchema)

module.exports = FileModel