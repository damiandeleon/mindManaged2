import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * MoodTrends Component
 *
 * This page displays the user's mental health check-in history
 * Shows mood trends over time
 */
const MoodTrends = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // Default to last 30 days
  const chartRef = useRef(null);

  // Fetch all mood check-ins when component mounts
  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/mood-checkins");
      setCheckIns(res.data);
    } catch (error) {
      console.error("Error fetching mood check-ins:", error);
      alert("Error loading mood trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to download chart as PDF
  const downloadChartAsPDF = async () => {
    if (!chartRef.current) return;

    try {
      // Capture the chart element as canvas
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add title
      pdf.setFontSize(16);
      pdf.text("Mood Trends Report", 15, 15);

      // Add user info
      pdf.setFontSize(10);
      pdf.text(`Generated for: ${user?.name || "User"}`, 15, 22);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 15, 27);
      pdf.text(`Time Period: Last ${timeRange} days`, 15, 32);

      // Add chart image
      pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(`mood-trends-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Format datetime for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get mood display info
  const getMoodInfo = (mood) => {
    switch (mood) {
      case "great":
        return { emoji: "😊", label: "Great", color: "#28a745" };
      case "okay":
        return { emoji: "😐", label: "Okay", color: "#ffc107" };
      case "not_great":
        return { emoji: "😔", label: "Not Great", color: "#dc3545" };
      default:
        return { emoji: "❓", label: "Unknown", color: "#666" };
    }
  };

  // Convert mood to numeric value for chart
  const getMoodValue = (mood) => {
    switch (mood) {
      case "great":
        return 3;
      case "okay":
        return 2;
      case "not_great":
        return 1;
      default:
        return 0;
    }
  };

  // Prepare chart data
  const getChartData = () => {
    // Filter check-ins by time range
    const now = new Date();
    const cutoffDate = new Date(
      now.getTime() - timeRange * 24 * 60 * 60 * 1000
    );

    const filteredCheckIns = checkIns.filter((checkIn) => {
      return new Date(checkIn.datetime) >= cutoffDate;
    });

    // Reverse to show chronological order (oldest to newest)
    const sortedCheckIns = [...filteredCheckIns].reverse();

    return {
      labels: sortedCheckIns.map((checkIn) => {
        const date = new Date(checkIn.datetime);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      }),
      datasets: [
        {
          label: "Mood Level",
          data: sortedCheckIns.map((checkIn) => getMoodValue(checkIn.mood)),
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: sortedCheckIns.map((checkIn) => {
            const moodInfo = getMoodInfo(checkIn.mood);
            return moodInfo.color;
          }),
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Mood Trend Over Time",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const moodValue = context.parsed.y;
            let moodLabel = "";
            switch (moodValue) {
              case 3:
                moodLabel = "Great 😊";
                break;
              case 2:
                moodLabel = "Okay 😐";
                break;
              case 1:
                moodLabel = "Not Great 😔";
                break;
              default:
                moodLabel = "Unknown";
            }
            return moodLabel;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            switch (value) {
              case 3:
                return "😊 Great";
              case 2:
                return "😐 Okay";
              case 1:
                return "😔 Not Great";
              default:
                return "";
            }
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading mood trends...</div>;
  }

  return (
    <div>
      {/* Page header */}
      <div className="dashboard-header">
        <div className="container">
          <h1>Mental Health Trends</h1>
          <p>Track your mood over time</p>
        </div>
      </div>

      <div className="container">
        {checkIns.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center" }}>
            <h3>No Check-ins Yet</h3>
            <p style={{ color: "#666" }}>
              Start tracking your mood from the dashboard to see your mental
              health trends!
            </p>
          </div>
        ) : (
          <>
            {/* Informational Card */}
            <div
              className="dashboard-card"
              style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                backgroundColor: "#f8f9fa",
                borderLeft: "4px solid #007bff",
              }}
            >
              <p style={{ margin: 0, lineHeight: "1.6", color: "#333" }}>
                Tracking your mood trends can help you understand existing or
                emerging patterns in your mood. This can help you manage your
                moods by either changing your environment or by scheduling
                strategic appointments with your mental health professional.
              </p>
            </div>

            {/* Chart Section */}
            <div
              className="dashboard-card"
              style={{ marginBottom: "2rem", padding: "2rem" }}
              ref={chartRef}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: 0, color: "#333" }}>Mood Trend Chart</h3>
                <button
                  onClick={downloadChartAsPDF}
                  className="btn btn-primary"
                  style={{
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>📥</span>
                  Download PDF
                </button>
              </div>

              <div style={{ height: "400px", marginBottom: "1.5rem" }}>
                <Line data={getChartData()} options={chartOptions} />
              </div>

              {/* Time Range Slider */}
              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    htmlFor="timeRange"
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    Time Range: Last {timeRange} days
                  </label>
                  <span style={{ color: "#666", fontSize: "0.85rem" }}>
                    Showing {getChartData().labels.length} entries
                  </span>
                </div>
                <input
                  type="range"
                  id="timeRange"
                  min="1"
                  max="365"
                  value={timeRange}
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "5px",
                    background: "#ddd",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#666",
                  }}
                >
                  <span>1 day</span>
                  <span>6 months</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>

            {/* Mood Check-ins List */}
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Recent Check-ins
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {checkIns.map((checkIn) => {
                const moodInfo = getMoodInfo(checkIn.mood);
                return (
                  <div
                    key={checkIn._id}
                    className="dashboard-card"
                    style={{
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      borderLeft: `4px solid ${moodInfo.color}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "3rem",
                        lineHeight: 1,
                      }}
                    >
                      {moodInfo.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: moodInfo.color,
                          fontSize: "1.5rem",
                        }}
                      >
                        {moodInfo.label}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        {formatDateTime(checkIn.datetime)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodTrends;
