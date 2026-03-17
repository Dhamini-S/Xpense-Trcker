// Storage Manager for Xpense Tracker
// Manages all data persistence using localStorage

const Storage = {
    // Keys
    KEYS: {
        USER: 'xpense_user',
        EXPENSES: 'xpense_expenses',
        BUDGET: 'xpense_budget'
    },

    // Initialize with sample data
    init() {
        if (!this.getExpenses().length) {
            this.seedSampleData();
        }
        if (!this.getBudget()) {
            this.setBudget(3000);
        }
    },

    // User methods
    setUser(user) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(this.KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    clearUser() {
        localStorage.removeItem(this.KEYS.USER);
    },

    // Expense methods
    getExpenses() {
        const expenses = localStorage.getItem(this.KEYS.EXPENSES);
        return expenses ? JSON.parse(expenses) : [];
    },

    addExpense(expense) {
        const expenses = this.getExpenses();
        const newExpense = {
            id: Utils.generateId(),
            ...expense,
            createdAt: new Date().toISOString()
        };
        expenses.push(newExpense);
        localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(expenses));
        return newExpense;
    },

    updateExpense(id, updates) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...updates };
            localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(expenses));
            return expenses[index];
        }
        return null;
    },

    deleteExpense(id) {
        const expenses = this.getExpenses();
        const filtered = expenses.filter(e => e.id !== id);
        localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(filtered));
    },

    getExpenseById(id) {
        const expenses = this.getExpenses();
        return expenses.find(e => e.id === id);
    },

    // Budget methods
    getBudget() {
        const budget = localStorage.getItem(this.KEYS.BUDGET);
        return budget ? parseFloat(budget) : 0;
    },

    setBudget(amount) {
        localStorage.setItem(this.KEYS.BUDGET, amount.toString());
    },

    // Statistics
    getTotalExpenses() {
        const expenses = this.getExpenses();
        return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    },

    getMonthExpenses() {
        const expenses = this.getExpenses();
        const { start, end } = Utils.getMonthRange();
        const monthExpenses = expenses.filter(e => e.date >= start && e.date <= end);
        return monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    },

    getCategoryTotals() {
        const expenses = this.getExpenses();
        return Utils.calculateCategoryTotals(expenses);
    },

    getMonthCategoryTotals() {
        const expenses = this.getExpenses();
        const { start, end } = Utils.getMonthRange();
        const monthExpenses = expenses.filter(e => e.date >= start && e.date <= end);
        return Utils.calculateCategoryTotals(monthExpenses);
    },

    // Seed sample data
    seedSampleData() {
        const today = new Date();
        const sampleExpenses = [
            {
                id: Utils.generateId(),
                description: 'Grocery Shopping',
                amount: 125.50,
                category: 'Food',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
                notes: 'Weekly groceries from Whole Foods',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Uber to Airport',
                amount: 45.00,
                category: 'Travel',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
                notes: 'Business trip',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'New Running Shoes',
                amount: 89.99,
                category: 'Shopping',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)),
                notes: 'Nike Air Max from outlet',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Internet Bill',
                amount: 79.99,
                category: 'Bills',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), 1)),
                notes: 'Monthly internet service',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Movie Tickets',
                amount: 28.00,
                category: 'Entertainment',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
                notes: 'Watched Oppenheimer with friends',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Pharmacy',
                amount: 42.50,
                category: 'Health',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
                notes: 'Prescription refill',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Coffee Beans',
                amount: 18.99,
                category: 'Food',
                date: Utils.formatDateInput(today),
                notes: 'Premium arabica beans',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Amazon Purchase',
                amount: 156.78,
                category: 'Shopping',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
                notes: 'Books and office supplies',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Restaurant Dinner',
                amount: 85.30,
                category: 'Food',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)),
                notes: 'Dinner at Italian restaurant',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Gym Membership',
                amount: 49.99,
                category: 'Health',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), 1)),
                notes: 'Monthly gym fee',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Streaming Services',
                amount: 35.97,
                category: 'Entertainment',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), 1)),
                notes: 'Netflix, Spotify, Disney+',
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.generateId(),
                description: 'Gas Station',
                amount: 52.00,
                category: 'Travel',
                date: Utils.formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8)),
                notes: 'Full tank',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(sampleExpenses));
    },

    // Clear all data
    clearAll() {
        localStorage.removeItem(this.KEYS.EXPENSES);
        localStorage.removeItem(this.KEYS.BUDGET);
    }
};

// Initialize storage
Storage.init();
