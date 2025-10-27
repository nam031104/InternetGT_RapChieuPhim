const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const showtimes = [
  { id: 1, movieId: 1, time: "10:00", date: "2025-10-18" },
  { id: 2, movieId: 1, time: "14:30", date: "2025-10-18" },
  { id: 3, movieId: 2, time: "19:00", date: "2025-10-19" },
];

const list = document.getElementById("showtime");
const filtered = showtimes.filter((s) => s.movieId == movieId);

list.innerHTML = `<h2>Chọn suất chiếu</h2>`;
filtered.forEach((s) => {
  const btn = document.createElement("button");
  btn.textContent = `${s.date} - ${s.time}`;
  btn.onclick = () => (window.location.href = `booking.html?showId=${s.id}`);
  list.appendChild(btn);
});
