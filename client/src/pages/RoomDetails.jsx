import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { SERVER_URL } from "../config";

function RoomDetails() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await api.get(`/images/${id}`);
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoom();
    fetchImages();
  }, [id]);

  const handleTakePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", id);

    try {
      setUploading(true);
      await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchImages();
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      console.log("UPLOAD RESPONSE:", error.response?.data);
      alert(error.response?.data?.message || error.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section card">
          <div className="space-between">
            <div>
              <h1 className="page-title">{room ? room.name : "Room"}</h1>
              <p className="page-subtitle">
                Capture room evidence and manage inspection photos.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleTakePhotoClick}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Take Photo"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="section card">
          <h2 className="heading-2">Room Photos</h2>

          {images.length === 0 ? (
            <p className="muted">No photos uploaded yet.</p>
          ) : (
            <div className="grid-auto">
              {images.map((image) => (
                <Link key={image.id} to={`/images/${image.id}`}>
                  <img
                    className="image-grid-thumb"
                    src={`${SERVER_URL}${image.url}`}
                    alt="Room inspection"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;