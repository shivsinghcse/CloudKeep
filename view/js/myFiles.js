
const Toast = new Notyf({
    position: {x: 'center', y: 'top'}
})


const uploadFile = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const {data} = await axios.post('/api/file', formData)
        console.log(data);
        Toast.success('File uploaded successfully')
        // form.reset()
        
    }
    catch(err)
    {
        Toast.error('File uploaded Failed')
    }
}