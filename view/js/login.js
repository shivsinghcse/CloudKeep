const Toast = new Notyf({
    position: {x: 'center', y: 'top'}
})

const login = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target

        const payload = {
            email: form.email.value,
            password: form.password.value
        }

        const response = await axios.post('/login', payload)
        form.reset()
        Toast.success(`${response.data.message} - Please wait while we are redirecting you...`)

        setTimeout(()=>{
            location.href = '../app/dashboard.html'
        }, 2000)
        
    }
    catch(err){
        Toast.error(err.response ? err.response.data.message : err.message)
    }
}