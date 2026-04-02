const Toast = new Notyf({
    position: {x: 'center', y: 'top'}
})

const drawer = document.querySelector('#drawer');

const toggleDrawer = () => {
    const rightValue = drawer.style.right;

    if( rightValue === "0px")
    {
        drawer.style.right = '-33.33%';
        drawer.style.transition = '0.3s';
    }
    else
    {
        drawer.style.right = '0px';
        drawer.style.transition = '0.3s';   
    }
    
}


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