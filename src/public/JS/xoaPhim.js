// public/js/movieDelete.js

document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút có class 'delete-btn'
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const movieId = e.currentTarget.dataset.id;
            const movieName = e.currentTarget.dataset.name;

            // 1. Xác nhận trước khi xóa
            if (!confirm(`Bạn có chắc chắn muốn xóa phim "${movieName}" (ID: ${movieId})? Hành động này không thể hoàn tác.`)) {
                return; // Ngừng nếu người dùng hủy
            }

            try {
                // 2. Gửi yêu cầu DELETE đến server (endpoint: /movies/:id)
                const response = await fetch(`/employee/xoaPhim/${movieId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // 3. Xử lý phản hồi từ server (JSON)
                const result = await response.json();

                if (response.ok && result.success) { // Kiểm tra cả status HTTP và success flag
                    alert(result.message);
                    
                    // 4. Xóa dòng khỏi bảng (cập nhật giao diện)
                    const rowToRemove = document.getElementById(`movie-row-${movieId}`);
                    if (rowToRemove) {
                        rowToRemove.style.backgroundColor = '#fce4e4'; // Đánh dấu đã xóa
                        rowToRemove.style.transition = 'opacity 0.5s';
                        rowToRemove.style.opacity = '0';
                        setTimeout(() => rowToRemove.remove(), 500); // Xóa hẳn sau 0.5s
                    }
                } else {
                    // Xử lý lỗi (bao gồm lỗi 404, 400, 500)
                    alert(`Lỗi xóa: ${result.message}`);
                }

            } catch (error) {
                console.error('Lỗi khi gửi yêu cầu xóa:', error);
                alert('Có lỗi xảy ra trong quá trình kết nối đến server. Vui lòng thử lại.');
            }
        });
    });
});