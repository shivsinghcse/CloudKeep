const table = document.getElementById("historyTable");
const cards = document.getElementById("historyCards");

window.onload = () => {
    fetchHistory()
}

const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000
})


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
        console.log(data);

        data.forEach((item, index) => {
            
            // TABLE (desktop)
            tableUI += `
                <tr class="text-gray-500 border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-4 px-4 capitalize">${item.file.filename}</td>
                    <td class="py-4 px-4">${(item.file.size/(1024*1024)).toFixed(1)} Mb</td>
                    <td class="px-4 break-all">${item.receiverEmail}</td>
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

                    <p class="text-sm text-gray-500 break-all">${item.receiverEmail}</p>

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

