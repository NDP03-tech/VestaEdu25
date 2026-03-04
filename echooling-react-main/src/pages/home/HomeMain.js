import React, { useEffect } from "react";
import Blog from "./BlogSection";
import About from "./AboutSection";
import Service from "./ServiceSection";
import HomeSlider from "./SliderSection";
import Course from "./CourseSection";
import Event from "./EventSection";
import Counter from "./CounterSection";
import ScrollToTop from "../../components/ScrollTop";
import Header from "../../components/Header";
import "./HomeMain.css";

/* ─────────────────────────────────────────────
   Hook: observe every [data-reveal] element and
   add class "is-visible" when it enters viewport
───────────────────────────────────────────── */
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      {
        threshold: 0.12, // 12% of element must be visible
        rootMargin: "0px 0px -48px 0px",
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ─────────────────────────────────────────────
   Wrapper adds data-reveal + optional delay
───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => (
  <div
    data-reveal
    className="reveal-block"
    style={{ "--reveal-delay": `${delay}ms` }}
  >
    {children}
  </div>
);

const HomeMain = () => {
  useScrollReveal();

  return (
    <>
      <div className="react-wrapper">
        <div className="react-wrapper-inner">
          <Header />

          {/* Slider: no reveal — visible immediately */}
          <HomeSlider />

          <Reveal delay={0}>
            <About />
          </Reveal>

          <Reveal delay={0}>
            <Course />
          </Reveal>

          <Reveal delay={0}>
            <Service />
          </Reveal>

          <Reveal delay={0}>
            <Counter />
          </Reveal>

          <Reveal delay={0}>
            <Event />
          </Reveal>

          <Reveal delay={0}>
            <Blog />
          </Reveal>

          <ScrollToTop scrollClassName="home react__up___scroll" />
        </div>
      </div>
    </>
  );
};

export default HomeMain;
