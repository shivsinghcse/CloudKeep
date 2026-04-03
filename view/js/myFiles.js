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

        const file = formdata.get('myFile')
        const size = ((file.size / 1024)/1024).toFixed(1)
        if(size > 200)
            return Toast.error('File is too large max size 200Mb allowed')
        
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
    finally{
        const uploadButton = document.getElementById('upload-btn')
        uploadButton.disabled = false
    }
}

const fetchFiles = async () => {
    try
    {
        const {data} = await axios.get('/api/file')

        const tbody = document.getElementById('tbody');
        const cardContainer = document.getElementById('cardContainer');

        let tableUI = '';
        let cardUI = '';

        data.forEach(file => {

        // TABLE UI (desktop)
        tableUI += `
            <tr class="text-gray-500 border-b border-gray-100 select-none">
                <td class="py-4 px-4 capitalize">${file.filename}</td>
                <td class="uppercase px-4">${file.type}</td>
                <td class="px-4">${(file.size/(1024*1024)).toFixed(1)}</td>
                <td class="px-4">${moment(file.createdAt).format('DD MMM YYYY hh:mm:ss A')}</td>
                <td class="px-4">
                    <div class="flex gap-2">
                        <button onclick="deleteFile('${file._id}', this)" class="bg-rose-400 text-white px-2 py-1 rounded">
                            <i class="ri-delete-bin-4-line"></i>
                        </button>
                        <button onclick="downloadFile('${file._id}', '${file.filename}', this)" class="bg-green-400 text-white px-2 py-1 rounded">
                            <i class="ri-download-line"></i>
                        </button>
                        <button onclick="openModal('${file._id}','${file.filename}','${file.type}','${file.size}')" class="bg-amber-400 text-white px-2 py-1 rounded">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        // CARD UI (mobile)
        cardUI += `
            <div class="bg-white rounded-lg shadow p-4 space-y-3 border border-gray-200 select-none">
                
                <div class="flex justify-between items-start">
                    <h1 class="font-medium text-gray-700 capitalize">${file.filename}</h1>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded uppercase">${file.type}</span>
                </div>

                <div class="text-sm text-gray-500 flex justify-between">
                    <span>Size: ${(file.size/(1024*1024)).toFixed(1)} Mb</span>
                    <span>${moment(file.createdAt).format('DD MMM YYYY hh:mm:ss A')}</span>
                </div>

                <div class="flex justify-end gap-2 pt-2 border-t border-gray-300">
                    <button onclick="deleteFile('${file._id}', this)" class="bg-rose-400 text-white px-3 py-1 rounded">
                        <i class="ri-delete-bin-4-line"></i>
                    </button>

                    <button onclick="downloadFile('${file._id}', '${file.filename}', this)" class="bg-green-400 text-white px-3 py-1 rounded">
                        <i class="ri-download-line"></i>
                    </button>

                    <button onclick="openModal('${file._id}','${file.filename}','${file.type}','${file.size}')" class="bg-amber-400 text-white px-3 py-1 rounded">
                        <i class="ri-share-line"></i>
                    </button>
                </div>

            </div>
        `;
        });

        tbody.innerHTML = tableUI;
        cardContainer.innerHTML = cardUI;
    }
    catch(err)
    {
        console.log(err);
    }
}

const deleteFile = async (id, button) => {
   try
   {
     button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
     button.disabled = true
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
   finally
    {
        button.innerHTML = `<i class="ri-download-line"></i>`
        button.disabled = false
    }
}

const downloadFile = async (id, filename, button) => {
   try
   {
        button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
        button.disabled = true
        
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
    finally
    {
        button.innerHTML = `<i class="ri-download-line"></i>`
        button.disabled = false
    }
}

const openModal = (id, filename, ext, size) => {
    Swal.fire({
            showConfirmButton: false,
            html: `
                <form class='flex flex-col gap-6' onsubmit="shareFile('${id}', '${filename}', '${ext}', '${size}', event)">
                    <h1 class='text-lg text-black font-semibold text-left'>Email id</h1>
                    <input type='email' name='email' required class='border py-1 px-3 rounded' placeholder='Enter email'/>
                    <button id='send-btn' class='px-6 py-2 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer border-0 rounded-md w-fit'>Send</button>
                  
                    <p class=' bg-gray-200 py-2 px-6 rounded-md text-center'>You are sharing - <span class='text-green-600'>${filename}.${ext}</span>
                     
                    <button onclick='Swal.close()' type='button' class='absolute top-2 right-3 text-xl hover:cursor-pointer'>
                        <i class='ri-close-circle-fill'></i>
                    </button>    
                </form>
            `
        });
}

const shareFile = async (id, filename, ext, size, e) => {
    
    try
    {        
        e.preventDefault()        
        const sendButton = document.getElementById('send-btn')
        const form = e.target
        const email = form.email.value.trim()
        sendButton.disabled = true
        sendButton.innerHTML = `<i class='fa fa-spinner fa-spin mr-2'></i>Sending`
        const payload = {
            fileId: id,
            ext,
            email,
            filename,
            size
        }
        const {data} = await axios.post(`/api/share`, payload)
        Toast.success(`${data.message}`)
    }
    catch(err)
    {
        Toast.error(`${err.response ? err.response.data.message : err.message}`)
    }
    finally
    {
        Swal.close()
    }
}