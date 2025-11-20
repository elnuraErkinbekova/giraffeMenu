const API_URL = "http://localhost:3000";

const fallbackData = {
  categories: [
    { id: "drinks", name_en: "Drinks", name_ru: "Напитки", name_kg: "Сусундуктар", img: "assets/images/drinks-menu.jpg" },
    { id: "desserts", name_en: "Desserts", name_ru: "Десерты", name_kg: "Десерттер", img: "assets/images/desserts-menu.jpg" },
    { id: "dishes", name_en: "Dishes", name_ru: "Блюда", name_kg: "Тамактар", img: "assets/images/dishes-menu.jpg" },
  ],
  items: {
    drinks: [
      { title_en: "Latte", title_ru: "Латте", title_kg: "Латте", description: "Milk coffee", ingredients: "Espresso, milk", price: "150 som", img: "assets/images/latte.jpg" },
      { title_en: "Cappuccino", title_ru: "Капучино", title_kg: "Капучино", description: "Classic cappuccino", ingredients: "Espresso, steamed milk, foam", price: "140 som", img: "assets/images/cappuccino.jpg" }
    ],
    desserts: [
      { title_en: "Chocolate Cake", title_ru: "Шоколадный торт", title_kg: "Шоколад торт", description: "Rich chocolate cake", ingredients: "Chocolate, flour, eggs", price: "200 som", img: "assets/images/cake.jpg" },
      { title_en: "Cheesecake", title_ru: "Чизкейк", title_kg: "Чизкейк", description: "Creamy New York cheesecake", ingredients: "Cream cheese, biscuit, berries", price: "220 som", img: "assets/images/cheesecake.jpg" }
    ],
    dishes: [
      { title_en: "Pasta Carbonara", title_ru: "Паста Карбонара", title_kg: "Паста Карбонара", description: "Italian pasta with creamy sauce", ingredients: "Pasta, bacon, eggs, parmesan", price: "250 som", img: "assets/images/pasta.jpg" },
      { title_en: "Caesar Salad", title_ru: "Салат Цезарь", title_kg: "Цезарь салаты", description: "Fresh Caesar salad with chicken", ingredients: "Lettuce, chicken, croutons, sauce", price: "180 som", img: "assets/images/caesar.jpg" }
    ]
  }
};

let lang = localStorage.getItem("lang") || "en";

// -------------------- Функции --------------------
function renderCategories(categories, container) {
  container.innerHTML = '';
  categories.forEach(c => {
    container.innerHTML += `
      <div class="category" onclick="location.href='menu.html?menu=${c.id}'">
        <img src="${c.img}" alt="${c[`name_${lang}`]}">
        <h2>${c[`name_${lang}`]}</h2>
      </div>
    `;
  });
}

function renderItems(items, container) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="no-items">No items in this category yet.</p>`;
    return;
  }

  items.forEach(item => {
    container.innerHTML += `
      <div class="item">
        <img src="${item.img}" alt="${item[`title_${lang}`]}">
        <div class="item-info">
          <h3>${item[`title_${lang}`]}</h3>
          <p class="description">${item.description}</p>
          <p class="ingredients">${item.ingredients}</p>
          <p class="price">${item.price}</p>
        </div>
      </div>
    `;
  });
}

// -------------------- Index.html --------------------
if (document.getElementById("categories")) {
  const container = document.getElementById("categories");
  container.innerHTML = "<p>Loading categories...</p>";

  fetch(`${API_URL}/categories`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(categories => renderCategories(categories, container))
      .catch(() => renderCategories(fallbackData.categories, container));
}

// -------------------- Menu.html --------------------
const params = new URLSearchParams(location.search);
const menu = params.get("menu");

if (document.getElementById("nav-categories")) {
  const navContainer = document.getElementById("nav-categories");
  const categories = fallbackData.categories; // можно заменить на fetch с API

  navContainer.innerHTML = '';
  categories.forEach(c => {
    navContainer.innerHTML += `
            <li><a href="menu.html?menu=${c.id}">${c[`name_${lang}`]}</a></li>
        `;
  });
}

if (menu && document.getElementById("items")) {
  const container = document.getElementById("items");
  const titleElement = document.getElementById("category-title");
  titleElement.textContent = "Loading...";
  container.innerHTML = "<p>Loading menu...</p>";

  let categoryData = fallbackData.categories.find(c => c.id === menu) || { name_en: "Menu", name_ru: "Меню", name_kg: "Меню" };
  let itemsData = fallbackData.items[menu] || [];

  // Получаем категорию из API
  fetch(`${API_URL}/categories/${menu}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(cat => { categoryData = cat; })
      .catch(() => {});

  // Получаем элементы из API
  fetch(`${API_URL}/items/${menu}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(items => { itemsData = items; })
      .catch(() => {});

  // Отображаем данные через небольшой таймаут, чтобы промисы успели выполниться
  setTimeout(() => {
    titleElement.textContent = categoryData[`name_${lang}`] || "Menu";
    renderItems(itemsData, container);
  }, 100); // 100ms задержка
}

// -------------------- Language switch --------------------
function switchLanguage(newLang) {
  lang = newLang;
  localStorage.setItem("lang", newLang);
  location.reload();
}
// ——— NAVBAR: language dropdown, label change, persist ———
(function setupNavbarLang() {
  const langBtn = document.getElementById('lang-btn');
  const dropdown = document.getElementById('lang-dropdown');
  const stored = localStorage.getItem('site_lang') || 'en';

  const labelMap = { en: 'lang', ru: 'язык', kg: 'тил' };
  // Отрисовать текущую надпись
  if (langBtn) langBtn.textContent = labelMap[stored] || 'lang';

  // toggle dropdown
  if (langBtn && dropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    // закрыть по клику вне
    document.addEventListener('click', () => { dropdown.style.display = 'none'; });

    // кнопки опций
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const newLang = ev.currentTarget.getAttribute('data-lang');
        localStorage.setItem('site_lang', newLang);
        // изменить текст кнопки
        langBtn.textContent = labelMap[newLang] || 'lang';
        dropdown.style.display = 'none';
        // обновить глобальную переменную lang если используешь её
        if (typeof lang !== 'undefined') {
          lang = newLang;
          localStorage.setItem('lang', newLang); // совместимость с app.js
        }
        // Перерендер (если нужно) — например перезагрузить страницу для применения
        // location.reload();
      });
    });
  }
})();

// ——— Навигация: если хочешь, чтобы центр заполнялся динамически по API — пример ———
(function fillNavCenterFromAPI() {
  const navCenter = document.getElementById('nav-center');
  if (!navCenter) return;

  // Если у тебя API есть, можешь заменить fetch; пока используем fallbackData или статические
  if (typeof fallbackData !== 'undefined' && fallbackData.categories) {
    // очистим и вставим (поддерживает названия на выбранном языке)
    const currentLang = localStorage.getItem('site_lang') || localStorage.getItem('lang') || 'en';
    navCenter.innerHTML = ''; // очистка
    fallbackData.categories.forEach(c => {
      const a = document.createElement('a');
      a.href = `menu.html?menu=${c.id}`;
      a.textContent = c[`name_${currentLang}`] || c.name_en || c.id;
      a.dataset.menu = c.id;
      navCenter.appendChild(a);
    });
  }
})();
