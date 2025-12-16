const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from dashboard directory
app.use(express.static(path.join(__dirname, 'dashboard')));

// API endpoint to receive insurance data
app.post('/api/receive-data', (req, res) => {
    try {
        const data = req.body;
        console.log('تم استقبال بيانات جديدة:', data);
        
        // In a real application, you would save this to a database
        // For now, we'll just log it and return success
        
        res.json({
            success: true,
            message: 'تم استقبال البيانات بنجاح',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('خطأ في معالجة البيانات:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في معالجة البيانات',
            error: error.message
        });
    }
});

// Serve dashboard files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// API endpoint to get all requests (for demo purposes)
app.get('/api/requests', (req, res) => {
    // In a real application, this would fetch from a database
    res.json({
        success: true,
        data: [],
        message: 'للحصول على البيانات، استخدم localStorage في المتصفح'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 لوحة تحكم تأميني تعمل على المنفذ ${PORT}`);
    console.log(`📊 ادخل إلى: http://localhost:${PORT}/dashboard`);
});