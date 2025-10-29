document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dateButtonsContainer = document.getElementById('date-buttons');
    const timeButtonsContainer = document.getElementById('time-buttons');
    const seatContainer = document.getElementById('seat-container');
    const seatsGrid = document.getElementById('seats-grid');
    const countDisplay = document.getElementById('count');
    const totalDisplay = document.getElementById('total');
    const bookButton = document.getElementById('book-button');
    const timeDisplay = document.getElementById('selected-time-display');
    const dateDisplay = document.getElementById('selected-date-display');
    const pricePerSeatDisplay = document.getElementById('price-per-seat');

    
    const SEAT_PRICE = 360000; 
    const NUM_ROWS = 10;
    const NUM_COLS = 10;
    const SEAT_LABELS = 'ABCDEFGHIJ';

   
    let selectedDate = null;
    let selectedTime = null;
    let selectedDateLabel = null;
    let selectedSeats = [];

   
    pricePerSeatDisplay.textContent = SEAT_PRICE.toLocaleString('vi-VN');

   
    const mockShowtimes = {
       
        '2025-10-25_10:00': ['A1', 'B2', 'C3', 'D4', 'E5'],
        '2025-10-25_14:30': ['A2', 'A3', 'C7', 'D10', 'J1'],
        '2025-10-25_18:00': ['B5', 'B6', 'B7', 'E1', 'E2', 'E3', 'F4'],
        '2025-10-25_21:00': ['H5', 'H6', 'I7', 'J8'],
        
        '2025-10-26_10:00': ['A1', 'B1', 'C1', 'D1'],
        '2025-10-26_14:30': ['H1', 'H2', 'H3', 'I9', 'I10'],
        '2025-10-26_18:00': ['C10', 'D9', 'E8', 'F7'],
        '2025-10-26_21:00': ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2'],

        '2025-10-27_10:00': ['C1', 'C2', 'D1', 'D2', 'E1'],
        '2025-10-27_14:30': ['F5', 'G6', 'H7', 'I8', 'J9'],
        '2025-10-27_18:00': ['A10', 'B9', 'C8', 'D7', 'E6'],
        '2025-10-27_21:00': ['B3', 'B4', 'C4', 'C5', 'D5', 'D6'],
    };

    const allShowTimes = [
        { date: '2025-10-25', label: 'Hôm nay (4/11)' },
        { date: '2025-10-26', label: 'Ngày mai (5/11)' },
        { date: '2025-10-27', label: ' (6/11)' }
    ];
    const availableTimes = ['10:00', '14:30', '18:00', '21:00'];
    
    

    function renderDateButtons() {
        dateButtonsContainer.innerHTML = '';
        allShowTimes.forEach(showtime => {
            const button = document.createElement('button');
            button.classList.add('selection-button', 'date-button');
            button.textContent = showtime.label;
            button.dataset.date = showtime.date;
            button.addEventListener('click', () => handleDateSelect(showtime.date, showtime.label, button));
            dateButtonsContainer.appendChild(button);
        });
    }

    function handleDateSelect(date, label, button) {
        
        document.querySelectorAll('.date-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        
        selectedDate = date;
        selectedDateLabel = label;
        selectedTime = null; 
        
        
        document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
        
        seatContainer.style.display = 'none'; 
        renderTimeButtons();
    }

    function renderTimeButtons() {
        timeButtonsContainer.innerHTML = '';
        availableTimes.forEach(time => {
            const button = document.createElement('button');
            button.classList.add('selection-button', 'time-button');
            button.textContent = time;
            button.dataset.time = time;
            button.addEventListener('click', () => handleTimeSelect(time, button));
            timeButtonsContainer.appendChild(button);
        });
    }

    function handleTimeSelect(time, button) {
        if (!selectedDate) {
            alert('Vui lòng chọn ngày chiếu trước.');
            return;
        }

        
        document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        selectedTime = time;
        
        const showtimeKey = `${selectedDate}_${selectedTime}`;
        const occupiedSeats = mockShowtimes[showtimeKey] || [];

        
        timeDisplay.textContent = selectedTime;
        dateDisplay.textContent = selectedDateLabel;
        seatContainer.style.display = 'block';
        renderSeats(occupiedSeats);
    }

    

    function renderSeats(occupiedSeats) {
        seatsGrid.innerHTML = '';
        selectedSeats = []; 
        seatsGrid.style.gridTemplateColumns = `repeat(${NUM_COLS}, 1fr)`;
        
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                const seatLabel = SEAT_LABELS[r] + (c + 1);
                const seat = document.createElement('div');
                seat.classList.add('seat');
                seat.dataset.seatId = seatLabel;
                seat.textContent = seatLabel;
                
                if (occupiedSeats.includes(seatLabel)) {
                    seat.classList.add('occupied');
                }

                seat.addEventListener('click', handleSeatClick);
                seatsGrid.appendChild(seat);
            }
        }
        updateSummary();
    }

    function handleSeatClick(e) {
        const seat = e.target;
        
        if (seat.classList.contains('occupied')) {
            
            console.log('Ghế này đã có người đặt!'); 
            return;
        }

        seat.classList.toggle('selected');
        updateSummary();
    }

    function updateSummary() {
        const currentlySelectedSeats = document.querySelectorAll('.seat.selected');
        
        selectedSeats = Array.from(currentlySelectedSeats).map(seat => seat.dataset.seatId);
        
        const count = selectedSeats.length;
        const total = count * SEAT_PRICE;

        countDisplay.textContent = count;
        totalDisplay.textContent = total.toLocaleString('vi-VN');
    }

    function handleBook() {
        if (!selectedDate || !selectedTime) {
            
            console.log('Vui lòng chọn Ngày và Giờ chiếu trước khi thanh toán.');
            return;
        }
        if (selectedSeats.length === 0) {
            console.log('Vui lòng chọn ít nhất một ghế.');
            return;
        }

        const confirmation = window.confirm(
            `Xác nhận đặt ${selectedSeats.length} ghế (${selectedSeats.join(', ')}) cho suất ${selectedTime}, ${selectedDateLabel} với tổng số tiền ${totalDisplay.textContent} VNĐ?`
        );

        if (confirmation) {
            console.log('Đã đặt vé thành công! (Chuyển sang xử lý thanh toán thực tế...)');
            
            
            document.querySelectorAll('.seat.selected').forEach(seat => {
                seat.classList.remove('selected');
                seat.classList.add('occupied');
            });
            
            selectedSeats = [];
            updateSummary();
        }
    }
    
    bookButton.addEventListener('click', handleBook);

    
    renderDateButtons();
});
