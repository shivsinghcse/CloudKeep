const session = getSession()

session
.then((data) => {
    if(data)
    {
        location.href = 'dashboard'
    }
})
.catch((err) => {
    console.log(err);
})

const Toast = new Notyf({
    position: {x: 'center', y: 'top'}
})

const signup = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target

        const payload = {
            fullname: form.fullname.value,
            email: form.email.value,
            mobile: form.mobile.value,
            password: form.password.value
        }

        const response = await axios.post('/api/signup', payload)
        form.reset()
        Toast.success(`${response.data.message} - Please wait while we are redirecting you...`)

        setTimeout(()=>{
            location.href = '/login'
        }, 2000)
        
    }
    catch(err){
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}

const passwordEle = document.querySelector('#password')

const togglePassword = (btn) => {
    if(passwordEle.type === 'password'){
        passwordEle.type = 'text'
        btn.innerHTML = `<i class="ri-eye-off-line"></i>`
    } else {
        passwordEle.type = 'password'
        btn.innerHTML = `<i class="ri-eye-line"></i>`
    }
}