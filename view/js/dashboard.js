window.onload = () => {
    fetchFilesReport()
    fetchRecentFiles()
    fetchRecentShared()
}

const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000
})

const copyEmail = (btn, email) => {
    navigator.clipboard.writeText(email)
    btn.innerText = "Copied!"
    setTimeout(()=>{
        btn.innerHTML = `<i class="ri-file-copy-line"></i>`
    }, 1000)
}

const notFound = `
    <div class="flex flex-col items-center justify-center py-20 px-6 w-full">

        <!-- Dashed upload zone -->
        <div class="relative flex flex-col items-center justify-center w-full max-w-lg border-2 border-dashed border-slate-200 rounded-2xl py-16 px-8 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 group cursor-pointer">

            <!-- Floating file cards (decorative) -->
            <div class="absolute -top-4 -left-4 w-14 h-16 bg-white border border-slate-100 rounded-xl shadow-md rotate-[-8deg] flex flex-col gap-1.5 p-2 opacity-70 group-hover:opacity-100 group-hover:rotate-[-10deg] transition-all duration-300">
            <div class="w-full h-2 bg-indigo-100 rounded"></div>
            <div class="w-3/4 h-2 bg-slate-100 rounded"></div>
            <div class="w-1/2 h-2 bg-slate-100 rounded"></div>
            </div>
            <div class="absolute -top-3 -right-3 w-12 h-14 bg-white border border-slate-100 rounded-xl shadow-md rotate-[6deg] flex flex-col gap-1.5 p-2 opacity-50 group-hover:opacity-90 group-hover:rotate-[8deg] transition-all duration-300">
            <div class="w-full h-2 bg-purple-100 rounded"></div>
            <div class="w-2/3 h-2 bg-slate-100 rounded"></div>
            </div>

            <!-- Upload icon -->
            <div class="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-5 group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
            <svg class="w-8 h-8 text-indigo-300 group-hover:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4">
                <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            </div>

            <!-- Text -->
            <h2 class="text-xl font-semibold text-slate-700 mb-2">No files uploaded yet</h2>
            <p class="text-sm text-slate-400 text-center leading-relaxed max-w-xs mb-6">
            Drag & drop your files here, or click the button below to browse and upload.
            </p>

            <!-- Stats row -->
            <div class="flex items-center gap-6 mb-7 text-center">
            <div>
                <p class="text-2xl font-bold text-slate-200">0</p>
                <p class="text-xs text-slate-400 mt-0.5">Files</p>
            </div>
            <div class="w-px h-8 bg-slate-100"></div>
            <div>
                <p class="text-2xl font-bold text-slate-200">0 MB</p>
                <p class="text-xs text-slate-400 mt-0.5">Used</p>
            </div>
            <div class="w-px h-8 bg-slate-100"></div>
            <div>
                <p class="text-2xl font-bold text-slate-200">—</p>
                <p class="text-xs text-slate-400 mt-0.5">Last Upload</p>
            </div>
            </div>

            <!-- CTA -->
            <button class="px-6 py-2.5 text-sm font-medium text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 active:scale-95 transition-all duration-150 inline-flex items-center gap-2 shadow-sm shadow-indigo-200">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload Your First File
            </button>

            <!-- Accepted formats -->
            <p class="mt-4 text-xs text-slate-300">PDF, PNG, JPG, DOCX, XLSX — up to 25MB</p>
        </div>

    </div>
`

const dashboard = document.getElementById('dashboard')
const recentFilesBox = document.getElementById('recent-files-box')
const recentSharedBox = document.getElementById('recent-shared-box')
const fileReportBox = document.getElementById('file-report-box')


const fetchRecentFiles = async () => {
    try
    {
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }
        const {data} = await axios.get('/api/file?limit=5', options)

        if(data.length === 0){
            dashboard.innerHTML = notFound
            return
        }

        let recentFilesUI = ''
        for(let file of data){
            const fileCard = `
                <div class="flex justify-between items-start rounded-md py-2 px-3 shadow-md shadow-indigo-700/20 hover:shadow-indigo-700/40 transition duration-300 bg-indigo-100/30">
                    <div>
                        <h1 class="font-medium text-black/80 capitalize">${file.filename}</h1>
                        <small class="text-gray-500 text-sm">${(file.size/(1024*1024)).toFixed(1)}Mb</small>
                    </div>
                    <div class='flex flex-col items-end justify-between gap-1'>
                        <small class="text-gray-700 text-xs rounded bg-white py-[2px] px-2 border border-indigo-200 shadow capitalize">${file.type}</small>
                        <p class="text-sm text-gray-600">${moment(file.createdAt).format('DD MMM YYYY')}</p>
                    </div>
                </div>
            `
            recentFilesUI += fileCard
        }
        recentFilesBox.innerHTML = recentFilesUI
    }
    catch(err){
        console.error(err.response ? err.response.data.message : err.message)
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchRecentShared = async () => {
    try
    {
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }
        const {data} = await axios.get('/api/share?limit=5', options)
        
        if(data.length === 0){
            recentSharedBox.innerHTML = `
                <div class='w-full min-h-30'>
                    <div class='w-full h-full rounded'>
                        <h1 class='text-2xl font-medium text-black/50 text-center py-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>No file shared yet !</h1>
                    </div>
                </div>
            `
            return
        }

        let recentSharedUI = ''
        for(let item of data){
        
            const fileCard = `
                <div class="rounded-md py-2 px-3 shadow-md shadow-indigo-700/20 hover:shadow-indigo-700/40 transition duration-300 bg-indigo-100/30">
                    <div class='flex justify-between'>
                        <h1 class="font-medium text-black/80 capitalize">${item.file.filename}</h1>

                        <p class="text-sm text-gray-600">${moment(item.createdAt).format('DD MMM YYYY')}</p>
                    </div>
                    <div class='flex justify-between'>
                        <small class="text-gray-500 text-sm">${item.receiverEmail}</small>

                        <button onclick="copyEmail(this, '${item.receiverEmail}')" class="text-gray-700 text-xs rounded bg-white py-[2px] px-1 transition duration-300 hover:cursor-pointer">
                            <i class="ri-file-copy-line"></i>
                        </button>
                    </div>
                </div>
            `
            recentSharedUI += fileCard
        }
        recentSharedBox.innerHTML = recentSharedUI
    }
    catch(err){
        console.error(err.response ? err.response.data.message : err.message)
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}



const fetchFilesReport = async () => {
    try
    {
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }
        const {data} = await axios.get('/api/dashboard', options)

        let fileReportUI = ''
        for(let item of data){
            const fileCard = `
                <div class="overflow-hidden relative bg-white rounded-lg shadow hover:shadow-lg hover:cursor-pointer flex flex-col items-center justify-center gap-1 py-6 md:py-12 border border-gray-200 select-none">
                        <h1 class="text-xl font-semibold text-gray-600 ml-5 md:ml-0 uppercase">${item._id}</h1>
                        <p class="text-xl md:text-4xl font-bold ml-5 md:ml-0">${item.total}</p>
                        <div
                            class="flex justify-center items-center w-16 md:w-25 h-16 md:h-25 rounded-full absolute -left-4 md:-left-5"
                            style="background-image: linear-gradient(to top, #ff0844 0%, #ffb199 100%);"
                        >
                            <i class="ri-file-text-line text-4xl text-white"></i>
                        </div>
                </div>
            `
            fileReportUI += fileCard
        }
        fileReportBox.innerHTML = fileReportUI
    }
    catch(err){
        console.error(err.response ? err.response.data.message : err.message)
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}