import { useEffect, useState } from "react";
import axios from "axios";

function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/stores");
      setStores(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Stores Directory</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          Loading stores...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
          </div>
          Stores Directory
        </h2>
      </div>

      {stores.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          No stores added yet
        </p>
      ) : (
        <div>
          {stores.map((store, index) => (
            <div key={store._id} className="store-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="store-header">
                <div className="store-name">{store.name}</div>
                <span className="badge badge-primary">{store.category}</span>
              </div>
              <div className="store-details">
                <div className="store-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Floor {store.floor}
                </div>
                <div className="store-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {store.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreList;
