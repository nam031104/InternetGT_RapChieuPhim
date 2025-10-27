//test DB
// const { connectDB } = require("../../config/db");

// connectDB();

// const pool = connectDB();
// const phim = pool.request().query("SELECT * FROM Phim");

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
  div.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title} </h3>
    <p>${movie.genre} </p>
    `;
  danhSachPhim.appendChild(div);
}

/* tạo cuộn tự động cho phim đang chiếu*/
// const track = document.getElementById("phimDangChieu");
// const posters = track.querySelectorAll(".movie_card");
// const posterWidth = posters[0].offsetWidth + 5;
// const maxScroll = track.scrollWidth - track.clientWidth;
// let index = 0;

// setInterval(function () {
//   index++;

//   const newScrollLeft = index * posterWidth;

//   if (newScrollLeft >= maxScroll) {
//     index = 0;
//     track.scrollTo({ left: 0, behavior: "smooth" });
//   } else {
//     track.scrollTo({ left: newScrollLeft, behavior: "smooth" });
//   }
// }, 3110);

// /* làm tương tự với phim sắp chiếu */

const danhSachPhimSapChieu = document.getElementById("phimSapChieu");
for (let movie of movies) {
  let div = document.createElement("div");
  div.className = "movie_card1";
  div.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title} </h3>
    <p>${movie.genre} </p>
    `;
  danhSachPhimSapChieu.appendChild(div);
}

// /* tạo cuộn tự động cho phim đang chiếu*/
// const track1 = document.getElementById("phimSapChieu");
// const posters1 = track1.querySelectorAll(".movie_card1");
// const posterWidth1 = posters1[0].offsetWidth + 5;
// const maxScroll1 = track1.scrollWidth - track1.clientWidth;
// let index1 = 0;

// setInterval(function () {
//   index1++;

//   const newScrollLeft1 = index * posterWidth1;

//   if (newScrollLeft1 >= maxScroll1) {
//     index = 0;
//     track1.scrollTo({ left: 0, behavior: "smooth" });
//   } else {
//     track1.scrollTo({ left: newScrollLeft1, behavior: "smooth" });
//   }
// }, 3110);

// console.log("scrollWidth:", track.scrollWidth);
// console.log("clientWidth:", track.clientWidth);
// console.log("chieudai1the", posters1[5].offsetWidth);

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
