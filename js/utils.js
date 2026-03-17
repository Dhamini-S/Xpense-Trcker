// Utility functions for Xpense Tracker

const Utils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Format date
    formatDate(date) {
        const d = new Date(date);
        return new Intl.DateFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(d);
    },

    // Format date for input
    formatDateInput(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },

    // Get today's date in YYYY-MM-DD format
    getTodayDate() {
        return this.formatDateInput(new Date());
    },

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'Food': '🍔',
            'Travel': '✈️',
            'Shopping': '🛍️',
            'Bills': '📄',
            'Entertainment': '🎮',
            'Health': '⚕️',
            'Others': '📦'
        };
        return icons[category] || '📦';
    },

    // Get category color
    getCategoryColor(category) {
        const colors = {
            'Food': '#10b981',
            'Travel': '#3b82f6',
            'Shopping': '#f59e0b',
            'Bills': '#ef4444',
            'Entertainment': '#8b5cf6',
            'Health': '#ec4899',
            'Others': '#6b7280'
        };
        return colors[category] || '#6b7280';
    },

    // Calculate percentage
    calculatePercentage(part, total) {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    },

    // Get date range
    getDateRange(range) {
        const today = new Date();
        let startDate = new Date();

        switch(range) {
            case 'today':
                startDate = new Date(today.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(today.setDate(today.getDate() - today.getDay()));
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                return { start: null, end: null };
        }

        return {
            start: this.formatDateInput(startDate),
            end: this.formatDateInput(new Date())
        };
    },

    // Filter expenses by date range
    filterByDateRange(expenses, range) {
        if (range === 'all') return expenses;
        
        const { start, end } = this.getDateRange(range);
        return expenses.filter(expense => {
            return expense.date >= start && expense.date <= end;
        });
    },

    // Sort expenses
    sortExpenses(expenses, sortBy) {
        const sorted = [...expenses];
        
        switch(sortBy) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'amount-desc':
                return sorted.sort((a, b) => b.amount - a.amount);
            case 'amount-asc':
                return sorted.sort((a, b) => a.amount - b.amount);
            default:
                return sorted;
        }
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            fontWeight: '500'
        });

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Get current month name
    getCurrentMonth() {
        return new Intl.DateFormat('en-US', { month: 'long' }).format(new Date());
    },

    // Get month start and end dates
    getMonthRange() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            start: this.formatDateInput(start),
            end: this.formatDateInput(end)
        };
    },

    // Calculate total by category
    calculateCategoryTotals(expenses) {
        const totals = {};
        expenses.forEach(expense => {
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.amount;
        });
        return totals;
    }
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
