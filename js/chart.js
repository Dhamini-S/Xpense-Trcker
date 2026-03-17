// Simple Chart Implementation for Xpense Tracker
// Lightweight canvas-based charting without external dependencies

const ChartRenderer = {
    // Render spending trend chart
    renderSpendingChart(canvasId, days = 30) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const expenses = Storage.getExpenses();
        
        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Prepare data
        const dailyData = this.aggregateDailyExpenses(expenses, startDate, endDate);
        
        // Set canvas size
        const width = canvas.parentElement.clientWidth;
        const height = 300;
        canvas.width = width;
        canvas.height = height;

        // Draw chart
        this.drawLineChart(ctx, dailyData, width, height);
    },

    // Render category pie chart
    renderCategoryChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const categoryTotals = Storage.getMonthCategoryTotals();
        
        // Set canvas size
        const width = canvas.parentElement.clientWidth;
        const height = 300;
        canvas.width = width;
        canvas.height = height;

        // Draw chart
        this.drawPieChart(ctx, categoryTotals, width, height);
    },

    // Aggregate expenses by day
    aggregateDailyExpenses(expenses, startDate, endDate) {
        const dailyMap = {};
        
        // Initialize all dates with 0
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateKey = Utils.formatDateInput(current);
            dailyMap[dateKey] = 0;
            current.setDate(current.getDate() + 1);
        }

        // Sum expenses by date
        expenses.forEach(expense => {
            if (dailyMap.hasOwnProperty(expense.date)) {
                dailyMap[expense.date] += expense.amount;
            }
        });

        // Convert to array format
        return Object.entries(dailyMap).map(([date, amount]) => ({
            date,
            amount
        }));
    },

    // Draw line chart
    drawLineChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        const maxAmount = Math.max(...data.map(d => d.amount), 1);
        const maxY = Math.ceil(maxAmount / 100) * 100;

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxY - (maxY / 5) * i;
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'right';
            ctx.fillText('$' + value.toFixed(0), padding - 10, y + 4);
        }

        // Draw line
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.amount / maxY) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw gradient fill
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw points
        ctx.fillStyle = '#6366f1';
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.amount / maxY) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // White border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw X-axis labels (show every nth label to avoid crowding)
        const labelInterval = Math.ceil(data.length / 7);
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        
        data.forEach((point, index) => {
            if (index % labelInterval === 0 || index === data.length - 1) {
                const x = padding + (chartWidth / (data.length - 1)) * index;
                const date = new Date(point.date);
                const label = (date.getMonth() + 1) + '/' + date.getDate();
                ctx.fillText(label, x, height - padding + 20);
            }
        });
    },

    // Draw pie chart
    drawPieChart(ctx, categoryTotals, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate total
        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        if (total === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', centerX, centerY);
            return;
        }

        // Draw slices
        let currentAngle = -Math.PI / 2; // Start from top
        const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

        categories.forEach(([category, amount]) => {
            const sliceAngle = (amount / total) * Math.PI * 2;
            const color = Utils.getCategoryColor(category);

            // Draw slice
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw white border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);

            ctx.fillStyle = '#374151';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = labelX > centerX ? 'left' : 'right';
            ctx.fillText(category, labelX, labelY);

            // Draw percentage
            const percentage = ((amount / total) * 100).toFixed(1) + '%';
            ctx.font = '11px Inter';
            ctx.fillStyle = '#6b7280';
            ctx.fillText(percentage, labelX, labelY + 14);

            currentAngle += sliceAngle;
        });

        // Draw center circle for donut effect
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Draw total in center
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(Utils.formatCurrency(total), centerX, centerY - 5);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter';
        ctx.fillText('Total Spent', centerX, centerY + 15);
    },

    // Draw bar chart
    drawBarChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }

        // Find max value
        const maxAmount = Math.max(...data.map(d => d.amount));
        const maxY = Math.ceil(maxAmount / 100) * 100;

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxY - (maxY / 5) * i;
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'right';
            ctx.fillText('$' + value.toFixed(0), padding - 10, y + 4);
        }

        // Draw bars
        const barWidth = chartWidth / data.length * 0.7;
        const barGap = chartWidth / data.length * 0.3;

        data.forEach((item, index) => {
            const x = padding + (chartWidth / data.length) * index + barGap / 2;
            const barHeight = (item.amount / maxY) * chartHeight;
            const y = padding + chartHeight - barHeight;

            // Gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = '#6b7280';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);
        });
    }
};
