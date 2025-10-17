// import { QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
// import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
// import { config } from "./wagmi.ts";

import "./index.css";

// Toggle dark mode on app load or via button
const html = document.documentElement;

// Add dark mode
html.classList.add("dark");

// const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <footer>
      <div className="flex items-center justify-center flex-col">
        sponsored by{" "}
        <a href="https://overtime.io" className="hover:text-accent underline">
          overtime.io
        </a>{" "}
        <img
          src="https://purp-games.vercel.app/overtime.png"
          alt="Overtime Logo"
          className="p-2"
        />
      </div>
    </footer>
  </React.StrictMode>
);
