import { useState, useEffect } from "react";
import axios from "axios";

function AddPromotion() {
  const [stores, setStores] = useState([]);
  const [promotion, setPromotion] = useState({
    storeName: "",
    title: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/stores");
      setStores(res.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleChange = (e) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/promotions", promotion);
      alert("Promotion Created Successfully!");
      setPromotion({ 
        storeName: "", 
        title: "", 
        discount: "", 
        startDate: "", 
        endDate: "" 
      });
    } catch (error) {
      alert("Error creating promotion: " + (error.response?.data?.error || error.message));
      console.error(error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          Create Promotion
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Store</label>
          <select
            className="form-input"
            name="storeName"
            value={promotion.storeName}
            onChange={handleChange}
            required
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store._id} value={store.name}>
                {store.name} - {store.category} (Floor {store.floor})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Promotion Title</label>
          <input
            className="form-input"
            name="title"
            placeholder="e.g., Summer Sale, Black Friday Deal"
            value={promotion.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discount</label>
          <input
            className="form-input"
            name="discount"
            placeholder="e.g., 20% off, Buy 1 Get 1"
            value={promotion.discount}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              className="form-input"
              type="date"
              name="startDate"
              value={promotion.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              className="form-input"
              type="date"
              name="endDate"
              value={promotion.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Create Promotion
        </button>
      </form>
    </div>
  );
}

export default AddPromotion;
