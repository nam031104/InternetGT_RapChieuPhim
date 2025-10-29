document.addEventListener('DOMContentLoaded', () => {
    // Hàm tạo mã Captcha ngẫu nhiên
    function generateCaptcha(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < length; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    // Hàm xử lý làm mới Captcha
    function setupCaptcha(displayId, refreshBtnId) {
        const captchaDisplay = document.getElementById(displayId);
        const captchaRefreshBtn = document.getElementById(refreshBtnId);

        function refreshCaptcha() {
            if (captchaDisplay) {
                captchaDisplay.textContent = generateCaptcha();
            }
        }

        if (captchaRefreshBtn) {
            captchaRefreshBtn.addEventListener('click', refreshCaptcha);
        }
        
        // Tạo Captcha ban đầu
        refreshCaptcha();
    }
    
    // Khởi tạo Captcha cho cả hai form (Login và Register)
    setupCaptcha('captcha-display', 'captcha-refresh-btn'); // Cho form Đăng nhập
    setupCaptcha('reg-captcha-display', 'reg-captcha-refresh-btn'); // Cho form Đăng ký

    
    // 1. Xử lý chuyển đổi Tab (Đăng nhập/Đăng ký)
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Xóa trạng thái active khỏi tất cả các nút
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Ẩn tất cả nội dung tab
            tabContents.forEach(content => content.style.display = 'none');

            // Thêm trạng thái active cho nút được click
            button.classList.add('active');
            // Hiển thị nội dung tab tương ứng
            document.getElementById(targetTab).style.display = 'block';
        });
    });

    // 2. Tự động điền options cho Ngày/Tháng/Năm Sinh
    const daySelect = document.getElementById('reg-day');
    const monthSelect = document.getElementById('reg-month');
    const yearSelect = document.getElementById('reg-year');

    // Điền Ngày (1-31)
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0'); // Định dạng 01, 02...
        daySelect.appendChild(option);
    }

    // Điền Tháng (1-12)
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        monthSelect.appendChild(option);
    }

    // Điền Năm (từ năm hiện tại lùi về 100 năm)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
});