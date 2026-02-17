// Toggle Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Ubah icon hamburger ke X
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0';
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Active Link Highlighter on Scroll
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// Scroll Reveal Animation
window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;

        if (revealtop < windowheight - revealpoint) {
            reveals[i].classList.add('active');
        }
    }
}

// Trigger reveal on load
reveal();

// Form Handling (Simulation)
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Tampilkan Toast
    const toast = document.getElementById('toast');
    toast.className = "show";
    
    // Reset Form
    contactForm.reset();
    
    // Hilangkan Toast setelah 3 detik
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
});