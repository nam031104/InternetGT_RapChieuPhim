document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("Movie Labels:", movieLabels);
    console.log("Movie Sales:", movieSales);

    // Kiểm tra Chart.js
    if (typeof Chart === "undefined") {
      console.error("Chart.js chưa được tải!");
      return;
    }

    // Lấy canvas
    const movieChart = document.getElementById("salesByMovieChart");
    const monthChart = document.getElementById("salesByMonthChart");

    if (!movieChart || !monthChart) {
      console.error("Không tìm thấy phần tử canvas.");
      return;
    }

    // Vẽ biểu đồ doanh số theo phim
    new Chart(movieChart, {
      type: "bar",
      data: {
        labels: movieLabels,
        datasets: [
          {
            label: "Doanh số (VNĐ)",
            data: movieSales,
            backgroundColor: [
              "rgba(75,192,192,0.6)",
              "rgba(255,159,64,0.6)",
              "rgba(153,102,255,0.6)",
              "rgba(255,99,132,0.6)",
            ],
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: "Doanh số theo Từng Phim",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString("vi-VN") + "₫";
              },
            },
          },
        },
      },
    });

    // Nếu có dữ liệu tháng, vẽ thêm biểu đồ
    if (monthLabels && monthLabels.length > 0) {
      new Chart(monthChart, {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: "Doanh số (VNĐ)",
              data: monthSales,
              borderColor: "rgba(54,162,235,0.8)",
              tension: 0.2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Xu hướng Doanh số 3 Tháng Gần nhất",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value.toLocaleString("vi-VN") + "₫",
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Lỗi render biểu đồ:", error);
  }
});
