import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/**
 * Dashboard Component
 *
 * This is the main dashboard page that displays:
 * - User's productivity statistics (tasks, goals, etc.)
 * - Quick action buttons for common tasks
 * - Mental health check-in interface
 * - Recent activity overview
 *
 * Only accessible to authenticated users
 */
const Dashboard = () => {
  // Extract current user information from authentication context
  const { user } = useAuth();

  // State to store dashboard statistics from the API
  const [stats, setStats] = useState({
    totalTasks: 0, // Total number of tasks created by user
    completedTasks: 0, // Number of completed tasks
    pendingTasks: 0, // Number of pending/in-progress tasks
    weeklyGoals: 0, // Number of goals set for current week
  });

  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch dashboard data when component mounts
  useEffect(() => {
    /**
     * Async function to fetch dashboard statistics from backend
     * Makes API call to /api/dashboard endpoint
     */
    const fetchDashboardData = async () => {
      try {
        // Make GET request to dashboard API endpoint
        const res = await axios.get("/api/dashboard");
        // Update stats state with response data
        setStats(res.data);
      } catch (error) {
        // Log any errors that occur during API call
        console.error("Error fetching dashboard data:", error);
      } finally {
        // Always set loading to false, regardless of success/failure
        setLoading(false);
      }
    };

    // Call the fetch function when component mounts
    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Main dashboard render
  return (
    <div>
      {/* Dashboard header with personalized welcome message */}
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your productivity overview</p>
        </div>
      </div>

      <div className="container">
        {/* First row: Statistics cards displaying key metrics */}
        <div className="dashboard-grid">
          {/* Total Tasks Card - Shows total number of tasks created */}
          <div className="dashboard-card">
            <h3>Total Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}
            >
              {stats.totalTasks}
            </p>
            <p>Tasks created this month</p>
          </div>

          {/* Completed Tasks Card - Shows tasks that are finished */}
          <div className="dashboard-card">
            <h3>Completed Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}
            >
              {stats.completedTasks}
            </p>
            <p>Tasks completed this month</p>
          </div>

          {/* Pending Tasks Card - Shows tasks still in progress */}
          <div className="dashboard-card">
            <h3>Pending Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffc107" }}
            >
              {stats.pendingTasks}
            </p>
            <p>Tasks still in progress</p>
          </div>

          {/* Weekly Goals Card - Shows goals set for current week */}
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

        {/* Second row: Quick actions and recent activity */}
        <div className="dashboard-grid">
          {/* Quick Actions Card - Provides shortcuts to common tasks */}
          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Button to quickly add a new task (not yet functional) */}
              <button className="btn btn-primary">Add Task</button>
              {/* Button to set a new goal (not yet functional) */}
              <button className="btn btn-secondary">Set Goal</button>
              {/* Button to track current mood (not yet functional) */}
              <button className="btn btn-secondary">Track Mood</button>
              {/* Link to medication lookup page */}
              <Link to="/medsearch" className="btn btn-secondary">
                Lookup Meds
              </Link>
            </div>
          </div>

          {/* Recent Activity Card - Shows user's recent actions */}
          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            {/* Placeholder content - will be replaced with actual activity data */}
            <p>No recent activity to display.</p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Start by creating your first task or goal!
            </p>
          </div>
        </div>

        {/* Mental Health Check-in Card - Allows users to track their mood */}
        <div className="dashboard-card">
          <h3>Mental Health Check-in</h3>
          <p>How are you feeling today?</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            {/* Mood tracking buttons - will save mood data when functional */}
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

// Export Dashboard component as default export
export default Dashboard;
