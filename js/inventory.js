const inventoryForm = document.getElementById("inventoryForm");

const inventoryFormWrapper = document.getElementById(
    "inventoryFormWrapper"
);

const openProductForm = document.getElementById(
    "openProductForm"
);

const openProductFormEmpty = document.getElementById(
    "openProductFormEmpty"
);

const closeProductForm = document.getElementById(
    "closeProductForm"
);

const cancelProductForm = document.getElementById(
    "cancelProductForm"
);

let editingProductId = null;

const inventoryFormTitle =
    document.getElementById("inventoryFormTitle");


const inventoryDeleteModal =
    document.getElementById("inventoryDeleteModal");

const deleteProductName =
    document.getElementById("deleteProductName");

const cancelInventoryDelete =
    document.getElementById("cancelInventoryDelete");

const confirmInventoryDelete =
    document.getElementById("confirmInventoryDelete");

let productToDeleteId = null;


/* ========================================
   OPEN PRODUCT FORM
========================================= */

function showInventoryForm() {

    inventoryFormWrapper.style.display = "block";

    document.getElementById("productName").focus();

}


/* ========================================
   CLOSE PRODUCT FORM
========================================= */

function hideInventoryForm() {

    inventoryFormWrapper.style.display = "none";

    inventoryForm.reset();

    editingProductId = null;

    inventoryFormTitle.textContent = "Add Product";

}

/* ========================================
   OPEN FORM BUTTONS
========================================= */

openProductForm.addEventListener(
    "click",
    showInventoryForm
);

openProductFormEmpty.addEventListener(
    "click",
    showInventoryForm
);


/* ========================================
   CLOSE FORM BUTTONS
========================================= */

closeProductForm.addEventListener(
    "click",
    hideInventoryForm
);

cancelProductForm.addEventListener(
    "click",
    hideInventoryForm
);


/* ========================================
   SAVE PRODUCT
========================================= */

inventoryForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const productName =
            document.getElementById("productName").value.trim();

        const productCategory =
            document.getElementById("productCategory").value.trim();

        const productStock =
            Number(document.getElementById("productStock").value);

        const productPrice =
            Number(document.getElementById("productPrice").value);


const inventory = getInventory(currentUser.id);


if (editingProductId) {

    const productIndex = inventory.findIndex(
        function (product) {

            return product.id === editingProductId;

        }
    );


    if (productIndex !== -1) {

        inventory[productIndex] = {

            id: editingProductId,

            name: productName,

            category: productCategory,

            stock: productStock,

            price: productPrice

        };

    }


} else {

    const newProduct = {

        id: Date.now().toString(),

        name: productName,

        category: productCategory,

        stock: productStock,

        price: productPrice

    };


    inventory.push(newProduct);

}


          saveInventory(currentUser.id, inventory);

          editingProductId = null;

          inventoryFormTitle.textContent = "Add Product";


        hideInventoryForm();

        renderInventory();

    }
);

/* ========================================
   RENDER INVENTORY
========================================= */

function renderInventory() {

    const inventory = getInventory(currentUser.id);

    const inventoryList =
        document.getElementById("inventoryList");

    const inventoryEmpty =
        document.getElementById("inventoryEmpty");

    const inventoryTable =
        document.getElementById("inventoryTable");


    /* ========================================
       UPDATE SUMMARY COUNTS
    ========================================= */

    const totalProducts =
        document.getElementById("totalProducts");

    const lowStockProducts =
        document.getElementById("lowStockProducts");

    const outOfStockProducts =
        document.getElementById("outOfStockProducts");


    totalProducts.textContent = inventory.length;


    const lowStockCount = inventory.filter(function (product) {

        return product.stock > 0 && product.stock <= 5;

    }).length;


    const outOfStockCount = inventory.filter(function (product) {

        return product.stock === 0;

    }).length;


    lowStockProducts.textContent = lowStockCount;

    outOfStockProducts.textContent = outOfStockCount;


    /* ========================================
       EMPTY STATE
    ========================================= */

    if (inventory.length === 0) {

        inventoryEmpty.style.display = "block";

        inventoryTable.style.display = "none";

        inventoryList.innerHTML = "";

        return;
    }


    /* ========================================
       SHOW TABLE
    ========================================= */

    inventoryEmpty.style.display = "none";

    inventoryTable.style.display = "table";

    inventoryList.innerHTML = "";


    /* ========================================
       RENDER PRODUCTS
    ========================================= */

    inventory.forEach(function (product) {

        let statusText = "";

        let statusClass = "";


        if (product.stock === 0) {

            statusText = "Out of Stock";

            statusClass = "out-of-stock";

        } else if (product.stock <= 5) {

            statusText = "Low Stock";

            statusClass = "low-stock";

        } else {

            statusText = "In Stock";

            statusClass = "in-stock";

        }


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${product.name}
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                ${product.stock}
            </td>

            <td>
                ₦${product.price.toLocaleString()}
            </td>

            <td>
                <span class="inventory-status ${statusClass}">
                    ${statusText}
                </span>
            </td>

            <td>
                <div class="inventory-actions">

                    <button
                        type="button"
                        class="inventory-action-button edit"
                        data-id="${product.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="inventory-action-button delete"
                        data-id="${product.id}"
                    >
                        Delete
                    </button>

                </div>
            </td>

        `;


        inventoryList.appendChild(row);

    });


    /* ========================================
       EDIT BUTTONS
    ========================================= */

    const editButtons =
        document.querySelectorAll(
            ".inventory-action-button.edit"
        );


    editButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    button.dataset.id;

                openEditProduct(productId);

            }
        );

    });

    /* ========================================
   DELETE BUTTONS
========================================= */

    const deleteButtons =
        document.querySelectorAll(
            ".inventory-action-button.delete"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    button.dataset.id;

                deleteProduct(productId);

            }
        );

    });

}



/* ========================================
   LOAD INVENTORY
========================================= */

renderInventory();

/* ========================================
   OPEN EDIT PRODUCT
========================================= */

function openEditProduct(productId) {

    const inventory = getInventory(currentUser.id);

    const product = inventory.find(function (item) {

        return item.id === productId;

    });


    if (!product) {
        return;
    }


    editingProductId = productId;


    inventoryFormTitle.textContent =
        "Edit Product";


    document.getElementById("productName").value =
        product.name;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productStock").value =
        product.stock;

    document.getElementById("productPrice").value =
        product.price;


    inventoryFormWrapper.style.display = "block";


    document.getElementById("productName").focus();

}

/* ========================================
   OPEN DELETE MODAL
========================================= */

function deleteProduct(productId) {

    const inventory = getInventory(currentUser.id);

    const product = inventory.find(function (item) {

        return item.id === productId;

    });


    if (!product) {
        return;
    }


    productToDeleteId = productId;

    deleteProductName.textContent =
        product.name;

    inventoryDeleteModal.style.display = "flex";

}


/* ========================================
   CLOSE DELETE MODAL
========================================= */

function closeInventoryDeleteModal() {

    inventoryDeleteModal.style.display = "none";

    productToDeleteId = null;

}


/* ========================================
   CONFIRM DELETE
========================================= */

confirmInventoryDelete.addEventListener(
    "click",
    function () {

        if (!productToDeleteId) {
            return;
        }


        const inventory =
            getInventory(currentUser.id);


        const updatedInventory =
            inventory.filter(function (item) {

                return item.id !== productToDeleteId;

            });


        saveInventory(
            currentUser.id,
            updatedInventory
        );


        closeInventoryDeleteModal();

        renderInventory();

    }
);


/* ========================================
   CANCEL DELETE
========================================= */

cancelInventoryDelete.addEventListener(
    "click",
    closeInventoryDeleteModal
);