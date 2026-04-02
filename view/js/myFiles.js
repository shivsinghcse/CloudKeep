axios.defaults.baseURL = SERVER

window.onload = function () {
    fetchFiles()
}

const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000

})


const uploadFile = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target
        const progressbar = document.getElementById('progressbar')
        const uploadButton = document.getElementById('upload-btn')
        const formdata = new FormData(form)
        
        const options = {
            onUploadProgress: (e) => {
                const loaded = e.loaded
                const total = e.total
                const percentageValue = Math.floor((loaded*100)/total)
                progressbar.style.width = percentageValue+'%'
                progressbar.innerHTML = percentageValue+'%'
            }
        }

        uploadButton.disabled = true
        await axios.post('/api/file', formdata, options)
        Toast.success(`File uploaded!`)
        uploadButton.disabled = false
        progressbar.style.width = 0
        progressbar.innerHTML = ''
        form.reset()
        toggleDrawer()
        fetchFiles()
    }
    catch(err)
    {
        Toast.error('Upload Failed')
    }
}

const fetchFiles = async () => {
    try
    {
        const tbody = document.getElementById('tbody')
        const {data} = await axios.get('/api/file')
        let ui = ''
        data.forEach(file => {
            const row = `<tr class="text-gray-500 border-b border-gray-100">
                <td class="py-4 pl-6 capitalize">${file.filename}</td>
                <td class="capitalize">${file.type}</td>
                <td>${(file.size/(1024*1024)).toFixed(1)}Mb</td>
                <td>${moment(file.createdAt).format('DD MMM YYYY hh:mm:ss A')}</td>
                <td>
                    <div class="space-x-2">
                        <button onclick="deleteFile('${file._id}')" class="bg-rose-400 hover:bg-rose-600 text-white rounded hover:cursor-pointer px-2 py-1">
                            <i class="ri-delete-bin-4-line"></i>
                        </button>

                        <button onclick="downloadFile('${file._id}', '${file.filename}')" class="bg-green-400 hover:bg-green-600 text-white rounded hover:cursor-pointer px-2 py-1">
                            <i class="ri-download-line"></i>
                        </button>

                        <button class="bg-amber-400 hover:bg-amber-600 text-white rounded hover:cursor-pointer px-2 py-1">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>
                </td>
            </tr>`
            ui += row
        });
        tbody.innerHTML = ui
    }
    catch(err)
    {
        console.log(err);
    }
}

const deleteFile = async (id) => {
   try
   {
     await axios.delete(`/api/file/${id}`)
     Toast.success(`File deleted!`)
     fetchFiles()
   }
   catch(err){
     console.log(err.response ? err.response.data.message : err.message);
     console.log(err.message);
     console.log(err);
     Toast.error(`Delete Failed!`)
   }
}

const downloadFile = async (id, filename) => {
   try
   {
        const {data} = await axios.get(`/api/file/download/${id}`, {
            responseType: 'blob'
            })

        const url = URL.createObjectURL(data)

        const link = document.createElement('a')
        link.href = url

        const ext = data.type.split('/').pop()
        const name = `${filename}.${ext}` 
        link.setAttribute('download', name)    

        document.body.appendChild(link);
        link.click()

        link.remove()
        URL.revokeObjectURL(url)
        Toast.success(`File downloaded!`)
   }
   catch(err){
       if(!err.response)
        {
            return Toast.error(err.message)
        } 
        
        const error = await (err?.response?.data)?.text()
        const {message} = JSON.parse(error)
        Toast.error(message)
    }
}