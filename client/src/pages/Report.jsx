import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function getSeverityClass(severity) {
  const value = severity?.toLowerCase();

  if (value === "high") return "badge badge-high";
  if (value === "medium") return "badge badge-medium";
  return "badge badge-low";
}

function Report() {
  const { propertyId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${propertyId}`);
      setReportData(response.data);
    } catch (error) {
      console.error("REPORT FETCH ERROR:", error);
      alert(error.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="page">
        <div className="container">
          <p>No report data available.</p>
        </div>
      </div>
    );
  }

  const { property, generatedAt } = reportData;

  const totalRooms = property.rooms.length;
  const totalImages = property.rooms.reduce(
    (sum, room) => sum + room.images.length,
    0
  );
  const totalIssues = property.rooms.reduce(
    (sum, room) =>
      sum +
      room.images.reduce(
        (imgSum, image) => imgSum + image.annotations.length,
        0
      ),
    0
  );

  return (
    <div className="page">
      <div className="container">
        <div className="space-between section card">
          <div>
            <h1 className="page-title">Inspection Report</h1>
            <p className="page-subtitle">
              Structured room-by-room condition summary for dispute protection.
            </p>
          </div>

          <button
            className="btn btn-primary report-print-hide"
            onClick={() => window.print()}
          >
            Export / Save as PDF
          </button>
        </div>

        <div className="section card">
          <h2 className="heading-2">{property.name}</h2>
          <p className="muted">{property.address}</p>
          <p className="muted">
            <strong>Generated:</strong> {new Date(generatedAt).toLocaleString()}
          </p>

          <div className="grid-3" style={{ marginTop: "20px" }}>
            <div className="summary-stat">
              <div className="summary-stat-title">Rooms</div>
              <div className="summary-stat-value">{totalRooms}</div>
            </div>

            <div className="summary-stat">
              <div className="summary-stat-title">Images</div>
              <div className="summary-stat-value">{totalImages}</div>
            </div>

            <div className="summary-stat">
              <div className="summary-stat-title">Issues</div>
              <div className="summary-stat-value">{totalIssues}</div>
            </div>
          </div>
        </div>

        {property.rooms.map((room) => {
          const roomIssueCount = room.images.reduce(
            (sum, image) => sum + image.annotations.length,
            0
          );

          return (
            <div key={room.id} className="section card">
              <h3 className="heading-3">{room.name}</h3>

              {roomIssueCount === 0 ? (
                <div className="room-banner-clean">
                  <strong>No issues recorded for this room.</strong>
                </div>
              ) : (
                <div className="room-banner-issues">
                  <strong>{roomIssueCount}</strong> issue
                  {roomIssueCount !== 1 ? "s" : ""} recorded in this room.
                </div>
              )}

              {room.images.length === 0 ? (
                <p className="muted">No images uploaded for this room.</p>
              ) : (
                room.images.map((image) => (
                  <div key={image.id} className="image-card">
                    <div
                      className="image-frame"
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                        maxWidth: "500px"
                      }}
                    >
                      <img
                        src={image.url}
                        alt="Inspection"
                        style={{
                          width: "100%",
                          display: "block"
                        }}
                      />

                      {image.annotations.map((annotation, index) => (
                        <div
                          key={annotation.id}
                          title={`${annotation.note} (${annotation.severity})`}
                          className="annotation-dot saved"
                          style={{
                            left: `${annotation.x * 100}%`,
                            top: `${annotation.y * 100}%`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "700",
                            color: "#111"
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>

                    <p className="timestamp">
                      <strong>Captured:</strong>{" "}
                      {new Date(image.createdAt).toLocaleString()}
                    </p>

                    <h4 className="heading-3">Issues Found</h4>

                    {image.annotations.length === 0 ? (
                      <p className="muted">No issues recorded for this image.</p>
                    ) : (
                      <ul className="issue-list">
                        {image.annotations.map((annotation, index) => (
                          <li key={annotation.id} className="issue-item">
                            <strong>#{index + 1}</strong>{" "}
                            <span className={getSeverityClass(annotation.severity)}>
                              {annotation.severity}
                            </span>
                            <span style={{ marginLeft: "10px" }}>{annotation.note}</span>
                            <br />
                            <small className="muted">
                              Logged: {new Date(annotation.createdAt).toLocaleString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Report;