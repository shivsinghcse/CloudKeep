const copyAdminEmail = (btn) => {
    const email = document.getElementById('userEmail').textContent
    navigator.clipboard.writeText(email)
    btn.innerText = "Copied!"
    setTimeout(()=>{
        btn.innerHTML = `<i class="ri-file-copy-line"></i>`
    }, 1000)
}


