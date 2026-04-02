const session = getSession()

session
.then((data) => {
    if(!data)
    {
        location.href = 'login'
    }
})
.catch((err) => {
    console.log(err);
})