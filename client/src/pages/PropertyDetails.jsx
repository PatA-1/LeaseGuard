import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomStats, setRoomStats] = useState({});

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);

      const stats = {};

      await Promise.all(
        response.data.rooms.map(async (room) => {
          try {
            const imagesResponse = await api.get(`/images/${room.id}`);
            const images = imagesResponse.data;

            let issueCount = 0;

            for (const image of images) {
              const annotationsResponse = await api.get(`/annotations/${image.id}`);
              issueCount += annotationsResponse.data.length;
            }

            stats[room.id] = {
              images: images.length,
              issues: issueCount
            };
          } catch (error) {
            console.error(error);
            stats[room.id] = {
              images: 0,
              issues: 0
            };
          }
        })
      );

      setRoomStats(stats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      await api.post("/rooms", {
        name: roomName,
        propertyId: Number(id)
      });
      setRoomName("");
      fetchProperty();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add room");
    }
  };

  if (!property) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const totalRooms = property.rooms.length;
  const totalImages = Object.values(roomStats).reduce(
    (sum, item) => sum + (item.images || 0),
    0
  );
  const totalIssues = Object.values(roomStats).reduce(
    (sum, item) => sum + (item.issues || 0),
    0
  );

  return (
    <div className="page">
      <div className="container">
        <div className="section card">
          <div className="space-between">
            <div>
              <h1 className="page-title">{property.name}</h1>
              <p className="page-subtitle">{property.address}</p>
            </div>

            <Link to={`/reports/${id}`}>
              <button className="btn btn-primary">View Report</button>
            </Link>
          </div>

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

        <div className="section card">
          <h2 className="heading-2">Add Room</h2>
          <p className="muted" style={{ marginBottom: "20px" }}>
            Create room sections to capture evidence and annotate inspection issues.
          </p>

          <form onSubmit={handleAddRoom}>
            <div className="form-group">
              <label className="label">Room Name</label>
              <input
                className="input"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Living Room"
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Add Room
            </button>
          </form>
        </div>

        <div className="section card">
          <div className="space-between" style={{ marginBottom: "16px" }}>
            <h2 className="heading-2" style={{ margin: 0 }}>
              Rooms
            </h2>
            <span className="muted">{property.rooms.length} saved</span>
          </div>

          {property.rooms.length === 0 ? (
            <p className="muted">No rooms added yet.</p>
          ) : (
            <div className="grid">
              {property.rooms.map((room) => (
                <Link key={room.id} to={`/rooms/${room.id}`}>
                  <div className="card-soft section property-card">
                    <h3 className="heading-3" style={{ marginBottom: "6px" }}>
                      {room.name}
                    </h3>

                    <div className="row">
                      <span className="mini-stat">
                        {roomStats[room.id]?.images || 0} images
                      </span>
                      <span className="mini-stat">
                        {roomStats[room.id]?.issues || 0} issues
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;