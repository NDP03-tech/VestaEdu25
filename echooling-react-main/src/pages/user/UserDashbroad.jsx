import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";
import UserHeader from "../../components/User/userHeader";
import QuoteOfTheDay from "../../components/QuoteOfTheDay";
import { TrendingUp, Calendar, Award, Zap } from "lucide-react";

const UserDashboard = () => {
  const [activityData, setActivityData] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    thisWeek: 0,
    streak: 0,
    bestDay: 0,
  });

  const fetchQuizzesWithLatestAttempts = async (userId, token) => {
    const res = await fetch(`/api/${userId}/quizzes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const quizzes = await res.json();

    const enriched = await Promise.all(
      quizzes.map(async (quiz) => {
        const attemptRes = await fetch(`/api/results/latest/${quiz.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const latestAttempt = await attemptRes.json();
        return { ...quiz, latestAttempt };
      })
    );

    return enriched;
  };

  const convertToHeatmapData = (quizAttempts) => {
    const dateMap = {};
    quizAttempts.forEach(({ latestAttempt }) => {
      if (latestAttempt?.submittedAt) {
        const date = latestAttempt.submittedAt.split("T")[0];
        dateMap[date] = (dateMap[date] || 0) + 1;
      }
    });

    return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
  };

  const calculateStats = (heatmapData) => {
    const total = heatmapData.reduce((sum, item) => sum + item.count, 0);

    const now = new Date();
    const weekAgo = subDays(now, 7);
    const thisWeekCount = heatmapData
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= weekAgo && itemDate <= now;
      })
      .reduce((sum, item) => sum + item.count, 0);

    const maxCount = Math.max(...heatmapData.map((item) => item.count), 0);

    let currentStreak = 0;
    const sortedDates = heatmapData
      .map((item) => ({ ...item, dateObj: new Date(item.date) }))
      .sort((a, b) => b.dateObj - a.dateObj);

    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalQuizzes: total,
      thisWeek: thisWeekCount,
      streak: currentStreak,
      bestDay: maxCount,
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = JSON.parse(userStr);
        const userId = user.id || user.id;

        const combined = await fetchQuizzesWithLatestAttempts(userId, token);
        const data = convertToHeatmapData(combined);
        setActivityData(data);
        setStats(calculateStats(data));
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu heatmap:", err);
      }
    };

    init();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div
      className="stat-card"
      style={{
        background: gradient,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color="white" />
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "white",
            opacity: 0.9,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
          marginTop: "8px",
        }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * {
            font-family: 'Inter', sans-serif;
          }

          .dashboard-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .stat-card {
            cursor: pointer;
          }

          .heatmap-container {
            background: white;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(102, 126, 234, 0.1);
          }

          .heatmap-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(102, 126, 234, 0.1);
          }

          .heatmap-title h2 {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
          }

          .react-calendar-heatmap {
            width: 100%;
          }

          .react-calendar-heatmap .color-empty {
            fill: #ebedf0;
          }

          .react-calendar-heatmap .color-github-1 {
            fill: #c6e48b;
          }

          .react-calendar-heatmap .color-github-2 {
            fill: #7bc96f;
          }

          .react-calendar-heatmap .color-github-3 {
            fill: #239a3b;
          }

          .react-calendar-heatmap .color-github-4 {
            fill: #196127;
          }

          .react-calendar-heatmap rect:hover {
            stroke: #667eea;
            stroke-width: 2px;
          }

          .legend-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 20px;
            padding: 16px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            flex-wrap: wrap;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #4a5568;
            font-weight: 500;
          }

          .legend-box {
            width: 16px;
            height: 16px;
            border-radius: 4px;
          }

          @media (max-width: 640px) {
            .heatmap-container {
              padding: 20px;
            }

            .heatmap-title h2 {
              font-size: 20px;
            }

            .legend-container {
              gap: 12px;
            }
          }
        `}
      </style>

      <div className="dashboard-container">
        <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Quote of the Day */}
          <QuoteOfTheDay />

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
              marginTop: "15px",
            }}
          >
            <StatCard
              icon={Award}
              label="Total Quizzes"
              value={stats.totalQuizzes}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <StatCard
              icon={TrendingUp}
              label="This Week"
              value={stats.thisWeek}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
            <StatCard
              icon={Zap}
              label="Current Streak"
              value={`${stats.streak} days`}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
            <StatCard
              icon={Calendar}
              label="Best Day"
              value={`${stats.bestDay} quizzes`}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
          </div>

          {/* Heatmap Section */}
          <div className="heatmap-container">
            <div className="heatmap-title">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Calendar size={24} color="white" />
              </div>
              <div>
                <h2>Your Activity</h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#718096",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Quiz activity over the past year
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="scale-[0.8] sm:scale-100 origin-top-left">
                <CalendarHeatmap
                  startDate={subDays(new Date(), 365)}
                  endDate={new Date()}
                  values={activityData}
                  classForValue={(value) => {
                    if (!value) return "color-empty";
                    if (value.count >= 3) return "color-github-4";
                    if (value.count === 2) return "color-github-3";
                    if (value.count === 1) return "color-github-2";
                    return "color-github-1";
                  }}
                  tooltipDataAttrs={(value) =>
                    value && value.date
                      ? {
                          "data-tip": `${value.date}: ${value.count} quizzes completed`,
                        }
                      : null
                  }
                  showWeekdayLabels
                />
              </div>
            </div>

            {/* Legend */}
            <div className="legend-container">
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568" }}
              >
                Less
              </span>
              <div className="legend-item">
                <div
                  className="legend-box"
                  style={{ background: "#ebedf0" }}
                ></div>
                <span>0</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-box"
                  style={{ background: "#c6e48b" }}
                ></div>
                <span>1</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-box"
                  style={{ background: "#7bc96f" }}
                ></div>
                <span>2</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-box"
                  style={{ background: "#239a3b" }}
                ></div>
                <span>3</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-box"
                  style={{ background: "#196127" }}
                ></div>
                <span>3+</span>
              </div>
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568" }}
              >
                More
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
