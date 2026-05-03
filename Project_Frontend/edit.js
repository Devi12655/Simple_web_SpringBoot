const API_URL = "http://localhost:8080/api";

// get product id from URL
const id = new URLSearchParams(window.location.search).get("id");

/* =========================
   LOAD PRODUCT DATA
========================= */
async function loadProduct() {
    try {
        const res = await fetch(`${API_URL}/product/${id}`);

        if (!res.ok) throw new Error("Failed to load product");

        const p = await res.json();

        // fill form fields
        document.getElementById("name").value = p.name || "";
        document.getElementById("brand").value = p.brand || "";
        document.getElementById("category").value = p.category || "";
        document.getElementById("price").value = p.price || "";
        document.getElementById("quantity").value = p.quantity || "";
        document.getElementById("description").value = p.description || "";
        document.getElementById("releaseDate").value =
            p.releaseDate ? p.releaseDate.split("T")[0] : "";

        // show existing image
        document.getElementById("previewImage").src =
            `${API_URL}/product/${id}/image`;

    } catch (err) {
        console.error(err);
        alert("Error loading product");
    }
}

loadProduct();


/* =========================
   UPDATE PRODUCT
========================= */
document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔥 ALWAYS use getElementById
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

    // send JSON as blob
    formData.append("product", new Blob(
        [JSON.stringify(product)],
        { type: "application/json" }
    ));

    // only attach image if selected
    if (image) {
        formData.append("image", image);
    }

    try {
        const res = await fetch(`${API_URL}/product/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) throw new Error("Update failed");

        alert("✅ Product Updated Successfully!");
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
        alert("❌ Error updating product");
    }
});


/* =========================
   IMAGE LIVE PREVIEW (OPTIONAL UX)
========================= */
document.getElementById("image").addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
        document.getElementById("previewImage").src =
            URL.createObjectURL(file);
    }
});