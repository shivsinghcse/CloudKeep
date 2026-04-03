// const table = document.getElementById("historyTable");
// const cards = document.getElementById("historyCards");

// let tableUI = "";
// let cardUI = "";

// // Example data (replace with API response)
// const data = [
//     {
//         filename: "Introduction to HTML",
//         email: "singhshiv0204@gmail.com",
//         date: "24 June 2025",
//         id: "1"
//     }
// ];

// data.forEach(item => {

//     // TABLE (desktop)
//     tableUI += `
//         <tr class="text-gray-500 border-b border-gray-100 hover:bg-gray-50">
//             <td class="py-4 px-4 capitalize">${item.filename}</td>
//             <td class="px-4 break-all">${item.email}</td>
//             <td class="px-4 whitespace-nowrap">${item.date}</td>
//             <td class="px-4">
//                 <button onclick="deleteHistory('${item.id}', this)" 
//                     class="bg-rose-400 hover:bg-rose-600 text-white px-2 py-1 rounded">
//                     <i class="ri-delete-bin-4-line"></i>
//                 </button>
//             </td>
//         </tr>
//     `;

//     // CARD (mobile)
//     cardUI += `
//         <div class="bg-white rounded-lg shadow p-4 space-y-3 border border-gray-200">
            
//             <div class="flex justify-between items-start">
//                 <h1 class="font-medium text-gray-700 capitalize">${item.filename}</h1>
//                 <span class="text-xs bg-gray-100 px-2 py-1 rounded">Shared</span>
//             </div>

//             <p class="text-sm text-gray-500 break-all">${item.email}</p>

//             <div class="flex justify-between text-sm text-gray-400">
//                 <span>${item.date}</span>
//             </div>

//             <div class="flex justify-end pt-2 border-t">
//                 <button onclick="deleteHistory('${item.id}', this)" 
//                     class="bg-rose-400 hover:bg-rose-600 text-white px-3 py-1 rounded">
//                     <i class="ri-delete-bin-4-line"></i>
//                 </button>
//             </div>

//         </div>
//     `;
// });

// table.innerHTML = tableUI;
// cards.innerHTML = cardUI;