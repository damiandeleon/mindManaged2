import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/**
 * Journal Component
 *
 * This page displays all journal entries in cards
 * Allows users to view, edit, and delete their journal entries
 */
const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    entry: "",
  });

  // Fetch all journal entries when component mounts
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/journals");
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      alert("Error loading journal entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to start editing an entry
  const handleEditEntry = (entry) => {
    setEditingEntryId(entry._id);
    setEditForm({
      title: entry.title || "",
      entry: entry.entry || "",
    });
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditForm({ title: "", entry: "" });
  };

  // Function to handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to save edited entry
  const handleSaveEdit = async (entryId) => {
    try {
      await axios.put(`/api/journals/${entryId}`, editForm);

      // Update the entry in the local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry._id === entryId ? { ...entry, ...editForm } : entry
        )
      );

      // Reset editing state
      handleCancelEdit();
      alert("Journal entry updated successfully!");
    } catch (error) {
      console.error("Error updating journal entry:", error);
      alert("Error updating journal entry. Please try again.");
    }
  };

  // Function to delete an entry
  const handleDeleteEntry = async (entryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this journal entry? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/api/journals/${entryId}`);

      // Remove the entry from the local state
      setEntries((prev) => prev.filter((entry) => entry._id !== entryId));

      alert("Journal entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      alert("Error deleting journal entry. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Loading journal entries...</div>;
  }

  return (
    <div>
      {/* Page header */}
      <div className="dashboard-header">
        <div className="container">
          <h1>My Journal</h1>
          <p>Your thoughts and reflections</p>
        </div>
      </div>

      <div className="container">
        {entries.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center" }}>
            <h3>No Journal Entries Yet</h3>
            <p style={{ color: "#666" }}>
              Start writing your first journal entry from the dashboard!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="dashboard-card"
                style={{
                  padding: "2rem",
                }}
              >
                {editingEntryId === entry._id ? (
                  // Edit Mode
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        Date: {formatDate(entry.date)}
                      </label>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "bold",
                        }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditFormChange}
                        placeholder="Entry title"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "1rem",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "bold",
                        }}
                      >
                        Entry
                      </label>
                      <textarea
                        name="entry"
                        value={editForm.entry}
                        onChange={handleEditFormChange}
                        placeholder="Write your thoughts..."
                        rows="10"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          resize: "vertical",
                          fontSize: "1rem",
                          lineHeight: "1.5",
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
                        className="btn btn-secondary"
                        style={{
                          padding: "0.5rem 1rem",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(entry._id)}
                        className="btn btn-primary"
                        style={{
                          padding: "0.5rem 1rem",
                        }}
                      >
                        Save Changes
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
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h2 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                          {entry.title}
                        </h2>
                        <p
                          style={{
                            margin: 0,
                            color: "#666",
                            fontSize: "0.9rem",
                          }}
                        >
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          marginLeft: "1rem",
                        }}
                      >
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="btn btn-primary"
                          style={{
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="btn btn-secondary"
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#dc3545",
                            border: "none",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                        color: "#333",
                        fontSize: "1rem",
                      }}
                    >
                      {entry.entry}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
