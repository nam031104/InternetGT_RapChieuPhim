document.addEventListener("DOMContentLoaded", () => {
  // 🧩 1. Hàm tạo Captcha ngẫu nhiên
  function generateCaptcha(length = 5) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < length; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  // 🧩 2. Hàm setup Captcha cho từng form
  function setupCaptcha(displayId, refreshBtnId) {
    const captchaDisplay = document.getElementById(displayId);
    const captchaRefreshBtn = document.getElementById(refreshBtnId);

    function refreshCaptcha() {
      if (captchaDisplay) captchaDisplay.textContent = generateCaptcha();
    }

    if (captchaRefreshBtn)
      captchaRefreshBtn.addEventListener("click", refreshCaptcha);

    refreshCaptcha();
  }

  // 👉 Khởi tạo Captcha cho đăng nhập và đăng ký
  setupCaptcha("captcha-display", "captcha-refresh-btn"); // login
  setupCaptcha("reg-captcha-display", "reg-captcha-refresh-btn"); // register

  // 🧩 3. Xử lý chuyển tab (Đăng nhập / Đăng ký)
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => (c.style.display = "none"));
      button.classList.add("active");
      document.getElementById(target).style.display = "block";
    });
  });

  // 🧩 4. Kiểm tra Captcha khi ĐĂNG NHẬP
  const loginForm = document.querySelector("#login form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const display = document.getElementById("captcha-display");
      const input = loginForm.querySelector('input[name="captchaLoginInput"]');
      const entered = input.value.trim();
      const correct = display.textContent.trim();

      if (entered.toLowerCase() !== correct.toLowerCase()) {
        e.preventDefault();
        alert("❌ Mã Captcha không đúng. Vui lòng thử lại!");
        display.textContent = generateCaptcha(); // đổi captcha
        input.value = "";
        input.focus();
      }
    });
  }

  // 🧩 5. Kiểm tra Captcha khi ĐĂNG KÝ
  const registerForm = document.querySelector("#register form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const display = document.getElementById("reg-captcha-display");
      const input = registerForm.querySelector('input[name="captchaInput"]');
      const entered = input.value.trim();
      const correct = display.textContent.trim();

      if (entered.toLowerCase() !== correct.toLowerCase()) {
        e.preventDefault();
        alert("❌ Mã Captcha không đúng. Vui lòng thử lại!");
        display.textContent = generateCaptcha();
        input.value = "";
        input.focus();
      }
    });
  }

  // 🧩 6. Điền Ngày / Tháng / Năm sinh (form đăng ký)
  const daySelect = document.getElementById("reg-day");
  const monthSelect = document.getElementById("reg-month");
  const yearSelect = document.getElementById("reg-year");
  if (daySelect && monthSelect && yearSelect) {
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i.toString().padStart(2, "0");
      daySelect.appendChild(opt);
    }
    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i.toString().padStart(2, "0");
      monthSelect.appendChild(opt);
    }
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      yearSelect.appendChild(opt);
    }
  }
});
