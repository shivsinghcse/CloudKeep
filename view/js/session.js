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

        const {data} = await axios.post('/token/verify', payload)
        return data
        
    }
    catch(err)
    {
        return null
    }
}



