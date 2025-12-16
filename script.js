// Dashboard JavaScript
class InsuranceDashboard {
    constructor() {
        this.requests = JSON.parse(localStorage.getItem('insuranceRequests')) || [];
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateStats();
        this.renderRecentRequests();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(link.dataset.view);
            });
        });

        // Header buttons
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterRequests(e.target.value);
        });

        document.getElementById('filterSelect').addEventListener('change', (e) => {
            this.filterRequests(document.getElementById('searchInput').value, e.target.value);
        });

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('requestModal').addEventListener('click', (e) => {
            if (e.target.id === 'requestModal') {
                this.closeModal();
            }
        });

        // Auto refresh every 30 seconds
        setInterval(() => {
            this.loadData();
        }, 30000);
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).closest('.nav-item').classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}View`).classList.add('active');

        // Update header
        const titles = {
            dashboard: { title: 'الرئيسية', subtitle: 'مرحباً بك في لوحة تحكم تأميني' },
            requests: { title: 'طلبات التأمين', subtitle: 'إدارة ومراجعة جميع طلبات التأمين' },
            analytics: { title: 'الإحصائيات', subtitle: 'تحليلات مفصلة لبيانات التأمين' },
            settings: { title: 'الإعدادات', subtitle: 'إعدادات النظام والحساب' }
        };

        document.getElementById('pageTitle').textContent = titles[viewName].title;
        document.getElementById('pageSubtitle').textContent = titles[viewName].subtitle;

        this.currentView = viewName;

        // Load view-specific data
        if (viewName === 'requests') {
            this.renderRequestsTable();
        } else if (viewName === 'analytics') {
            this.renderAnalytics();
        }
    }

    loadData() {
        this.requests = JSON.parse(localStorage.getItem('insuranceRequests')) || [];
        this.updateStats();
        this.updateRequestsCount();
    }

    updateStats() {
        const total = this.requests.length;
        const today = this.requests.filter(req => {
            const today = new Date().toDateString();
            const requestDate = new Date(req.timestamp).toDateString();
            return today === requestDate;
        }).length;

        const newInsurance = this.requests.filter(req => req.offerType === 'new').length;
        const transfers = this.requests.filter(req => req.offerType === 'transfer').length;

        document.getElementById('totalRequests').textContent = total;
        document.getElementById('todayRequests').textContent = today;
        document.getElementById('newInsurance').textContent = newInsurance;
        document.getElementById('transfers').textContent = transfers;
    }

    updateRequestsCount() {
        const badge = document.getElementById('requestsCount');
        if (badge) {
            badge.textContent = this.requests.length;
        }
    }

    renderRecentRequests() {
        const container = document.getElementById('recentRequests');
        
        if (this.requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>لا توجد طلبات</h3>
                    <p>لم يتم استقبال أي طلبات حتى الآن</p>
                </div>
            `;
            return;
        }

        const recentRequests = this.requests
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        container.innerHTML = recentRequests.map(request => `
            <div class="request-item">
                <div class="request-info">
                    <h4>${request.userName}</h4>
                    <p>${request.phoneNumber} • ${request.offerType === 'new' ? 'تأمين جديد' : 'نقل ملكية'}</p>
                </div>
                <div class="request-meta">
                    <div class="request-time">${this.formatDate(request.timestamp)}</div>
                    <div class="request-status status-new">جديد</div>
                </div>
            </div>
        `).join('');
    }

    renderRequestsTable() {
        const tbody = document.getElementById('requestsTableBody');
        
        if (this.requests.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>لا توجد طلبات</h3>
                        <p>لم يتم استقبال أي طلبات حتى الآن</p>
                    </td>
                </tr>
            `;
            return;
        }

        const filteredRequests = this.getFilteredRequests();
        
        tbody.innerHTML = filteredRequests.map(request => `
            <tr>
                <td>${request.userName}</td>
                <td>${request.phoneNumber}</td>
                <td>
                    <span class="status-badge ${request.offerType === 'new' ? 'status-new' : 'status-progress'}">
                        ${request.offerType === 'new' ? 'تأمين جديد' : 'نقل ملكية'}
                    </span>
                </td>
                <td>${request.serialNumber}</td>
                <td>${this.formatDate(request.timestamp)}</td>
                <td>
                    <button class="action-btn primary" onclick="dashboard.showRequestDetails('${request.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn danger" onclick="dashboard.deleteRequest('${request.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredRequests() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const filterValue = document.getElementById('filterSelect')?.value || 'all';

        let filtered = this.requests;

        if (searchTerm) {
            filtered = filtered.filter(request => 
                request.userName.toLowerCase().includes(searchTerm) ||
                request.phoneNumber.includes(searchTerm) ||
                request.serialNumber.toLowerCase().includes(searchTerm)
            );
        }

        if (filterValue !== 'all') {
            filtered = filtered.filter(request => request.offerType === filterValue);
        }

        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    filterRequests(searchTerm, filterValue = 'all') {
        if (this.currentView === 'requests') {
            this.renderRequestsTable();
        }
    }

    showRequestDetails(requestId) {
        const request = this.requests.find(r => r.id === requestId);
        if (!request) return;

        const modal = document.getElementById('requestModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="request-details">
                <h4>البيانات الأساسية</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>الاسم:</label>
                        <span>${request.userName}</span>
                    </div>
                    <div class="detail-item">
                        <label>رقم الهاتف:</label>
                        <span>${request.phoneNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>رقم الهوية:</label>
                        <span>${request.idNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>نوع الطلب:</label>
                        <span>${request.offerType === 'new' ? 'تأمين جديد' : 'نقل ملكية'}</span>
                    </div>
                    <div class="detail-item">
                        <label>نوع التسجيل:</label>
                        <span>${request.regType === 'serial' ? 'الرقم التسلسلي' : 'بطاقة جمركية'}</span>
                    </div>
                    <div class="detail-item">
                        <label>الرقم التسلسلي/الجمركي:</label>
                        <span>${request.serialNumber}</span>
                    </div>
                    ${request.birthDate ? `
                    <div class="detail-item">
                        <label>تاريخ الميلاد:</label>
                        <span>${request.birthDate}</span>
                    </div>
                    ` : ''}
                    ${request.carYear ? `
                    <div class="detail-item">
                        <label>سنة الصنع:</label>
                        <span>${request.carYear}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <label>تاريخ التقديم:</label>
                        <span>${this.formatDateTime(request.timestamp)}</span>
                    </div>
                </div>
                
                <h4 style="margin-top: 2rem;">بيانات الخطوات التالية</h4>
                <div id="additionalData" class="additional-data">
                    ${this.renderAdditionalData(request)}
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    renderAdditionalData(request) {
        if (!request.additionalData || Object.keys(request.additionalData).length === 0) {
            return '<p class="text-muted">لا توجد بيانات إضافية</p>';
        }

        return Object.entries(request.additionalData).map(([key, value]) => `
            <div class="detail-item">
                <label>${this.getFieldLabel(key)}:</label>
                <span>${value}</span>
            </div>
        `).join('');
    }

    getFieldLabel(key) {
        const labels = {
            vehicleType: 'نوع المركبة',
            vehicleModel: 'موديل المركبة',
            vehicleYear: 'سنة الصنع',
            vehicleValue: 'قيمة المركبة',
            insuranceType: 'نوع التأمين',
            coverage: 'التغطية',
            premium: 'القسط',
            policyStartDate: 'تاريخ بداية الوثيقة',
            policyEndDate: 'تاريخ نهاية الوثيقة'
        };
        return labels[key] || key;
    }

    deleteRequest(requestId) {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            this.requests = this.requests.filter(r => r.id !== requestId);
            localStorage.setItem('insuranceRequests', JSON.stringify(this.requests));
            this.loadData();
            this.renderRecentRequests();
            if (this.currentView === 'requests') {
                this.renderRequestsTable();
            }
        }
    }

    closeModal() {
        document.getElementById('requestModal').classList.remove('active');
    }

    refreshData() {
        this.loadData();
        this.renderRecentRequests();
        if (this.currentView === 'requests') {
            this.renderRequestsTable();
        }
        this.showNotification('تم تحديث البيانات', 'success');
    }

    exportData() {
        const data = {
            exportDate: new Date().toISOString(),
            totalRequests: this.requests.length,
            requests: this.requests
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insurance-requests-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('تم تصدير البيانات بنجاح', 'success');
    }

    renderAnalytics() {
        // Insurance Type Chart
        const ctx1 = document.getElementById('insuranceTypeChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: ['تأمين جديد', 'نقل ملكية'],
                    datasets: [{
                        data: [
                            this.requests.filter(r => r.offerType === 'new').length,
                            this.requests.filter(r => r.offerType === 'transfer').length
                        ],
                        backgroundColor: ['#3b82f6', '#10b981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Daily Requests Chart
        const ctx2 = document.getElementById('dailyRequestsChart');
        if (ctx2) {
            const dailyData = this.getDailyRequests();
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: dailyData.labels,
                    datasets: [{
                        label: 'عدد الطلبات',
                        data: dailyData.data,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    getDailyRequests() {
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const count = this.requests.filter(req => {
                const reqDate = new Date(req.timestamp).toISOString().split('T')[0];
                return reqDate === dateStr;
            }).length;

            last7Days.push({
                date: dateStr,
                count: count,
                label: date.toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })
            });
        }

        return {
            labels: last7Days.map(d => d.label),
            data: last7Days.map(d => d.count)
        };
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ar-SA');
    }

    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('ar-SA');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// API for external sites to send data
window.InsuranceDashboardAPI = {
    addRequest: function(data) {
        const request = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...data
        };

        // Get existing requests
        const requests = JSON.parse(localStorage.getItem('insuranceRequests')) || [];
        
        // Add new request
        requests.push(request);
        
        // Save back to localStorage
        localStorage.setItem('insuranceRequests', JSON.stringify(requests));
        
        // Show notification
        if (window.dashboard) {
            window.dashboard.loadData();
            window.dashboard.showNotification('تم استقبال طلب جديد', 'success');
        }

        return { success: true, id: request.id };
    },

    getRequests: function() {
        return JSON.parse(localStorage.getItem('insuranceRequests')) || [];
    },

    clearRequests: function() {
        localStorage.removeItem('insuranceRequests');
        return { success: true };
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .detail-item label {
        font-weight: 600;
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    .detail-item span {
        color: #1f2937;
        font-weight: 500;
    }
    
    .text-muted {
        color: #6b7280;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new InsuranceDashboard();
});