// UI Components for Xpense Tracker

const Components = {
    // Render recent expenses
    renderRecentExpenses(containerId, limit = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const expenses = Storage.getExpenses()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);

        if (expenses.length === 0) {
            container.innerHTML = this.getEmptyState('No expenses yet', 'Start tracking by adding your first expense');
            return;
        }

        container.innerHTML = expenses.map(expense => this.renderExpenseItem(expense)).join('');
    },

    // Render all expenses with filters
    renderExpensesList(containerId, filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let expenses = Storage.getExpenses();

        // Apply filters
        if (filters.category) {
            expenses = expenses.filter(e => e.category === filters.category);
        }

        if (filters.dateRange && filters.dateRange !== 'all') {
            expenses = Utils.filterByDateRange(expenses, filters.dateRange);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            expenses = expenses.filter(e => 
                (e.description && e.description.toLowerCase().includes(searchLower)) ||
                e.notes?.toLowerCase().includes(searchLower)
            );
        }

        if (filters.sortBy) {
            expenses = Utils.sortExpenses(expenses, filters.sortBy);
        }

        if (expenses.length === 0) {
            container.innerHTML = this.getEmptyState('No expenses found', 'Try adjusting your filters');
            return;
        }

        container.innerHTML = expenses.map(expense => this.renderExpenseItem(expense, true)).join('');
    },

    // Render single expense item
    renderExpenseItem(expense, showActions = false) {
        const icon = Utils.getCategoryIcon(expense.category);
        const formattedDate = Utils.formatDate(expense.date);
        const formattedAmount = Utils.formatCurrency(expense.amount);
        const description = expense.description || `${expense.category} Expense`;

        return `
            <div class="expense-item" data-id="${expense.id}">
                <div class="expense-category-icon" style="background: ${Utils.getCategoryColor(expense.category)}20;">
                    ${icon}
                </div>
                <div class="expense-details">
                    <div class="expense-description">${description}</div>
                    <div class="expense-meta">
                        <span class="expense-date">${formattedDate}</span>
                        <span class="expense-category-badge">${expense.category}</span>
                    </div>
                    ${expense.notes ? `<div class="expense-notes">💬 ${expense.notes}</div>` : ''}
                </div>
                <div class="expense-amount-wrapper">
                    <div class="expense-amount">${formattedAmount}</div>
                    ${showActions ? `
                        <div class="expense-actions">
                            <button class="btn-icon-only btn-edit" onclick="App.editExpense('${expense.id}')" title="Edit">
                                ✏️
                            </button>
                            <button class="btn-icon-only btn-delete" onclick="App.deleteExpense('${expense.id}')" title="Delete">
                                🗑️
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Render category breakdown
    renderCategoryBreakdown(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categoryTotals = Storage.getMonthCategoryTotals();
        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

        if (total === 0) {
            container.innerHTML = this.getEmptyState('No expenses this month', 'Start tracking your spending');
            return;
        }

        // Sort by amount
        const sorted = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5

        container.innerHTML = sorted.map(([category, amount]) => {
            const icon = Utils.getCategoryIcon(category);
            const percent = Utils.calculatePercentage(amount, total);
            const formattedAmount = Utils.formatCurrency(amount);

            return `
                <div class="category-item">
                    <div class="category-icon" style="background: ${Utils.getCategoryColor(category)}20;">
                        ${icon}
                    </div>
                    <div class="category-details">
                        <div class="category-name">${category}</div>
                        <div class="category-progress">
                            <div class="category-progress-bar" style="width: ${percent}%; background: ${Utils.getCategoryColor(category)};"></div>
                        </div>
                    </div>
                    <div class="category-amount">
                        <div>${formattedAmount}</div>
                        <div class="category-percent">${percent}%</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render category budgets
    renderCategoryBudgets(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categoryTotals = Storage.getMonthCategoryTotals();
        const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];

        container.innerHTML = categories.map(category => {
            const spent = categoryTotals[category] || 0;
            const icon = Utils.getCategoryIcon(category);
            const formattedAmount = Utils.formatCurrency(spent);

            return `
                <div class="category-item">
                    <div class="category-icon" style="background: ${Utils.getCategoryColor(category)}20;">
                        ${icon}
                    </div>
                    <div class="category-details">
                        <div class="category-name">${category}</div>
                    </div>
                    <div class="category-amount">
                        ${formattedAmount}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render top categories
    renderTopCategories(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categoryTotals = Storage.getCategoryTotals();
        const sorted = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (sorted.length === 0) {
            container.innerHTML = this.getEmptyState('No data', 'Add expenses to see insights');
            return;
        }

        container.innerHTML = sorted.map(([category, amount], index) => {
            const icon = Utils.getCategoryIcon(category);
            const formattedAmount = Utils.formatCurrency(amount);
            const medals = ['🥇', '🥈', '🥉'];

            return `
                <div class="category-item">
                    <div class="category-icon" style="background: ${Utils.getCategoryColor(category)}20;">
                        ${icon}
                    </div>
                    <div class="category-details">
                        <div class="category-name">${medals[index]} ${category}</div>
                    </div>
                    <div class="category-amount">
                        ${formattedAmount}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render spending patterns
    renderSpendingPatterns(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const expenses = Storage.getExpenses();
        const total = Storage.getTotalExpenses();
        const monthTotal = Storage.getMonthExpenses();
        const avgPerDay = expenses.length > 0 ? total / Math.max(this.getDaysSinceFirstExpense(), 1) : 0;

        const patterns = [
            {
                icon: '📊',
                label: 'Average per Day',
                value: Utils.formatCurrency(avgPerDay)
            },
            {
                icon: '📅',
                label: 'This Month',
                value: Utils.formatCurrency(monthTotal)
            },
            {
                icon: '🔢',
                label: 'Total Transactions',
                value: expenses.length
            }
        ];

        container.innerHTML = patterns.map(pattern => `
            <div class="category-item">
                <div class="category-icon" style="background: var(--gray-100);">
                    ${pattern.icon}
                </div>
                <div class="category-details">
                    <div class="category-name">${pattern.label}</div>
                </div>
                <div class="category-amount">
                    ${pattern.value}
                </div>
            </div>
        `).join('');
    },

    // Get days since first expense
    getDaysSinceFirstExpense() {
        const expenses = Storage.getExpenses();
        if (expenses.length === 0) return 1;

        const dates = expenses.map(e => new Date(e.date));
        const earliest = new Date(Math.min(...dates));
        const today = new Date();
        const diffTime = Math.abs(today - earliest);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(diffDays, 1);
    },

    // Get empty state HTML
    getEmptyState(title, message) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3 class="empty-state-title">${title}</h3>
                <p class="empty-state-text">${message}</p>
            </div>
        `;
    },

    // Update statistics
    updateStatistics() {
        const total = Storage.getTotalExpenses();
        const monthTotal = Storage.getMonthExpenses();
        const budget = Storage.getBudget();
        const remaining = budget - monthTotal;
        const expenses = Storage.getExpenses();

        // Update stat cards
        this.updateElement('total-expenses', Utils.formatCurrency(total));
        this.updateElement('month-expenses', Utils.formatCurrency(monthTotal));
        this.updateElement('budget-left', Utils.formatCurrency(Math.max(remaining, 0)));
        this.updateElement('transaction-count', expenses.length);

        // Update budget percentage
        const budgetPercent = Utils.calculatePercentage(monthTotal, budget);
        this.updateElement('budget-percent', `${budgetPercent}% of budget`);
    },

    // Update budget display
    updateBudgetDisplay() {
        const budget = Storage.getBudget();
        const spent = Storage.getMonthExpenses();
        const remaining = budget - spent;
        const percent = Utils.calculatePercentage(spent, budget);

        this.updateElement('budget-total', Utils.formatCurrency(budget));
        this.updateElement('budget-spent', Utils.formatCurrency(spent));
        this.updateElement('budget-remaining', Utils.formatCurrency(Math.max(remaining, 0)));

        const progressBar = document.getElementById('budget-progress-bar');
        if (progressBar) {
            progressBar.style.width = Math.min(percent, 100) + '%';
            progressBar.className = 'budget-progress-bar';
            if (percent > 90) {
                progressBar.classList.add('warning');
            }
        }
    },

    // Helper to update element
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
};
