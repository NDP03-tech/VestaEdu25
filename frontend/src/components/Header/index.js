import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MenuItems from "./MenuItems";
import normalLogo from "../../assets/images/logos/logo-ngang.png";
import stickyLogo from "../../assets/images/logos/logo-ngang.png";

const Header = (props) => {
  const {
    topbarEnable,
    headerClass,
    parentMenu,
    headerNormalLogo,
    headerStickyLogo,
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Ref prevents stale closure & avoids re-render on every frame
  const rafId = useRef(null);
  const lastSticky = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending frame first
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const shouldBeSticky = window.scrollY > 100;
        // Only call setState when the value actually changes
        if (shouldBeSticky !== lastSticky.current) {
          lastSticky.current = shouldBeSticky;
          setIsSticky(shouldBeSticky);
        }
      });
    };

    // passive:true lets browser scroll without waiting for JS
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <header
      id="react-header"
      className={headerClass ? headerClass : "react-header react-header-three"}
    >
      <div className={isSticky ? "header-area react-sticky" : "header-area"}>
        {/* ── Topbar ── */}
        {topbarEnable && (
          <div className="topbar-area style1">
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <div className="topbar-contact">
                    <ul>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <a href="tel:+84838779988">(+84) 838 77 99 88</a>
                      </li>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <a href="mailto:info@vestaedu.online">
                          info@vestaedu.online
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Nav ── */}
        <div className="menu-part">
          <div className="container">
            <div className="react-main-menu">
              <nav>
                <div className="menu-toggle">
                  <div className="logo">
                    <Link to="/" className="logo-text">
                      <img
                        src={isSticky ? stickyLogo : normalLogo}
                        alt="Vesta Academy"
                        style={{
                          width: "250px",
                          height: "200px",
                          objectFit: "contain",
                          display: "flex",
                          marginTop: "-45px",
                          padding: "0",
                        }}
                      />
                    </Link>
                  </div>
                  <button
                    type="button"
                    id="menu-btn"
                    className={
                      menuOpen ? "mobile-menu-btn open" : "mobile-menu-btn"
                    }
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>

                <div
                  className={
                    menuOpen
                      ? "react-inner-menus menu-open"
                      : "react-inner-menus"
                  }
                >
                  <ul
                    id="backmenu"
                    className="react-menus react-sub-shadow"
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                      padding: "0 0 0 20px",
                    }}
                  >
                    <MenuItems parentMenu={parentMenu} />
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
