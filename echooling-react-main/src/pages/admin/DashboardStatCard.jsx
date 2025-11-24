// src/components/admin/DashboardStatCard.jsx
import React from 'react';
import { Card } from 'antd';

const DashboardStatCard = ({ title, value, icon, background }) => {
  return (
    <Card
      variant="filled"
      styles={{
        body: {
          padding: 20,
          background: background,
          color: 'white',
        },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '14px', color: '#f0f0f0' }}>{title}</div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardStatCard;
