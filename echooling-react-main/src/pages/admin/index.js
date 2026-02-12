import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Typography, message } from 'antd';
import {
  FileAddOutlined,
  FileTextOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardStatCard from './DashboardStatCard';
import RegistrationTableTabs from './RegistrationTableTabs';
import config from '../../config';
const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    passedToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${config.API_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          message.error(err.message || 'Failed to fetch dashboard stats');
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err);
        message.error('Error fetching stats');
      }
    };

    fetchStats();
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${config.API_URL}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Untitled Quiz',
          description: '',
          category: 'general',
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('❌ Error creating quiz:', error);
        return;
      }

  const data = await res.json();
  const createdQuizId = data.id;
  navigate(`/admin/quiz-builder/${createdQuizId}`);
    } catch (err) {
      console.error('❌ Network error:', err);
    }
  };

  const actions = [
    {
      title: 'Create Quiz',
      description: 'Quickly create a new IELTS quiz.',
      icon: <FileAddOutlined />,
      onClick: handleCreateQuiz,
    },
    {
      title: 'Write Blog',
      description: 'Share educational knowledge.',
      icon: <FileTextOutlined />,
      onClick: () => navigate('/admin/adminBlog'),
    },
    {
      title: 'Add Course',
      description: 'Create a new course for IELTS, Grammar, etc.',
      icon: <BookOutlined />,
      onClick: () => navigate('/admin/adminCourse'),
    },
    {
      title: 'Create Event',
      description: 'Manage events.',
      icon: <TeamOutlined />,
      onClick: () => navigate('/admin/adminEvent'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Quick Actions
      </Title>

      <Row gutter={[16, 16]}>
        {actions.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              variant="outlined"
              style={{
                height: '100%',
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              actions={[
                <Button
                  type="primary"
                  icon={item.icon}
                  style={{ fontSize: 12, height: 32, padding: '0 12px' }}
                  onClick={item.onClick}
                >
                  {item.title}
                </Button>,
              ]}
            >
              <Title level={5}>{item.title}</Title>
              <Paragraph type="secondary" style={{ minHeight: 48 }}>
                {item.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={4} style={{ margin: '40px 0 24px' }}>
        Quick Stats
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <DashboardStatCard
            title="Quizzes Passed Today"
            value={stats.passedToday}
            icon={<CheckCircleOutlined />}
            background="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <DashboardStatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UserOutlined />}
            background="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <DashboardStatCard
            title="Total Quizzes"
            value={stats.totalQuizzes}
            icon={<BookOutlined />}
            background="#fa8c16"
          />
        </Col>
      </Row>

      <Title level={4} style={{ margin: '40px 0 16px' }}>
  Recent Registrations
</Title>

<RegistrationTableTabs />
    </div>
  );
};

export default Dashboard;
