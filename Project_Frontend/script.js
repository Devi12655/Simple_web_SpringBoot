const API_URL = "http://localhost:8080/api";

let allProducts = [];

/* =========================
   INIT (PAGE DETECTION)
========================= */
document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("productForm")) {
        setupAddProduct();
    }

    if (document.getElementById("productList")) {
        loadProducts();
    }

    if (document.getElementById("details")) {
        loadProductDetails();
    }
});


/* =========================
   ADD PRODUCT
========================= */
function setupAddProduct() {
    const form = document.getElementById("productForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const product = {
            name: document.getElementById("name").value,
            brand: document.getElementById("brand").value,
            category: document.getElementById("category").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            description: document.getElementById("description").value,
            releaseDate: document.getElementById("releaseDate").value
        };

        const image = document.getElementById("image").files[0];

        const formData = new FormData();

        formData.append("product", new Blob(
            [JSON.stringify(product)],
            { type: "application/json" }
        ));

        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await fetch(`${API_URL}/product`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Failed");

            alert("✅ Product Added Successfully!");
            window.location.href = "index.html";

        } catch (err) {
            console.error(err);
            alert("❌ Error adding product");
        }
    });
}


/* =========================
   LOAD PRODUCTS (INDEX)
========================= */
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        allProducts = data;
        renderProducts(data);

    } catch (err) {
        console.error("Error loading products:", err);
    }
}


/* =========================
   RENDER PRODUCTS
========================= */
function renderProducts(products) {
    const list = document.getElementById("productList");

    list.innerHTML = "";

    if (!products || products.length === 0) {
        list.innerHTML = "<p>No products available</p>";
        return;
    }

    products.forEach(p => {

        const card = document.createElement("div");
        card.className = "card";

        const img = getImageUrl(p);

        card.innerHTML = `
            <img src="${img}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            <div class="title">${p.name || "Unnamed Product"}</div>
            <div class="brand">${p.brand || ""}</div>
            <div class="price">₹${p.price || 0}</div>
        `;

        card.onclick = () => {
            window.location.href = `product-details.html?id=${p.id}`;
        };

        list.appendChild(card);
    });
}


/* =========================
   PRODUCT DETAILS
========================= */
async function loadProductDetails() {
    const container = document.getElementById("details");

    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        container.innerHTML = "<p style='padding:20px'>Invalid Product</p>";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/product/${id}`);

        if (!res.ok) {
            container.innerHTML = "<p>Product not found</p>";
            return;
        }

        const p = await res.json();

        const img = getImageUrl(p);

       container.innerHTML = `
    <div class="details-left">
        <img src="${img}" class="details-image"
             onerror="this.src='https://via.placeholder.com/300'">
    </div>

    <div class="details-right">
        <h2>${p.name || "Unnamed Product"}</h2>

        <div class="price">₹${p.price || 0}</div>

        <p><b>Brand:</b> ${p.brand || "-"}</p>
        <p><b>Category:</b> ${p.category || "-"}</p>
        <p><b>Description:</b> ${p.description || "-"}</p>
        <p><b>Stock:</b> ${p.quantity || 0}</p>

        <p><b>Release Date:</b> ${
            p.releaseDate ? p.releaseDate.split("T")[0] : "-"
        }</p>

        <!-- 🔥 ACTION BUTTONS -->
        <div class="details-actions">
            <button class="edit-btn" onclick="editProduct(${p.id})">✏️ Update</button>
            <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑 Delete</button>
        </div>
    </div>
`;

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Error loading product</p>";
    }
}


/* =========================
   IMAGE URL (FINAL FIX)
========================= */
function getImageUrl(p) {
    if (p && p.id) {
        return `${API_URL}/product/${p.id}/image`;
    }
    return "https://via.placeholder.com/300?text=No+Image";
}
/* =========================
   DELETE PRODUCT
========================= */
function deleteProduct(id) {
    const confirmDelete = confirm("Delete this product?");

    if (!confirmDelete) return;

    fetch(`${API_URL}/product/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Product deleted");
        window.location.href = "index.html";
    })
    .catch(err => console.error(err));
}


/* =========================
   EDIT PRODUCT
========================= */
function editProduct(id) {
    window.location.href = `edit-product.html?id=${id}`;
}
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

async function fetchProducts() {
    const keyword = searchInput.value.trim();
    const category = categoryFilter.value;

    let url = `${API_URL}/products`;

    // 🔍 if search keyword exists
    if (keyword !== "") {
        url = `${API_URL}/products/search?keyword=${encodeURIComponent(keyword)}`;
    }

    // 📂 if category selected
    if (category !== "all") {
        url += keyword ? `&category=${category}` : `?category=${category}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        renderProducts(data);

    } catch (err) {
        console.error("Error:", err);
    }
}

/* 🔍 SEARCH EVENT */
if (searchInput) {
    searchInput.addEventListener("input", fetchProducts);
}

/* 📂 CATEGORY FILTER EVENT */
if (categoryFilter) {
    categoryFilter.addEventListener("change", fetchProducts);
}