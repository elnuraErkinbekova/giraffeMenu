const API_URL = "http://localhost:3000";

let lang = localStorage.getItem("lang") || "en";
let categories = [];

const systemMessages = {
    en: {
        noItems: "No items available in this category.",
        loading: "Loading...",
        menu: "Menu",
        errorLoading: "Error loading items. Please try again.",
        priceNotSet: "Price not set",
        back: "Back"
    },
    ru: {
        noItems: "В этой категории нет доступных товаров.",
        loading: "Загрузка...",
        menu: "Меню",
        errorLoading: "Ошибка загрузки товаров. Пожалуйста, попробуйте снова.",
        priceNotSet: "Цена не установлена",
        back: "Назад"
    },
    kg: {
        noItems: "Бул категорияда товар жок.",
        loading: "Жүктөлүүдө...",
        menu: "Меню",
        errorLoading: "Товарларды жүктөөдө ката. Кайра аракет кылыңыз.",
        priceNotSet: "Баасы белгиленген эмес",
        back: "Артка"
    }
};

// -------------------- Language & Navigation --------------------
function setupLanguage() {
    const langBtn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const stored = localStorage.getItem('lang') || 'en';

    const labelMap = { en: 'lang', ru: 'язык', kg: 'тил' };
    if (langBtn) langBtn.textContent = labelMap[stored] || 'lang';

    if (langBtn && dropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        });

        document.addEventListener('click', () => { dropdown.style.display = 'none'; });

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const newLang = ev.currentTarget.getAttribute('data-lang');
                switchLanguage(newLang);
            });
        });
    }

    // Translate static page elements
    translateStaticElements();
}

function translateStaticElements() {
    // Translate back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.textContent = systemMessages[lang].back;
    }

    // Translate page title if it's not the cafe name
    const pageTitle = document.querySelector('h1');
    if (pageTitle && !pageTitle.textContent.includes('Giraffe Café')) {
        pageTitle.textContent = systemMessages[lang].menu;
    }
}

function switchLanguage(newLang) {
    lang = newLang;
    localStorage.setItem("lang", newLang);
    location.reload();
}

// -------------------- Translation Functions --------------------



// -------------------- API Functions --------------------
async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function fetchItemsByCategory(categoryId) {
    try {
        const response = await fetch(`${API_URL}/items/${categoryId}?lang=${lang}`);
        if (!response.ok) throw new Error('Failed to fetch items');
        const items = await response.json();

        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

// -------------------- Rendering Functions --------------------
function renderCategories(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {
        // Use pre-translated category names (from admin panel)
        const name = category[`name_${lang}`] || category.name_en || 'Unnamed Category';
        const imageUrl = category.img ? `${API_URL}${category.img}` : 'assets/images/placeholder.jpg';
        
        container.innerHTML += `
            <div class="category" onclick="location.href='menu.html?category=${category.id}'">
                <img src="${imageUrl}" alt="${name}" onerror="this.src='assets/images/placeholder.jpg'">
                <h2 class="category-title">${name}</h2>
            </div>
        `;
    });
}

function renderItems(items, container) {
    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = `<p class="no-items">${systemMessages[lang].noItems}</p>`;
        return;
    }

    items.forEach(item => {
        // Use pre-translated titles (from admin panel)
        const title = item[`title_${lang}`] || item.title_en || 'Untitled Item';
        const description = item.description || '';
        const ingredients = item.ingredients || '';
        const imageUrl = item.img ? `${API_URL}${item.img}` : 'assets/images/placeholder.jpg';
        
        container.innerHTML += `
            <div class="item">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="item-info">
                    <h3 class="item-title">${title}</h3>
                    ${description ? `<p class="description">${description}</p>` : ''}
                    ${ingredients ? `<p class="ingredients">${ingredients}</p>` : ''}
                    <p class="price">${item.price || systemMessages[lang].priceNotSet}</p>
                </div>
            </div>
        `;
    });
}

function renderNavCategories(categories, container) {
    if (!container) return;
    
    container.innerHTML = '';
    categories.forEach(category => {
        // Use pre-translated category names (from admin panel)
        const name = category[`name_${lang}`] || category.name_en || category.id;
        const a = document.createElement('a');
        a.href = `menu.html?category=${category.id}`;
        a.textContent = name;
        a.className = 'nav-category-link';
        a.dataset.category = category.id;
        container.appendChild(a);
    });
}

// -------------------- Page Specific Logic --------------------

// Index Page - Categories List
if (document.getElementById("categories")) {
    const container = document.getElementById("categories");
    container.innerHTML = `<p>${systemMessages[lang].loading}</p>`;

    fetchCategories().then(cats => {
        categories = cats;
        renderCategories(cats, container);
    });
}

// Menu Page - Items List
const params = new URLSearchParams(location.search);
const categoryId = params.get("category");

if (categoryId && document.getElementById("items")) {
    const container = document.getElementById("items");
    const titleElement = document.getElementById("category-title");
    
    container.innerHTML = `<p>${systemMessages[lang].loading}</p>`;
    titleElement.textContent = systemMessages[lang].loading;

    // Load category name and items in parallel
    Promise.all([fetchCategories(), fetchItemsByCategory(categoryId)])
        .then(([cats, items]) => {
            const category = cats.find(c => c.id == categoryId);
            if (category) {
                // Use pre-translated category name (from admin panel)
                const categoryName = category[`name_${lang}`] || category.name_en || systemMessages[lang].menu;
                titleElement.textContent = categoryName;
            } else {
                titleElement.textContent = systemMessages[lang].menu;
            }
            renderItems(items, container);
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            titleElement.textContent = systemMessages[lang].menu;
            container.innerHTML = `<p class="no-items">${systemMessages[lang].errorLoading}</p>`;
        });
}

// Navigation center for menu page
if (document.getElementById("nav-center")) {
    const navContainer = document.getElementById("nav-center");
    fetchCategories().then(cats => {
        renderNavCategories(cats, navContainer);
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    setupLanguage();
});