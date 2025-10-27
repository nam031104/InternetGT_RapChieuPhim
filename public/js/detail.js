const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const movie = movies.find((m) => m.id == movieId);

const container = document.getElementById("movie-detail");
if (movie) {
  container.innerHTML = `
    <h1>${movie.title}</h1>
    <img src="${movie.poster}" alt="${movie.title}" class="poster">
    <p><b>Thể loại:</b> ${movie.genre}</p>
    <p><b>Thời lượng:</b> ${movie.duration} phút</p>
    <p>${movie.description}</p>
    <button onclick="goShowtime(${movie.id})">Đặt vé</button>
  `;
}

function goShowtime(id) {
  window.location.href = `showtime.html?id=${id}`;
}
