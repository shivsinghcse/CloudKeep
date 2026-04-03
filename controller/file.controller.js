const FileModel = require('../model/file.model')
const fs = require('fs')
const path = require('path')

const createFile = async (req, res) => {
    try
    {
        const file = req.file
        const {filename} = req.body
        const payload = {
            path: (file.destination+file.filename),
            filename: filename,
            type: file.originalname.split('.').pop(),
            size: file.size
        }

        const newFile = await FileModel.create(payload)
        res.status(200).json(newFile)
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
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
        const file = await FileModel.findByIdAndDelete(id)
        if(!file)
        {
            return res.status(404).json({message: 'file does not exist'})
        }

        fs.unlinkSync(file.path)
        res.status(200).json(file)
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

const fileDownload = async (req, res) => {
    try
    {
        const {id} = req.params
        const file = await FileModel.findById(id)
        if(!file)
        {
            return res.status(404).json({message: 'File not found'})
        }

        const root = process.cwd()
        const filePath = path.join(root, file.path)

        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${file.type}"`)
        // res.setHeader('Content-Type', 'image/png')
        
        res.sendFile(filePath, (err) => {
            if(err)
            {
                res.status(404).json({message: 'File not found'})
            }
        })
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    createFile,
    fetchFiles,
    deleteFile,
    fileDownload
}