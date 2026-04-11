axios.defaults.baseURL = SERVER
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

const login = async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('button[type="submit"]')
    setLoading(btn, true)
    const form = e.target
    try
    {
        const payload = {
            email: form.email.value,
            password: form.password.value
        }

        const response = await axios.post('/api/login', payload)
        
        localStorage.setItem('authToken', response.data.token)
        location.href = 'dashboard'       
    }
    catch(err){
        Toast.error(err.response ? err.response.data.message : err.message)
    }
    finally
    {
        setLoading(btn, false)
        form.reset()
    }
}
