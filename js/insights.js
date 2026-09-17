// ========================================
// BUSINESS INSIGHTS
// ========================================


// ========================================
// ELEMENTS
// ========================================

const insightsRevenue =
    document.getElementById(
        "insightsRevenue"
    );

const insightsExpenses =
    document.getElementById(
        "insightsExpenses"
    );

const insightsProfit =
    document.getElementById(
        "insightsProfit"
    );

const insightsList =
    document.getElementById(
        "insightsList"
    );

const insightsEmpty =
    document.getElementById(
        "insightsEmpty"
    );

const recommendationsList =
    document.getElementById(
        "recommendationsList"
    );

const recommendationsEmpty =
    document.getElementById(
        "recommendationsEmpty"
    );


// ========================================
// CURRENCY FORMATTER
// ========================================

function formatInsightCurrency(amount) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


// ========================================
// FINANCIAL DATA
// ========================================

function getFinancialInsightData() {

    if (!currentUser) {
        return null;
    }

    const transactions =
        getTransactions(
            currentUser.id
        );

    let revenue = 0;
    let expenses = 0;

    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                ) || 0;

            if (
                transaction.type ===
                "income"
            ) {

                revenue += amount;

            }

            if (
                transaction.type ===
                "expense"
            ) {

                expenses += amount;

            }

        }
    );

    const profit =
        revenue - expenses;

    return {
        revenue: revenue,
        expenses: expenses,
        profit: profit,
        transactionCount:
            transactions.length
    };

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateInsightsSummary() {

    const data =
        getFinancialInsightData();

    if (!data) {
        return;
    }

    if (insightsRevenue) {

        insightsRevenue.textContent =
            formatInsightCurrency(
                data.revenue
            );

    }

    if (insightsExpenses) {

        insightsExpenses.textContent =
            formatInsightCurrency(
                data.expenses
            );

    }

    if (insightsProfit) {

        insightsProfit.textContent =
            formatInsightCurrency(
                data.profit
            );

    }

}


// ========================================
// GENERATE FINANCIAL INSIGHTS
// ========================================

function generateFinancialInsights() {

    const data =
        getFinancialInsightData();

    if (!data) {
        return [];
    }

    const insights = [];


    // ------------------------------------
    // NO TRANSACTIONS
    // ------------------------------------

    if (
        data.transactionCount === 0
    ) {

        return insights;

    }


    // ------------------------------------
    // PROFITABILITY
    // ------------------------------------

    if (data.profit > 0) {

        insights.push({
            icon: "↑",
            title: "Your business is currently profitable",
            description:
                `You generated ${formatInsightCurrency(data.revenue)} in revenue and recorded ${formatInsightCurrency(data.expenses)} in expenses, leaving ${formatInsightCurrency(data.profit)} in net profit.`
        });

    }


    if (data.profit === 0) {

        insights.push({
            icon: "=",
            title: "Your business is currently breaking even",
            description:
                "Your recorded revenue and expenses are currently equal. Keep tracking your activity to understand how your business performs over time."
        });

    }


    if (data.profit < 0) {

        insights.push({
            icon: "!",
            title: "Your expenses are currently higher than your revenue",
            description:
                `You recorded ${formatInsightCurrency(data.revenue)} in revenue and ${formatInsightCurrency(data.expenses)} in expenses, resulting in a ${formatInsightCurrency(Math.abs(data.profit))} loss.`
        });

    }


    // ------------------------------------
    // EXPENSE RATIO
    // ------------------------------------

    if (data.revenue > 0) {

        const expenseRatio =
            (data.expenses /
                data.revenue) *
            100;


        if (
            expenseRatio > 70 &&
            expenseRatio <= 100
        ) {

            insights.push({
                icon: "!",
                title: "Expenses are taking a large share of revenue",
                description:
                    `Your recorded expenses represent approximately ${expenseRatio.toFixed(0)}% of your revenue. Review your major expense categories to identify areas that could be reduced.`
            });

        }


        if (
            expenseRatio > 100
        ) {

            insights.push({
                icon: "!",
                title: "Expenses are exceeding revenue",
                description:
                    `Your expenses are approximately ${expenseRatio.toFixed(0)}% of your recorded revenue. Reviewing your spending and pricing may help improve profitability.`
            });

        }


        if (
            expenseRatio <= 70 &&
            data.profit > 0
        ) {

            insights.push({
                icon: "✓",
                title: "Your recorded expenses are below 70% of revenue",
                description:
                    `Expenses currently represent approximately ${expenseRatio.toFixed(0)}% of your revenue, leaving room between revenue and recorded expenses.`
            });

        }

    }


    return insights;

}

// ========================================
// CATEGORY ANALYSIS
// ========================================

function generateCategoryInsights() {

    if (!currentUser) {
        return [];
    }

    const transactions =
        getTransactions(
            currentUser.id
        );

    if (transactions.length === 0) {
        return [];
    }

    const incomeCategories = {};
    const expenseCategories = {};


    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                ) || 0;

            const category =
                transaction.category ||
                "Uncategorized";


            if (
                transaction.type ===
                "income"
            ) {

                if (
                    !incomeCategories[
                        category
                    ]
                ) {
                    incomeCategories[
                        category
                    ] = 0;
                }

                incomeCategories[
                    category
                ] += amount;
            }


            if (
                transaction.type ===
                "expense"
            ) {

                if (
                    !expenseCategories[
                        category
                    ]
                ) {
                    expenseCategories[
                        category
                    ] = 0;
                }

                expenseCategories[
                    category
                ] += amount;
            }

        }
    );


    const insights = [];


    // ====================================
    // TOP REVENUE CATEGORY
    // ====================================

    const incomeEntries =
        Object.entries(
            incomeCategories
        );


    if (incomeEntries.length > 0) {

        incomeEntries.sort(
            function (a, b) {
                return b[1] - a[1];
            }
        );


        const topRevenueCategory =
            incomeEntries[0];


        insights.push({

            icon: "↗",

            title:
                `${topRevenueCategory[0]} is your largest revenue category`,

            description:
                `${topRevenueCategory[0]} has generated ${formatInsightCurrency(topRevenueCategory[1])} in recorded revenue, making it your largest income category.`

        });

    }


    // ====================================
    // TOP EXPENSE CATEGORY
    // ====================================

    const expenseEntries =
        Object.entries(
            expenseCategories
        );


    if (expenseEntries.length > 0) {

        expenseEntries.sort(
            function (a, b) {
                return b[1] - a[1];
            }
        );


        const topExpenseCategory =
            expenseEntries[0];


        insights.push({

            icon: "↓",

            title:
                `${topExpenseCategory[0]} is your largest expense category`,

            description:
                `${topExpenseCategory[0]} accounts for ${formatInsightCurrency(topExpenseCategory[1])} of your recorded expenses. Review this category to understand what is driving the spending.`

        });

    }


    return insights;

}


// ========================================
// INVENTORY ANALYSIS
// ========================================

function generateInventoryInsights() {

    if (!currentUser) {
        return [];
    }

    const inventory =
        getInventory(
            currentUser.id
        );

    if (inventory.length === 0) {
        return [];
    }

    const insights = [];

    const outOfStockProducts =
        inventory.filter(
            function (product) {
                return (
                    Number(product.stock) <= 0
                );
            }
        );

  const lowStockProducts =
    inventory.filter(
        function (product) {

            const stock =
                Number(product.stock) || 0;

            return (
                stock > 0 &&
                stock <= 5
            );
        }
    );


    // ====================================
    // OUT OF STOCK
    // ====================================

    if (
        outOfStockProducts.length > 0
    ) {

        const productNames =
            outOfStockProducts
                .slice(0, 3)
                .map(
                    function (product) {
                        return product.name;
                    }
                )
                .join(", ");


        let description =
            `${outOfStockProducts.length} product`;

        if (
            outOfStockProducts.length !== 1
        ) {
            description += "s";
        }

        description +=
            ` ${outOfStockProducts.length === 1 ? "is" : "are"} currently out of stock.`;


        if (productNames) {

            description +=
                ` ${productNames}`;

            if (
                outOfStockProducts.length > 3
            ) {

                description +=
                    ` and ${outOfStockProducts.length - 3} more`;

            }

            description += ".";

        }


        insights.push({

            icon: "!",

            title:
                "Some products are out of stock",

            description:
                description

        });

    }


    // ====================================
    // LOW STOCK
    // ====================================

    if (
        lowStockProducts.length > 0
    ) {

        const productNames =
            lowStockProducts
                .slice(0, 3)
                .map(
                    function (product) {
                        return product.name;
                    }
                )
                .join(", ");


        let description =
            `${lowStockProducts.length} product`;

        if (
            lowStockProducts.length !== 1
        ) {
            description += "s";
        }

        description +=
            ` ${lowStockProducts.length === 1 ? "is" : "are"} running low on stock.`;


        if (productNames) {

            description +=
                ` ${productNames}`;

            if (
                lowStockProducts.length > 3
            ) {

                description +=
                    ` and ${lowStockProducts.length - 3} more`;

            }

            description += ".";

        }


        insights.push({

            icon: "↓",

            title:
                "Some products have low stock",

            description:
                description

        });

    }


    // ====================================
    // HEALTHY INVENTORY
    // ====================================

    if (
        outOfStockProducts.length === 0 &&
        lowStockProducts.length === 0
    ) {

        insights.push({

            icon: "✓",

            title:
                "Your current inventory has no stock alerts",

            description:
                `All ${inventory.length} recorded product${inventory.length === 1 ? "" : "s"} currently have stock levels above their low-stock limits.`

        });

    }


    return insights;

}


// ========================================
// RECOMMENDATIONS
// ========================================

function generateRecommendations() {

    if (!currentUser) {
        return [];
    }

    const transactions =
        getTransactions(currentUser.id);

    const inventory =
        getInventory(currentUser.id);

    const recommendations = [];

    if (
        transactions.length === 0 &&
        inventory.length === 0
    ) {
        return recommendations;
    }

    let revenue = 0;
    let expenses = 0;

    const expenseCategories = {};
    const incomeCategories = {};

    transactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount) || 0;

            const category =
                transaction.category ||
                "Uncategorized";

            if (
                transaction.type === "income"
            ) {

                revenue += amount;

                if (
                    !incomeCategories[category]
                ) {
                    incomeCategories[category] = 0;
                }

                incomeCategories[category] +=
                    amount;

            }

            if (
                transaction.type === "expense"
            ) {

                expenses += amount;

                if (
                    !expenseCategories[category]
                ) {
                    expenseCategories[category] = 0;
                }

                expenseCategories[category] +=
                    amount;

            }
        }
    );

    const profit =
        revenue - expenses;

    const outOfStockProducts =
        inventory.filter(
            function (product) {

                return (
                    Number(product.stock) <= 0
                );

            }
        );

    const lowStockProducts =
        inventory.filter(
            function (product) {

                const stock =
                    Number(product.stock) || 0;

                return (
                    stock > 0 &&
                    stock <= 5
                );

            }
        );

    /*
     * HIGH PRIORITY
     */

    if (
        outOfStockProducts.length > 0
    ) {

        const productNames =
            outOfStockProducts
                .slice(0, 2)
                .map(
                    function (product) {
                        return product.name;
                    }
                )
                .join(", ");

        let description =
            `Review your inventory and consider restocking ${productNames}`;

        if (
            outOfStockProducts.length > 2
        ) {

            description +=
                ` and ${outOfStockProducts.length - 2} other product${outOfStockProducts.length - 2 === 1 ? "" : "s"}`;

        }

        description +=
            " that are currently out of stock.";

        recommendations.push({

            priority: "high",

            icon: "!",

            title:
                "Consider restocking unavailable products",

            description:
                description
        });
    }

    if (
        transactions.length > 0 &&
        profit < 0
    ) {

        recommendations.push({

            priority: "high",

            icon: "!",

            title:
                "Review your current spending",

            description:
                `Your recorded expenses are ${formatInsightCurrency(Math.abs(profit))} higher than your revenue. Review your largest expense categories and look for costs that can be reduced.`
        });
    }

    /*
     * MEDIUM PRIORITY
     */

    if (
        lowStockProducts.length > 0
    ) {

        const productNames =
            lowStockProducts
                .slice(0, 2)
                .map(
                    function (product) {
                        return product.name;
                    }
                )
                .join(", ");

        recommendations.push({

            priority: "medium",

            icon: "↓",

            title:
                "Review products with low stock",

            description:
                `${productNames}${lowStockProducts.length > 2 ? " and other products" : ""} ${lowStockProducts.length === 1 ? "has" : "have"} limited stock remaining. Consider reviewing their stock levels before they run out.`
        });
    }

    if (
        revenue > 0
    ) {

        const expenseRatio =
            (expenses / revenue) * 100;

        if (
            expenseRatio > 70 &&
            expenseRatio <= 100
        ) {

            recommendations.push({

                priority: "medium",

                icon: "!",

                title:
                    "Keep a closer eye on expenses",

                description:
                    `Your expenses currently represent approximately ${expenseRatio.toFixed(0)}% of your revenue. Reviewing recurring expenses could help create more room for profit.`
            });
        }
    }

    /*
     * LOW PRIORITY
     */

    const expenseEntries =
        Object.entries(
            expenseCategories
        );

    if (
        expenseEntries.length > 0
    ) {

        expenseEntries.sort(
            function (a, b) {
                return b[1] - a[1];
            }
        );

        const topExpense =
            expenseEntries[0];

        if (
            topExpense[1] > 0
        ) {

            recommendations.push({

                priority: "low",

                icon: "↘",

                title:
                    `Review your ${topExpense[0]} expenses`,

                description:
                    `${topExpense[0]} is currently your largest recorded expense category at ${formatInsightCurrency(topExpense[1])}. Review the transactions in this category to understand where the spending is going.`
            });
        }
    }

    const incomeEntries =
        Object.entries(
            incomeCategories
        );

    if (
        incomeEntries.length > 0
    ) {

        incomeEntries.sort(
            function (a, b) {
                return b[1] - a[1];
            }
        );

        const topRevenue =
            incomeEntries[0];

        recommendations.push({

            priority: "low",

            icon: "↗",

            title:
                `Pay attention to ${topRevenue[0]}`,

            description:
                `${topRevenue[0]} is currently your largest revenue category, generating ${formatInsightCurrency(topRevenue[1])}. Continue monitoring its performance as you grow your business.`
        });
    }

    /*
     * HEALTHY BUSINESS
     */

    if (
        transactions.length > 0 &&
        profit > 0 &&
        expenses <= revenue * 0.7 &&
        outOfStockProducts.length === 0 &&
        lowStockProducts.length === 0
    ) {

        recommendations.push({

            priority: "low",

            icon: "✓",

            title:
                "Continue monitoring your current performance",

            description:
                `Your recorded revenue currently exceeds expenses, while no inventory stock alerts are present. Keep tracking your transactions and inventory to maintain visibility as the business grows.`
        });
    }

    return recommendations;
}

// ========================================
// RENDER RECOMMENDATIONS
// ========================================
function renderRecommendations() {

    if (!recommendationsList) {
        return;
    }

    const recommendations =
        generateRecommendations();

    if (recommendations.length === 0) {

        if (recommendationsEmpty) {
            recommendationsEmpty.hidden = false;
        }

        return;
    }

    if (recommendationsEmpty) {
        recommendationsEmpty.hidden = true;
    }

    /*
     * Sort recommendations by priority.
     *
     * High → Medium → Low
     */

    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    };

    recommendations.sort(
        function (a, b) {

            return (
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
            );

        }
    );


    recommendationsList.innerHTML =
        recommendations
            .map(
                function (recommendation) {

                    let priorityLabel = "Low Priority";

                    if (
                        recommendation.priority === "high"
                    ) {

                        priorityLabel =
                            "High Priority";

                    } else if (
                        recommendation.priority === "medium"
                    ) {

                        priorityLabel =
                            "Medium Priority";

                    }


                    return `

                        <div
                            class="recommendation-item recommendation-${recommendation.priority}"
                        >

                            <div class="recommendation-item-icon">

                                ${recommendation.icon}

                            </div>


                            <div class="recommendation-item-content">

                                <div class="recommendation-item-heading">

                                    <h4 class="recommendation-item-title">

                                        ${recommendation.title}

                                    </h4>

                                    <span
                                        class="recommendation-priority recommendation-priority-${recommendation.priority}"
                                    >

                                        ${priorityLabel}

                                    </span>

                                </div>


                                <p class="recommendation-item-description">

                                    ${recommendation.description}

                                </p>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");
}

// ========================================
// RENDER INSIGHTS
// ========================================

function renderFinancialInsights() {

    if (!insightsList) {
        return;
    }

    const financialInsights =
        generateFinancialInsights();

    const categoryInsights =
        generateCategoryInsights();

    const inventoryInsights =
        generateInventoryInsights();

    const insights =
        financialInsights
            .concat(categoryInsights)
            .concat(inventoryInsights);


    if (
        insights.length === 0
    ) {

        if (insightsEmpty) {
            insightsEmpty.hidden =
                false;
        }

        return;

    }


    if (insightsEmpty) {
        insightsEmpty.hidden =
            true;
    }


    insightsList.innerHTML =
        insights
            .map(
                function (insight) {

                    return `
                        <div class="insight-item">

                            <div class="insight-item-icon">
                                ${insight.icon}
                            </div>

                            <div class="insight-item-content">

                                <h4 class="insight-item-title">
                                    ${insight.title}
                                </h4>

                                <p class="insight-item-description">
                                    ${insight.description}
                                </p>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


// ========================================
// INITIALIZE INSIGHTS
// ========================================

function refreshInsights() {

    updateInsightsSummary();

    renderFinancialInsights();

    renderRecommendations();

}


refreshInsights();


