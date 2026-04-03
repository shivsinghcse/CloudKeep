const sidebar = document.getElementById("sidebar");

const toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
}

const drawer = document.querySelector('#drawer');

const toggleDrawer = () => {
    drawer.classList.toggle("translate-x-full");
    overlay.classList.toggle("hidden");
}