const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')  
mongoose.connect(process.env.DB)

const root = process.cwd()
const express = require('express')
const path = require('path')
const cors = require('cors')
const {v4: uniqueId} = require('uuid')
// console.log(path.join(root, 'view', 'signup.html'));

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, 'files/')
    },
    filename: (req, file, next) => {
        const nameArray = file.originalname.split('.')
        const extension = nameArray.pop()
        const orignalName = nameArray.join('.')
        const name = `${orignalName}_${uniqueId()}.${extension}`
        next(null, name)
    }
})
const upload = multer({
    storage: storage,
    // limits: {
        // fileSize: 200 * 1024 * 1024
    // }
})

const { signup, login } = require('./controller/user.controller')
const { createFile, fetchFiles, deleteFile, fileDownload } = require('./controller/file.controller')
const { fetchDashboard } = require('./controller/dashboard.controller')
const { verifyToken } = require('./controller/token.controller')
const { shareFile } = require('./controller/share.controller')
const app = express()
app.listen(process.env.PORT || 8080)

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:8080/', 'https://cloudkeep-gh1d.onrender.com/']
}))
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
app.post('/api/file', upload.single('myFile'),createFile)
app.get('/api/file', fetchFiles)
app.delete('/api/file/:id', deleteFile)
app.get('/api/file/download/:id', fileDownload)
app.get('/api/dashboard', fetchDashboard)
app.post('/api/token/verify', verifyToken)
app.post('/api/share', shareFile)