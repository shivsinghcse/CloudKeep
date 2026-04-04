const FileModel = require('../model/file.model')
const cloudinary = require('../config/cloudinary');
const axios = require("axios");


const createFile = async (req, res) => {
    try {
        const file = req.file
        const { filename } = req.body

        const getResourceTypeFromUrl = (url) => {
            if (url.includes("/image/upload/")) return "image"
            if (url.includes("/video/upload/")) return "video"
            return "raw"
        }

        const payload = {
            url: file.path,
            filename: filename || file.originalname,
            public_id: file.filename,
            resource_type: getResourceTypeFromUrl(file.path), // ✅ FIX
            type: file.originalname.split('.').pop(),
            size: file.size
        }

        const newFile = await FileModel.create(payload)
        res.status(200).json(newFile)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const fetchFiles = async (req, res) => {
    try
    {
        const files = await FileModel.find().sort({createdAt: -1})
        res.status(200).json(files)
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

const deleteFile = async (req, res) => {
    try
    {
        const { id } = req.params 

        const file = await FileModel.findById(id)
        if(!file)
            {
                return res.status(404).json({message: 'file does not exist'})
            }
        
        const result = await cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type ||  "image"
        })

        // console.log("DELETE RESULT:", result)

        await FileModel.findByIdAndDelete(id)
        res.status(200).json({ message: "File deleted successfully" })
    }
    catch(err)
    {
        console.error("DELETE ERROR:", err);
        res.status(500).json({message: err.message})
    }
}

const fileDownload = async (req, res) => {
    try {
        const { id } = req.params

        const file = await FileModel.findById(id)
        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        const downloadUrl = file.url.replace('/upload/', '/upload/fl_attachment/')

        const response = await axios.get(downloadUrl, {
            responseType: 'stream'
        })

        const filename = `${file.filename}.${file.type}` // e.g. "resume.pdf", "setup.exe"

        res.setHeader('Content-Type', response.headers['content-type'])
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

        response.data.pipe(res)

    } catch (err) {
        console.error("Download error:", err.message)
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    createFile,
    fetchFiles,
    deleteFile,
    fileDownload
}