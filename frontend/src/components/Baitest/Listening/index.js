
import React, { useState } from 'react';

import image from "./image.png";
const Listening = ({ setBandScore }) => {
  
  const [answers, setAnswers] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
    16: '',
    17: '',
    18: '',
    19: '',
    20: '',
    21: '',
    22: '',
    23: '',
    24: '',
    25: '',
    26: '',
    27: '',
    28: '',
    29: '',
    30: '',
    31: '',
    32: '',
    33: '',
    34: '',
    35: '',
    36: '',
    37: '',
    38: '',
    39: '',
    40: '',
  });

  const correctAnswers = {
    1: 'Carousel',
    2: ['clear tables','clear the tables'],
    3: 'Waiting staff',
    4: ["Millerby’s department","Millerby","Millerby's"],
    5: ['bake cakes','bake the cakes'],
    6: 'Food taster',
    7: '15.30',
    8: 'label',
    9: ["extra pay","1-week's wages","one-week's wages"],
    10: 'manage customer database',
    11: 'H',
    12: 'G',
    13: 'C',
    14: 'E',
    15: 'D',
    16: 'B',
    17: 'C',
    18: 'F',
    19: 'B',
    20: 'A',
    21: ['D', 'E'],
    22: ['D', 'E'],
    23:['A good mood','good mood'],
    24:['shared hate','hate'],
    25:'B',
    26:'D',
    27:'A',
    28:'B',
    29:'C',
    30:'D',
    31:['E','C'],
    32:['E','C'],
    33:'goals',
    34:'revised',
    36:['key decision makers','decision makers','decision-makers','key decision-makers'],
    35:'a planning team',
    37:'individuals',
    38:'past',
    39:'predict',
    40:'exciting',
  };
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa
  const calculateBandScore = (score) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 20) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 7) return 3.5;
    if (score >= 5) return 3.0;
    if (score >= 3) return 2.5;
    return 0;
  };

  const checkAnswers = () => {
    let newScore = 0;

    // Tính điểm cho các câu 21 và 22
    const userAnswer21 = answers[21]?.toUpperCase();
    const userAnswer22 = answers[22]?.toUpperCase();
    // Kiểm tra điều kiện cho câu 21 và 22
    if ((userAnswer21 === 'D' && userAnswer22 === 'E') || (userAnswer21 === 'E' && userAnswer22 === 'D')) {
      newScore += 2;
    } else if (userAnswer21 === userAnswer22 && (userAnswer21 === 'D' || userAnswer21 === 'E')) {
      newScore += 1;
    } else {
      if (userAnswer21 === 'D') newScore++;
      if (userAnswer21 === 'E') newScore++;
      if (userAnswer22 === 'D') newScore++;
      if (userAnswer22 === 'E') newScore++;
    }

    // Tính điểm cho các câu 31 và 32
    const userAnswer31 = answers[31]?.toUpperCase();
    const userAnswer32 = answers[32]?.toUpperCase();
    if ((userAnswer31 === 'C' && userAnswer32 === 'E') || (userAnswer31 === 'E' && userAnswer32 === 'C')) {
      newScore += 2;
    } else if (userAnswer31 === userAnswer32 && (userAnswer31 === 'D' || userAnswer31 === 'E')) {
      newScore += 1;
    } else {
      if (userAnswer31 === 'C') newScore++;
      if (userAnswer31 === 'E') newScore++;
      if (userAnswer32 === 'C') newScore++;
      if (userAnswer32 === 'E') newScore++;
    }

    // Kiểm tra các câu hỏi từ 1 đến 20, từ 23 đến 30, và từ 33 đến 40
    for (let i = 1; i <= 40; i++) {
      if (i === 21 || i === 22 || i === 31 || i === 32) continue;

      if (correctAnswers[i]) {
        if (typeof correctAnswers[i] === 'string' && correctAnswers[i].toLowerCase() === answers[i]?.toLowerCase()) {
          newScore++;
        } else if (Array.isArray(correctAnswers[i]) && correctAnswers[i].some(ans => ans.toLowerCase() === answers[i]?.toLowerCase())) {
          newScore++;
        }
      }
    }

    const bandScore = calculateBandScore(newScore); // Tính band điểm từ số câu đúng
    setBandScore(bandScore); // Lưu band điểm
    localStorage.setItem('listeningScore', newScore); // Lưu điểm vào localStorage
    setIsSubmitted(true); // Đánh dấu là đã gửi
  };

  return (
    <div className="App container mt-5">
  
      <p className="bg-warning text-center font-weight-bold" style={{ fontSize: '36px', textDecoration: 'underline' }}>
        A. LISTENING - 25-30 MINUTES
      </p>
  
      <iframe 
        src="https://drive.google.com/file/d/1aldhZwPVmcNq7a-uS5_FWYzOlmi_UWiS/preview" 
        width="600" 
        height="50" 
        title="Listening Audio" 
        className="w-100 mb-4"
      ></iframe>
  
      <p><strong>SECTION 1</strong></p>
      <p><em>Questions 1-10: Complete the table below. Write NO MORE THAN TWO WORDS for each answer.</em></p>
  
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>JOB</th>
            <th>EMPLOYER</th>
            <th>WORK DAYS</th>
            <th>DUTIES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kitchen assistant</td>
            <td>The (<strong>1</strong>) <input type="text" value={answers[1]} onChange={(e) => setAnswers({ ...answers, 1: e.target.value })} /> Cafe</td>
            <td>Weekends</td>
            <td>(<strong>2</strong>) <input type="text" value={answers[2]} onChange={(e) => setAnswers({ ...answers, 2: e.target.value })} />, Wash dishes</td>
          </tr>
          <tr>
            <td>(<strong>3</strong>) <input type="text" value={answers[3]} onChange={(e) => setAnswers({ ...answers, 3: e.target.value })} /></td>
            <td>Bellamy’s Restaurant</td>
            <td>Thursday and Friday evening</td>
            <td>Serve customers, wipe tables</td>
          </tr>
          <tr>
            <td>Barista</td>
            <td>(<strong>4</strong>) <input type="text" value={answers[4]} onChange={(e) => setAnswers({ ...answers, 4: e.target.value })} /> store</td>
            <td>Saturday</td>
            <td>Prepare drinks, (<strong>5</strong>) <input type="text" value={answers[5]} onChange={(e) => setAnswers({ ...answers, 5: e.target.value })} /></td>
          </tr>
        </tbody>
      </table>
  
      <p>
        <strong><em>Questions 6–10:</em></strong> 
        <strong><em>Answer the questions below.</em></strong> 
        <strong><em>Write NO MORE THAN THREE WORDS AND/OR NUMBERS for each answer.</em></strong>
      </p>
  
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Position</th>
            <th>Duties</th>
            <th>Pay</th>
            <th>Other benefits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>6</strong>. <input type="text" value={answers[6]} onChange={(e) => setAnswers({ ...answers, 6: e.target.value })} /></td>
            <td>Check food quality</td>
            <td><strong>7</strong>. £<input type="text" value={answers[7]} onChange={(e) => setAnswers({ ...answers, 7: e.target.value })} /> an hour</td>
            <td>Recipe creation</td>
          </tr>
          <tr>
            <td>Food packer</td>
            <td>Pack and <strong>8</strong>. <input type="text" value={answers[8]} onChange={(e) => setAnswers({ ...answers, 8: e.target.value })} /> label boxes</td>
            <td>£8.45 an hour</td>
            <td><strong>9</strong>. <input type="text" value={answers[9]} onChange={(e) => setAnswers({ ...answers, 9: e.target.value })} /> at the end of summer</td>
          </tr>
          <tr>
            <td>Office assistant</td>
            <td>Type reports, <strong>10</strong>. <input type="text" value={answers[10]} onChange={(e) => setAnswers({ ...answers, 10: e.target.value })} />.</td>
            <td>£12.50 an hour</td>
            <td>receive health and safety training</td>
          </tr>
        </tbody>
      </table>
  
      <p><strong>SECTION 2</strong></p>
      <p><em>Questions 11-16: Label the map below. Write the correct letter A–I, next to the questions.</em></p>
  
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td valign="top" width="50%">
              <p>A gift shop</p>
              <p>B café</p>
              <p>C visitor centre</p>
              <p>D cave</p>
              <p>E decorated walls</p>
              <p>F information desk</p>
              <p>G cloakroom</p>
              <p>H volcanic rocks</p>
              <p>I temporary exhibition room</p>
              <p>
                11. <input type="text" value={answers[11]} onChange={(e) => setAnswers({ ...answers, 11: e.target.value })} />
                <br />
                12. <input type="text" value={answers[12]} onChange={(e) => setAnswers({ ...answers, 12: e.target.value })} />
                <br />
                13. <input type="text" value={answers[13]} onChange={(e) => setAnswers({ ...answers, 13: e.target.value })} />
                <br />
                14. <input type="text" value={answers[14]} onChange={(e) => setAnswers({ ...answers, 14: e.target.value })} />
                <br />
                15. <input type="text" value={answers[15]} onChange={(e) => setAnswers({ ...answers, 15: e.target.value })} />
                <br />
                16. <input type="text" value={answers[16]} onChange={(e) => setAnswers({ ...answers, 16: e.target.value })} />
              </p>
            </td>
            <td valign="top" width="50%">
              <img src={image} alt="Map" className="img-fluid" />
            </td>
          </tr>
        </tbody>
      </table>
  
      <p><strong>Questions 17–20: How does the speaker describe the purpose of each of the following areas? Write the correct letter, A–F next to the questions.</strong></p>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td valign="top" width="50%">
              <p>17. the north face <input type="text" value={answers[17]} onChange={(e) => setAnswers({ ...answers, 17: e.target.value })} /></p>
              <p>18. the south side <input type="text" value={answers[18]} onChange={(e) => setAnswers({ ...answers, 18: e.target.value })} /></p>
              <p>19. the central area <input type="text" value={answers[19]} onChange={(e) => setAnswers({ ...answers, 19: e.target.value })} /></p>
              <p>20. the top floor <input type="text" value={answers[20]} onChange={(e) => setAnswers({ ...answers, 20: e.target.value })} /></p>
            </td>
            <td valign="top" width="50%">
              <p>Purpose</p>
              <p>A to bring people together</p>
              <p>B to celebrate independence</p>
              <p>C to reflect nature</p>
              <p>D to represent the native culture</p>
              <p>E to provide views of the city</p>
              <p>F to symbolize what more recent arrivals offer</p>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p><strong>Questions 21–22: What TWO things does David say are necessary for early friendships to form?</strong></p>
      <p>
        ANSWER: <input type="text" value={answers[21]} onChange={(e) => setAnswers({ ...answers, 21: e.target.value })} /> and 
        <input type="text" value={answers[22]} onChange={(e) => setAnswers({ ...answers, 22: e.target.value })} />
      </p>
      <p>A being a similar age</p>
      <p>B accessing means of communication</p>
      <p>C having common hobbies</p>
      <p>D sharing a physical environment</p>
      <p>E spending sufficient time together</p>
  
      <p><strong>Questions 23–30: Write NO MORE THAN THREE WORDS AND/OR NUMBERS for each answer.</strong></p>
      <p>
        23. What do people who easily become friends usually associate with their first meeting? 
        <input type="text" value={answers[23]} onChange={(e) => setAnswers({ ...answers, 23: e.target.value })} />
      </p>
      <p>
        24. What negative emotion can bring people together? 
        <input type="text" value={answers[24]} onChange={(e) => setAnswers({ ...answers, 24: e.target.value })} />
      </p>
  
      <p><strong>Questions 25–30: Choose the correct letter A–D.</strong></p>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td valign="top" width="50%">
              <p>25. There are three stages of making friends. These stages depend on 
                <input type="text" value={answers[25]} onChange={(e) => setAnswers({ ...answers, 25: e.target.value })} />
              </p>
              <p>A doing things together</p>
              <p>B the age of the children</p>
              <p>C wanting someone to play with</p>
              <p>D getting to know each other</p>
  
              <p>27. The most important factor at stage 3 is 
                <input type="text" value={answers[27]} onChange={(e) => setAnswers({ ...answers, 27: e.target.value })} />
              </p>
              <p>A loyalty</p>
              <p>B getting into trouble at school.</p>
              <p>C testing out different people</p>
              <p>D jealousy</p>
  
              <p>29. What does David think people change when they are friends? 
                <input type="text" value={answers[29]} onChange={(e) => setAnswers({ ...answers, 29: e.target.value })} />
              </p>
              <p>A the way they look</p>
              <p>B the things they do</p>
              <p>C the way they behave</p>
              <p>D talk about their behaviours</p>
            </td>
            <td valign="top" width="50%">
              <p>26. Around the age of eight to ten kids begin to 
                <input type="text" value={answers[26]} onChange={(e) => setAnswers({ ...answers, 26: e.target.value })} />
              </p>
              <p>A hang out late in the evening</p>
              <p>B stay at their friend's house</p>
              <p>C have a best friend</p>
              <p>D trust each other</p>
  
              <p>28. David thinks that both he and Maria are 
                <input type="text" value={answers[28]} onChange={(e) => setAnswers({ ...answers, 28: e.target.value })} />
              </p>
              <p>A super trendy</p>
              <p>B a bit geeky</p>
              <p>C similar in age</p>
              <p>D awkward</p>
  
              <p>30. According to Maria, what do people look for in a friend? 
                <input type="text" value={answers[30]} onChange={(e) => setAnswers({ ...answers, 30: e.target.value })} />
              </p>
              <p>A the friend’s social status</p>
              <p>B what they look like</p>
              <p>C someone with a sense of humour</p>
              <p>D possessing similar values</p>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p><strong>Questions 31–32: What are the TWO main concerns of an urban planner?</strong></p>
      <p>
        ANSWER: <input type="text" value={answers[31]} onChange={(e) => setAnswers({ ...answers, 31: e.target.value })} /> and 
        <input type="text" value={answers[32]} onChange={(e) => setAnswers({ ...answers, 32: e.target.value })} />
      </p>
      <p>A available time</p>
      <p>B city residents</p>
      <p>C function</p>
      <p>D budget</p>
      <p>E appearance</p>
  
      <p><strong>Questions 33–36: Complete the flow chart with NO MORE THAN THREE WORDS for each answer</strong></p>
      <div className="flow-chart">
        <p>The vision is identified and 33.<input type="text" value={answers[33]} onChange={(e) => setAnswers({ ...answers, 33: e.target.value })} /> are selected.</p>
        <div className="arrow">↓</div>
        <p>Data is gathered and interpreted. The first draft of the plan is written and then 34. <input type="text" value={answers[34]} onChange={(e) => setAnswers({ ...answers, 34: e.target.value })} />.</p>
        <div className="arrow">↓</div>
        <p>Draft 2 is presented to 35.<input type="text" value={answers[35]} onChange={(e) => setAnswers({ ...answers, 35: e.target.value })} />.</p>
        <div className="arrow">↓</div>
        <p>Residents voice their opinions at a consultation meeting.</p>
        <div className="arrow">↓</div>
        <p>The final draft is written and presented to 36. <input type="text" value={answers[36]} onChange={(e) => setAnswers({ ...answers, 36: e.target.value })} /> at the city council.</p>
      </div>
  
      <p><strong>Questions 37–40: Complete the summary below. Write NO MORE THAN ONE WORD for each answer.</strong></p>
      <p>Urban planning can be difficult for three key reasons.</p>
      <p>The first is that much of a town or city belongs to 37. <input type="text" value={answers[37]} onChange={(e) => setAnswers({ ...answers, 37: e.target.value })} /> and not local government, taking control out of their hands.</p>
      <p>The second issue is the impact of 38.<input type="text" value={answers[38]} onChange={(e) => setAnswers({ ...answers, 38: e.target.value })} /> planning decisions, such as roads which are too narrow for today's cars.</p>
      <p>Finally, a planner has to 39.<input type="text" value={answers[39]} onChange={(e) => setAnswers({ ...answers, 39: e.target.value })} /> the needs of a future population.</p>
      <p>So, although being a planner can be 40.<input type="text" value={answers[40]} onChange={(e) => setAnswers({ ...answers, 40: e.target.value })} />, it is also very challenging.</p>
      
      <button 
    onClick={checkAnswers} 
    disabled={isSubmitted} // Vô hiệu hóa nút nếu đã gửi
    style={{ 
      padding: '10px 20px',
      backgroundColor: isSubmitted ? '#ccc' : '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: isSubmitted ? 'not-allowed' : 'pointer'
    }}
  >
    Submit
  </button>
    </div>
  );
}

export default Listening;