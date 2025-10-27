const listContainer = document.getElementById("movie-list");

movies.forEach((movie) => {
  const div = document.createElement("div");
  div.className = "movie-card";
  div.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p>${movie.genre}</p>
    <button onclick="viewDetail(${movie.id})">Chi tiết</button>
  `;
  listContainer.appendChild(div);
});

function viewDetail(id) {
  window.location.href = `movie-detail.html?id=${id}`;
}
