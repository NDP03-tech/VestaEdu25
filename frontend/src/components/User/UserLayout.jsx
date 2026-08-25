import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import UserHeader from './userHeader';

const { Content } = Layout;

const UserLayout = () => {
  return (
    <Layout>
      <UserHeader />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default UserLayout;
