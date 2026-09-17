/* ========================================
   BUSINESS COPILOT STORAGE
========================================= */

const TRANSACTION_KEY_PREFIX = "bc_transactions_";

/*
    Get the storage key for the currently
    logged-in user.
*/
function getTransactionStorageKey(userId) {
    return TRANSACTION_KEY_PREFIX + userId;
}


/*
    Get all transactions belonging
    to a specific user.
*/
function getTransactions(userId) {

    const key = getTransactionStorageKey(userId);

    const savedTransactions = localStorage.getItem(key);

    if (!savedTransactions) {
        return [];
    }

    return JSON.parse(savedTransactions);
}


/*
    Save transactions for a specific user.
*/
function saveTransactions(userId, transactions) {

    const key = getTransactionStorageKey(userId);

    localStorage.setItem(
        key,
        JSON.stringify(transactions)
    );
}


/* ========================================
   INVENTORY STORAGE
========================================= */

const INVENTORY_KEY_PREFIX = "bc_inventory_";


function getInventoryStorageKey(userId) {
    return INVENTORY_KEY_PREFIX + userId;
}


function getInventory(userId) {

    const key = getInventoryStorageKey(userId);

    const savedInventory = localStorage.getItem(key);

    if (!savedInventory) {
        return [];
    }

    return JSON.parse(savedInventory);
}


function saveInventory(userId, inventory) {

    const key = getInventoryStorageKey(userId);

    localStorage.setItem(
        key,
        JSON.stringify(inventory)
    );
}


// GOALS

const GOALS_KEY_PREFIX = "bc_goals_";

function getGoalsStorageKey(userId) {
    return GOALS_KEY_PREFIX + userId;
}

function getGoals(userId) {
    const key = getGoalsStorageKey(userId);

    const savedGoals = localStorage.getItem(key);

    if (!savedGoals) {
        return [];
    }

    return JSON.parse(savedGoals);
}

function saveGoals(userId, goals) {
    const key = getGoalsStorageKey(userId);

    localStorage.setItem(
        key,
        JSON.stringify(goals)
    );
}


// ========================================
// SETTINGS STORAGE
// ========================================

const SETTINGS_KEY_PREFIX = "bc_settings_";

function getSettingsStorageKey(userId) {
    return SETTINGS_KEY_PREFIX + userId;
}

function getSettings(userId) {
    const key = getSettingsStorageKey(userId);
    const savedSettings = localStorage.getItem(key);

    if (!savedSettings) {
        return {
            businessName: "",
            businessType: "",
            currency: "NGN"
        };
    }

    return JSON.parse(savedSettings);
}

function saveSettings(userId, settings) {
    const key = getSettingsStorageKey(userId);

    localStorage.setItem(
        key,
        JSON.stringify(settings)
    );
}