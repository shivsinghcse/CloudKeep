window.onload = () => {
    fetchFilesReport()
    fetchRecentFiles()
    fetchRecentShared()
    setGreeting()
}

const Toast = new Notyf({
    position: { x: 'center', y: 'top' },
    duration: 2000
})

// greeting based on time of day
const setGreeting = () => {
    const hour = new Date().getHours()
    const name = document.getElementById('userName')?.textContent || ''
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const el = document.getElementById('greetingText')
    if (el) el.textContent = name ? `${greet}, ${name.trim().split(' ').map((word) => word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(' ')}` : greet
}

const copyEmail = (btn, email) => {
    navigator.clipboard.writeText(email)
    btn.innerHTML = `<i class="ri-check-double-line text-xs text-emerald-400"></i>`
    setTimeout(() => {
        btn.innerHTML = `<i class="ri-file-copy-line text-xs"></i>`
    }, 1500)
}

const fileIconMap = (type) => ({
    'pdf':  'ri-file-pdf-line text-rose-400',
    'jpg':  'ri-image-line text-blue-400',
    'jpeg': 'ri-image-line text-blue-400',
    'png':  'ri-image-line text-blue-400',
    'mp4':  'ri-video-line text-purple-400',
    'mp3':  'ri-music-line text-green-400',
    'doc':  'ri-file-word-line text-blue-500',
    'docx': 'ri-file-word-line text-blue-500',
    'zip':  'ri-file-zip-line text-amber-400',
}[type?.toLowerCase()] || 'ri-file-line text-gray-400')

const formatSize = (bytes) => bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(1) + ' KB'
    : (bytes / (1024 * 1024)).toFixed(1) + ' MB'

// report type icons
const reportIconMap = (type) => ({
    'pdf':   { icon: 'ri-file-pdf-line',  bg: 'bg-rose-50',   text: 'text-rose-400'   },
    'jpg':   { icon: 'ri-image-line',     bg: 'bg-blue-50',   text: 'text-blue-400'   },
    'jpeg':  { icon: 'ri-image-line',     bg: 'bg-blue-50',   text: 'text-blue-400'   },
    'png':   { icon: 'ri-image-line',     bg: 'bg-blue-50',   text: 'text-blue-400'   },
    'mp4':   { icon: 'ri-video-line',     bg: 'bg-purple-50', text: 'text-purple-400' },
    'mp3':   { icon: 'ri-music-line',     bg: 'bg-green-50',  text: 'text-green-400'  },
    'doc':   { icon: 'ri-file-word-line', bg: 'bg-blue-50',   text: 'text-blue-500'   },
    'docx':  { icon: 'ri-file-word-line', bg: 'bg-blue-50',   text: 'text-blue-500'   },
    'zip':   { icon: 'ri-file-zip-line',  bg: 'bg-amber-50',  text: 'text-amber-400'  },
}[type?.toLowerCase()] || { icon: 'ri-file-line', bg: 'bg-gray-50', text: 'text-gray-400' })

const notFound = `
    <div class="flex flex-col items-center justify-center py-20 px-6 w-full select-none">
        <div class="relative flex flex-col items-center justify-center w-full max-w-lg border-2 border-dashed border-slate-200 rounded-2xl py-16 px-8 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 group cursor-pointer">
            <div class="absolute -top-4 -left-4 w-14 h-16 bg-white border border-slate-100 rounded-xl shadow-md rotate-[-8deg] flex flex-col gap-1.5 p-2 opacity-70 group-hover:opacity-100 group-hover:rotate-[-10deg] transition-all duration-300">
                <div class="w-full h-2 bg-indigo-100 rounded"></div>
                <div class="w-3/4 h-2 bg-slate-100 rounded"></div>
                <div class="w-1/2 h-2 bg-slate-100 rounded"></div>
            </div>
            <div class="absolute -top-3 -right-3 w-12 h-14 bg-white border border-slate-100 rounded-xl shadow-md rotate-[6deg] flex flex-col gap-1.5 p-2 opacity-50 group-hover:opacity-90 group-hover:rotate-[8deg] transition-all duration-300">
                <div class="w-full h-2 bg-purple-100 rounded"></div>
                <div class="w-2/3 h-2 bg-slate-100 rounded"></div>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-5 group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
                <svg class="w-8 h-8 text-indigo-300 group-hover:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-700 mb-2">No files uploaded yet</h2>
            <p class="text-sm text-slate-400 text-center leading-relaxed max-w-xs mb-6">Upload your first file to get started.</p>
            <a href="files">
                <button class="px-6 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 transition-all duration-150 inline-flex items-center gap-2">
                    <i class="ri-add-line"></i>
                    Upload your first file
                </button>
            </a>
            <p class="mt-4 text-xs text-slate-300">PDF, PNG, JPG, DOCX, MP4 — up to 25MB</p>
        </div>
    </div>
`

const dashboard = document.getElementById('dashboard')
const recentFilesBox = document.getElementById('recent-files-box')
const recentSharedBox = document.getElementById('recent-shared-box')
const fileReportBox = document.getElementById('file-report-box')

const fetchRecentFiles = async () => {
    try {
        const options = { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
        const { data } = await axios.get('/api/file?limit=5', options)

        if (data.length === 0) {
            dashboard.innerHTML = notFound
            return
        }

        recentFilesBox.innerHTML = data.map(file => `
            <div class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div class="flex items-center gap-2.5 min-w-0">
                    <i class="${fileIconMap(file.type)} text-base flex-shrink-0"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-700 capitalize truncate">${file.filename}</p>
                        <p class="text-xs text-gray-400">${formatSize(file.size)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase">${file.type}</span>
                    <span class="text-xs text-gray-400 whitespace-nowrap">${moment(file.createdAt).format('DD MMM')}</span>
                </div>
            </div>
        `).join('')

    } catch(err) {
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchRecentShared = async () => {
    try {
        const options = { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
        const { data } = await axios.get('/api/share?limit=5', options)

        if (data.length === 0) {
            recentSharedBox.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 text-center">
                    <i class="ri-share-line text-2xl text-gray-200 mb-2"></i>
                    <p class="text-sm text-gray-400">No files shared yet</p>
                </div>
            `
            return
        }

        recentSharedBox.innerHTML = data.map(item => `
            <div class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div class="flex items-center gap-2.5 min-w-0">
                    <i class="${fileIconMap(item.file.type)} text-base flex-shrink-0"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-700 capitalize truncate">${item.file.filename}</p>
                        <p class="text-xs text-gray-400 truncate">${item.receiverEmail}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <span class="text-xs text-gray-400 whitespace-nowrap">${moment(item.createdAt).format('DD MMM')}</span>
                    <button onclick="copyEmail(this, '${item.receiverEmail}')"
                        class="p-1 rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <i class="ri-file-copy-line text-xs"></i>
                    </button>
                </div>
            </div>
        `).join('')

    } catch(err) {
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchFilesReport = async () => {
    try {
        const options = { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
        const { data } = await axios.get('/api/dashboard', options)

        fileReportBox.innerHTML = data.map(item => {
            const { icon, bg, text } = reportIconMap(item._id)
            return `
                <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 select-none hover:border-violet-200 transition">
                    <div class="w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0">
                        <i class="${icon} ${text} text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">${item._id}</p>
                        <p class="text-2xl font-semibold text-gray-800">${item.total}</p>
                    </div>
                </div>
            `
        }).join('')

    } catch(err) {
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}