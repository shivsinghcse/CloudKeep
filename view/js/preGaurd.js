const checkAuth = async () => {
    try
    {
        const session = await getSession()
        if(!session){
            location.href = '/login'
        } 
    }
    catch(err)
    {
        console.log(err);
    }

}

checkAuth()