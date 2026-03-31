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

        const response = await axios.post('/signup', payload)
        form.reset()
        Toast.success(`${response.data.message} - Please wait while we are redirecting you...`)

        setTimeout(()=>{
            location.href = '../index.html'
        }, 2000)
        
    }
    catch(err){
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}