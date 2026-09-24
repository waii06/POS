// ==========================================
// MONO POS
// Dashboard + Orders + Products + Reports
// ==========================================


// ==========================================
// DEFAULT PRODUCTS
// ==========================================

const defaultProducts = [
    {
        id: 1,
        name: "Black Coffee",
        category: "coffee",
        price: 95,
        icon: "☕"
    },
    {
        id: 2,
        name: "Iced Latte",
        category: "coffee",
        price: 135,
        icon: "🥤"
    },
    {
        id: 3,
        name: "Cappuccino",
        category: "coffee",
        price: 145,
        icon: "☕"
    },
    {
        id: 4,
        name: "Americano",
        category: "coffee",
        price: 110,
        icon: "☕"
    },
    {
        id: 5,
        name: "Classic Burger",
        category: "food",
        price: 185,
        icon: "🍔"
    },
    {
        id: 6,
        name: "French Fries",
        category: "food",
        price: 90,
        icon: "🍟"
    },
    {
        id: 7,
        name: "Club Sandwich",
        category: "food",
        price: 165,
        icon: "🥪"
    },
    {
        id: 8,
        name: "Chocolate Cake",
        category: "dessert",
        price: 125,
        icon: "🍰"
    },
    {
        id: 9,
        name: "Cheesecake",
        category: "dessert",
        price: 145,
        icon: "🍰"
    },
    {
        id: 10,
        name: "Donut",
        category: "dessert",
        price: 75,
        icon: "🍩"
    },
    {
        id: 11,
        name: "Cookies",
        category: "dessert",
        price: 65,
        icon: "🍪"
    },
    {
        id: 12,
        name: "Chicken Meal",
        category: "food",
        price: 220,
        icon: "🍗"
    }
];


// ==========================================
// LOCAL STORAGE
// ==========================================

let products =
    JSON.parse(localStorage.getItem("monoProducts"))
    || defaultProducts;

let orders =
    JSON.parse(localStorage.getItem("monoOrders"))
    || [];

let cart = [];


// ==========================================
// SAVE DATA
// ==========================================

function saveProducts() {

    localStorage.setItem(
        "monoProducts",
        JSON.stringify(products)
    );
}


function saveOrders() {

    localStorage.setItem(
        "monoOrders",
        JSON.stringify(orders)
    );
}


// ==========================================
// DOM
// ==========================================

const productGrid =
    document.getElementById("productGrid");

const cartItems =
    document.getElementById("cartItems");

const subtotalElement =
    document.getElementById("subtotal");

const taxElement =
    document.getElementById("tax");

const totalElement =
    document.getElementById("total");

const changeElement =
    document.getElementById("change");

const itemCountElement =
    document.getElementById("itemCount");

const paymentInput =
    document.getElementById("paymentInput");

const searchInput =
    document.getElementById("searchInput");

const receiptModal =
    document.getElementById("receiptModal");

const receipt =
    document.getElementById("receipt");

const productModal =
    document.getElementById("productModal");

const orderModal =
    document.getElementById("orderModal");


// ==========================================
// DATE
// ==========================================

function updateDate() {

    const now = new Date();

    document.getElementById("date").textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
}

updateDate();


// ==========================================
// MONEY
// ==========================================

function formatMoney(amount) {

    return `₱${Number(amount).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;
}


// ==========================================
// NAVIGATION
// ==========================================

const navItems =
    document.querySelectorAll(".nav-item");

const pages = {
    dashboard: document.getElementById("dashboardPage"),
    orders: document.getElementById("ordersPage"),
    products: document.getElementById("productsPage"),
    reports: document.getElementById("reportsPage")
};


const pageTitles = {
    dashboard: "Point of Sale",
    orders: "Orders",
    products: "Products",
    reports: "Reports"
};


navItems.forEach(button => {

    button.addEventListener("click", () => {

        const page =
            button.dataset.page;


        navItems.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");


        Object.values(pages).forEach(section => {
            section.classList.remove("active-page");
        });


        pages[page].classList.add("active-page");


        document.getElementById("pageTitle")
            .textContent = pageTitles[page];


        if (page === "orders") {
            renderOrders();
        }

        if (page === "products") {
            renderAdminProducts();
        }

        if (page === "reports") {
            renderReports();
        }

    });

});


// ==========================================
// DASHBOARD PRODUCTS
// ==========================================

function displayProducts(list = products) {

    productGrid.innerHTML = "";


    if (list.length === 0) {

        productGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
                color:#555;
            ">
                No products found.
            </div>
        `;

        return;
    }


    list.forEach((product, index) => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.style.animationDelay =
            `${index * .04}s`;


        card.innerHTML = `

            <div class="product-image">
                ${product.icon}
            </div>

            <h3>${product.name}</h3>

            <span class="category-name">
                ${product.category}
            </span>

            <div class="product-bottom">

                <span class="price">
                    ${formatMoney(product.price)}
                </span>

                <button class="add-btn">
                    +
                </button>

            </div>
        `;


        card.addEventListener(
            "click",
            () => addToCart(product.id)
        );


        productGrid.appendChild(card);

    });
}


displayProducts();


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        const filtered =
            products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(query)
            );


        displayProducts(filtered);

    }
);


// ==========================================
// CATEGORY
// ==========================================

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add("active");


                const category =
                    button.dataset.category;


                if (category === "all") {

                    displayProducts(products);

                } else {

                    displayProducts(
                        products.filter(
                            product =>
                                product.category === category
                        )
                    );

                }

            }
        );

    });


// ==========================================
// CART
// ==========================================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    renderCart();
}


function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product => product.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    renderCart();
}


function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Select a product to start an order.
                </p>

            </div>

        `;

    } else {

        cartItems.innerHTML = "";


        cart.forEach(item => {

            const element =
                document.createElement("div");

            element.className =
                "cart-item";


            element.innerHTML = `

                <div class="cart-item-image">
                    ${item.icon}
                </div>

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>${formatMoney(item.price)}</p>

                    <div class="item-controls">

                        <button
                            class="qty-btn"
                            onclick="changeQuantity(
                                ${item.id},
                                -1
                            )"
                        >
                            −
                        </button>

                        <span class="quantity">
                            ${item.quantity}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="changeQuantity(
                                ${item.id},
                                1
                            )"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="item-price">
                    ${formatMoney(
                        item.price *
                        item.quantity
                    )}
                </div>

            `;


            cartItems.appendChild(element);

        });

    }


    updateSummary();
}


// ==========================================
// SUMMARY
// ==========================================

function calculateSubtotal() {

    return cart.reduce(
        (sum, item) =>
            sum +
            item.price *
            item.quantity,
        0
    );
}


function updateSummary() {

    const subtotal =
        calculateSubtotal();

    const tax =
        subtotal * .12;

    const total =
        subtotal + tax;


    subtotalElement.textContent =
        formatMoney(subtotal);

    taxElement.textContent =
        formatMoney(tax);

    totalElement.textContent =
        formatMoney(total);


    const items =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    itemCountElement.textContent =
        `${items} ${
            items === 1
                ? "item"
                : "items"
        }`;


    updateChange();
}


function updateChange() {

    const payment =
        Number(paymentInput.value) || 0;

    const total =
        calculateSubtotal() * 1.12;


    if (payment <= 0) {

        changeElement.textContent =
            "₱0.00";

    } else if (payment >= total) {

        changeElement.textContent =
            formatMoney(
                payment - total
            );

    } else {

        changeElement.textContent =
            "Insufficient";

    }
}


paymentInput.addEventListener(
    "input",
    updateChange
);


// ==========================================
// CLEAR CART
// ==========================================

document
    .getElementById("clearCart")
    .addEventListener(
        "click",
        () => {

            cart = [];

            paymentInput.value = "";

            renderCart();

        }
    );


// ==========================================
// CHECKOUT
// ==========================================

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        completePayment
    );


function completePayment() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const payment =
        Number(paymentInput.value) || 0;


    const subtotal =
        calculateSubtotal();

    const tax =
        subtotal * .12;

    const total =
        subtotal + tax;


    if (payment < total) {

        alert(
            `Insufficient payment.\n\n` +
            `Total: ${formatMoney(total)}\n` +
            `Payment: ${formatMoney(payment)}`
        );

        return;
    }


    const change =
        payment - total;


    const orderNumber =
        generateOrderNumber();


    const order = {

        id: orderNumber,

        date:
            new Date().toLocaleString(
                "en-PH"
            ),

        items:
            cart.map(item => ({
                ...item
            })),

        subtotal,
        tax,
        total,
        payment,
        change

    };


    orders.unshift(order);

    saveOrders();


    generateReceipt(order);


    receiptModal.classList.add("show");

}


// ==========================================
// ORDER NUMBER
// ==========================================

function generateOrderNumber() {

    return Math.floor(
        100000 +
        Math.random() * 900000
    );

}


// ==========================================
// RECEIPT
// ==========================================

function generateReceipt(order) {

    let html = "";


    order.items.forEach(item => {

        html += `

            <div class="receipt-line">

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

                <span>
                    ${formatMoney(
                        item.price *
                        item.quantity
                    )}
                </span>

            </div>

        `;

    });


    html += `

        <div class="receipt-total">

            <span>Total</span>

            <span>
                ${formatMoney(order.total)}
            </span>

        </div>


        <div class="receipt-info">

            <div>
                <span>Order #</span>
                <strong>${order.id}</strong>
            </div>

            <div>
                <span>Subtotal</span>
                <strong>
                    ${formatMoney(order.subtotal)}
                </strong>
            </div>

            <div>
                <span>Tax</span>
                <strong>
                    ${formatMoney(order.tax)}
                </strong>
            </div>

            <div>
                <span>Payment</span>
                <strong>
                    ${formatMoney(order.payment)}
                </strong>
            </div>

            <div>
                <span>Change</span>
                <strong>
                    ${formatMoney(order.change)}
                </strong>
            </div>

        </div>
    `;


    receipt.innerHTML = html;
}


// ==========================================
// NEW ORDER
// ==========================================

document
    .getElementById("newOrder")
    .addEventListener(
        "click",
        () => {

            cart = [];

            paymentInput.value = "";

            receiptModal
                .classList
                .remove("show");

            renderCart();

        }
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        () => {

            receiptModal
                .classList
                .remove("show");

        }
    );


// ==========================================
// ORDERS PAGE
// ==========================================

function renderOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );

    const empty =
        document.getElementById(
            "ordersEmpty"
        );

    const count =
        document.getElementById(
            "ordersCount"
        );


    count.textContent =
        orders.length;


    table.innerHTML = "";


    if (orders.length === 0) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    orders.forEach(order => {

        const row =
            document.createElement("tr");


        const totalItems =
            order.items.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );


        row.innerHTML = `

            <td>
                <span class="order-number">
                    #${order.id}
                </span>
            </td>

            <td>
                ${order.date}
            </td>

            <td>
                ${totalItems}
            </td>

            <td>
                ${formatMoney(order.total)}
            </td>

            <td>
                ${formatMoney(order.payment)}
            </td>

            <td>
                ${formatMoney(order.change)}
            </td>

            <td>

                <button
                    class="view-btn"
                    onclick="viewOrder(${order.id})"
                >
                    View
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// VIEW ORDER
// ==========================================

function viewOrder(orderId) {

    const order =
        orders.find(
            item => item.id === orderId
        );


    if (!order) return;


    const container =
        document.getElementById(
            "orderDetails"
        );


    let html = `

        <div class="receipt-info">

            <div>
                <span>Order #</span>
                <strong>${order.id}</strong>
            </div>

            <div>
                <span>Date</span>
                <strong>${order.date}</strong>
            </div>

        </div>

        <br>
    `;


    order.items.forEach(item => {

        html += `

            <div class="order-detail-item">

                <span>
                    ${item.icon}
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ${formatMoney(
                        item.price *
                        item.quantity
                    )}
                </strong>

            </div>

        `;

    });


    html += `

        <div class="order-detail-total">

            <span>Total</span>

            <span>
                ${formatMoney(order.total)}
            </span>

        </div>

        <div class="receipt-info">

            <div>
                <span>Payment</span>
                <strong>
                    ${formatMoney(order.payment)}
                </strong>
            </div>

            <div>
                <span>Change</span>
                <strong>
                    ${formatMoney(order.change)}
                </strong>
            </div>

        </div>

    `;


    container.innerHTML = html;

    orderModal.classList.add("show");

}


document
    .getElementById("closeOrderModal")
    .addEventListener(
        "click",
        () => {

            orderModal
                .classList
                .remove("show");

        }
    );


// ==========================================
// PRODUCTS MANAGEMENT
// ==========================================

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProductGrid"
        );


    container.innerHTML = "";


    products.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "admin-product";


        card.innerHTML = `

            <div class="admin-icon">
                ${product.icon}
            </div>

            <div class="admin-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.category}
                </p>

                <div class="admin-price">
                    ${formatMoney(product.price)}
                </div>

            </div>

            <div class="admin-actions">

                <button
                    class="icon-btn"
                    onclick="editProduct(${product.id})"
                    title="Edit"
                >
                    ✎
                </button>

                <button
                    class="icon-btn"
                    onclick="deleteProduct(${product.id})"
                    title="Delete"
                >
                    ×
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// ADD PRODUCT
// ==========================================

document
    .getElementById("addProductBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "productModalTitle"
                )
                .textContent =
                "Add Product";


            document
                .getElementById(
                    "productForm"
                )
                .reset();


            document
                .getElementById(
                    "editProductId"
                )
                .value = "";


            productModal
                .classList
                .add("show");

        }
    );


// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
        "Edit Product";


    document
        .getElementById(
            "editProductId"
        )
        .value =
        product.id;


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name;


    document
        .getElementById(
            "productCategory"
        )
        .value =
        product.category;


    document
        .getElementById(
            "productPrice"
        )
        .value =
        product.price;


    document
        .getElementById(
            "productIcon"
        )
        .value =
        product.icon;


    productModal
        .classList
        .add("show");

}


// ==========================================
// SAVE PRODUCT
// ==========================================

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                document
                    .getElementById(
                        "editProductId"
                    )
                    .value;


            const name =
                document
                    .getElementById(
                        "productName"
                    )
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "productCategory"
                    )
                    .value;


            const price =
                Number(
                    document
                        .getElementById(
                            "productPrice"
                        )
                        .value
                );


            const icon =
                document
                    .getElementById(
                        "productIcon"
                    )
                    .value
                    .trim();


            if (id) {

                const product =
                    products.find(
                        item =>
                            item.id ===
                            Number(id)
                    );


                if (product) {

                    product.name =
                        name;

                    product.category =
                        category;

                    product.price =
                        price;

                    product.icon =
                        icon;

                }

            } else {

                products.push({

                    id:
                        Date.now(),

                    name,

                    category,

                    price,

                    icon

                });

            }


            saveProducts();


            displayProducts();

            renderAdminProducts();


            productModal
                .classList
                .remove("show");

        }
    );


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const confirmDelete =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmDelete) return;


    products =
        products.filter(
            item => item.id !== productId
        );


    saveProducts();


    displayProducts();

    renderAdminProducts();

}


// ==========================================
// CLOSE PRODUCT MODAL
// ==========================================

document
    .getElementById("closeProductModal")
    .addEventListener(
        "click",
        () => {

            productModal
                .classList
                .remove("show");

        }
    );


// ==========================================
// REPORTS
// ==========================================

function renderReports() {

    const totalSales =
        orders.reduce(
            (sum, order) =>
                sum + order.total,
            0
        );


    const totalOrders =
        orders.length;


    const itemsSold =
        orders.reduce(
            (sum, order) =>
                sum +
                order.items.reduce(
                    (itemSum, item) =>
                        itemSum +
                        item.quantity,
                    0
                ),
            0
        );


    const average =
        totalOrders > 0
            ? totalSales / totalOrders
            : 0;


    document
        .getElementById(
            "reportSales"
        )
        .textContent =
        formatMoney(totalSales);


    document
        .getElementById(
            "reportOrders"
        )
        .textContent =
        totalOrders;


    document
        .getElementById(
            "reportItems"
        )
        .textContent =
        itemsSold;


    document
        .getElementById(
            "reportAverage"
        )
        .textContent =
        formatMoney(average);


    renderProductReport();

}


// ==========================================
// PRODUCT REPORT
// ==========================================

function renderProductReport() {

    const container =
        document.getElementById(
            "productReport"
        );


    const sales = {};


    orders.forEach(order => {

        order.items.forEach(item => {

            if (!sales[item.id]) {

                sales[item.id] = {

                    name: item.name,

                    icon: item.icon,

                    quantity: 0,

                    revenue: 0

                };

            }


            sales[item.id].quantity +=
                item.quantity;


            sales[item.id].revenue +=
                item.price *
                item.quantity;

        });

    });


    const sorted =
        Object.values(sales)
            .sort(
                (a, b) =>
                    b.quantity -
                    a.quantity
            );


    if (sorted.length === 0) {

        container.innerHTML = `

            <div class="table-empty">
                No sales data yet.
            </div>

        `;

        return;
    }


    container.innerHTML = "";


    sorted.forEach(item => {

        const row =
            document.createElement("div");


        row.className =
            "sales-row";


        row.innerHTML = `

            <div class="sales-icon">
                ${item.icon}
            </div>

            <div class="sales-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ${item.quantity} item(s) sold
                </span>

            </div>

            <div class="sales-value">
                ${formatMoney(item.revenue)}
            </div>

        `;


        container.appendChild(row);

    });

}


// ==========================================
// CLEAR REPORTS / ORDERS
// ==========================================

document
    .getElementById("clearReportsBtn")
    .addEventListener(
        "click",
        () => {

            if (orders.length === 0) {

                alert(
                    "There is no sales data to clear."
                );

                return;
            }


            const confirmed =
                confirm(
                    "Delete ALL order and sales history?"
                );


            if (!confirmed) return;


            orders = [];

            saveOrders();


            renderReports();

            renderOrders();


            alert(
                "Sales data has been cleared."
            );

        }
    );


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmed) {

                alert(
                    "Logout function triggered."
                );

            }

        }
    );


// ==========================================
// INITIALIZE
// ==========================================

renderCart();

renderAdminProducts();

renderOrders();

renderReports();
