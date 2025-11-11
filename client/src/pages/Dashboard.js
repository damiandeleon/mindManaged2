import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    weeklyGoals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your productivity overview</p>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}
            >
              {stats.totalTasks}
            </p>
            <p>Tasks created this month</p>
          </div>

          <div className="dashboard-card">
            <h3>Completed Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}
            >
              {stats.completedTasks}
            </p>
            <p>Tasks completed this month</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffc107" }}
            >
              {stats.pendingTasks}
            </p>
            <p>Tasks still in progress</p>
          </div>

          <div className="dashboard-card">
            <h3>Weekly Goals</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#6f42c1" }}
            >
              {stats.weeklyGoals}
            </p>
            <p>Goals set for this week</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn btn-primary">Add Task</button>
              <button className="btn btn-secondary">Set Goal</button>
              <button className="btn btn-secondary">Track Mood</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            <p>No recent activity to display.</p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Start by creating your first task or goal!
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Mental Health Check-in</h3>
          <p>How are you feeling today?</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              😊 Great
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              😐 Okay
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              😔 Not Great
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
