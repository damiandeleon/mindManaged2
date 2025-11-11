import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Mind Managed</h1>
          <p>Take control of your mental well-being and productivity</p>
          <div>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Features
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Task Management</h3>
              <p>
                Organize your tasks and goals with intelligent prioritization
                and tracking.
              </p>
            </div>
            <div className="feature-card">
              <h3>Mental Health Tracking</h3>
              <p>
                Monitor your mental well-being with daily check-ins and mood
                tracking.
              </p>
            </div>
            <div className="feature-card">
              <h3>Progress Visualization</h3>
              <p>
                See your progress with beautiful charts and analytics to stay
                motivated.
              </p>
            </div>
            <div className="feature-card">
              <h3>Secure & Private</h3>
              <p>
                Your data is encrypted and secure. Only you have access to your
                information.
              </p>
            </div>
            <div className="feature-card">
              <h3>Cross-Platform</h3>
              <p>
                Access your data from any device with our responsive web
                application.
              </p>
            </div>
            <div className="feature-card">
              <h3>Customizable</h3>
              <p>
                Personalize your experience with themes and custom workflow
                settings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
