import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/main.scss";

import axios from "axios";

axios.defaults.withCredentials = true;

const browserFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) =>
  browserFetch(input, {
    ...init,
    headers: (() => {
      const headers = new Headers(init.headers || {});
      headers.delete("Authorization");
      return headers;
    })(),
    credentials: init.credentials || "include",
  });

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
