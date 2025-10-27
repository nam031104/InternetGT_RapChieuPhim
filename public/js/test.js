const url = "http://localhost:3000/data";
async function getPhim() {
  const response = await fetch(url);
  const phim = await response.json();
  //console.log(phim);
  const danhSach = document.getElementById("phim");
  for (let movie of phim) {
    let div = document.createElement("div");
    div.className = "movie_card";
    div.innerHTML = `
    <h3>${movie.TenPhim} </h3>
    <p>${movie.TheLoai} </p>
    `;
    danhSach.appendChild(div);
  }
}
getPhim();

// const response = fetch(url);
// const phim = response.json();
// const danhSach = document.getElementById("phim");
// for (let movie of phim) {
//   let div = document.createElement("div");
//   div.className = "movie_card";
//   div.innerHTML = `
//     <h3>${movie.TenPhim} </h3>
//     <p>${movie.TheLoai} </p>
//     `;
//   danhSach.appendChild(div);
// }

const danhSachPhim = document.getElementById("phimDangChieu");
for (let movie of movies) {
  let div = document.createElement("div");
  div.className = "movie_card";
  div.setAttribute("tenPhim", movie.title);
  div.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title} </h3>
    <p>${movie.genre} </p>
    `;
  danhSachPhim.appendChild(div);
}

// /* làm tương tự với phim sắp chiếu */

const danhSachPhimSapChieu = document.getElementById("phimSapChieu");
for (let movie of movies) {
  let div = document.createElement("div");
  div.className = "movie_card";
  div.setAttribute("tenPhim", movie.title);
  div.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title} </h3>
    <p>${movie.genre} </p>
    `;
  danhSachPhimSapChieu.appendChild(div);
}

const quangCao = document.getElementById("quangCaoUl");
for (let movie of movies) {
  let li = document.createElement("ol");
  li.className = "danhSachQuangCao";
  li.style.zIndex = movie.id + 100;
  li.innerHTML = `<img src="${movie.poster}">`;
  quangCao.appendChild(li);
}

const danhSachQuangCao = document.querySelectorAll(".danhSachQuangCao");
let index2 = 0;
updateGd();
const nutTruoc = document.getElementById("nutTruoc");
const nutSau = document.getElementById("nutSau");
nutTruoc.addEventListener("click", () => {
  if (index2 > 0) index2--;
  updateGd();
});

nutSau.addEventListener("click", () => {
  if (index2 < danhSachQuangCao.length - 1) index2++;
  updateGd();
});

function updateGd() {
  for (let a of danhSachQuangCao) {
    a.style.visibility = "hidden";
  }
  danhSachQuangCao[index2].style.visibility = "visible";
}

console.log(danhSachQuangCao);

const chuyenSangChiTietS = document.querySelectorAll(".movie_card");
for (let chuyenSangChiTiet of chuyenSangChiTietS) {
  chuyenSangChiTiet.addEventListener("click", () => {
    let name = chuyenSangChiTiet.getAttribute("tenPhim");
    window.location.href = `../chiTietPhim/${name}`;
  });
}
