const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')  
mongoose.connect(process.env.DB)

const express = require('express')
const cors = require('cors')
const {v4: uniqueId} = require('uuid')

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
const upload = multer({storage: storage})

const { signup, login } = require('./controller/user.controller')
const { createFile, fetchFiles, deleteFile, fileDownload } = require('./controller/file.controller')
const { fetchDashboard } = require('./controller/dashboard.controller')
const { verifyToken } = require('./controller/token.controller')
const app = express()
app.listen(process.env.PORT || 8080)

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:8080/']
}))
app.use(express.static('view'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/signup', signup)
app.post('/login', login)
app.post('/file', upload.single('myFile'),createFile)
app.get('/file', fetchFiles)
app.delete('/file/:id', deleteFile)
app.get('/file/download/:id', fileDownload)
app.get('/dashboard', fetchDashboard)
app.post('/token/verify', verifyToken)