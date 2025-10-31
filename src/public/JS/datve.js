document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // DOM Elements
  // ------------------------------
  const dateButtonsContainer = document.getElementById("date-buttons");
  const timeButtonsContainer = document.getElementById("time-buttons");
  const seatContainer = document.getElementById("seat-container");
  const seatsGrid = document.getElementById("seats-grid");
  const bookButton = document.getElementById("book-button");

  const dateDisplay = document.getElementById("selected-date-display");
  const timeDisplay = document.getElementById("selected-time-display");
  const auditoriumDisplay = document.getElementById("auditorium-display");
  const auditoriumName = document.getElementById("auditorium-name");

  // ------------------------------
  // Dữ liệu từ HBS
  // ------------------------------
  const showtimeDataScript = document.getElementById("showtime-data");
  if (!showtimeDataScript) {
    console.error("Không tìm thấy #showtime-data trong DOM");
    return;
  }

  let showtimesGrouped = {};
  try {
    showtimesGrouped = JSON.parse(showtimeDataScript.textContent);
    console.log("Dữ liệu suất chiếu:", showtimesGrouped);
  } catch (error) {
    console.error("Lỗi parse JSON showtimesGrouped:", error);
    return;
  }

  // Tạo danh sách ngày từ showtimesGrouped
  const showtimesByDate = Object.keys(showtimesGrouped).map((date) => ({
    date,
    label: formatDateLabel(date),
  }));

  // ------------------------------
  // State
  // ------------------------------
  let selectedDate = null;
  let selectedDateLabel = null;
  let selectedTime = null;
  let selectedShowtime = null;
  let selectedSeats = [];

  // ------------------------------
  // Helper: Format date label
  // ------------------------------
  function formatDateLabel(dateStr) {
    const date = new Date(dateStr);
    const weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${weekday} (${day}/${month})`;
  }

  // ------------------------------
  // Render nút ngày
  // ------------------------------
  function renderDateButtons() {
    dateButtonsContainer.innerHTML = "";

    if (showtimesByDate.length === 0) {
      dateButtonsContainer.innerHTML = "<p>Không có suất chiếu nào.</p>";
      return;
    }

    showtimesByDate.forEach((d, index) => {
      const button = document.createElement("button");
      button.textContent = d.label;
      button.classList.add("selection-button", "date-button");

      button.addEventListener("click", () =>
        handleDateSelect(d.date, d.label, button)
      );

      dateButtonsContainer.appendChild(button);

      // Tự động chọn ngày đầu tiên
      if (index === 0) {
        setTimeout(() => handleDateSelect(d.date, d.label, button), 100);
      }
    });
  }

  // ------------------------------
  // Chọn ngày
  // ------------------------------
  function handleDateSelect(date, label, button) {
    selectedDate = date;
    selectedDateLabel = label;
    selectedTime = null;
    selectedShowtime = null;
    selectedSeats = [];

    // Highlight nút được chọn
    document
      .querySelectorAll(".date-button")
      .forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    // Reset giao diện
    timeButtonsContainer.innerHTML = "";
    seatContainer.style.display = "none";

    updateSummary();
    renderTimeButtons();
  }

  // ------------------------------
  // Render nút giờ theo ngày
  // ------------------------------
  function renderTimeButtons() {
    const timesForDate = showtimesGrouped[selectedDate] || [];

    if (!timesForDate.length) {
      timeButtonsContainer.innerHTML =
        "<p>Không có suất chiếu nào cho ngày này.</p>";
      return;
    }

    timesForDate.forEach((st) => {
      const button = document.createElement("button");
      button.textContent = st.time;
      button.classList.add("selection-button", "time-button");
      button.dataset.showtimeId = st.id;

      button.addEventListener("click", () => handleTimeSelect(st, button));

      timeButtonsContainer.appendChild(button);
    });
  }

  // ------------------------------
  // Chọn giờ
  // ------------------------------
  async function handleTimeSelect(showtime, button) {
    selectedTime = showtime.time;
    selectedShowtime = showtime;
    selectedSeats = [];

    // Highlight nút được chọn
    document
      .querySelectorAll(".time-button")
      .forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    // Cập nhật thông tin hiển thị
    timeDisplay.textContent = selectedTime;
    dateDisplay.textContent = selectedDateLabel;
    auditoriumDisplay.textContent = showtime.auditoriumName;
    auditoriumName.textContent = showtime.auditoriumName;

    // Hiển thị container ghế
    seatContainer.style.display = "block";

    // Tải danh sách ghế đã đặt
    try {
      const response = await fetch(
        `/api/seats/occupied-seats?showtimeId=${showtime.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const occupiedSeats = data.occupiedSeats || [];

      renderSeats(occupiedSeats);
    } catch (error) {
      console.error("Lỗi khi tải ghế:", error);
      alert("Lỗi kết nối khi tải sơ đồ ghế. Vui lòng thử lại.");
      renderSeats([]);
    }
  }

  // ------------------------------
  // Render sơ đồ ghế
  // ------------------------------
  function renderSeats(occupiedSeats) {
    seatsGrid.innerHTML = "";

    const rows = "ABCDEFGH".split("");
    const seatsPerRow = 10;

    rows.forEach((row) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("seat-row");

      // Label hàng
      const rowLabel = document.createElement("span");
      rowLabel.classList.add("row-label");
      rowLabel.textContent = row;
      rowDiv.appendChild(rowLabel);

      // Các ghế trong hàng
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatLabel = row + i;
        const seatButton = document.createElement("button");
        seatButton.textContent = i;
        seatButton.classList.add("seat-button");
        seatButton.dataset.seatLabel = seatLabel;

        // Ghế đã được đặt
        if (occupiedSeats.includes(seatLabel)) {
          seatButton.classList.add("occupied");
          seatButton.disabled = true;
        }

        seatButton.addEventListener("click", () =>
          handleSeatClick(seatButton, seatLabel)
        );

        rowDiv.appendChild(seatButton);
      }

      seatsGrid.appendChild(rowDiv);
    });

    updateSummary();
  }

  // ------------------------------
  // Chọn ghế
  // ------------------------------
  function handleSeatClick(button, seatLabel) {
    if (button.classList.contains("occupied")) {
      return; // Không cho chọn ghế đã đặt
    }

    if (selectedSeats.includes(seatLabel)) {
      // Bỏ chọn
      selectedSeats = selectedSeats.filter((s) => s !== seatLabel);
      button.classList.remove("selected");
    } else {
      // Chọn ghế
      selectedSeats.push(seatLabel);
      button.classList.add("selected");
    }

    updateSummary();
  }

  // ------------------------------
  // Cập nhật summary
  // ------------------------------
  function updateSummary() {
    const countElement = document.getElementById("count");
    const totalElement = document.getElementById("total");

    if (!countElement || !totalElement) {
      return;
    }

    const price = selectedShowtime?.price || 0;
    const total = selectedSeats.length * price;

    countElement.textContent = selectedSeats.length;
    totalElement.textContent = total.toLocaleString("vi-VN");

    // Hiển thị danh sách ghế đã chọn (nếu có element)
    const seatsList = document.getElementById("selected-seats");
    if (seatsList) {
      const seatsText = selectedSeats.length
        ? selectedSeats.join(", ")
        : "Chưa chọn ghế";
      seatsList.textContent = seatsText;
    }
  }

  // ------------------------------
  // Đặt vé
  // ------------------------------
  async function handleBook() {
    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    const total = selectedSeats.length * selectedShowtime.price;
    const confirmMessage = `Xác nhận đặt ${
      selectedSeats.length
    } ghế (${selectedSeats.join(", ")})\nTổng tiền: ${total.toLocaleString(
      "vi-VN"
    )} VNĐ`;

    const confirmBooking = window.confirm(confirmMessage);
    if (!confirmBooking) return;

    try {
      bookButton.disabled = true;
      bookButton.textContent = "Đang xử lý...";

      const response = await fetch("/api/dat-ve/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId: selectedShowtime.id,
          seats: selectedSeats,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Đặt vé thành công!\n" +
            `Ghế: ${selectedSeats.join(", ")}\n` +
            `Tổng tiền: ${total.toLocaleString("vi-VN")} VNĐ`
        );

        // Reload lại sơ đồ ghế để cập nhật trạng thái
        handleTimeSelect(
          selectedShowtime,
          document.querySelector(`[data-showtime-id="${selectedShowtime.id}"]`)
        );
      } else {
        alert("Lỗi đặt vé: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi API đặt vé:", error);
      alert("Lỗi mạng hoặc server khi thanh toán. Vui lòng thử lại.");
    } finally {
      bookButton.disabled = false;
      bookButton.textContent = "Thanh toán";
    }
  }

  bookButton.addEventListener("click", handleBook);

  // ------------------------------
  // Khởi tạo
  // ------------------------------
  renderDateButtons();
});
