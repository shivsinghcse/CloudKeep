
const sidebar = document.querySelector('#sidebar');
const section = document.querySelector('#section');

const toggleSidebar = () => {
    const defaultWidth = sidebar.style.width;
    if(defaultWidth === '250px')
    {
        sidebar.style.width = "0px";
        sidebar.style.transition = '0.3s';
        section.style.marginLeft = "0px";
        section.style.transition = '0.3s';
    }
    else
    {
        sidebar.style.width = '250px';
        sidebar.style.transition = '0.3s';
        section.style.marginLeft = '250px';
        section.style.transition = '0.3s';
    }
       
}

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