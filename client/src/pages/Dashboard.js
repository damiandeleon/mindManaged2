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

  // Modal state for add task functionality
  const [showModal, setShowModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    due: "",
    tags: "",
    status: "pending",
  });

  // Modal state for task list functionality
  const [showTaskListModal, setShowTaskListModal] = useState(false);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [taskListLoading, setTaskListLoading] = useState(false);

  // Modal state for completed tasks functionality
  const [showCompletedTasksModal, setShowCompletedTasksModal] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedTasksLoading, setCompletedTasksLoading] = useState(false);

  // Modal state for all tasks functionality
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [allTasksLoading, setAllTasksLoading] = useState(false);

  // State for task editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    due: "",
    tags: "",
  });

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

  // Function to handle opening the add task modal
  const handleAddTask = () => {
    setShowModal(true);
  };

  // Function to handle closing the modal and resetting form
  const handleCloseModal = () => {
    setShowModal(false);
    setTaskForm({
      title: "",
      description: "",
      due: "",
      tags: "",
      status: "pending",
    });
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      // Convert tags string to array and prepare task data
      const taskData = {
        ...taskForm,
        tags: taskForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      // Make API call to create new task
      await axios.post("/api/tasks", taskData);

      // Close modal and reset form
      handleCloseModal();

      // Refresh dashboard data to show new task
      const res = await axios.get("/api/dashboard");
      setStats(res.data);

      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task. Please try again.");
    }
  };

  // Function to handle Pending Tasks card click
  const handlePendingTasksClick = async () => {
    setShowTaskListModal(true);
    setTaskListLoading(true);

    try {
      // Fetch all pending tasks
      const res = await axios.get("/api/tasks?status=pending");
      // console.log("API Response:", res.data); // Debug log

      // Ensure we always set an array, handle different response structures
      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data?.tasks && Array.isArray(res.data.tasks)
        ? res.data.tasks
        : [];

      setIncompleteTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIncompleteTasks([]); // Ensure it's always an array even on error
      alert("Error loading tasks. Please try again.");
    } finally {
      setTaskListLoading(false);
    }
  };

  // Function to handle closing the task list modal
  const handleCloseTaskListModal = () => {
    setShowTaskListModal(false);
    setIncompleteTasks([]);
    setEditingTaskId(null);
    setEditForm({ title: "", description: "", due: "", tags: "" });
  };

  // Function to handle Completed Tasks card click
  const handleCompletedTasksClick = async () => {
    setShowCompletedTasksModal(true);
    setCompletedTasksLoading(true);

    try {
      // Fetch all completed tasks
      const res = await axios.get("/api/tasks?status=completed");
      // console.log("Completed Tasks API Response:", res.data); // Debug log

      // Ensure we always set an array, handle different response structures
      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data?.tasks && Array.isArray(res.data.tasks)
        ? res.data.tasks
        : [];

      setCompletedTasks(tasks);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setCompletedTasks([]); // Ensure it's always an array even on error
      alert("Error loading completed tasks. Please try again.");
    } finally {
      setCompletedTasksLoading(false);
    }
  };

  // Function to handle Total Tasks card click
  const handleTotalTasksClick = async () => {
    setShowAllTasksModal(true);
    setAllTasksLoading(true);

    try {
      // Fetch all tasks
      const res = await axios.get("/api/tasks");
      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data?.tasks && Array.isArray(res.data.tasks)
        ? res.data.tasks
        : [];
      setAllTasks(tasks);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      setAllTasks([]); // Ensure it's always an array even on error
      alert("Error loading all tasks. Please try again.");
    } finally {
      setAllTasksLoading(false);
    }
  };

  // Function to handle closing the completed tasks modal
  const handleCloseCompletedTasksModal = () => {
    setShowCompletedTasksModal(false);
    setCompletedTasks([]);
  };

  // Function to handle closing the all tasks modal
  const handleCloseAllTasksModal = () => {
    setShowAllTasksModal(false);
    setAllTasks([]);
  };

  // Function to start editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      due: task.due ? task.due.split("T")[0] : "",
      tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags || "",
    });
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({ title: "", description: "", due: "", tags: "" });
  };

  // Function to handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to save edited task
  const handleSaveEdit = async (taskId) => {
    try {
      const taskData = {
        ...editForm,
        tags: editForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      await axios.put(`/api/tasks/${taskId}`, taskData);

      // Update the task in the local state
      setIncompleteTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...taskData } : task
        )
      );
      setAllTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...taskData } : task
        )
      );

      // Reset editing state
      handleCancelEdit();

      // Refresh dashboard stats
      const res = await axios.get("/api/dashboard");
      setStats(res.data);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task. Please try again.");
    }
  };

  // Function to mark task as completed
  const handleCompleteTask = async (taskId) => {
    try {
      // console.log("Marking task as completed:", taskId);
      const updateResponse = await axios.put(`/api/tasks/${taskId}`, {
        status: "completed",
      });
      // console.log("Task update response:", updateResponse.data);

      // Remove the task from incomplete tasks list
      setIncompleteTasks((prev) => prev.filter((task) => task._id !== taskId));
      // Update the task status in allTasks list
      setAllTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );

      // Add a small delay to ensure database is updated before fetching stats
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh dashboard stats
      // console.log("Fetching updated dashboard stats...");
      const res = await axios.get("/api/dashboard");
      // console.log("Updated dashboard stats:", res.data);
      setStats(res.data);

      alert("Task marked as completed!");
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Error completing task. Please try again.");
    }
  };

  // Function to undo task completion (mark as incomplete)
  const handleUndoComplete = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: "pending" });

      // Remove the task from completed tasks list immediately
      setCompletedTasks((prev) => prev.filter((task) => task._id !== taskId));
      // Update the task status in allTasks list
      setAllTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: "pending" } : task
        )
      );

      // Refresh the pending tasks list (if the pending modal is open)
      const res = await axios.get("/api/tasks?status=pending");
      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data?.tasks && Array.isArray(res.data.tasks)
        ? res.data.tasks
        : [];
      setIncompleteTasks(tasks);

      // Refresh dashboard stats
      const dashboardRes = await axios.get("/api/dashboard");
      setStats(dashboardRes.data);

      alert("Task marked as incomplete!");
    } catch (error) {
      console.error("Error undoing task completion:", error);
      alert("Error undoing completion. Please try again.");
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      // console.log("Deleting task:", taskId);
      await axios.delete(`/api/tasks/${taskId}`);

      // Remove the task from all task lists
      setIncompleteTasks((prev) => prev.filter((task) => task._id !== taskId));
      setCompletedTasks((prev) => prev.filter((task) => task._id !== taskId));
      setAllTasks((prev) => prev.filter((task) => task._id !== taskId));

      // Add a small delay to ensure database is updated before fetching stats
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh dashboard stats
      // console.log("Fetching updated dashboard stats after delete...");
      const res = await axios.get("/api/dashboard");
      // console.log("Updated dashboard stats:", res.data);
      setStats(res.data);

      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    }
  };

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
          <div
            className="dashboard-card"
            onClick={handleTotalTasksClick}
            style={{ cursor: "pointer" }}
          >
            <h3>Total Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}
            >
              {stats.totalTasks}
            </p>
            <small style={{ color: "#666", fontSize: "0.8rem" }}>
              Click to view all tasks
            </small>
          </div>

          {/* Completed Tasks Card - Shows tasks that are finished */}
          <div
            className="dashboard-card"
            onClick={handleCompletedTasksClick}
            style={{ cursor: "pointer" }}
          >
            <h3>Completed Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}
            >
              {stats.completedTasks}
            </p>
            <small style={{ color: "#666", fontSize: "0.8rem" }}>
              Click to view completed tasks
            </small>
          </div>

          {/* Pending Tasks Card - Shows tasks still in progress */}
          <div
            className="dashboard-card"
            onClick={handlePendingTasksClick}
            style={{ cursor: "pointer" }}
          >
            <h3>Pending Tasks</h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffc107" }}
            >
              {stats.pendingTasks}
            </p>
            <small style={{ color: "#666", fontSize: "0.8rem" }}>
              Click to view incomplete tasks
            </small>
          </div>
        </div>

        {/* Second row: Quick actions and recent activity */}
        <div className="dashboard-grid">
          {/* Quick Actions Card - Provides shortcuts to common tasks */}
          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Button to quickly add a new task */}
              <button className="btn btn-primary" onClick={handleAddTask}>
                Add Task
              </button>
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

      {/* Completed Tasks Modal */}
      {showCompletedTasksModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2>Completed Tasks</h2>
              <button
                onClick={handleCloseCompletedTasksModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {completedTasksLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Loading completed tasks...
              </div>
            ) : !Array.isArray(completedTasks) ||
              completedTasks.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                No completed tasks found!
              </div>
            ) : (
              <div>
                {completedTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      backgroundColor: "#f8fff8",
                      opacity: 0.9,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0",
                          color: "#28a745",
                          flex: 1,
                          textDecoration: "line-through",
                        }}
                      >
                        ✓ {task.title}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.25rem",
                          marginLeft: "1rem",
                        }}
                      >
                        <button
                          onClick={() => handleUndoComplete(task._id)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          Undo Complete
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                        {task.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      {task.due && (
                        <span>
                          <strong>Due:</strong>{" "}
                          {new Date(task.due).toLocaleDateString()}
                        </span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <span>
                          <strong>Tags:</strong>{" "}
                          {Array.isArray(task.tags)
                            ? task.tags.join(", ")
                            : task.tags}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task List Modal */}
      {showTaskListModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2>Incomplete Tasks</h2>
              <button
                onClick={handleCloseTaskListModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {taskListLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Loading tasks...
              </div>
            ) : !Array.isArray(incompleteTasks) ||
              incompleteTasks.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                No incomplete tasks found!
              </div>
            ) : (
              <div>
                {incompleteTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {editingTaskId === task._id ? (
                      // Edit Form
                      <div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditFormChange}
                            placeholder="Task title"
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditFormChange}
                            placeholder="Description"
                            rows="2"
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              resize: "vertical",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <input
                            type="date"
                            name="due"
                            value={editForm.due}
                            onChange={handleEditFormChange}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            name="tags"
                            value={editForm.tags}
                            onChange={handleEditFormChange}
                            placeholder="Tags (comma separated)"
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: "0.25rem 0.75rem",
                              border: "1px solid #ddd",
                              backgroundColor: "white",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h4 style={{ margin: "0", color: "#333", flex: 1 }}>
                            {task.title}
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.25rem",
                              marginLeft: "1rem",
                            }}
                          >
                            <button
                              onClick={() => handleEditTask(task)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "0.7rem",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "0.7rem",
                              }}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "0.7rem",
                              }}
                            >
                              Delete
                            </button>
                            {task.status === "completed" && (
                              <button
                                onClick={() => handleUndoComplete(task._id)}
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  backgroundColor: "#ffc107",
                                  color: "black",
                                  border: "none",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "0.7rem",
                                }}
                              >
                                Undo
                              </button>
                            )}
                          </div>
                        </div>
                        {task.description && (
                          <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                            {task.description}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.9rem",
                            color: "#666",
                          }}
                        >
                          {task.due && (
                            <span>
                              <strong>Due:</strong>{" "}
                              {new Date(task.due).toLocaleDateString()}
                            </span>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <span>
                              <strong>Tags:</strong>{" "}
                              {Array.isArray(task.tags)
                                ? task.tags.join(", ")
                                : task.tags}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Tasks Modal */}
      {showAllTasksModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2>All Tasks</h2>
              <button
                onClick={handleCloseAllTasksModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {allTasksLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Loading all tasks...
              </div>
            ) : !Array.isArray(allTasks) || allTasks.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                No tasks found!
              </div>
            ) : (
              <div>
                {allTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      backgroundColor:
                        task.status === "completed" ? "#f8fff8" : "#f8f9fa",
                      opacity: task.status === "completed" ? 0.9 : 1,
                    }}
                  >
                    {editingTaskId === task._id ? (
                      // Edit Form
                      <div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditFormChange}
                            placeholder="Task title"
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditFormChange}
                            placeholder="Description"
                            rows="2"
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              resize: "vertical",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <input
                            type="date"
                            name="due"
                            value={editForm.due}
                            onChange={handleEditFormChange}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            name="tags"
                            value={editForm.tags}
                            onChange={handleEditFormChange}
                            placeholder="Tags (comma separated)"
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: "0.25rem 0.75rem",
                              border: "1px solid #ddd",
                              backgroundColor: "white",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h4
                            style={{
                              margin: "0",
                              color:
                                task.status === "completed"
                                  ? "#28a745"
                                  : "#333",
                              flex: 1,
                              textDecoration:
                                task.status === "completed"
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {task.status === "completed" ? "✓ " : ""}
                            {task.title}
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.25rem",
                              marginLeft: "1rem",
                            }}
                          >
                            {task.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleEditTask(task)}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleCompleteTask(task._id)}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  Complete
                                </button>
                              </>
                            )}
                            {task.status === "completed" && (
                              <button
                                onClick={() => handleUndoComplete(task._id)}
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  backgroundColor: "#ffc107",
                                  color: "black",
                                  border: "none",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "0.7rem",
                                }}
                              >
                                Undo Complete
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "0.7rem",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {task.description && (
                          <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                            {task.description}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.9rem",
                            color: "#666",
                          }}
                        >
                          <span>
                            <strong>Status:</strong>{" "}
                            <span
                              style={{
                                color:
                                  task.status === "completed"
                                    ? "#28a745"
                                    : "#ffc107",
                                fontWeight: "bold",
                              }}
                            >
                              {task.status === "completed"
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </span>
                          {task.due && (
                            <span>
                              <strong>Due:</strong>{" "}
                              {new Date(task.due).toLocaleDateString()}
                            </span>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <span>
                              <strong>Tags:</strong>{" "}
                              {Array.isArray(task.tags)
                                ? task.tags.join(", ")
                                : task.tags}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmitTask}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="title"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="description"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="due"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="due"
                  name="due"
                  value={taskForm.due}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="tags"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={taskForm.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., work, urgent, project)"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <small style={{ color: "#666", fontSize: "0.8rem" }}>
                  Separate multiple tags with commas
                </small>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #ddd",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Export Dashboard component as default export
export default Dashboard;
