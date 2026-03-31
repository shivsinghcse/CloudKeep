# Day-28

- download file
    - find the file using id and get the path using `findById()`
    - whenever you are using `findById(), findByIdAndUpdate(), findByIdAndDelete()` always handle `null`
    - endpoint `file/download/:id`
    - to download use  `sendFile(rootpath)` from `res`, it return promise so handle with callbak and it give err parameter by default
    - find rootpath = current working directory (process.cwd() + file.path) to make full path use path module `path.join(root, file.path)` it will give absolute path

- force file to download in express using res.sendFile()
    - for that we send headers(silent info which server sends to browser)
    `res.setHeader('Content-Disposition', 'attachment; filename="demo.png"')`
    `res.setHeader('Content-Type', 'image/png');`

```js
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

        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`)
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
```
- for smaller range project we will create api for dashboard     
- we did not create model for dashboard