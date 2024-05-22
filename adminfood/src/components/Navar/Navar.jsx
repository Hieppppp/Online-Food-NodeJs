import React, { useEffect, useState } from 'react';

const Navar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());//hookUseState để khởi tạo state

    //useEffect để thực thi hàm effect
    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());//cập nhập giá trị của currentTime với time hiện tại
        }, 1000);

        return () => clearInterval(timerID);
    }, []);

    const getWeekday = (date) => {
        const weekday = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        return weekday[date.getDay()];
    };

    const myMonth = (date) => {
        const monthday = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        return monthday[date.getMonth()];
    };

    //Hàm đối tượng Date trả về  1 chuỗi biểu diễn cho thời gian theo định dạng, thứ, ngày/thắng/năm giờ:phút:giây
    const formatTime = (date) => {
        const dayOfWeek = getWeekday(date);
        const dayOfMonth = date.getDate();
        const month = myMonth(date);
        const year = date.getFullYear();
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${dayOfWeek}, ${dayOfMonth}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div>
            <div className='top'>
                <h3>Chào mừng Vũ Văn Hiệp...</h3>
                <div style={{marginRight:'20px'}}>
                    {formatTime(currentTime)}
                </div>
            </div>
        </div>
    );
};

export default Navar;
