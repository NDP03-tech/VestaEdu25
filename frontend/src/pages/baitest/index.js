
import React, { useState } from 'react';
import Listening from '../../components/Baitest/Listening/index';
import ReadingSection from '../../components/Baitest/ReadingSection/index';
import WritingTask from '../../components/Baitest/Writing/index';
import SpeakingComponent from '../../components/Baitest/Speaking/index';

const TestSection = ({ userInfo, handleSubmit }) => {
  const [listeningScore, setListeningScore] = useState(0);
  const [readingScore, setReadingScore] = useState(0);
  const [writingEssay, setWritingEssay] = useState('');
  const [speakingVideoUrl, setSpeakingVideoUrl] = useState('');

  const totalScore = listeningScore + readingScore; // Tính tổng điểm

  return (
    <div>
      <h2 className="text-center">THÍ SINH ĐƯỢC LÀM BÀI CHỈ 1 LẦN</h2>
      {/* Các phần thi */}
      <Listening setBandScore={setListeningScore} />
      <ReadingSection setBandScore={setReadingScore} />
      <WritingTask setEssayState={setWritingEssay} />
      <SpeakingComponent setVideoUrl={setSpeakingVideoUrl} />

      {/* Nút Nộp bài */}
      <button onClick={() => handleSubmit(userInfo, totalScore)} className="btn btn-danger w-100 mt-3">
        Nộp bài ngay
      </button>
    </div>
  );
};


export default TestSection;