// Main Application Logic for Xpense Tracker

const App = {
    currentPage: 'login',
    currentFilters: {
        category: '',
        dateRange: 'month',
        sortBy: 'date-desc',
        search: ''
    },

    // Initialize the app
    init() {
        this.checkAuth();
        this.setupEventListeners();
    },

    // Check authentication
    checkAuth() {
        const user = Storage.getUser();
        if (user) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    },

    // Show login page
    showLogin() {
        const app = document.getElementById('app');
        const template = document.getElementById('login-template');
        app.innerHTML = template.innerHTML;

        this.currentPage = 'login';
        this.setupLoginHandlers();
    },

    // Setup login handlers
    setupLoginHandlers() {
        const form = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');

        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }

        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
    },

    // Handle login
    handleLogin(e) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Demo credentials
        if (email === 'robert.chase@walnutai.com' && password === 'demo@123') {
            const user = {
                email,
                name: 'Robert Chase',
                initials: 'RC'
            };
            Storage.setUser(user);
            Utils.showToast('Welcome back, Robert! 👋', 'success');
            setTimeout(() => this.showDashboard(), 500);
        } else {
            Utils.showToast('Invalid credentials. Please use demo credentials.', 'error');
        }
    },

    // Show dashboard
    showDashboard() {
        const app = document.getElementById('app');
        const template = document.getElementById('dashboard-template');
        app.innerHTML = template.innerHTML;

        this.currentPage = 'dashboard';
        this.setupDashboardHandlers();
        this.loadPage('overview');
    },

    // Setup dashboard event handlers
    setupDashboardHandlers() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Add expense button
        const addExpenseBtn = document.getElementById('add-expense-btn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => this.showExpenseModal());
        }
    },

    // Load page content
    loadPage(pageName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            'overview': 'Dashboard',
            'expenses': 'All Expenses',
            'budget': 'Budget Management',
            'insights': 'Spending Insights'
        };

        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[pageName] || 'Dashboard';
        }

        // Load content
        const contentArea = document.getElementById('content-area');
        const template = document.getElementById(`${pageName}-template`);
        
        if (contentArea && template) {
            contentArea.innerHTML = template.innerHTML;
            this.initializePage(pageName);
        }
    },

    // Initialize page-specific content
    initializePage(pageName) {
        switch(pageName) {
            case 'overview':
                this.initOverviewPage();
                break;
            case 'expenses':
                this.initExpensesPage();
                break;
            case 'budget':
                this.initBudgetPage();
                break;
            case 'insights':
                this.initInsightsPage();
                break;
        }
    },

    // Initialize overview page
    initOverviewPage() {
        Components.updateStatistics();
        Components.renderCategoryBreakdown('category-breakdown');
        Components.renderRecentExpenses('recent-expenses', 5);
        
        // Render charts
        setTimeout(() => {
            ChartRenderer.renderSpendingChart('spending-chart', 30);
        }, 100);

        // Chart period selector
        const periodSelector = document.getElementById('chart-period');
        if (periodSelector) {
            periodSelector.addEventListener('change', (e) => {
                ChartRenderer.renderSpendingChart('spending-chart', parseInt(e.target.value));
            });
        }

        // View all link
        document.querySelectorAll('[data-page="expenses"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPage('expenses');
            });
        });
    },

    // Initialize expenses page
    initExpensesPage() {
        this.renderExpenses();

        // Setup filters
        const filterCategory = document.getElementById('filter-category');
        const filterDate = document.getElementById('filter-date');
        const filterSort = document.getElementById('filter-sort');
        const filterSearch = document.getElementById('filter-search');

        if (filterCategory) {
            filterCategory.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.renderExpenses();
            });
        }

        if (filterDate) {
            filterDate.addEventListener('change', (e) => {
                this.currentFilters.dateRange = e.target.value;
                this.renderExpenses();
            });
        }

        if (filterSort) {
            filterSort.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.renderExpenses();
            });
        }

        if (filterSearch) {
            const debouncedSearch = Utils.debounce((value) => {
                this.currentFilters.search = value;
                this.renderExpenses();
            }, 300);

            filterSearch.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    },

    // Render expenses list
    renderExpenses() {
        Components.renderExpensesList('expenses-list', this.currentFilters);
    },

    // Initialize budget page
    initBudgetPage() {
        Components.updateBudgetDisplay();
        Components.renderCategoryBudgets('category-budgets');

        const editBudgetBtn = document.getElementById('edit-budget-btn');
        if (editBudgetBtn) {
            editBudgetBtn.addEventListener('click', () => this.showBudgetModal());
        }
    },

    // Initialize insights page
    initInsightsPage() {
        Components.renderTopCategories('top-categories');
        Components.renderSpendingPatterns('spending-patterns');

        setTimeout(() => {
            ChartRenderer.renderCategoryChart('insights-chart');
        }, 100);
    },

    // Show expense modal
    showExpenseModal(expenseId = null) {
        const app = document.getElementById('app');
        const template = document.getElementById('expense-modal-template');
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = template.innerHTML;
        app.appendChild(modalContainer.firstElementChild);

        const modal = document.getElementById('expense-modal');
        const form = document.getElementById('expense-form');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');

        // Set today's date as default
        document.getElementById('expense-date').value = Utils.getTodayDate();

        // If editing, populate form
        if (expenseId) {
            const expense = Storage.getExpenseById(expenseId);
            if (expense) {
                document.getElementById('modal-title').textContent = 'Edit Expense';
                document.getElementById('submit-text').textContent = 'Update Expense';
                document.getElementById('expense-id').value = expense.id;
                document.getElementById('expense-description').value = expense.description;
                document.getElementById('expense-amount').value = expense.amount;
                document.getElementById('expense-category').value = expense.category;
                document.getElementById('expense-date').value = expense.date;
                document.getElementById('expense-notes').value = expense.notes || '';
            }
        }

        // Close modal handlers
        const closeModal = () => {
            modal.classList.add('hidden');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExpenseSubmit(e, expenseId);
            closeModal();
        });
    },

    // Handle expense form submission
    handleExpenseSubmit(e, expenseId = null) {
        const formData = {
            description: document.getElementById('expense-description').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            category: document.getElementById('expense-category').value,
            date: document.getElementById('expense-date').value,
            notes: document.getElementById('expense-notes').value
        };

        if (expenseId) {
            Storage.updateExpense(expenseId, formData);
            Utils.showToast('Expense updated successfully! ✅', 'success');
        } else {
            Storage.addExpense(formData);
            Utils.showToast('Expense added successfully! ✅', 'success');
        }

        // Refresh current page
        this.refreshCurrentPage();
    },

    // Edit expense
    editExpense(expenseId) {
        this.showExpenseModal(expenseId);
    },

    // Delete expense
    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            Storage.deleteExpense(expenseId);
            Utils.showToast('Expense deleted successfully! 🗑️', 'success');
            this.refreshCurrentPage();
        }
    },

    // Show budget modal
    showBudgetModal() {
        const app = document.getElementById('app');
        const template = document.getElementById('budget-modal-template');
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = template.innerHTML;
        app.appendChild(modalContainer.firstElementChild);

        const modal = document.getElementById('budget-modal');
        const form = document.getElementById('budget-form');
        const closeBtn = document.getElementById('close-budget-modal');
        const cancelBtn = document.getElementById('cancel-budget-btn');

        // Set current budget
        document.getElementById('budget-amount').value = Storage.getBudget();

        // Close modal handlers
        const closeModal = () => {
            modal.classList.add('hidden');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const budget = parseFloat(document.getElementById('budget-amount').value);
            Storage.setBudget(budget);
            Utils.showToast('Budget updated successfully! 💰', 'success');
            closeModal();
            this.refreshCurrentPage();
        });
    },

    // Refresh current page
    refreshCurrentPage() {
        const activePage = document.querySelector('.nav-item.active');
        if (activePage) {
            const pageName = activePage.dataset.page;
            this.initializePage(pageName);
        }
    },

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            Storage.clearUser();
            Utils.showToast('Logged out successfully! 👋', 'success');
            setTimeout(() => this.showLogin(), 500);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Handle window resize for charts
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.refreshCurrentPage();
            }, 250);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to add expense
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.currentPage === 'dashboard') {
                    this.showExpenseModal();
                }
            }

            // ESC to close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay');
                if (modal) {
                    modal.click();
                }
            }
        });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
