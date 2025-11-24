import React, { useState } from 'react';

const WritingTask = ({setEssayState}) => {
  const [essay, setEssay] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa

  const handleChange = (e) => {
    const value = e.target.value;
    setEssayState(value);
    setEssay(value); // Cập nhật nội dung bài viết
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      localStorage.setItem('essay', essay); // Lưu nội dung bài viết vào localStorage
      setIsSubmitted(true); // Đánh dấu là đã gửi
      alert('Bài viết đã được gửi và lưu thành công!'); // Thông báo cho người dùng
    } else {
      alert('Bạn đã gửi bài viết này rồi!'); // Thông báo nếu đã gửi
    }
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Helvetica' }}>
      <p style={{ backgroundColor: '#ffdb39', textAlign: 'left', padding: '15px' }}>
        <span style={{ fontSize: '36px' }}>
          <strong>
            <span style={{ textDecoration: 'underline' }}>
              C. WRITING TASK 2 - 40 MINUTES
            </span>
          </strong>
        </span>
      </p>
      <p style={{ backgroundColor: '#ffdb39', textAlign: 'left', padding: '15px' }}>
        <span style={{ fontSize: '18px' }}>
          CHOOSE 1 OF THE FOLLOWING QUESTIONS TO WRITE AN ESSAY IN RESPONSE TO IT.
        </span>
      </p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            <span style={{ color: '#000080', fontSize: '24px' }}>A</span>.
          </em>
        </strong>
        <strong>
          <em>
            Many people tend to spread wrong stories about public figures and maliciously defame them over the Internet due to personal hatred or business competition. Unfortunately, the public tend to believe the information without questioning its reliability, especially when the news is negative and sensational. 
            <span style={{ color: '#ff0000' }}>
              What are the consequences of this hasty belief in fake news and suggest some possible solutions to improve the critical thinking of the mass?
            </span>
          </em>
        </strong>
        <span style={{ fontSize: '18px' }}>
          <strong>
            <em> GIVE YOUR ANSWER IN AT LEAST 250 WORDS.</em>
          </strong>
        </span>
      </p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            Nhiều người nói xấu và bôi nhọ người khác trên mạng do thù ghét hoặc cạnh tranh bẩn. Tuy nhiên, công chúng thường tin luôn những gì họ đọc, thông tin càng xấu, càng giật gân, càng dễ tin. 
            <span style={{ color: '#ff0000' }}>
              Đâu là hậu quả của việc vội vàng tin lời đồn trên mạng (không kiểm chứng lời đồn) và giải pháp để cải thiện ý thức phản biện của người dân?
            </span>
          </em>
        </strong>
      </p>

      <p style={{ backgroundColor: '#a2f9d3', textAlign: 'center' }}></p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            <span style={{ color: '#000080', fontSize: '24px' }}>B</span>.
            In many countries, certificates and degrees are relied upon to assess a teacher's competence. For instance, if someone achieves a high position in a reputable Mathematics competition, they become eligible to teach Mathematics. 
            <span style={{ color: '#ff0000' }}>
              Do you agree or disagree with this viewpoint? What attributes characterise a competent teacher?
            </span>
          </em>
        </strong>
        <span style={{ fontSize: '18px' }}>
          <strong>
            <em> GIVE YOUR ANSWER IN AT LEAST 250 WORDS.</em>
          </strong>
        </span>
      </p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            Ở nhiều nước, bằng cấp và chứng chỉ được dùng để đánh giá năng lực giáo viên. Ví dụ, nếu một người đạt giải cao trong kì thi toán có tiếng thì họ đủ điều kiện để dạy toán. 
            <span style={{ color: '#ff0000' }}>
              Em đồng ý hay không đồng ý với quan điểm này? Đâu là phẩm chất của một nhà giáo có năng lực?
            </span>
          </em>
        </strong>
      </p>

      <p style={{ backgroundColor: '#a2f9d3', textAlign: 'center' }}></p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            <span style={{ color: '#000080', fontSize: '24px' }}>C.</span>
            Many people believe there are shortcuts to success, for example winning a lottery for wealth or using tricks to excel in an IELTS exam. Others believe that everything comes at a cost, implying that success is the result of hard work.
            <span style={{ color: '#ff0000' }}>
              What is your opinion?
            </span>
          </em>
        </strong>
        <span style={{ fontSize: '18px' }}>
          <strong>
            <em> GIVE YOUR ANSWER IN AT LEAST 250 WORDS.</em>
          </strong>
        </span>
      </p>

      <p style={{ textAlign: 'justify', fontSize: '18px' }}>
        <strong>
          <em>
            Nhiều người tin là có đường tắt đến thành công, ví dụ trúng số để có tiền hoặc dùng thủ thuật để qua bài kiểm tra IELTS. Nhiều người khác nói là mọi thứ đều có giá của nó và thành công là kết quả sự chăm chỉ bền bỉ. 
            <span style={{ color: '#ff0000' }}>
              Hãy nêu quan điểm của em.
            </span>
          </em>
        </strong>
      </p>

      <p style={{ backgroundColor: '#a2f9d3', textAlign: 'center' }}></p>

      {/* Textbox for writing the essay */}
      <textarea 
        style={{ 
          width: '100%', 
          height: '200px', 
          marginTop: '20px', 
          padding: '10px', 
          fontSize: '16px', 
          borderRadius: '4px', 
          border: '1px solid #ccc' 
        }} 
        placeholder="Write your essay here..."
        value={essay}
        onChange={handleChange}
      />

      {/* Nút Submit */}
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
    </div>
  );
};

export default WritingTask;