const API_URL = "http://localhost:3000";
const actionSection = document.getElementById("action-section");

document.getElementById("addBtn").onclick = () => showAddMenu();
document.getElementById("deleteBtn").onclick = () => showDeleteMenu();

// --- Add/Delete Menu ---
function showAddMenu() {
    actionSection.innerHTML = `
        <div class="add-buttons">
            <button onclick="addCategoryForm()">Category</button>
            <button onclick="addItemForm()">Item</button>
        </div>
        <div id="form-container"></div>
    `;
}

function showDeleteMenu() {
    actionSection.innerHTML = `
        <div class="delete-buttons">
            <button onclick="deleteCategoryList()">Category</button>
            <button onclick="deleteItemList()">Item</button>
        </div>
        <div id="form-container"></div>
    `;
}

// --- Add Category ---
function addCategoryForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = `
        <h3>Add Category</h3>
        <input id="catNameRu" placeholder="Name (RU)" />
        <input id="catNameEn" placeholder="Name (EN)" />
        <input id="catNameKg" placeholder="Name (KG)" />
        <div class="file-upload">
            <label for="catImgFile" class="file-btn">Choose Image</label>
            <input type="file" id="catImgFile" accept="image/*" />
        </div>

        <button onclick="submitCategory()">Add</button>
    `;
}

function submitCategory() {
    const name_ru = document.getElementById("catNameRu").value;
    const name_en = document.getElementById("catNameEn").value;
    const name_kg = document.getElementById("catNameKg").value;
    const imgFile = document.getElementById("catImgFile").files[0];

    if (!name_ru || !name_en || !name_kg || !imgFile) {
        alert("Please fill all name fields and select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("name_ru", name_ru);
    formData.append("name_en", name_en);
    formData.append("name_kg", name_kg);
    formData.append("image", imgFile);

    fetch(`${API_URL}/categories`, { method: "POST", body: formData })
        .then(res => res.ok ? alert("Category added!") : alert("Error adding category"))
        .then(() => addCategoryForm())
        .catch(err => alert("Error: " + err));
}

// --- Add Item ---
function addItemForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = `
        <h3>Add Item</h3>
        <input id="itemNameRu" placeholder="Name (RU)" />
        <input id="itemNameEn" placeholder="Name (EN)" />
        <input id="itemNameKg" placeholder="Name (KG)" />
        <input id="itemDesc" placeholder="Description" />
        <input id="itemIng" placeholder="Ingredients" />
        <input id="itemPrice" placeholder="Price" />
        <div class="file-upload">
            <label for="itemImgFile" class="file-btn">Choose Image</label>
            <input type="file" id="itemImgFile" accept="image/*" />
        </div>

        <select id="itemCategory"></select>
        <button onclick="submitItem()">Add</button>
    `;
    loadCategoriesForSelect();
}

function loadCategoriesForSelect() {
    const select = document.getElementById("itemCategory");
    select.innerHTML = "";
    fetch(`${API_URL}/categories`)
        .then(res => res.json())
        .then(categories => {
            categories.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `${c.name_en} / ${c.name_ru} / ${c.name_kg}`;
                select.appendChild(opt);
            });
        });
}

function submitItem() {
    const title_ru = document.getElementById("itemNameRu").value;
    const title_en = document.getElementById("itemNameEn").value;
    const title_kg = document.getElementById("itemNameKg").value;
    const desc = document.getElementById("itemDesc").value;
    const ing = document.getElementById("itemIng").value;
    const price = document.getElementById("itemPrice").value;
    const imgFile = document.getElementById("itemImgFile").files[0];
    const category = document.getElementById("itemCategory").value;

    if (!title_ru || !title_en || !title_kg || !imgFile || !category) {
        alert("Please fill all required fields and select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("title_ru", title_ru);
    formData.append("title_en", title_en);
    formData.append("title_kg", title_kg);
    formData.append("description", desc);
    formData.append("ingredients", ing);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", imgFile);

    fetch(`${API_URL}/items`, { method: "POST", body: formData })
        .then(res => res.ok ? alert("Item added!") : alert("Error adding item"))
        .then(() => addItemForm())
        .catch(err => alert("Error: " + err));
}

// --- Delete Category ---
function deleteCategoryList() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = "<h3>Delete Category</h3>";
    fetch(`${API_URL}/categories`)
        .then(res => res.json())
        .then(categories => {
            categories.forEach(c => {
                const btn = document.createElement("button");
                btn.textContent = `Delete ${c.name_en} / ${c.name_ru} / ${c.name_kg}`;
                btn.style.display = "block";
                btn.style.margin = "5px 0";
                btn.onclick = () => {
                    if(confirm(`Delete category "${c.name_en}"?`)) {
                        fetch(`${API_URL}/categories/${c.id}`, { method: "DELETE" })
                            .then(() => alert("Deleted!"))
                            .then(() => deleteCategoryList());
                    }
                };
                formContainer.appendChild(btn);
            });
        });
}

// --- Delete Item ---
function deleteItemList() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = "<h3>Delete Item</h3>";
    fetch(`${API_URL}/items`)
        .then(res => res.json())
        .then(items => {
            items.forEach(i => {
                const btn = document.createElement("button");
                btn.textContent = `Delete ${i.title_en} / ${i.title_ru} / ${i.title_kg}`;
                btn.style.display = "block";
                btn.style.margin = "5px 0";
                btn.onclick = () => {
                    if(confirm(`Delete item "${i.title_en}"?`)) {
                        fetch(`${API_URL}/items/${i.id}`, { method: "DELETE" })
                            .then(() => alert("Deleted!"))
                            .then(() => deleteItemList());
                    }
                };
                formContainer.appendChild(btn);
            });
        });
}
const loginContainer = document.getElementById('login-container');
const actionSection = document.getElementById('action-section');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Пример фиксированных данных для входа
const ADMIN_CREDENTIALS = {
    name: "admin",
    password: "1234"
};

loginBtn.addEventListener('click', () => {
    const name = document.getElementById('admin-name').value.trim();
    const password = document.getElementById('admin-pass').value.trim();

    if(name === ADMIN_CREDENTIALS.name && password === ADMIN_CREDENTIALS.password) {
        // Успешный вход
        loginContainer.style.display = 'none';
        actionSection.style.display = 'flex';
    } else {
        // Ошибка
        loginError.style.display = 'block';
    }
});
