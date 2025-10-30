const chuyenSangChiTietS = document.querySelectorAll(".movie-card");
for (let chuyenSangChiTiet of chuyenSangChiTietS) {
  chuyenSangChiTiet.addEventListener("click", () => {
    let name = chuyenSangChiTiet.getAttribute("ten-phim");
    window.location.href = `../chiTietPhim/${encodeURIComponent(name)}`;
  });
}
console.log(chuyenSangChiTietS.length);
