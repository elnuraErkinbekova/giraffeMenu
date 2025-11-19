const API_URL = "http://localhost:3000";

const fallbackData = {
  categories: [
    {
      id: "drinks",
      name_en: "Drinks",
      name_ru: "Напитки",
      img: "assets/images/drinks-menu.jpg"
    },
    {
      id: "desserts",
      name_en: "Desserts",
      name_ru: "Десерты",
      img: "assets/images/desserts-menu.jpg"
    },
    {
      id: "dishes",
      name_en: "Dishes",
      name_ru: "Блюда",
      img: "assets/images/dishes-menu.jpg"
    },
  ],

  items: {
    drinks: [
      {
        title_en: "Latte",
        title_ru: "Латте",
        description: "Milk coffee",
        ingredients: "Espresso, milk",
        price: "150 som",
        img: "assets/images/latte.jpg"
      },
      {
        title_en: "Cappuccino",
        title_ru: "Капучино",
        description: "Classic cappuccino",
        ingredients: "Espresso, steamed milk, foam",
        price: "140 som",
        img: "assets/images/cappuccino.jpg"
      }
    ],
    desserts: [
      {
        title_en: "Chocolate Cake",
        title_ru: "Шоколадный торт",
        description: "Rich chocolate cake",
        ingredients: "Chocolate, flour, eggs",
        price: "200 som",
        img: "assets/images/cake.jpg"
      },
      {
        title_en: "Cheesecake",
        title_ru: "Чизкейк",
        description: "Creamy New York cheesecake",
        ingredients: "Cream cheese, biscuit, berries",
        price: "220 som",
        img: "assets/images/cheesecake.jpg"
      }
    ],
    dishes: [
      {
        title_en: "Pasta Carbonara",
        title_ru: "Паста Карбонара",
        description: "Italian pasta with creamy sauce",
        ingredients: "Pasta, bacon, eggs, parmesan",
        price: "250 som",
        img: "assets/images/pasta.jpg"
      },
      {
        title_en: "Caesar Salad",
        title_ru: "Салат Цезарь",
        description: "Fresh Caesar salad with chicken",
        ingredients: "Lettuce, chicken, croutons, sauce",
        price: "180 som",
        img: "assets/images/caesar.jpg"
      }
    ]
  }
};

let lang = localStorage.getItem("lang") || "en";

function renderCategories(categories, container) {
  container.innerHTML = ''; // Clear loading state
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

if (document.getElementById("categories")) {
  const container = document.getElementById("categories");
  container.innerHTML = "<p>Loading categories...</p>";

  fetch(`${API_URL}/categories`)
    .then(res => {
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      return res.json();
    })
    .then(categories => {
      console.log("Loaded categories from API");
      renderCategories(categories, container);
    })
    .catch(err => {
      console.log("API not available, using fallback data:", err.message);
      renderCategories(fallbackData.categories, container);
    });
}

// MENU PAGE - Items
const params = new URLSearchParams(location.search);
const menu = params.get("menu");

if (menu && document.getElementById("items")) {
  const container = document.getElementById("items");
  const titleElement = document.getElementById("category-title");

  container.innerHTML = "<p>Loading menu...</p>";
  titleElement.textContent = "Loading...";

  Promise.all([
    fetch(`${API_URL}/categories/${menu}`)
      .then(res => {
        if (!res.ok) throw new Error('Category not found in API');
        return res.json();
      })
      .catch(() => {
        return fallbackData.categories.find(c => c.id === menu) || {
          name_en: "Menu",
          name_ru: "Меню"
        };
      }),

    fetch(`${API_URL}/items/${menu}`)
      .then(res => {
        if (!res.ok) throw new Error('Items not found in API');
        return res.json();
      })
      .catch(() => {
        return fallbackData.items[menu] || [];
      })
  ])
  .then(([category, items]) => {
    titleElement.textContent = category[`name_${lang}`] || "Menu";

    renderItems(items, container);
  })
  .catch(err => {
    console.error("Error loading menu:", err);
    titleElement.textContent = "Menu";
    container.innerHTML = "<p>Error loading menu. Please try again later.</p>";
  });
}

function switchLanguage(newLang) {
  lang = newLang;
  localStorage.setItem("lang", newLang);
  location.reload();
}