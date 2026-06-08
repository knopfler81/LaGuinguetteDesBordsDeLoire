// ===== Menu Dynamique via Google Sheets =====
const MENU_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdVk_-1vzMCagYfniAoAxFnDlQ9hTuLEb-gEhbL7H_M-oQrNyuHnehAhMW2WeNiSbWXwTewjgHZAdK/pub?output=csv';

let menuData = [];
let filteredMenuData = [];
let categories = [];

async function loadMenu() {
    try {
        const response = await fetch(MENU_CSV_URL);
        if (!response.ok) throw new Error('Erreur chargement menu');
        
        const csv = await response.text();
        parseCSV(csv);
        generateMenuTabs();
        if (categories.length > 0) {
            displayMenu(categories[0]);
        }
    } catch (error) {
        console.log('Menu Google Sheet non configuré');
        document.querySelector('.menu-loading').innerHTML = 
            '📋 Configure ton Google Sheet avec le menu';
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    
    menuData = [];
    categories = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length >= 4) {
            const category = values[0];
            const item = {
                category: category,
                name: values[1],
                description: values[2],
                price: values[3]
            };
            menuData.push(item);
            
            if (!categories.includes(category)) {
                categories.push(category);
            }
        }
    }
}

function generateMenuTabs() {
    const tabContainer = document.querySelector('.menu-selector');
    tabContainer.innerHTML = '';
    
    // Bouton "Tout"
    const allBtn = document.createElement('button');
    allBtn.className = 'menu-tab active';
    allBtn.dataset.category = 'all';
    allBtn.textContent = 'Tout';
    allBtn.addEventListener('click', (e) => {
        document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        displayAllMenu();
    });
    tabContainer.appendChild(allBtn);
    
    // Boutons pour chaque catégorie
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-tab';
        btn.dataset.category = cat;
        btn.textContent = cat;
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            displayMenu(cat);
        });
        tabContainer.appendChild(btn);
    });
}

function displayAllMenu() {
    const container = document.getElementById('menuContainer');
    document.querySelector('.menu-loading').style.display = 'none';
    
    if (menuData.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Aucun item</p>';
        return;
    }
    
    container.innerHTML = menuData.map(item => `
        <div class="menu-item" style="opacity: 0; animation: fadeInUp 0.5s ease-out forwards;">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="menu-item-price">${item.price}</div>
        </div>
    `).join('');
}

function displayMenu(category) {
    const container = document.getElementById('menuContainer');
    document.querySelector('.menu-loading').style.display = 'none';
    
    filteredMenuData = menuData.filter(item => item.category === category);
    
    if (filteredMenuData.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Pas d\'items pour cette catégorie</p>';
        return;
    }
    
    container.innerHTML = filteredMenuData.map(item => `
        <div class="menu-item" style="opacity: 0; animation: fadeInUp 0.5s ease-out forwards;">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="menu-item-price">${item.price}</div>
        </div>
    `).join('');
}

// Charger le menu au démarrage
document.addEventListener('DOMContentLoaded', loadMenu);

// ===== Menu Hamburger =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu en cliquant sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments clés
document.querySelectorAll('.service-card, .gallery-item, .info-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== Navigation active au scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== Smooth scroll pour les ancres =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active nav link styling =====
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-primary);
        font-weight: 700;
        border-bottom: 2px solid var(--color-accent);
        padding-bottom: 2px;
    }
`;
document.head.appendChild(style);