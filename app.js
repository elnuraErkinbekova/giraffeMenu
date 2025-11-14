// hardcoded placeholder data
const data = {
  categories: [
    { id: "drinks", name: { en: "Drinks", ru: "Напитки" }, img: "assets/images/drinks-menu.jpg" },
    { id: "desserts", name: { en: "Desserts", ru: "Десерты" }, img: "assets/images/desserts-menu.jpg" },
    { id: "dishes", name: { en: "Dishes", ru: "Блюда" }, img: "assets/images/dishes-menu.jpg" },
  ],

  items: {
    drinks: [
      {
        title: { en: "Latte", ru: "Латте" },
        description: "Milk coffee",
        ingredients: "Espresso, milk",
        price: "150 som",
        img: "assets/latte.jpg"
      }
    ],
    desserts: [
      {
        title: { en: "Chocolate Cake", ru: "Шоколадный торт" },
        description: "Rich chocolate cake",
        ingredients: "Chocolate, flour, eggs",
        price: "200 som",
        img: "assets/cake.jpg"
      }
    ],
    dishes: [
      {
        title: { en: "Pasta", ru: "Паста" },
        description: "Italian pasta",
        ingredients: "Pasta, tomatoes, herbs",
        price: "250 som",
        img: "assets/pasta.jpg"
      }
    ]
  }
};

// LANGUAGE
let lang = localStorage.getItem("lang") || "en";

// HOME PAGE - Only run if categories element exists
if (document.getElementById("categories")) {
  const container = document.getElementById("categories");
  data.categories.forEach(c => {
    container.innerHTML += `
      <div class="category" onclick="location.href='menu.html?menu=${c.id}'">
        <img src="${c.img}">
        <h2>${c.name[lang]}</h2>
      </div>
    `;
  });
}

// MENU PAGE - Only run if items element exists
const params = new URLSearchParams(location.search);
const menu = params.get("menu");

if (menu && document.getElementById("items")) {
  const items = data.items[menu];
  const container = document.getElementById("items");
  const title = document.getElementById("category-title");

  // Find the category - fixed to use 'menu' instead of 'id'
  const category = data.categories.find(c => c.menu === menu || c.id === menu);
  if (category) {
    title.textContent = category.name[lang];
  }

  if (items && items.length > 0) {
    items.forEach(item => {
      container.innerHTML += `
        <div class="item">
          <img src="${item.img}">
          <h3>${item.title[lang]}</h3>
          <p>${item.description}</p>
          <p>${item.ingredients}</p>
          <p>${item.price}</p>
        </div>
      `;
    });
  } else {
    container.innerHTML = `<p>No items found for this category.</p>`;
  }
}