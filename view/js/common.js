const copyAdminEmail = (btn) => {
    const email = document.getElementById('userEmail').textContent;
    navigator.clipboard.writeText(email);
    
    // swap to checkmark icon
    btn.innerHTML = `<i class="ri-check-double-line text-xs text-emerald-400"></i>`;
    
    setTimeout(() => {
        btn.innerHTML = `<i class="ri-file-copy-line text-xs"></i>`;
    }, 1500);
}