const seatContainer = document.getElementById("seat-container");
const rows = 5,
  cols = 8;
const selected = [];

function renderSeats() {
  let html = `<h2>Chọn ghế</h2><div class='seats'>`;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const seatId = `${r}${String.fromCharCode(64 + c)}`;
      html += `<button class="seat" id="${seatId}" onclick="toggleSeat('${seatId}')">${seatId}</button>`;
    }
    html += "<br>";
  }
  html += `</div><button onclick="confirmBooking()">Xác nhận</button>`;
  seatContainer.innerHTML = html;
}

function toggleSeat(id) {
  const idx = selected.indexOf(id);
  if (idx === -1) selected.push(id);
  else selected.splice(idx, 1);
  document.getElementById(id).classList.toggle("selected");
}

function confirmBooking() {
  if (selected.length === 0) alert("Vui lòng chọn ít nhất 1 ghế!");
  else alert(`Bạn đã đặt ${selected.join(", ")}`);
}

renderSeats();
