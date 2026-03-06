import { useState } from "react";
import AddStore from "./components/operator-service/AddStore";
import StoreList from "./components/operator-service/StoreList";
import AddPromotion from "./components/operator-service/AddPromotion";
import PromotionList from "./components/operator-service/PromotionList";
import AddEvent from "./components/operator-service/AddEvent";
import EventList from "./components/operator-service/EventList";
import HomePage from "./components/HomePage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "stores":
        return (
          <>
            <AddStore />
            <StoreList />
          </>
        );
      case "promotions":
        return (
          <>
            <AddPromotion />
            <PromotionList />
          </>
        );
      case "events":
        return (
          <>
            <AddEvent />
            <EventList />
          </>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="logo-text">MallHub</span>
          </div>

          <div className="nav-links">
            <button
              className={`nav-link ${currentPage === "home" ? "active" : ""}`}
              onClick={() => setCurrentPage("home")}
            >
              Home
            </button>
            <button
              className={`nav-link ${currentPage === "stores" ? "active" : ""}`}
              onClick={() => setCurrentPage("stores")}
            >
              Stores
            </button>
            <button
              className={`nav-link ${currentPage === "promotions" ? "active" : ""}`}
              onClick={() => setCurrentPage("promotions")}
            >
              Promotions
            </button>
            <button
              className={`nav-link ${currentPage === "events" ? "active" : ""}`}
              onClick={() => setCurrentPage("events")}
            >
              Events
            </button>
          </div>

          <div className="nav-profile">
            <div className="profile-avatar">AD</div>
          </div>
        </div>
      </nav>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
