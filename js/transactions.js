/* ========================================
   TRANSACTIONS
========================================= */

const transactionForm = document.getElementById("transactionForm");
const transactionFormWrapper = document.getElementById("transactionFormWrapper");

const openTransactionForm = document.getElementById("openTransactionForm");
const closeTransactionForm = document.getElementById("closeTransactionForm");
const cancelTransaction = document.getElementById("cancelTransaction");

const transactionEmpty = document.getElementById("transactionEmpty");
const transactionTableWrapper = document.getElementById("transactionTableWrapper");
const transactionList = document.getElementById("transactionList");

const transactionDate = document.getElementById("transactionDate");
const transactionDescription = document.getElementById("transactionDescription");
const transactionCategory = document.getElementById("transactionCategory");
const transactionAmount = document.getElementById("transactionAmount");
const deleteTransactionModal = document.getElementById("deleteTransactionModal");
const deleteModalOverlay = document.getElementById("deleteModalOverlay");
const cancelDeleteTransaction = document.getElementById("cancelDeleteTransaction");
const confirmDeleteTransaction = document.getElementById("confirmDeleteTransaction");
const transactionProduct =
    document.getElementById("transactionProduct");

const transactionQuantity =
    document.getElementById("transactionQuantity");

// TRANSACTION DELETE MODAL POP UP

function openDeleteModal(transactionId, triggerButton) {

    transactionToDelete = transactionId;

    deleteModalTrigger = triggerButton;

    deleteTransactionModal.classList.add("open");

    deleteTransactionModal.setAttribute(
        "aria-hidden",
        "false"
    );

}

function closeDeleteModal() {

    transactionToDelete = null;

    deleteTransactionModal.classList.remove(
        "open"
    );

    deleteTransactionModal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (deleteModalTrigger) {

        deleteModalTrigger.focus();

        deleteModalTrigger = null;

    }

}

if (cancelDeleteTransaction) {

    cancelDeleteTransaction.addEventListener(
        "click",
        closeDeleteModal
    );

}


if (deleteModalOverlay) {

    deleteModalOverlay.addEventListener(
        "click",
        closeDeleteModal
    );

}

if (confirmDeleteTransaction) {

    confirmDeleteTransaction.addEventListener(
        "click",
        function () {

            if (!transactionToDelete) {
                return;
            }


            /* ========================================
               GET TRANSACTIONS
            ========================================= */

            let transactions =
                getTransactions(
                    transactionUser.id
                );


            /* ========================================
               FIND TRANSACTION BEING DELETED
            ========================================= */

            const transaction =
                transactions.find(
                    function (item) {

                        return item.id === transactionToDelete;

                    }
                );


            if (!transaction) {

                closeDeleteModal();

                return;
            }


            /* ========================================
               RESTORE INVENTORY
               IF PRODUCT SALE
            ========================================= */

            if (
                transaction.type === "income" &&
                transaction.category === "Sales" &&
                transaction.productId &&
                transaction.quantity
            ) {

                const inventory =
                    getInventory(
                        transactionUser.id
                    );


                const product =
                    inventory.find(
                        function (item) {

                            return item.id === transaction.productId;

                        }
                    );

                if (product) {

                  

                    const previousInventory =
                        inventory.map(function (item) {

                            return {
                                ...item
                            };

                        });


                    product.stock +=
                        transaction.quantity;


                    saveInventory(
                        transactionUser.id,
                        inventory
                    );



                    if (typeof renderNotifications === "function") {

                        renderNotifications();

                    }

                }

            }


            /* ========================================
               REMOVE TRANSACTION
            ========================================= */

            transactions =
                transactions.filter(
                    function (item) {

                        return item.id !== transactionToDelete;

                    }
                );


            saveTransactions(
                transactionUser.id,
                transactions
            );

            refreshOverviewData();

            if (typeof renderGoals === "function") {
                renderGoals();
            }


            /* ========================================
               REFRESH UI
            ========================================= */

            closeDeleteModal();

            renderTransactions();

            updateDashboardStats();

            renderInventory();

            loadTransactionProducts();

        }
    );

}


let transactionToDelete = null;
let deleteModalTrigger = null;


/* ========================================
   CURRENT USER
========================================= */

const transactionSession = getSession();

let transactionUser = null;

if (transactionSession) {

    const users = getUsers();

    transactionUser = users.find(function (user) {
        return user.id === transactionSession.userId;
    });
}

/* ========================================
   LOAD INVENTORY PRODUCTS
========================================= */

function loadTransactionProducts() {

    const productSelect =
        document.getElementById("transactionProduct");

    if (!productSelect || !transactionUser) {
        return;
    }

    const inventory =
        getInventory(transactionUser.id);

    productSelect.innerHTML = `
        <option value="">
            Select product
        </option>
    `;

    inventory.forEach(function (product) {

        const option =
            document.createElement("option");

        option.value = product.id;

        option.textContent =
            `${product.name} — ${product.stock} in stock`;

        productSelect.appendChild(option);

    });

}


function updateProductFieldsVisibility() {

    const productField =
        document.getElementById("transactionProductField");

    const quantityField =
        document.getElementById("transactionQuantityField");

    const selectedType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        );

    const selectedCategory =
        transactionCategory.value;

    if (!productField || !quantityField || !selectedType) {
        return;
    }

    const isProductSale =
        selectedType.value === "income" &&
        selectedCategory === "Sales";

    if (isProductSale) {

        productField.style.display = "block";

        quantityField.style.display = "block";

    } else {

        productField.style.display = "none";

        quantityField.style.display = "none";

    }

}

const transactionTypeInputs =
    document.querySelectorAll(
        'input[name="transactionType"]'
    );


transactionTypeInputs.forEach(function (input) {

    input.addEventListener(
        "change",
        function () {

            updateProductFieldsVisibility();

            calculateProductSaleAmount();

        }
    );

});


if (transactionCategory) {

    transactionCategory.addEventListener(
        "change",
        function () {

            updateProductFieldsVisibility();

            calculateProductSaleAmount();

        }
    );

}

/* ========================================
   CALCULATE PRODUCT SALE AMOUNT
========================================= */

/* ========================================
   CALCULATE PRODUCT SALE AMOUNT
========================================= */

function calculateProductSaleAmount() {

    if (
        !transactionProduct ||
        !transactionQuantity ||
        !transactionAmount ||
        !transactionUser
    ) {
        return;
    }

    const selectedType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        );

    if (!selectedType) {
        return;
    }


    const isProductSale =
        selectedType.value === "income" &&
        transactionCategory.value === "Sales";


    /* ========================================
       NORMAL TRANSACTION
    ========================================= */

    if (!isProductSale) {

        transactionAmount.readOnly = false;

        transactionAmount.value = "";

        return;
    }


    /* ========================================
       PRODUCT SALE
    ========================================= */

    transactionAmount.readOnly = true;


    const selectedProductId =
        transactionProduct.value;

    const quantity =
        Number(transactionQuantity.value);


    if (!selectedProductId || !quantity) {

        transactionAmount.value = "";

        return;
    }


    const inventory =
        getInventory(transactionUser.id);


    const product =
        inventory.find(
            function (item) {

                return item.id === selectedProductId;

            }
        );


    if (!product) {

        transactionAmount.value = "";

        return;
    }


    const totalAmount =
        product.price * quantity;


    transactionAmount.value =
        totalAmount;

}

transactionProduct.addEventListener(
    "change",
    calculateProductSaleAmount
);

transactionQuantity.addEventListener(
    "input",
    calculateProductSaleAmount
);

/* ========================================
   OPEN FORM
========================================= */

if (openTransactionForm) {

    openTransactionForm.addEventListener("click", function () {

        transactionFormWrapper.classList.add("open");

        transactionDate.focus();

    });
}


/* ========================================
   CLOSE FORM
========================================= */

function closeTransactionFormFunction() {

    transactionFormWrapper.classList.remove("open");

    transactionForm.reset();

    setTodayDate();

    updateProductFieldsVisibility();

    loadTransactionProducts();

    transactionAmount.value = "";

}


if (closeTransactionForm) {

    closeTransactionForm.addEventListener(
        "click",
        closeTransactionFormFunction
    );
}


if (cancelTransaction) {

    cancelTransaction.addEventListener(
        "click",
        closeTransactionFormFunction
    );
}


/* ========================================
   DEFAULT DATE
========================================= */

function setTodayDate() {

    if (!transactionDate) {
        return;
    }

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    transactionDate.value =
        `${year}-${month}-${day}`;
}


/* ========================================
   SAVE TRANSACTION
========================================= */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ========================================
               CHECK USER SESSION
            ========================================= */

            if (!transactionUser) {

                alert(
                    "Your session could not be found. Please log in again."
                );

                return;
            }


            /* ========================================
               GET TRANSACTION TYPE
            ========================================= */

            const transactionType =
                document.querySelector(
                    'input[name="transactionType"]:checked'
                ).value;


            /* ========================================
               CHECK IF PRODUCT SALE
            ========================================= */

            const isProductSale =
                transactionType === "income" &&
                transactionCategory.value === "Sales";


            let inventory = [];

            let selectedProduct = null;

            let quantity = null;


            /* ========================================
               PRODUCT SALE VALIDATION
            ========================================= */

            if (isProductSale) {

                const selectedProductId =
                    transactionProduct.value;


                quantity =
                    Number(transactionQuantity.value);


                /* ----------------------------------------
                   PRODUCT REQUIRED
                ----------------------------------------- */

                if (!selectedProductId) {

                    alert(
                        "Please select a product."
                    );

                    return;
                }


                /* ----------------------------------------
                   VALIDATE QUANTITY
                ----------------------------------------- */

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {

                    alert(
                        "Please enter a valid quantity."
                    );

                    return;
                }


                /* ----------------------------------------
                   GET INVENTORY
                ----------------------------------------- */

                inventory =
                    getInventory(
                        transactionUser.id
                    );


                /* ----------------------------------------
                   FIND SELECTED PRODUCT
                ----------------------------------------- */

                selectedProduct =
                    inventory.find(
                        function (product) {

                            return product.id === selectedProductId;

                        }
                    );


                if (!selectedProduct) {

                    alert(
                        "The selected product could not be found."
                    );

                    return;
                }


                /* ----------------------------------------
                   CHECK AVAILABLE STOCK
                ----------------------------------------- */

                if (quantity > selectedProduct.stock) {

                    alert(
                        `${selectedProduct.name} only has ${selectedProduct.stock} unit(s) in stock.`
                    );

                    return;
                }

            }


            /* ========================================
               VALIDATE BASIC TRANSACTION FIELDS
            ========================================= */

            const description =
                transactionDescription.value.trim();

            const category =
                transactionCategory.value;

            const amount =
                Number(transactionAmount.value);


            if (
                !transactionDate.value ||
                !description ||
                !category ||
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Please complete all transaction fields."
                );

                return;
            }


            /* ========================================
               CREATE TRANSACTION
            ========================================= */

            const newTransaction = {

                id:
                    Date.now().toString(),

                date:
                    transactionDate.value,

                description:
                    description,

                category:
                    category,

                type:
                    transactionType,

                amount:
                    amount,

                productId:
                    isProductSale
                        ? selectedProduct.id
                        : null,

                quantity:
                    isProductSale
                        ? quantity
                        : null

            };


/* ========================================
   DEDUCT INVENTORY
========================================= */

if (isProductSale) {


    const previousInventory =
        inventory.map(function (product) {

            return {
                ...product
            };

        });


    selectedProduct.stock -= quantity;


    saveInventory(
        transactionUser.id,
        inventory
    );



    if (typeof renderNotifications === "function") {

        renderNotifications();

    }



    if (
        typeof checkForNewInventoryNotifications ===
        "function"
    ) {

        checkForNewInventoryNotifications(
            previousInventory
        );

    }

}


            /* ========================================
               SAVE TRANSACTION
            ========================================= */

            const transactions =
                getTransactions(
                    transactionUser.id
                );


            transactions.unshift(
                newTransaction
            );


            saveTransactions(
                transactionUser.id,
                transactions
            );

            refreshOverviewData();


            /* ========================================
               RESET & REFRESH
            ========================================= */

            closeTransactionFormFunction();

            renderTransactions();

            updateDashboardStats();

            renderInventory();

            loadTransactionProducts();

        }
    );

}


/* ========================================
   DISPLAY TRANSACTIONS
========================================= */


function getTransactionProductName(productId) {

    const inventory =
        getInventory(transactionUser.id);

    const product =
        inventory.find(function (item) {

            return item.id === productId;

        });

    if (!product) {
        return "Product unavailable";
    }

    return product.name;
}

function renderTransactions() {

    if (!transactionUser) {
        return;
    }


    const transactions =
        getTransactions(transactionUser.id);


    transactionList.innerHTML = "";


    /* ========================================
       NO TRANSACTIONS
    ========================================= */

    if (transactions.length === 0) {

        transactionEmpty.classList.add("visible");

        transactionTableWrapper.classList.remove(
            "visible"
        );

        return;
    }


    /* ========================================
       HAS TRANSACTIONS
    ========================================= */

    transactionEmpty.classList.remove(
        "visible"
    );

    transactionTableWrapper.classList.add(
        "visible"
    );


    /* ========================================
       RENDER TRANSACTIONS
    ========================================= */

    transactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        const formattedAmount =
            formatCurrency(transaction.amount);


        const formattedDate =
            formatTransactionDate(
                transaction.date
            );


        row.innerHTML = `

            <td>
                ${formattedDate}
            </td>

            <td>

                ${
                    transaction.productId && transaction.quantity
                        ? `${transaction.description} × ${transaction.quantity}`
                        : transaction.description
                }

            </td>

            <td>

                ${
                    transaction.productId
                        ? getTransactionProductName(transaction.productId)
                        : "—"
                }

            </td>

            <td>
                ${transaction.category}
            </td>

            <td>

                <span class="transaction-badge ${transaction.type}">
                    ${
                        transaction.type === "income"
                            ? "Income"
                            : "Expense"
                    }
                </span>

            </td>

            <td class="${
                transaction.type === "income"
                    ? "transaction-income"
                    : "transaction-expense"
            }">

                ${
                    transaction.type === "income"
                        ? "+"
                        : "-"
                }

                ${formattedAmount}

            </td>

            <td>

                <button
                    type="button"
                    class="transaction-delete-button"
                    data-id="${transaction.id}"
                >
                    Delete
                </button>

            </td>

        `;


        transactionList.appendChild(row);

    });


    addDeleteListeners();

}


/* ========================================
   DELETE TRANSACTION
========================================= */

function addDeleteListeners() {

    const deleteButtons =
        document.querySelectorAll(
            ".transaction-delete-button"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const transactionId =
                    button.dataset.id;

                openDeleteModal(transactionId, button);

            }
        );

    });

}


/* ========================================
   CURRENCY FORMAT
========================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* ========================================
   DATE FORMAT
========================================= */

function formatTransactionDate(date) {

    const transactionDate =
        new Date(date + "T00:00:00");


    return transactionDate.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ========================================
   UPDATE DASHBOARD STATS
========================================= */

function updateDashboardStats() {

    if (!transactionUser) {
        return;
    }


    const transactions =
        getTransactions(
            transactionUser.id
        );


    let revenue = 0;

    let expenses = 0;


    transactions.forEach(
        function (transaction) {

            if (transaction.type === "income") {

                revenue += transaction.amount;

            } else {

                expenses += transaction.amount;

            }

        }
    );


    const profit =
        revenue - expenses;


    const revenueElement =
        document.getElementById(
            "revenueValue"
        );


    const expenseElement =
        document.getElementById(
            "expenseValue"
        );


    const profitElement =
        document.getElementById(
            "profitValue"
        );


    if (revenueElement) {

        revenueElement.textContent =
            formatCurrency(revenue);

    }


    if (expenseElement) {

        expenseElement.textContent =
            formatCurrency(expenses);

    }


    if (profitElement) {

        profitElement.textContent =
            formatCurrency(profit);

    }


    const revenueChange =
        document.getElementById("revenueChange");

    const expenseChange =
        document.getElementById("expenseChange");

    const profitChange =
        document.getElementById("profitChange");


    const hasTransactions =
        transactions.length > 0;


    if (revenueChange) {

        revenueChange.hidden =
            hasTransactions;

    }


    if (expenseChange) {

        expenseChange.hidden =
            hasTransactions;

    }


    if (profitChange) {

        profitChange.hidden =
            hasTransactions;

    }

}




/* ========================================
   INITIALIZE
========================================= */

setTodayDate();

loadTransactionProducts();

updateProductFieldsVisibility();

renderTransactions();

updateDashboardStats();

if (typeof renderNotifications === "function") {

    renderNotifications();

}

console.log("Transactions initialized");
console.log("Empty state:", transactionEmpty);
console.log("Table:", transactionTableWrapper);
console.log(
    "Empty state display:",
    window.getComputedStyle(transactionEmpty).display
);
console.log(
    "Table display:",
    window.getComputedStyle(transactionTableWrapper).display
);