import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ name: "", address: "" });
  const [roomCounts, setRoomCounts] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);

      const details = await Promise.all(
        response.data.map((property) => api.get(`/properties/${property.id}`))
      );

      const counts = {};
      details.forEach((res) => {
        counts[res.data.id] = {
          rooms: res.data.rooms.length
        };
      });

      setRoomCounts(counts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/properties", form);
      setForm({ name: "", address: "" });
      fetchProperties();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create property");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalProperties = properties.length;
  const totalRooms = Object.values(roomCounts).reduce(
    (sum, item) => sum + (item.rooms || 0),
    0
  );

  return (
    <div className="page">
      <div className="container">
        <div className="section card">
          <div className="space-between">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Welcome{user?.email ? `, ${user.email}` : ""}. Manage your rental property inspections here.
              </p>
            </div>

            <button className="btn btn-secondary" onClick={handleLogout}>
              Log Out
            </button>
          </div>

          <div className="grid-3" style={{ marginTop: "20px" }}>
            <div className="summary-stat">
              <div className="summary-stat-title">Properties</div>
              <div className="summary-stat-value">{totalProperties}</div>
            </div>

            <div className="summary-stat">
              <div className="summary-stat-title">Rooms</div>
              <div className="summary-stat-value">{totalRooms}</div>
            </div>

            <div className="summary-stat">
              <div className="summary-stat-title">Reports</div>
              <div className="summary-stat-value">{totalProperties}</div>
            </div>
          </div>
        </div>

        <div className="section card">
          <h2 className="heading-2">Add New Property</h2>
          <p className="muted" style={{ marginBottom: "20px" }}>
            Create a property record to begin adding rooms, photos, and inspection notes.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="label">Property Name</label>
                <input
                  className="input"
                  name="name"
                  placeholder="e.g. Flat 12"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Property Address</label>
                <input
                  className="input"
                  name="address"
                  placeholder="Enter full address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              Add Property
            </button>
          </form>
        </div>

        <div className="section card">
          <div className="space-between" style={{ marginBottom: "16px" }}>
            <h2 className="heading-2" style={{ margin: 0 }}>
              Your Properties
            </h2>
            <span className="muted">{properties.length} saved</span>
          </div>

          {properties.length === 0 ? (
            <p className="muted">No properties added yet.</p>
          ) : (
            <div className="grid">
              {properties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <div className="card-soft section property-card">
                    <h3 className="heading-3" style={{ marginBottom: "6px" }}>
                      {property.name}
                    </h3>
                    <p className="muted" style={{ marginBottom: "14px" }}>
                      {property.address}
                    </p>

                    <div className="row">
                      <span className="mini-stat">
                        {roomCounts[property.id]?.rooms || 0} rooms
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

export default Dashboard;