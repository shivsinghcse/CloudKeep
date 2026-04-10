
const togglePassword = (btn) => {
    const passwordEle = document.querySelector('#password')
    if(passwordEle.type === 'password'){
        passwordEle.type = 'text'
        btn.innerHTML = `<i class="ri-eye-off-line"></i>`
    } else {
        passwordEle.type = 'password'
        btn.innerHTML = `<i class="ri-eye-line"></i>`
    }
}