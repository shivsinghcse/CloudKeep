const table = document.getElementById("historyTable");
const cards = document.getElementById("historyCards");

window.onload = () => {
    fetchHistory()
}

const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000
})

const copyEmail = (btn, email) => {
    navigator.clipboard.writeText(email)
    btn.innerHTML = `<i class="ri-check-double-line text-xs text-emerald-400"></i>`;
    setTimeout(()=>{
        btn.innerHTML = `<i class="ri-file-copy-line text-xs"></i>`;
    }, 1000)
}


let tableUI = "";
let cardUI = "";



const fetchHistory = async() => {
    try
    {
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }
        const {data} = await axios.get('/api/share', options)

        const notFound = `
            <tr class="border w-full">
                <td colspan="4">
                    <div class="flex flex-col items-center justify-center py-16 px-6 my-6 mx-auto max-w-md">
                    
                    <!-- Illustration container -->
                    <div class="relative mb-6">
                        <div class="w-24 h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
                        <svg class="w-12 h-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12h6m-3-3v6M4.5 19.5l.75-3.75A4.5 4.5 0 0 1 9 12h6a4.5 4.5 0 0 1 3.75 3.75l.75 3.75M3 9l2.25-4.5h13.5L21 9M3 9h18" />
                        </svg>
                        </div>
                        <!-- Decorative dot -->
                        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-200 border-2 border-white"></span>
                    </div>

                    <!-- Text -->
                    <h2 class="text-lg font-semibold text-slate-700 mb-1">No history yet</h2>
                    <p class="text-sm text-slate-400 text-center leading-relaxed max-w-xs">
                        Your activity will appear here once you get started.
                    </p>

                    <!-- Optional CTA -->
                    <a href="files">
                        <button class="mt-6 px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                            Get Started
                        </button>
                    </a>

                    </div>
                </td>
            </tr>
        `
        if(data.length === 0){
            table.innerHTML = notFound
            cards.innerHTML = notFound
            return
        }

        data.forEach((item, index) => {

    const fileIcon = {
        // images
        'jpg':  'ri-image-line text-blue-400',
        'jpeg': 'ri-image-line text-blue-400',
        'png':  'ri-image-line text-blue-400',
        'gif':  'ri-image-line text-blue-400',
        'svg':  'ri-image-line text-blue-400',
        'webp': 'ri-image-line text-blue-400',

        // documents
        'pdf':  'ri-file-pdf-line text-rose-400',
        'doc':  'ri-file-word-line text-blue-500',
        'docx': 'ri-file-word-line text-blue-500',
        'xls':  'ri-file-excel-line text-green-600',
        'xlsx': 'ri-file-excel-line text-green-600',
        'ppt':  'ri-file-ppt-line text-orange-500',
        'pptx': 'ri-file-ppt-line text-orange-500',
        'txt':  'ri-file-text-line text-gray-400',
        'csv':  'ri-file-chart-line text-green-500',

        // video
        'mp4':  'ri-video-line text-purple-400',
        'mkv':  'ri-video-line text-purple-400',
        'mov':  'ri-video-line text-purple-400',
        'avi':  'ri-video-line text-purple-400',
        'webm': 'ri-video-line text-purple-400',

        // audio
        'mp3':  'ri-music-line text-green-400',
        'wav':  'ri-music-line text-green-400',
        'aac':  'ri-music-line text-green-400',
        'flac': 'ri-music-line text-green-400',

        // archives
        'zip':  'ri-file-zip-line text-amber-400',
        'rar':  'ri-file-zip-line text-amber-400',
        '7z':   'ri-file-zip-line text-amber-400',
        'tar':  'ri-file-zip-line text-amber-400',
        'gz':   'ri-file-zip-line text-amber-400',

        // code
        'js':   'ri-javascript-line text-yellow-400',
        'ts':   'ri-code-line text-blue-400',
        'html': 'ri-html5-line text-orange-400',
        'css':  'ri-css3-line text-blue-400',
        'json': 'ri-braces-line text-gray-500',
        'xml':  'ri-code-line text-gray-500',
        'py':   'ri-code-line text-blue-400',
        'java': 'ri-code-line text-red-400',
        'cpp':  'ri-code-line text-blue-600',
        'c':    'ri-code-line text-blue-600',

        // executables — show a warning color since these can be dangerous
        'exe':  'ri-terminal-box-line text-red-500',
        'msi':  'ri-terminal-box-line text-red-500',
        'dmg':  'ri-terminal-box-line text-red-500',
        'apk':  'ri-android-line text-green-500',

        // misc
        'iso':  'ri-disc-line text-gray-500',
        'torrent': 'ri-download-line text-gray-400',
    }[item.type?.toLowerCase()] || 'ri-file-line text-gray-400';

    const size = item.size < 1024 * 1024
        ? (item.size / 1024).toFixed(1) + ' KB'
        : (item.size / (1024 * 1024)).toFixed(1) + ' MB';

    const date = moment(item.createdAt).format('DD MMM YYYY hh:mm A');

    const statusBadge = {
        'sent':      'bg-green-50 text-green-600',
        'failed':    'bg-red-50 text-red-500',
        'delivered': 'bg-blue-50 text-blue-500',
    }[item.status] || 'bg-gray-50 text-gray-400'

    // TABLE (desktop)
    tableUI += `
        <tr class="text-gray-500 border-b border-gray-100 hover:bg-gray-50 transition select-none">
            <td class="py-3.5 pl-6 pr-4">
                <div class="flex items-center gap-2.5">
                    <i class="${fileIcon} text-base"></i>
                    <span class="text-gray-700 text-sm font-medium capitalize">${item.filename}</span>
                </div>
            </td>
            <td class="pr-4">
                <div class="flex items-center gap-2">
                    <span class="text-sm">${item.receiverEmail}</span>
                    <button onclick="copyEmail(this, '${item.receiverEmail}')"
                        class="p-1 rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <i class="ri-file-copy-line text-xs"></i>
                    </button>
                </div>
            </td>
            <td class="text-sm pr-4">${size}</td>
            <td class="text-sm pr-4 whitespace-nowrap">${date}</td>
            <td class="text-xs px-2 py-0.5 rounded-md font-medium ${statusBadge} capitalize">${item.status}</td>
        </tr>
    `;

    // CARD (mobile)
    cardUI += `
        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3 select-none">

            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <i class="${fileIcon} text-lg"></i>
                    <span class="font-medium text-gray-700 text-sm capitalize">${item.file.filename}</span>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-md font-medium ${statusBadge} capitalize">${item.status}</span>
            </div>

            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 break-all">${item.receiverEmail}</span>
                <button onclick="copyEmail(this, '${item.receiverEmail}')"
                    class="ml-2 p-1.5 rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition flex-shrink-0">
                    <i class="ri-file-copy-line text-xs"></i>
                </button>
            </div>

            <div class="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>${size}</span>
                <span>${date}</span>
            </div>

        </div>
    `;
});

table.innerHTML = tableUI;
cards.innerHTML = cardUI;
}
    catch(err)
    {
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

