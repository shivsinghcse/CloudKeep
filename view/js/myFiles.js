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

const passwordEle = document.querySelector('#password')

const togglePassword = (btn) => {
    if(passwordEle.type === 'password'){
        passwordEle.type = 'text'
        btn.innerHTML = `<i class="ri-eye-off-line"></i>`
    } else {
        passwordEle.type = 'password'
        btn.innerHTML = `<i class="ri-eye-line"></i>`
    }
}