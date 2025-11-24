import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  CalendarOutlined,
  FolderOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Bản đồ ánh xạ path sang tiêu đề hiển thị trên Header
  const titleMap = {
    "/admin/dashboard": "Dashboard",
    "/admin/adminUser": "User Management",
    "/admin/adminBlog": "Blog Management",
    "/admin/adminCourse": "Course Management",
    "/admin/adminEvent": "Event Management",
    "/admin/quiz-manage": "Quiz Management",
    "/admin/classes": "Class Management",
    "/admin/categories": "Category Management",
  };

  // Lấy tiêu đề tương ứng với đường dẫn hiện tại
  const currentTitle = titleMap[location.pathname] || "Vesta Academy";

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  // User dropdown menu
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Menu items với icon đẹp hơn
  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined style={{ fontSize: 16 }} />,
      label: "Dashboard",
    },
    {
      key: "/admin/adminUser",
      icon: <TeamOutlined style={{ fontSize: 16 }} />,
      label: "Users",
    },
    {
      key: "/admin/adminBlog",
      icon: <FileTextOutlined style={{ fontSize: 16 }} />,
      label: "Blog",
    },
    {
      key: "/admin/adminCourse",
      icon: <BookOutlined style={{ fontSize: 16 }} />,
      label: "Courses",
    },
    {
      key: "/admin/adminEvent",
      icon: <CalendarOutlined style={{ fontSize: 16 }} />,
      label: "Events",
    },
    {
      key: "/admin/quiz-manage",
      icon: <ReadOutlined style={{ fontSize: 16 }} />,
      label: "Quiz Manage",
    },
    {
      key: "/admin/classes",
      icon: <TeamOutlined style={{ fontSize: 16 }} />,
      label: "Classes",
    },
    {
      key: "/admin/categories",
      icon: <FolderOutlined style={{ fontSize: 16 }} />,
      label: "Categories",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {!collapsed ? (
            <Text
              strong
              style={{
                color: "#fff",
                fontSize: 18,
                letterSpacing: "0.5px",
              }}
            >
              🎓 Vesta Admin
            </Text>
          ) : (
            <Text strong style={{ color: "#fff", fontSize: 20 }}>
              🎓
            </Text>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            borderRight: 0,
            marginTop: 8,
          }}
        />

        {/* Logout Button at Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            padding: collapsed ? "0 8px" : "0 16px",
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            onClick={handleMenuClick}
            items={[
              {
                key: "logout",
                icon: <LogoutOutlined style={{ fontSize: 16 }} />,
                label: "Logout",
                danger: true,
              },
            ]}
          />
        </div>
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 240, transition: "all 0.2s" }}
      >
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {/* Left Side - Title */}
          <Space size={16}>
            <Text
              strong
              style={{
                fontSize: 20,
                color: "#262626",
                margin: 0,
              }}
            >
              {currentTitle}
            </Text>
          </Space>

          {/* Right Side - User Menu */}
          <Space size={20}>
            {/* Notifications */}
            <Badge count={5} size="small">
              <BellOutlined
                style={{
                  fontSize: 20,
                  color: "#595959",
                  cursor: "pointer",
                }}
              />
            </Badge>

            {/* User Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: "#1890ff",
                    cursor: "pointer",
                  }}
                  icon={<UserOutlined />}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1.2,
                  }}
                >
                  <Text strong style={{ fontSize: 14 }}>
                    Admin User
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Administrator
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#f0f2f5",
            minHeight: 280,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              minHeight: "100%",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
