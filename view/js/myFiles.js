
const Toast = new Notyf({
    position: {x: 'center', y: 'top'}
})


const uploadFile = async (e) => {
    try
    {
        e.preventDefault()
        const form = e.target
        const formdata = new FormData(form)
        const {data} = await axios.post('/api/file', formdata)
        console.log(data);
        alert('File uploaded successfully.')
        form.reset()
        // Toast.success('File uploaded successfully.')
    }
    catch(err)
    {
        console.log(err);
        // Toast.error('Failed')
    }
}