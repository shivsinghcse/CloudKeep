const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')  
mongoose.connect(process.env.DB)

const root = process.cwd()
const express = require('express')
const path = require('path')
const {v4: uniqueId} = require('uuid')

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary"); 

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: "cloudkeep_files",
    resource_type: "auto", 

    public_id: (req, file) => {
        const nameArray = file.originalname.split(".");
        const extension = nameArray.pop();
        const originalName = nameArray.join(".");
        return `${originalName}_${Date.now()}`;
    },

    format: async (req, file) => file.mimetype.split('/')[1] 
}
});

const upload = multer({ storage });

const { signup, login } = require('./controller/user.controller')
const { createFile, fetchFiles, deleteFile, fileDownload } = require('./controller/file.controller')
const { fetchDashboard } = require('./controller/dashboard.controller')
const { verifyToken } = require('./controller/token.controller')
const { shareFile, fetchShared } = require('./controller/share.controller')
const AuthMiddleware = require('./middleware/auth.middleware')
const app = express()
app.listen(process.env.PORT || 8080) 

app.use(express.static('view'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// UI endpoint
const getPth = (filename) => {
    return path.join(root, 'view', filename)
}

app.get('/', (req, res) => {
    res.sendFile(getPth('index.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})

app.get('/login', (req, res) => {
    res.sendFile(getPth('index.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})

app.get('/signup', (req, res) => {
    res.sendFile(getPth('signup.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})

app.get('/dashboard', (req, res) => {
    res.sendFile(getPth('app/dashboard.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})

app.get('/files', (req, res) => {
    res.sendFile(getPth('app/files.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})

app.get('/history', (req, res) => {
    res.sendFile(getPth('app/history.html'), (err) => {
        if(err)
        {
            res.send('404 | Page not found')
        }
    })
})



// API endpoint

app.post('/api/signup', signup)
app.post('/api/login', login)
app.post('/api/file', AuthMiddleware, upload.single('myFile'), createFile)
app.get('/api/file', AuthMiddleware, fetchFiles)
app.delete('/api/file/:id', AuthMiddleware, deleteFile)
app.get('/api/file/download/:id', fileDownload)
app.get('/api/dashboard', AuthMiddleware, fetchDashboard)
app.post('/api/token/verify', verifyToken)
app.post('/api/share', AuthMiddleware, shareFile)
app.get('/api/share', AuthMiddleware, fetchShared)



// endpoint Not found
app.use((req, res) => {
    res.status(404).json({message: 'Endpoint not found !'})
})