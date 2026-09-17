# Business Copilot

Business Copilot is a web-based business management dashboard designed to help small-business owners record transactions, manage inventory, set goals, and understand their business activity through simple insights and recommendations.

The project was developed as a school/final project with a focus on practical business management, clean user experience, and JavaScript-driven functionality.

---

## Features

### Authentication

* User sign-up and login
* Session management using `localStorage`
* Protected dashboard access
* Logout functionality
* User-specific data storage

### Dashboard Overview

* Revenue summary
* Expense summary
* Net profit calculation
* Financial activity chart
* Recent transactions
* Period filtering:

  * Today
  * This Week
  * This Month
  * All Time

### Transactions

* Add income transactions
* Add expense transactions
* Transaction date
* Description
* Category
* Amount
* Product sales integration
* Automatic sales amount calculation
* Transaction history
* Delete confirmation modal
* Automatic dashboard updates

### Inventory Management

* Add products
* Edit products
* Delete products
* Track stock quantities
* Track product prices
* Product categories
* Stock status:

  * In Stock
  * Low Stock
  * Out of Stock
* Inventory summary statistics
* Automatic stock deduction when a product is sold
* Automatic stock restoration when a product-sale transaction is deleted

### Goals

* Create financial/business goals
* Set target amounts
* Track goal progress
* Edit goals
* Delete goals
* Automatic progress updates based on transactions
* Goal status handling:

  * Active
  * Completed
  * Expired
  * Upcoming
  * Over Limit

### Insights

Business Copilot analyzes recorded business data and provides rule-based insights covering:

* Financial performance
* Revenue
* Expenses
* Net profit
* Expense ratios
* Income categories
* Expense categories
* Inventory
* Low-stock products
* Out-of-stock products

### Recommendations

The recommendation engine converts business data into practical suggestions.

Recommendations are organized by priority:

* **High Priority** — issues requiring immediate attention
* **Medium Priority** — issues that should be reviewed
* **Low Priority** — useful business observations

The most important current recommendation is highlighted as **Priority Attention**.

### Notifications

* Low-stock notifications
* Out-of-stock notifications
* Notification badge
* Notification panel
* Toast notifications
* Notification sound
* Alerts only trigger when a product enters a new alert state

### Settings

* Business name
* Business type
* Account information
* Currency preference
* User-specific settings storage

---

## Technology Stack

Business Copilot is built using standard front-end technologies:

* HTML5
* CSS3
* JavaScript
* Browser `localStorage`
* Canvas API

No external JavaScript framework is required for the core application.

---

## Project Structure

```text
business-copilot/
│
├── index.html
├── about.html
├── contact.html
├── login.html
├── signup.html
├── dashboard.html
│
├── css/
│   ├── style.css
│   ├── auth.css
│   └── dashboard.css
│
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── transactions.js
│   ├── inventory.js
│   ├── storage.js
│   ├── goals.js
│   └── insights.js
│
└── assets/
    ├── images/
    └── icons/
```

---

## How It Works

Business Copilot uses the browser's `localStorage` to store application data.

User-specific information includes:

* User accounts
* Sessions
* Transactions
* Inventory
* Goals
* Business settings

The different sections of the application are connected so that changes in one section can automatically affect related sections.

### Example: Product Sale Flow

```text
User records a product sale
        ↓
Transaction is created
        ↓
Product stock is automatically reduced
        ↓
Inventory status is recalculated
        ↓
Dashboard statistics update
        ↓
Goal progress can update
        ↓
Insights and recommendations update
        ↓
Inventory notifications update
```

When a product-sale transaction is deleted, the previously deducted stock is automatically restored.

---

## Running the Project

Business Copilot is a front-end application and can be run locally in a browser.

### Option 1: Open Directly

Open:

```text
index.html
```

in a web browser.

### Option 2: Use a Local Development Server

The recommended development approach is to use a local server such as **Live Server** in Visual Studio Code.

1. Open the project folder in Visual Studio Code.
2. Install/use Live Server.
3. Open `index.html` with Live Server.
4. Navigate through the application.

---

## Demo Flow

For a project presentation or demonstration, the following flow demonstrates the main functionality:

1. Create a user account.
2. Log in.
3. Open the dashboard.
4. Add products through Inventory.
5. Record a product sale through Transactions.
6. Demonstrate automatic inventory deduction.
7. Demonstrate a low-stock notification.
8. View updated dashboard statistics.
9. Create a business or financial goal.
10. Record transactions that affect the goal.
11. Open Insights.
12. Demonstrate financial and inventory analysis.
13. Show generated recommendations.
14. Open Settings and update the business profile.
15. Delete the test sale.
16. Demonstrate automatic inventory restoration.

---

## Data Storage

Business Copilot currently uses browser `localStorage` instead of a remote database.

This means:

* Data is stored locally in the browser.
* Data is associated with the current browser/device.
* Clearing browser storage can remove application data.
* Data does not automatically synchronize between devices.
* The current authentication system is designed for demonstration purposes.

This approach keeps the application simple and suitable for a front-end school project.

---

## Design Goals

The interface was designed around:

* Clean and professional presentation
* Simple navigation
* Clear financial information
* Responsive layouts
* Consistent spacing and typography
* Useful empty states
* Clear confirmation dialogs
* Minimal visual clutter

The goal is to make Business Copilot feel like a practical business management application rather than a collection of disconnected demo pages.

---

## Current Limitations

Business Copilot is currently a front-end application, so it has several limitations:

* No backend server
* No remote database
* No cloud synchronization
* Demonstration-level authentication
* Browser-based data storage
* Rule-based financial insights
* No external payment integration
* No accounting software integration
* No cloud backup

---

## Future Improvements

Possible future versions could include:

* Backend API
* Real database
* Secure server-side authentication
* Cloud synchronization
* PDF financial reports
* CSV data export
* Advanced financial analytics
* Sales forecasting
* Supplier management
* Customer management
* Expense reminders
* Automated business reports
* AI-powered business assistance
* Multi-user business accounts
* Role-based permissions

---

## JavaScript Concepts Demonstrated

The project demonstrates several important JavaScript concepts, including:

* Variables
* Constants
* Functions
* Conditional statements
* Loops
* Arrays
* Objects
* Array methods
* DOM manipulation
* Event listeners
* Form handling
* Form validation
* Template literals
* Local storage
* Data parsing and serialization
* Dynamic rendering
* Calculations
* State management
* Date handling
* Canvas API
* Reusable functions
* Cross-feature data interaction

---

## Project Purpose

The purpose of Business Copilot is to demonstrate how JavaScript can be used to build an interactive business application where multiple features share and respond to the same underlying data.

The project combines:

* User authentication
* State management
* Local data persistence
* DOM manipulation
* Event handling
* Form validation
* Data calculations
* Dynamic UI rendering
* Inventory management
* Financial tracking
* Goal tracking
* Business insights
* Notifications
* Responsive design

---

## Project Status

**Functional and presentation-ready.**

The main application features have been implemented, integrated, tested, and reviewed across the dashboard sections.
