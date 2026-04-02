
const Toast = new Notyf({
    position: {x: 'center', y: 'top'},
    duration: 2000

})


const uploadFile = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target
        const progressbar = document.getElementById('progressbar')
        const formdata = new FormData(form)
        
        const options = {
            onUploadProgress: (e) => {
                const loaded = e.loaded
                const total = e.total
                const percentageValue = Math.floor((loaded*100)/total)
                progressbar.style.width = percentageValue+'%'
                progressbar.innerHTML = percentageValue+'%'
            }
        }
        await axios.post('/api/file', formdata, options)
        Toast.success(`File uploaded!`)
        progressbar.style.width = 0
        progressbar.innerHTML = ''
        form.reset()
        toggleDrawer()
    }
    catch(err)
    {
        Toast.error('Failed!')
    }
}