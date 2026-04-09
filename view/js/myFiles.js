axios.defaults.baseURL = SERVER
const token = localStorage.getItem('authToken')

window.onload = function () {
    fetchFiles()
}

const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000
})


const uploadFile = async (e) => {
    e.preventDefault()
    const uploadButton = document.getElementById('upload-btn')
    const fileInput = document.getElementById('file-input')
    try
    {
        const form = e.target
        const progressbar = document.getElementById('progressbar')
        const progressLabel = document.getElementById('progressLabel')
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
            
                progressbar.style.width = percentageValue + '%';
                progressLabel.textContent = percentageValue + '%';
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        uploadButton.disabled = true
        uploadButton.style.cursor = 'not-allowed'
        fileInput.disabled = true
        fileInput.style.cursor = 'not-allowed'
        await axios.post('/api/file', formdata, options)
        Toast.success(`File uploaded!`)
        progressbar.style.width = 0
        progressLabel.textContent = '0%'
        form.reset()
        toggleDrawer()
        fetchFiles()
    }
    catch(err)
    {
        Toast.error('Upload Failed')
    }
    finally{
        uploadButton.disabled = false
        uploadButton.style.cursor = 'default'
        fileInput.disabled = false
        fileInput.style.cursor = 'default'
    }
}

const fetchFiles = async () => {
    try
    {
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const {data} = await axios.get('/api/file', options)

        const tbody = document.getElementById('tbody');
        const cardContainer = document.getElementById('cardContainer');

        let tableUI = '';
        let cardUI = '';
        const notFound = `
            <tr class=" w-full">
                <td colspan="4">
                    <div class="flex flex-col items-center justify-center py-16 px-6 my-6 mx-auto max-w-md">

                        <!-- Illustration container -->
                        <div class="relative mb-6">
                            <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                            <svg class="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            </div>
                            <!-- Decorative dot -->
                            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></span>
                        </div>

                        <!-- Text -->
                        <h2 class="text-lg font-semibold text-slate-700 mb-1">No files added</h2>
                        <p class="text-sm text-slate-400 text-center leading-relaxed max-w-xs">
                            Upload a file to get started. Supported formats will appear here.
                        </p>

                        <!-- Optional CTA -->
                        <button onclick="toggleDrawer()" class="mt-6 px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload File
                        </button>
                </div>
            </td>
        </tr>
    `

        if(data.length === 0){
            tbody.innerHTML = notFound
            cardContainer.innerHTML = notFound
            return
        }
        data.forEach(file => {

            const fileIcon = {
                'pdf': 'ri-file-pdf-line text-rose-400',
                'jpg': 'ri-image-line text-blue-400',
                'jpeg': 'ri-image-line text-blue-400',
                'png': 'ri-image-line text-blue-400',
                'mp4': 'ri-video-line text-purple-400',
                'mp3': 'ri-music-line text-green-400',
                'doc': 'ri-file-word-line text-blue-500',
                'docx': 'ri-file-word-line text-blue-500',
                'zip': 'ri-file-zip-line text-amber-400',
            }[file.type.toLowerCase()] || 'ri-file-line text-gray-400';

            const size = file.size < 1024 * 1024
                ? (file.size / 1024).toFixed(1) + ' KB'
                : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            const date = moment(file.createdAt).format('DD MMM YYYY hh:mm A');

        // TABLE UI (desktop)
        tableUI += `
            <tr class="text-gray-500 border-b border-gray-100 hover:bg-gray-50 transition select-none">
            <td class="py-3.5 pl-6 pr-4">
                <div class="flex items-center gap-2.5">
                    <i class="${fileIcon} text-base"></i>
                    <span class="text-gray-700 text-sm font-medium capitalize">${file.filename}</span>
                </div>
            </td>
            <td class="pr-4">
                <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase">${file.type}</span>
            </td>
            <td class="text-sm pr-4">${size}</td>
            <td class="text-sm pr-4">${date}</td>
            <td class="pr-4">
                <div class="flex gap-1.5">
                    <button onclick="deleteFile('${file._id}', this)" 
                        class="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition" title="Delete">
                        <i class="ri-delete-bin-4-line text-sm"></i>
                    </button>
                    <button onclick="downloadFile('${file._id}', '${file.filename}', this)" 
                        class="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition" title="Download">
                        <i class="ri-download-line text-sm"></i>
                    </button>
                    <button onclick="openModal('${file._id}','${file.filename}','${file.type}','${file.size}')" 
                        class="p-1.5 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 transition" title="Share">
                        <i class="ri-share-line text-sm"></i>
                    </button>
                </div>
            </td>
        </tr>
        `;

        // CARD UI (mobile)
        cardUI += `
            <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3 select-none">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <i class="${fileIcon} text-lg"></i>
                    <span class="font-medium text-gray-700 text-sm capitalize">${file.filename}</span>
                </div>
                <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase">${file.type}</span>
            </div>

            <div class="text-xs text-gray-400 flex justify-between">
                <span>${size}</span>
                <span>${date}</span>
            </div>

            <div class="flex justify-end gap-1.5 pt-2.5 border-t border-gray-100">
                <button onclick="deleteFile('${file._id}', this)" 
                    class="p-2 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition">
                    <i class="ri-delete-bin-4-line text-sm"></i>
                </button>
                <button onclick="downloadFile('${file._id}', '${file.filename}', this)" 
                    class="p-2 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition">
                    <i class="ri-download-line text-sm"></i>
                </button>
                <button onclick="openModal('${file._id}','${file.filename}','${file.type}','${file.size}')" 
                    class="p-2 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 transition">
                    <i class="ri-share-line text-sm"></i>
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
        console.error(err.response ? err.response.data.message : err.message);
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

const deleteFile = async (id, button) => {
   try
   {
     button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
     button.disabled = true
     const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
     }
     await axios.delete(`/api/file/${id}`, options)
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
    try {
        button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
        button.disabled = true

        const response = await axios.get(`/api/file/download/${id}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // Extract filename from Content-Disposition header
        const disposition = response.headers['content-disposition']
        let fname = filename
        if (disposition) {
            const match = disposition.match(/filename="(.+)"/)
            if (match) fname = match[1]
        }

        const url = URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fname)
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)

        Toast.success(`File downloaded!`)
    }
    catch (err) {
        console.error(err.response);
        Toast.error(err.response ? err.response.statusText : err.message)
    }
    finally {
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

        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const {data} = await axios.post(`/api/share`, payload, options)
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