import React, { useMemo } from "react";
import quotes from "../data/quotesData";
import { motion } from "framer-motion";

const animations = [
  { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  {
    initial: { opacity: 0, scale: 0.5, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
  },
  { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
  {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
];

const QuoteOfTheDay = () => {
  const todayIndex = useMemo(() => {
    const date = new Date();
    return date.getDate() % quotes.length;
  }, []);

  const selectedQuote = quotes[todayIndex];

  const randomAnimation = useMemo(() => {
    const index = Math.floor(Math.random() * animations.length);
    return animations[index];
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

          .font-display {
            font-family: 'Inter', sans-serif;
          }

          .font-serif {
            font-family: 'Playfair Display', serif;
          }

          .quote-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
          }

          .quote-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 8s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
          }

          .quote-icon {
            font-size: 80px;
            line-height: 1;
            opacity: 0.15;
            position: absolute;
            font-family: Georgia, serif;
          }

          .quote-icon.left {
            top: 20px;
            left: 30px;
          }

          .quote-icon.right {
            bottom: 20px;
            right: 30px;
            transform: rotate(180deg);
          }

          .sparkle {
            display: inline-block;
            animation: sparkle 2s ease-in-out infinite;
          }

          @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
          }

          .quote-content {
            position: relative;
            z-index: 1;
          }

          .author-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            padding: 8px 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .author-badge:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }

          @media (max-width: 640px) {
            .quote-icon {
              font-size: 50px;
            }
            .quote-icon.left {
              top: 15px;
              left: 15px;
            }
            .quote-icon.right {
              bottom: 15px;
              right: 15px;
            }
          }
        `}
      </style>

      <motion.div
        initial={randomAnimation.initial}
        animate={randomAnimation.animate}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-8 px-4"
      >
        <div className="quote-card p-8 sm:p-12 max-w-4xl mx-auto">
          {/* Decorative Quote Marks */}
          <div className="quote-icon left text-white">"</div>
          <div className="quote-icon right text-white">"</div>

          <div className="quote-content">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-6"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display flex items-center justify-center gap-3">
                <span className="sparkle">✨</span>
                Quote of the Day
                <span className="sparkle">✨</span>
              </h3>
            </motion.div>

            {/* Quote Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mb-6"
            >
              <p className="text-xl sm:text-3xl lg:text-4xl text-white font-serif leading-relaxed italic font-medium px-4">
                "{selectedQuote.text}"
              </p>
            </motion.div>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <div className="author-badge mx-auto">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-base sm:text-lg text-white font-display font-semibold">
                  {selectedQuote.author}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex justify-center gap-2 mt-6"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
              className="w-2 h-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                opacity: 0.6,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default QuoteOfTheDay;
