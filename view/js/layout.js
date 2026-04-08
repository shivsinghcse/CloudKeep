// const sidebar = document.getElementById("sidebar");

// const toggleSidebar = () => {
//     sidebar.classList.toggle("-translate-x-full");
// }



const drawer = document.querySelector('#drawer');

const toggleDrawer = () => {
    drawer.classList.toggle("translate-x-full");
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const section = document.getElementById('section');

    if (window.innerWidth >= 768) {
        // desktop — open by default
        sidebar.classList.remove('-translate-x-full');
        section.classList.add('md:ml-60');
    } else {
        // mobile — closed by default
        sidebar.classList.add('-translate-x-full');
        section.classList.remove('md:ml-60');
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            sidebar.classList.add('transition-transform', 'duration-300');
        });
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const section = document.getElementById('section');
    const isHidden = sidebar.classList.contains('-translate-x-full');

    if (isHidden) {
        sidebar.classList.remove('-translate-x-full');
        if (window.innerWidth >= 768) {
            section.classList.add('md:ml-60');
            section.classList.remove('md:ml-0');
        }
    } else {
        sidebar.classList.add('-translate-x-full');
        if (window.innerWidth >= 768) {
            section.classList.remove('md:ml-60');
            section.classList.add('md:ml-0');
        }
    }
}

// also handle window resize
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const section = document.getElementById('section');

    if (window.innerWidth >= 768) {
        sidebar.classList.remove('-translate-x-full');
        section.classList.add('md:ml-60');
        section.classList.remove('md:ml-0');
    } else {
        sidebar.classList.add('-translate-x-full');
        section.classList.remove('md:ml-60');
    }
});

initSidebar();

function setActiveNav() {
    const page = window.location.pathname.split('/').pop();
    document.querySelectorAll('aside a').forEach(link => {
        const btn = link.querySelector('button');
        const href = link.getAttribute('href');
        if (href === page) {
            btn.classList.add('bg-white/15', 'text-white');
            btn.classList.remove('text-indigo-200');
        }
    });
}

setActiveNav()