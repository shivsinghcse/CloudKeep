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
    btn.innerText = "Copied!"
    setTimeout(()=>{
        btn.innerHTML = `<i class="ri-file-copy-line"></i>`
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
            
            // TABLE (desktop)
            tableUI += `
                <tr class="text-gray-500 border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-4 px-4 capitalize">${item.file.filename}</td>
                    <td class="py-4 px-4">${(item.file.size/(1024*1024)).toFixed(1)} Mb</td>
                    <td class="px-4 break-all">
                        <div class='flex gap-4'>
                            <p class="text-gray-500 text-sm">${item.receiverEmail}</p>

                            <button onclick="copyEmail(this, '${item.receiverEmail}')" class="text-gray-700 text-xs rounded bg-gray-100 hover:bg-gray-200 hover:cursor-pointer py-[2px] px-1 transition duration-300">
                                <i class="ri-file-copy-line"></i>
                            </button>
                        </div>
                    </td>
                    <td class="px-4 whitespace-nowrap">${moment(item.createdAt).format('DD MMM YYYY hh:mm A')}</td>
                </tr>
            `;

            // CARD (mobile)
            cardUI += `
                <div class="bg-white rounded-lg shadow p-4 space-y-3 border border-gray-200">
                    
                    <div class="flex justify-between items-start">
                        <h1 class="font-medium text-gray-700 capitalize">${item.file.filename}</h1>
                        <span class="text-xs bg-gray-100 px-2 py-1 rounded">Shared</span>
                    </div>

                    <div class='flex justify-between'>
                        <p class="text-gray-500 text-sm">${item.receiverEmail}</p>

                        <button onclick="copyEmail(this, '${item.receiverEmail}')" class="text-gray-700 text-xs rounded bg-gray-100 hover:bg-gray-200 hover:cursor-pointer py-[2px] px-1 transition duration-300">
                            <i class="ri-file-copy-line"></i>
                        </button>
                    </div>

                    <div class="flex justify-between text-sm text-gray-400">
                        <span>${(item.file.size/(1024*1024)).toFixed(1)} Mb</span>
                        <span>${moment(item.createdAt).format('DD MMM YYYY hh:mm A')}</span>
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

