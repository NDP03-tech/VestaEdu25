import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Button, Dropdown, Avatar } from "antd";
import {
  ClipboardList,
  BarChart3,
  LogOut,
  User,
  AlignJustify,
  X,
} from "lucide-react";

const { Header } = Layout;

const UserHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const userMenuItems = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "My Profile",
      onClick: () => navigate("/user/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Log Out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <Header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "0 clamp(16px, 5vw, 48px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <Link
            to="/user"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
                color: "#667eea",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05) rotate(-5deg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1) rotate(0deg)")
              }
            >
              V
            </div>
            <span
              style={{
                color: "#fff",
                fontSize: "22px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              VestaEdu Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            <Link
              to="/user/quizzes"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                color: "#fff",
                background: isActive("/user/quizzes")
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                border: isActive("/user/quizzes")
                  ? "1px solid rgba(255, 255, 255, 0.3)"
                  : "1px solid transparent",
                boxShadow: isActive("/user/quizzes")
                  ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/user/quizzes")) {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/user/quizzes")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <ClipboardList size={18} />
              <span>My Quizzes</span>
            </Link>

            <Link
              to="/user/results"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                color: "#fff",
                background: isActive("/user/results")
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                border: isActive("/user/results")
                  ? "1px solid rgba(255, 255, 255, 0.3)"
                  : "1px solid transparent",
                boxShadow: isActive("/user/results")
                  ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/user/results")) {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/user/results")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <BarChart3 size={18} />
              <span>Results</span>
            </Link>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                style={{
                  marginLeft: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 16px 6px 6px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    fontWeight: "bold",
                    border: "2px solid white",
                  }}
                  icon={<User size={18} />}
                />
                <span
                  style={{ color: "white", fontWeight: 600, fontSize: "14px" }}
                >
                  Account
                </span>
              </div>
            </Dropdown>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={mobileMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: "white",
              display: "none",
              padding: "8px",
              height: "auto",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
            }}
            className="mobile-menu-btn"
          />
        </div>
      </Header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            animation: "slideDown 0.3s ease",
          }}
          className="mobile-menu"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Link
              to="/user/quizzes"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                borderRadius: "10px",
                color: "#fff",
                background: isActive("/user/quizzes")
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <ClipboardList size={20} />
              <span>My Quizzes</span>
            </Link>

            <Link
              to="/user/results"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                borderRadius: "10px",
                color: "#fff",
                background: isActive("/user/results")
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <BarChart3 size={20} />
              <span>Results</span>
            </Link>

            <div
              style={{
                height: "1px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "8px 0",
              }}
            />

            <Button
              type="text"
              icon={<LogOut size={20} />}
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                height: "auto",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "12px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default UserHeader;
