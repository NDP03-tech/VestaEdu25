import React, { useState, useEffect } from 'react';

const SpeakingComponent = ({ setVideoUrl }) => {
  const [videoUrl, setVideoUrlState] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa

  useEffect(() => {
    // Tải video URL từ localStorage khi component được khởi tạo
    const storedUrl = localStorage.getItem('videoUrl');
    if (storedUrl) {
      setVideoUrlState(storedUrl);
      setVideoUrl(storedUrl); // Cập nhật URL từ localStorage
    }
  }, [setVideoUrl]);

  const handleChange = (e) => {
    const url = e.target.value;
    setVideoUrlState(url);
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      localStorage.setItem('videoUrl', videoUrl); // Lưu URL vào localStorage
      setVideoUrl(videoUrl); // Gọi hàm truyền từ component cha để cập nhật URL
      setIsSubmitted(true); // Đánh dấu là đã gửi
      alert('Video URL đã được gửi và lưu thành công!'); // Thông báo cho người dùng
    } else {
      alert('Bạn đã gửi URL video này rồi!'); // Thông báo nếu đã gửi
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Helvetica' }}>
      <p style={{ backgroundColor: '#ffdb39', textAlign: 'left', padding: '15px' }}>
        <span style={{ color: '#000000', fontSize: '36px', fontFamily: 'Gill Sans' }}>
          <strong>
            D. SPEAKING: Record a video of yourself answering the following question in 2 minutes, upload it and paste the link to your video below.
          </strong>
        </span>
      </p>
      <hr style={{ height: '2px', borderWidth: 0, color: 'gray', backgroundColor: 'gray' }} />
      <p style={{ backgroundColor: '#fff8dc', textAlign: 'left', padding: '15px' }}>
        <strong>
          <span style={{ color: '#333333', fontSize: '24px', fontFamily: 'Georgia' }}>
            <em>
              Chọn một phương châm sống sau đây và kể một câu chuyện đã xảy ra với em mà em thấy đúng với phương châm đó.
            </em>
          </span>
        </strong>
      </p>
      <p style={{ backgroundColor: '#fff8dc', textAlign: 'left', padding: '15px' }}>
        <strong>
          <span style={{ color: '#333333', fontSize: '24px', fontFamily: 'Georgia' }}>
            <em>
              Ghi hình em nói trong 2 phút, upload link ở ô trống bên dưới.
            </em>
          </span>
        </strong>
      </p>
      <p style={{ backgroundColor: '#fff8dc', textAlign: 'left', padding: '15px' }}>
  <strong>
    <span style={{ color: '#333333', fontSize: '24px', fontFamily: 'Georgia' }}>
      <em>
        Chọn một phương châm sống sau đây và kể một câu chuyện đã xảy ra với em mà em thấy đúng với phương châm đó:
      </em>
    </span>
  </strong>
  <ol style={{ marginTop: '10px', fontSize: '20px', fontFamily: 'Georgia', color: '#555' }}>
    <li><strong>"Success is earned through sweat and persistence."</strong> - Thành công được kiếm bằng mồ hôi và sự kiên trì.</li>
    <li><strong>"Work hard today for a better tomorrow."</strong> - Làm việc chăm chỉ hôm nay để có ngày mai tốt đẹp hơn.</li>
    <li><strong>"No shortcuts, just hard work."</strong> - Không có lối tắt, chỉ có làm việc chăm chỉ.</li>
    <li><strong>"Dream big, work harder."</strong> - Mơ lớn, làm việc chăm chỉ hơn.</li>
    <li><strong>"Effort today, pride forever."</strong> - Nỗ lực hôm nay, tự hào mãi mãi.</li>
  </ol>
</p>

      <hr style={{ height: '2px', borderWidth: 0, color: 'gray', backgroundColor: 'gray' }} />
      <p style={{ fontSize: '20px', color: '#333333' }}>
        <strong>Paste your video URL here:</strong>
        <input 
          type="text" 
          value={videoUrl} 
          onChange={handleChange} 
          placeholder="Enter video URL" 
          style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
      </p>
      <button 
        onClick={handleSubmit} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 15px', 
          backgroundColor: isSubmitted ? '#ccc' : '#007bff', // Đổi màu nếu đã gửi
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isSubmitted ? 'not-allowed' : 'pointer', // Thay đổi con trỏ nếu đã gửi
          pointerEvents: isSubmitted ? 'none' : 'auto' // Ngăn chặn sự kiện nhấp nếu đã gửi
        }}
        disabled={isSubmitted} // Vô hiệu hóa nút nếu đã gửi
      >
        Submit
      </button>
      <p>
        <span style={{ fontSize: '18px', color: '#800000' }}>
          <strong>
            HAVE YOU LEFT YOUR EMAIL ADDRESS TO RECEIVE THE RESULT? IF NOT, PLEASE CONFIRM YOUR EMAIL BELOW.
          </strong>
        </span>
      </p>
    </div>
  );
};

export default SpeakingComponent;