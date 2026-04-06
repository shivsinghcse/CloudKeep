const checkAuth = async () => {
    try
    {
        const session = await getSession()

        if(!session){
            location.href = '/login'
        } 
        showUserDetails(session)
    }
    catch(err)
    {
        console.log(err);
    }

}

checkAuth()

const showUserDetails = (user) => {
    const profilePicture = document.getElementById('userImage')
    const name = document.getElementById('userName')
    const email = document.getElementById('userEmail')

    profilePicture.src = user.image ?? '../images/avt.png'
    name.textContent = user.fullname ?? 'Amelia Harper'
    email.textContent = user.email ?? 'amelia@harper.com'
    
}

