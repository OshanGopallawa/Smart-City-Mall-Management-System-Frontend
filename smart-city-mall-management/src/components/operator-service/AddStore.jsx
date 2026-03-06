import { useState } from "react";
import axios from "axios";

function AddStore() {
  const [store, setStore] = useState({
    name: "",
    category: "",
    floor: "",
  });

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/stores", store);
      alert("Store Added Successfully!");
      setStore({ name: "", category: "", floor: "" });
    } catch (error) {
      alert("Error adding store");
      console.error(error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          Add New Store
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Store Name</label>
          <input
            className="form-input"
            name="name"
            placeholder="Enter store name"
            value={store.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            className="form-input"
            name="category"
            placeholder="e.g., Fashion, Electronics, Food"
            value={store.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Floor</label>
          <input
            className="form-input"
            name="floor"
            placeholder="Floor number"
            value={store.floor}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Store
        </button>
      </form>
    </div>
  );
}

export default AddStore;
