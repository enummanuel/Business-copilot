// ========================================
// BUSINESS COPILOT - DASHBOARD
// ========================================


// ========================================
// GET CURRENT USER
// ========================================

const dashboardSession = getSession();

let currentUser = null;

if (dashboardSession) {

    const users = getUsers();

    currentUser = users.find(function (user) {
        return user.id === dashboardSession.userId;
    });

}


// ========================================
// DISPLAY USER INFORMATION
// ========================================

if (currentUser) {

    const userName =
        document.getElementById("dashboardUserName");

    const welcomeMessage =
        document.getElementById("dashboardWelcome");

    const userAvatar =
        document.getElementById("dashboardUserAvatar");


    // Display user's name
    if (userName) {
        userName.textContent = currentUser.name;
    }


    // Display welcome message
    if (welcomeMessage) {
        welcomeMessage.textContent =
            `Welcome back, ${currentUser.name}.`;
    }


    // Create initials
    if (userAvatar) {

        const nameParts =
            currentUser.name.trim().split(" ");

        let initials =
            nameParts[0].charAt(0).toUpperCase();

        if (nameParts.length > 1) {

            initials +=
                nameParts[nameParts.length - 1]
                    .charAt(0)
                    .toUpperCase();

        }

        userAvatar.textContent = initials;
    }

}


// ========================================
// DISPLAY CURRENT DATE
// ========================================

const dashboardDate =
    document.getElementById("dashboardDate");

if (dashboardDate) {

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString("en-NG", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    dashboardDate.textContent = formattedDate;
}


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        logout();

    });

}


// ========================================
// MOBILE SIDEBAR
// ========================================

const menuButton =
    document.getElementById("dashboardMenuButton");

const sidebar =
    document.getElementById("dashboardSidebar");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });

}


// ========================================
// CLOSE SIDEBAR AFTER NAVIGATION
// ========================================

const dashboardLinks =
    document.querySelectorAll(".dashboard-nav-link");

dashboardLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (window.innerWidth <= 800 && sidebar) {

            sidebar.classList.remove("open");

        }

    });

});


// ========================================
// QUICK ACTIONS
// ========================================

const addTransactionButton =
    document.getElementById("addTransactionButton");

const addProductButton =
    document.getElementById("addProductButton");

const setGoalButton =
    document.getElementById("setGoalButton");

const askBusinessButton =
    document.getElementById("askBusinessButton");


if (addTransactionButton) {

    addTransactionButton.addEventListener("click", function () {

        alert("Transaction feature coming next.");

    });

}


if (addProductButton) {

    addProductButton.addEventListener("click", function () {

        alert("Inventory feature coming next.");

    });

}


if (setGoalButton) {

    setGoalButton.addEventListener("click", function () {

        alert("Goals feature coming next.");

    });

}


if (askBusinessButton) {

    askBusinessButton.addEventListener("click", function () {

        alert("Business insights feature coming next.");

    });

}


/* ========================================
   DASHBOARD SECTION NAVIGATION
========================================= */

const navigationLinks = document.querySelectorAll(
    ".dashboard-nav-link[data-section]"
);

const dashboardSections = document.querySelectorAll(
    ".dashboard-content > section"
);

const pageTitle = document.querySelector(".dashboard-page-title");


function showDashboardSection(sectionName) {

    dashboardSections.forEach(function (section) {

        if (section.id === sectionName) {

            section.style.setProperty(
                "display",
                "block",
                "important"
            );

        } else {

            section.style.setProperty(
                "display",
                "none",
                "important"
            );

        }

    });


    navigationLinks.forEach(function (link) {

        if (link.dataset.section === sectionName) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });


    if (sectionName === "overview") {
        pageTitle.textContent = "Overview";
    }

    if (sectionName === "transactions") {
        pageTitle.textContent = "Transactions";
    }

    if (sectionName === "inventory") {
        pageTitle.textContent = "Inventory";
    }

    if (sectionName === "goals") {
        pageTitle.textContent = "Goals";
    }

    if (sectionName === "settings") {
        pageTitle.textContent = "Settings";
    }

    if (sectionName === "insights") {
        pageTitle.textContent = "Insights";
    }

}


navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const sectionName = link.dataset.section;

        showDashboardSection(sectionName);

        window.location.hash = sectionName;

        if (window.innerWidth <= 800 && sidebar) {
            sidebar.classList.remove("open");
        }

    });

});


/* ========================================
   LOAD SECTION FROM URL
========================================= */

const currentSection = window.location.hash.replace("#", "");

if (
    currentSection === "overview" ||
    currentSection === "transactions" ||
    currentSection === "inventory" ||
    currentSection === "goals" ||
    currentSection === "settings" ||
    currentSection === "insights"
) {
    showDashboardSection(currentSection);
} else {
    showDashboardSection("overview");
}


/* ========================================
   OVERVIEW PERIOD FILTER
========================================= */

const overviewPeriod =
    document.getElementById("overviewPeriod");

const revenueValue =
    document.getElementById("revenueValue");

const expenseValue =
    document.getElementById("expenseValue");

const profitValue =
    document.getElementById("profitValue");

const revenueChange =
    document.getElementById("revenueChange");

const expenseChange =
    document.getElementById("expenseChange");

const profitChange =
    document.getElementById("profitChange");


/* ========================================
   FORMAT OVERVIEW CURRENCY
========================================= */

function formatOverviewCurrency(amount) {

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
   GET PERIOD DATE RANGE
========================================= */

function getOverviewPeriodRange(period) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    /* TODAY */

    if (period === "today") {

        const startDate =
            new Date(today);

        const endDate =
            new Date(today);

        return {
            startDate: startDate,
            endDate: endDate
        };

    }


    /* THIS WEEK */

    if (period === "week") {

        const startDate =
            new Date(today);

        const day =
            startDate.getDay();

        const daysSinceMonday =
            day === 0 ? 6 : day - 1;

        startDate.setDate(
            startDate.getDate() -
            daysSinceMonday
        );


        const endDate =
            new Date(startDate);

        endDate.setDate(
            endDate.getDate() + 6
        );


        return {
            startDate: startDate,
            endDate: endDate
        };

    }


    /* THIS MONTH */

    if (period === "month") {

        const startDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        const endDate =
            new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );


        return {
            startDate: startDate,
            endDate: endDate
        };

    }


    /* ALL TIME */

    return {
        startDate: null,
        endDate: null
    };

}


/* ========================================
   UPDATE OVERVIEW
========================================= */

function updateOverview() {

    if (!currentUser) {
        return;
    }


    const selectedPeriod =
        overviewPeriod
            ? overviewPeriod.value
            : "month";


    const transactions =
        getTransactions(currentUser.id);


    const range =
        getOverviewPeriodRange(
            selectedPeriod
        );


    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                if (
                    !range.startDate ||
                    !range.endDate
                ) {
                    return true;
                }


                const transactionDate =
                    new Date(
                        transaction.date +
                        "T00:00:00"
                    );


                return (
                    transactionDate >= range.startDate &&
                    transactionDate <= range.endDate
                );

            }
        );


    let revenue = 0;
    let expenses = 0;


    filteredTransactions.forEach(
        function (transaction) {

            if (transaction.type === "income") {

                revenue +=
                    Number(transaction.amount) || 0;

            }


            if (transaction.type === "expense") {

                expenses +=
                    Number(transaction.amount) || 0;

            }

        }
    );


    const profit =
        revenue - expenses;


    /* ========================================
       UPDATE VALUES
    ========================================= */

    if (revenueValue) {

        revenueValue.textContent =
            formatOverviewCurrency(revenue);

    }


    if (expenseValue) {

        expenseValue.textContent =
            formatOverviewCurrency(expenses);

    }


    if (profitValue) {

        profitValue.textContent =
            formatOverviewCurrency(profit);

    }


    /* ========================================
       EMPTY STATE LABELS
    ========================================= */

    const hasTransactions =
        filteredTransactions.length > 0;


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
   PERIOD CHANGE
========================================= */

if (overviewPeriod) {

    overviewPeriod.addEventListener(
        "change",
        function () {

            updateOverview();

        }
    );

}


/* ========================================
   INITIAL OVERVIEW LOAD
========================================= */

updateOverview();


/* ========================================
   FINANCIAL ACTIVITY CHART
========================================= */

const financialChart =
    document.getElementById("financialActivityChart");

const financialChartEmpty =
    document.getElementById("financialChartEmpty");


/* ========================================
   GET CHART DATA
========================================= */

function getFinancialChartData() {

    if (!currentUser) {
        return null;
    }


    const selectedPeriod =
        overviewPeriod
            ? overviewPeriod.value
            : "month";


    const transactions =
        getTransactions(currentUser.id);


    const range =
        getOverviewPeriodRange(selectedPeriod);


    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                if (
                    !range.startDate ||
                    !range.endDate
                ) {
                    return true;
                }


                const transactionDate =
                    new Date(
                        transaction.date +
                        "T00:00:00"
                    );


                return (
                    transactionDate >= range.startDate &&
                    transactionDate <= range.endDate
                );

            }
        );


    return {
        transactions: filteredTransactions,
        period: selectedPeriod
    };

}


/* ========================================
   CREATE CHART PERIODS
========================================= */

function getChartPeriods(period, transactions) {

    const periods = [];


    if (period === "today") {

        periods.push({
            label: "Today",
            date: new Date()
        });

        return periods;

    }


    if (period === "week") {

        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const day = today.getDay();

        const daysSinceMonday =
            day === 0 ? 6 : day - 1;


        const monday =
            new Date(today);

        monday.setDate(
            monday.getDate() -
            daysSinceMonday
        );


        for (let i = 0; i < 7; i++) {

            const date =
                new Date(monday);

            date.setDate(
                monday.getDate() + i
            );


            periods.push({
                label: date.toLocaleDateString(
                    "en-NG",
                    {
                        weekday: "short"
                    }
                ),
                date: date
            });

        }


        return periods;

    }


    if (period === "month") {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            today.getMonth();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            periods.push({

                label:
                    String(day),

                date:
                    new Date(
                        year,
                        month,
                        day
                    )

            });

        }


        return periods;

    }


    /* ========================================
       ALL TIME
    ========================================= */

    const uniqueDates = [
        ...new Set(
            transactions.map(
                function (transaction) {
                    return transaction.date;
                }
            )
        )
    ].sort();


    uniqueDates.forEach(
        function (dateString) {

            periods.push({

                label:
                    new Date(
                        dateString +
                        "T00:00:00"
                    ).toLocaleDateString(
                        "en-NG",
                        {
                            day: "numeric",
                            month: "short"
                        }
                    ),

                date:
                    new Date(
                        dateString +
                        "T00:00:00"
                    )

            });

        }
    );


    return periods;

}


/* ========================================
   DRAW FINANCIAL CHART
========================================= */

function drawFinancialChart() {

    if (!financialChart) {
        return;
    }


    const chartData =
        getFinancialChartData();


    if (!chartData) {
        return;
    }


    const transactions =
        chartData.transactions;


    const period =
        chartData.period;


    const periods =
        getChartPeriods(
            period,
            transactions
        );


    const hasFinancialData =
        transactions.length > 0;


    /* ========================================
       EMPTY STATE
    ========================================= */

    if (!hasFinancialData) {

        financialChart.style.display =
            "none";

        if (financialChartEmpty) {

            financialChartEmpty.hidden =
                false;

        }

        return;

    }


    financialChart.style.display =
        "block";


    if (financialChartEmpty) {

        financialChartEmpty.hidden =
            true;

    }


    /* ========================================
       CANVAS SETUP
    ========================================= */

    const rect =
        financialChart.getBoundingClientRect();


    const devicePixelRatio =
        window.devicePixelRatio || 1;


    financialChart.width =
        rect.width * devicePixelRatio;

    financialChart.height =
        rect.height * devicePixelRatio;


    const ctx =
        financialChart.getContext("2d");


    ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    const width =
        rect.width;

    const height =
        rect.height;


    /* ========================================
       CHART DIMENSIONS
    ========================================= */

    const padding = {

        top: 20,

        right: 20,

        bottom: 45,

        left: 60

    };


    const chartWidth =
        width -
        padding.left -
        padding.right;


    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    /* ========================================
       PREPARE VALUES
    ========================================= */

    const revenueValues = [];

    const expenseValues = [];


    periods.forEach(
        function (periodItem) {

            let revenue = 0;

            let expenses = 0;


            transactions.forEach(
                function (transaction) {

                    const transactionDate =
                        new Date(
                            transaction.date +
                            "T00:00:00"
                        );


                    if (
                        transactionDate.getFullYear() ===
                            periodItem.date.getFullYear() &&

                        transactionDate.getMonth() ===
                            periodItem.date.getMonth() &&

                        transactionDate.getDate() ===
                            periodItem.date.getDate()
                    ) {

                        if (
                            transaction.type ===
                            "income"
                        ) {

                            revenue +=
                                Number(
                                    transaction.amount
                                ) || 0;

                        }


                        if (
                            transaction.type ===
                            "expense"
                        ) {

                            expenses +=
                                Number(
                                    transaction.amount
                                ) || 0;

                        }

                    }

                }
            );


            revenueValues.push(revenue);

            expenseValues.push(expenses);

        }
    );


    const allValues = [
        ...revenueValues,
        ...expenseValues
    ];


    const maxValue =
        Math.max(...allValues, 0);


    const chartMax =
        maxValue === 0
            ? 100
            : maxValue * 1.15;


    /* ========================================
       CLEAR CANVAS
    ========================================= */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* ========================================
       DRAW GRID
    ========================================= */

    const gridLines = 4;


    ctx.font =
        "12px Arial";


    ctx.textAlign =
        "right";


    ctx.textBaseline =
        "middle";


    for (
        let i = 0;
        i <= gridLines;
        i++
    ) {

        const y =
            padding.top +
            chartHeight -
            (
                i / gridLines
            ) *
            chartHeight;


        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width -
            padding.right,
            y
        );

        ctx.strokeStyle =
            "#e5e7eb";

        ctx.lineWidth =
            1;

        ctx.stroke();


        const value =
            (
                chartMax *
                i /
                gridLines
            );


        ctx.fillStyle =
            "#6b7280";


        ctx.fillText(
            formatChartValue(value),
            padding.left - 10,
            y
        );

    }


    /* ========================================
       DRAW X AXIS LABELS
    ========================================= */

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "top";

    ctx.fillStyle =
        "#6b7280";


    const step =
        periods.length > 1
            ? chartWidth /
              (periods.length - 1)
            : chartWidth;


    periods.forEach(
        function (periodItem, index) {

            const x =
                periods.length === 1
                    ? padding.left +
                      chartWidth / 2
                    : padding.left +
                      index * step;


            let shouldShowLabel =
                true;


            if (period === "month") {

                shouldShowLabel =
                    index === 0 ||
                    index === 6 ||
                    index === 13 ||
                    index === 20 ||
                    index === periods.length - 1;

            }


            if (period === "all") {

                const maximumLabels = 6;

                const interval =
                    Math.max(
                        1,
                        Math.ceil(
                            periods.length /
                            maximumLabels
                        )
                    );

                shouldShowLabel =
                    index % interval === 0 ||
                    index === periods.length - 1;

            }


            if (shouldShowLabel) {

                ctx.fillText(
                    periodItem.label,
                    x,
                    height -
                    padding.bottom +
                    12
                );

            }

        }
    );


    /* ========================================
       CREATE POINTS
    ========================================= */

    function createPoints(values) {

        return values.map(
            function (value, index) {

                const x =
                    periods.length === 1
                        ? padding.left +
                          chartWidth / 2
                        : padding.left +
                          index * step;


                const y =
                    padding.top +
                    chartHeight -
                    (
                        value /
                        chartMax
                    ) *
                    chartHeight;


                return {
                    x: x,
                    y: y
                };

            }
        );

    }


    const revenuePoints =
        createPoints(
            revenueValues
        );


    const expensePoints =
        createPoints(
            expenseValues
        );


    /* ========================================
       DRAW LINE
    ========================================= */

    function drawLine(
        points,
        lineWidth
    ) {

        if (!points.length) {
            return;
        }


        ctx.beginPath();


        points.forEach(
            function (point, index) {

                if (index === 0) {

                    ctx.moveTo(
                        point.x,
                        point.y
                    );

                } else {

                    ctx.lineTo(
                        point.x,
                        point.y
                    );

                }

            }
        );


        ctx.strokeStyle =
            lineWidth;

        ctx.lineWidth =
            2.5;

        ctx.lineJoin =
            "round";

        ctx.lineCap =
            "round";

        ctx.stroke();

    }


    /* ========================================
       REVENUE LINE
    ========================================= */

    drawLine(
        revenuePoints,
        "#166534"
    );


    /* ========================================
       EXPENSE LINE
    ========================================= */

    drawLine(
        expensePoints,
        "#dc2626"
    );


    /* ========================================
       DRAW POINTS
    ========================================= */

    function drawPoints(
        points,
        lineColor
    ) {

        points.forEach(
            function (point) {

                ctx.beginPath();

                ctx.arc(
                    point.x,
                    point.y,
                    3.5,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "#ffffff";

                ctx.fill();


                ctx.beginPath();

                ctx.arc(
                    point.x,
                    point.y,
                    3.5,
                    0,
                    Math.PI * 2
                );

                ctx.strokeStyle =
                    lineColor;

                ctx.lineWidth =
                    2;

                ctx.stroke();

            }
        );

    }


    drawPoints(
        revenuePoints,
        "#166534"
    );


    drawPoints(
        expensePoints,
        "#dc2626"
    );


    /* ========================================
       LEGEND
    ========================================= */

    const legendY =
        12;


    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "middle";


    ctx.fillStyle =
        "#166534";


    ctx.fillRect(
        padding.left,
        legendY,
        10,
        10
    );


    ctx.fillStyle =
        "#374151";


    ctx.fillText(
        "Revenue",
        padding.left + 18,
        legendY + 5
    );


    const revenueLegendWidth =
        ctx.measureText(
            "Revenue"
        ).width;


    ctx.fillStyle =
        "#dc2626";


    ctx.fillRect(
        padding.left +
        18 +
        revenueLegendWidth +
        25,
        legendY,
        10,
        10
    );


    ctx.fillStyle =
        "#374151";


    ctx.fillText(
        "Expenses",
        padding.left +
        18 +
        revenueLegendWidth +
        43,
        legendY + 5
    );

}


/* ========================================
   FORMAT CHART VALUES
========================================= */

function formatChartValue(value) {

    if (value >= 1000000) {

        return (
            "₦" +
            (
                value / 1000000
            ).toFixed(1) +
            "M"
        );

    }


    if (value >= 1000) {

        return (
            "₦" +
            (
                value / 1000
            ).toFixed(0) +
            "K"
        );

    }


    return (
        "₦" +
        Math.round(value)
    );

}


/* ========================================
   UPDATE CHART WHEN PERIOD CHANGES
========================================= */

if (overviewPeriod) {

    overviewPeriod.addEventListener(
        "change",
        function () {

            drawFinancialChart();

        }
    );

}


/* ========================================
   INITIAL CHART LOAD
========================================= */

drawFinancialChart();


/* ========================================
   REDRAW ON WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    function () {

        drawFinancialChart();

    }
);


/* ========================================
   RECENT TRANSACTIONS
========================================= */

const recentTransactionsList =
    document.getElementById(
        "recentTransactionsList"
    );

const recentTransactionsEmpty =
    document.getElementById(
        "recentTransactionsEmpty"
    );

const viewAllTransactionsButton =
    document.getElementById(
        "viewAllTransactionsButton"
    );


/* ========================================
   FORMAT RECENT TRANSACTION AMOUNT
========================================= */

function formatRecentTransactionAmount(amount) {

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
   FORMAT RECENT TRANSACTION DATE
========================================= */

function formatRecentTransactionDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ========================================
   RENDER RECENT TRANSACTIONS
========================================= */

function renderRecentTransactions() {

    if (
        !recentTransactionsList ||
        !currentUser
    ) {
        return;
    }


    const transactions =
        getTransactions(
            currentUser.id
        );


    /* ========================================
       SORT NEWEST FIRST
    ========================================= */

    const recentTransactions =
        [...transactions]
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.date +
                            "T00:00:00"
                        ) -
                        new Date(
                            a.date +
                            "T00:00:00"
                        )
                    );

                }
            )
            .slice(0, 5);


    /* ========================================
       EMPTY STATE
    ========================================= */

    if (recentTransactions.length === 0) {

        recentTransactionsList.innerHTML =
            "";


        if (recentTransactionsEmpty) {

            recentTransactionsEmpty.hidden =
                false;

        }

        return;

    }


    if (recentTransactionsEmpty) {

        recentTransactionsEmpty.hidden =
            true;

    }


    /* ========================================
       CREATE TRANSACTION ITEMS
    ========================================= */

    recentTransactionsList.innerHTML =
        recentTransactions
            .map(
                function (transaction) {

                    const amount =
                        Number(
                            transaction.amount
                        ) || 0;


                    const isIncome =
                        transaction.type ===
                        "income";


                    const amountPrefix =
                        isIncome
                            ? "+"
                            : "-";


                    const amountClass =
                        isIncome
                            ? "income"
                            : "expense";


                   return `
                    <div class="dashboard-recent-item">

                        <div class="dashboard-recent-icon ${amountClass}">
                            ${isIncome ? "↑" : "↓"}
                        </div>


                        <div class="dashboard-recent-main">

                            <p class="dashboard-recent-description">
                                ${transaction.description}
                            </p>

                            <div class="dashboard-recent-category">
                                ${transaction.category}
                            </div>

                        </div>


                        <div class="dashboard-recent-date">
                            ${formatRecentTransactionDate(
                                transaction.date
                            )}
                        </div>


                        <div class="dashboard-recent-amount ${amountClass}">
                            ${amountPrefix}${formatRecentTransactionAmount(
                                amount
                            )}
                        </div>

                    </div>
                `;

                }
            )
            .join("");

}


/* ========================================
   VIEW ALL TRANSACTIONS
========================================= */

if (viewAllTransactionsButton) {

    viewAllTransactionsButton.addEventListener(
        "click",
        function () {

            showDashboardSection(
                "transactions"
            );

            window.location.hash =
                "transactions";

        }
    );

}


/* ========================================
   INITIAL LOAD
========================================= */

renderRecentTransactions();

/* ========================================
   REFRESH OVERVIEW DATA
========================================= */

function refreshOverviewData() {

    updateOverview();

    drawFinancialChart();

    renderRecentTransactions();

}


// ========================================
// SETTINGS
// ========================================

const businessNameInput =
    document.getElementById("businessName");

const businessTypeInput =
    document.getElementById("businessType");

const settingsNameInput =
    document.getElementById("settingsName");

const settingsEmailInput =
    document.getElementById("settingsEmail");

const settingsCurrencyInput =
    document.getElementById("settingsCurrency");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");


function loadSettings() {

    if (!currentUser) {
        return;
    }

    const settings =
        getSettings(currentUser.id);

    businessNameInput.value =
        settings.businessName || "";

    businessTypeInput.value =
        settings.businessType || "";

    settingsCurrencyInput.value =
        settings.currency || "NGN";


    settingsNameInput.value =
        currentUser.name || "";

    settingsEmailInput.value =
        currentUser.email || "";
}


if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        function () {

            if (!currentUser) {
                return;
            }

            const settings = {

                businessName:
                    businessNameInput.value.trim(),

                businessType:
                    businessTypeInput.value,

                currency:
                    settingsCurrencyInput.value

            };

            saveSettings(
                currentUser.id,
                settings
            );

            alert("Settings saved successfully.");
        }
    );
}


loadSettings();

// ========================================
// NOTIFICATIONS
// ========================================

const notificationButton =
    document.getElementById(
        "notificationButton"
    );

const notificationPanel =
    document.getElementById(
        "notificationPanel"
    );

const notificationBadge =
    document.getElementById(
        "notificationBadge"
    );

const notificationList =
    document.getElementById(
        "notificationList"
    );


// ========================================
// NOTIFICATION SOUND
// ========================================

function playNotificationSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const audioContext =
            new AudioContext();

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            880,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            660,
            audioContext.currentTime + 0.12
        );

        gainNode.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.08,
            audioContext.currentTime + 0.01
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.18
        );

        oscillator.connect(gainNode);

        gainNode.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.18
        );

    } catch (error) {

        console.log(
            "Notification sound could not play:",
            error
        );

    }

}


// ========================================
// NOTIFICATION TOAST
// ========================================

function showInventoryNotificationToast(notification) {

    const existingToast =
        document.getElementById(
            "inventoryNotificationToast"
        );

    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.id =
        "inventoryNotificationToast";

    toast.className =
        `inventory-notification-toast ${notification.type}`;


    toast.innerHTML = `

        <div class="inventory-notification-toast-icon">
            !
        </div>

        <div class="inventory-notification-toast-content">

            <strong>
                ${notification.title}
            </strong>

            <span>
                ${notification.message}
            </span>

        </div>

    `;


    document.body.appendChild(toast);


    requestAnimationFrame(function () {

        toast.classList.add("visible");

    });


    setTimeout(function () {

        toast.classList.remove("visible");

        setTimeout(function () {

            toast.remove();

        }, 250);

    }, 4500);

}


// ========================================
// CHECK FOR NEW INVENTORY ALERTS
// ========================================

function checkForNewInventoryNotifications(
    previousInventory
) {

    if (!currentUser) {
        return;
    }


    const currentInventory =
        getInventory(currentUser.id);


    previousInventory =
        previousInventory || [];


    currentInventory.forEach(
        function (currentProduct) {

            const previousProduct =
                previousInventory.find(
                    function (product) {

                        return product.id === currentProduct.id;

                    }
                );


            const currentStock =
                Number(currentProduct.stock) || 0;


            const previousStock =
                previousProduct
                    ? Number(previousProduct.stock) || 0
                    : null;


            /*
             * We only care about a product
             * entering an alert state.
             */

            const becameOutOfStock =
                currentStock === 0 &&
                previousStock !== 0;


            const becameLowStock =
                currentStock > 0 &&
                currentStock <= 5 &&
                (
                    previousStock === null ||
                    previousStock > 5
                );


            if (
                becameOutOfStock ||
                becameLowStock
            ) {

                const notification = {

                    type:
                        becameOutOfStock
                            ? "out-of-stock"
                            : "low-stock",

                    title:
                        becameOutOfStock
                            ? "Out of Stock"
                            : "Low Stock",

                    message:
                        becameOutOfStock
                            ? `${currentProduct.name} is now out of stock.`
                            : `${currentProduct.name} has only ${currentStock} unit${currentStock === 1 ? "" : "s"} remaining.`

                };


                showInventoryNotificationToast(
                    notification
                );

                playNotificationSound();

            }

        }
    );

}

// ========================================
// GENERATE INVENTORY NOTIFICATIONS
// ========================================

function generateInventoryNotifications() {

    if (!currentUser) {
        return [];
    }

    const inventory =
        getInventory(currentUser.id);

    const notifications = [];

    inventory.forEach(
        function (product) {

            const stock =
                Number(product.stock) || 0;


            // OUT OF STOCK

            if (stock === 0) {

                notifications.push({

                    type: "out-of-stock",

                    title:
                        "Out of Stock",

                    message:
                        `${product.name} is currently out of stock.`

                });

                return;
            }


            // LOW STOCK

            if (
                stock > 0 &&
                stock <= 5
            ) {

                notifications.push({

                    type: "low-stock",

                    title:
                        "Low Stock",

                    message:
                        `${product.name} has only ${stock} unit${stock === 1 ? "" : "s"} remaining.`

                });

            }

        }
    );

    return notifications;

}


// ========================================
// RENDER NOTIFICATIONS
// ========================================

function renderNotifications() {

    if (
        !notificationBadge ||
        !notificationList
    ) {
        return;
    }

    const notifications =
        generateInventoryNotifications();


    // UPDATE BADGE

    if (notifications.length === 0) {

        notificationBadge.hidden = true;

    } else {

        notificationBadge.hidden = false;

        notificationBadge.textContent =
            notifications.length;

    }


    // EMPTY STATE

    if (notifications.length === 0) {

        notificationList.innerHTML = `

            <div class="dashboard-notification-empty">

                <span>
                    ✓
                </span>

                <p>
                    You're all caught up.
                </p>

            </div>

        `;

        return;
    }


    // RENDER NOTIFICATIONS

    notificationList.innerHTML =
        notifications
            .map(
                function (notification) {

                    return `

                        <div class="dashboard-notification-item">

                            <div
                                class="dashboard-notification-item-icon ${notification.type}"
                            >
                                !
                            </div>

                            <div class="dashboard-notification-item-content">

                                <h4>
                                    ${notification.title}
                                </h4>

                                <p>
                                    ${notification.message}
                                </p>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ========================================
// OPEN / CLOSE NOTIFICATION PANEL
// ========================================

if (
    notificationButton &&
    notificationPanel
) {

    notificationButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const isOpen =
                !notificationPanel.hidden;

            notificationPanel.hidden =
                isOpen;

            notificationButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !notificationPanel.contains(event.target) &&
                !notificationButton.contains(event.target)
            ) {

                notificationPanel.hidden =
                    true;

                notificationButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// ========================================
// INITIALIZE NOTIFICATIONS
// ========================================

renderNotifications();