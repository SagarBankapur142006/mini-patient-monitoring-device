import React, { useEffect, useState } from "react";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [arrivals, setArrivals] = useState([]);

  // --- LOGIC (UNCHANGED) ---
  const getColor = (risk) => {
    if (risk === "Critical") return "#ef4444";
    if (risk === "Alert") return "#f97316";
    return "#10b981";
  };

  useEffect(() => {
    const loadData = () => {
      const patientList = [];
      const arrivedList = [];

      for (let key in localStorage) {
        if (key.startsWith("patient_")) {
          const data = JSON.parse(localStorage.getItem(key));
          if (data) patientList.push(data);
        }
        if (key.startsWith("arrived_")) {
          const data = JSON.parse(localStorage.getItem(key));
          if (data) arrivedList.push(data);
        }
      }

      setPatients(patientList);
      setArrivals(arrivedList);
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const clearSystem = () => {
    for (let key in localStorage) {
      if (
        key.startsWith("patient_") ||
        key.startsWith("arrived_") ||
        key === "patientCounter"
      ) {
        localStorage.removeItem(key);
      }
    }
    window.location.reload();
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.pulseIcon}></div>
          <span>MED-MONITOR </span>
        </div>
        
        {/* UPDATED CLEAR BUTTON */}
        <button onClick={clearSystem} style={styles.clearBtn}>
          RESET SYSTEM
        </button>
      </header>

      <div style={styles.mainContent}>
        
        {/* Empty State */}
        {patients.length === 0 && arrivals.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={{ opacity: 0.5 }}>NO ACTIVE SIGNALS</h2>
            <p style={{ color: "#64748b" }}>Waiting for ambulance connection...</p>
          </div>
        )}

        {/* --- PATIENT ROWS --- */}
        <div style={styles.listContainer}>
          {patients.map((patient) => (
            <div
              key={patient.patientId}
              style={{
                ...styles.patientRow,
                borderLeft: `6px solid ${getColor(patient.hrRisk)}`
              }}
            >
              {/* SECTION 1: ID */}
              <div style={styles.infoSection}>
                <div style={styles.patientId}>{patient.patientId}</div>
                <div style={styles.liveTag}>● LIVE MONITORING</div>
              </div>

              {/* SECTION 2: VITALS + RISK STATUS */}
              <div style={styles.vitalsRow}>
                
                {/* Heart Rate */}
                <div style={styles.vitalGroup}>
                  <div style={styles.vitalLabel}>HEART RATE</div>
                  <div style={{ ...styles.vitalValue, color: getColor(patient.hrRisk) }}>
                    {patient.heartRate} <small style={styles.unit}>BPM</small>
                  </div>
                  <div style={{ ...styles.riskText, color: getColor(patient.hrRisk) }}>
                    {patient.hrRisk.toUpperCase()}
                  </div>
                </div>

                <div style={styles.divider}></div>

                {/* SpO2 */}
                <div style={styles.vitalGroup}>
                  <div style={styles.vitalLabel}>SpO₂</div>
                  <div style={{ ...styles.vitalValue, color: getColor(patient.spo2Risk) }}>
                    {patient.spo2} <small style={styles.unit}>%</small>
                  </div>
                  <div style={{ ...styles.riskText, color: getColor(patient.spo2Risk) }}>
                    {patient.spo2Risk.toUpperCase()}
                  </div>
                </div>

                <div style={styles.divider}></div>

                {/* BP */}
                <div style={styles.vitalGroup}>
                  <div style={styles.vitalLabel}>BP</div>
                  <div style={{ ...styles.vitalValue, color: getColor(patient.bpRisk) }}>
                    {patient.systolic}/{patient.diastolic}
                  </div>
                  <div style={{ ...styles.riskText, color: getColor(patient.bpRisk) }}>
                    {patient.bpRisk.toUpperCase()}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Recent Arrivals */}
        {arrivals.length > 0 && (
          <div style={styles.arrivalSection}>
            <h3 style={styles.sectionTitle}>RECENT ADMISSIONS</h3>
            <div style={styles.arrivalList}>
              {arrivals.map((arrival) => (
                <div key={arrival.patientId} style={styles.arrivalCard}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Patient <strong>{arrival.patientId}</strong> admitted to ER</span>
                  <span style={styles.timestamp}>{new Date(arrival.time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  dashboardContainer: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  brand: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  pulseIcon: {
    width: "12px",
    height: "12px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 10px #22c55e",
  },
  
  // ✅ UPDATED BUTTON STYLE FROM YOUR IMAGE
  clearBtn: {
    background: "linear-gradient(90deg, #357f50, #00ff5e)", // Gradient from image
    color: "white",
    border: "none",
    borderRadius: "10px", // Radius from image
    padding: "10px 24px", 
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(0, 255, 94, 0.2)", // Added a subtle glow
    transition: "transform 0.2s",
  },

  mainContent: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  emptyState: {
    textAlign: "center",
    marginTop: "100px",
    padding: "60px",
    border: "2px dashed #334155",
    borderRadius: "16px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "40px",
  },
  patientRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    padding: "20px 30px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  infoSection: {
    width: "150px",
  },
  patientId: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: "4px",
  },
  liveTag: {
    color: "#22c55e",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    animation: "pulse 2s infinite",
  },
  vitalsRow: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    flex: 1,
    justifyContent: "center",
  },
  vitalGroup: {
    textAlign: "center",
    minWidth: "120px",
  },
  vitalLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "bold",
    marginBottom: "4px",
    letterSpacing: "1px",
  },
  vitalValue: {
    fontSize: "32px",
    fontWeight: "bold",
    fontFamily: "monospace",
    lineHeight: "1",
    marginBottom: "6px",
  },
  unit: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "normal",
  },
  riskText: {
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  divider: {
    width: "1px",
    height: "40px",
    backgroundColor: "#334155",
  },
  arrivalSection: {
    marginTop: "40px",
    borderTop: "1px solid #334155",
    paddingTop: "20px",
  },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: "14px",
    letterSpacing: "1px",
    marginBottom: "16px",
    textTransform: "uppercase",
  },
  arrivalList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  arrivalCard: {
    backgroundColor: "#1e293b",
    padding: "12px 20px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderLeft: "4px solid #38bdf8",
    fontSize: "14px",
    color: "#cbd5e1",
  },
  checkIcon: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "bold",
  },
  timestamp: {
    marginLeft: "auto",
    color: "#64748b",
    fontSize: "12px",
  },
};

export default DoctorDashboard;