// axios.defaults.baseURL = 'http://localhost:8080'

const getSession = async () => {
    try
    {
        const session = localStorage.getItem('authToken')
    
        if(!session)
        {
            return null
        }
        const payload = {
            token: session
        }

        const {data} = await axios.post('/api/token/verify', payload)
        return data
        
    }
    catch(err)
    {
        return null
    }
}

const logout = () => {
    localStorage.clear()
    location.href = '/'
}
