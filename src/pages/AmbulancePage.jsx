import React, { useEffect, useState } from "react";

const AmbulancePage = () => {
  // ✅ 1. INITIALIZE EVERYTHING TO 0
  const [heartRate, setHeartRate] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  
  const [running, setRunning] = useState(false);
  const [patientId, setPatientId] = useState(null);

  // --- LOGIC SECTION ---
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getHRRisk = (hr) => {
    if (hr === 0) return "--"; // Handle 0 case
    if (hr > 110 || hr < 50) return "Critical";
    if (hr > 100) return "Alert";
    return "Stable";
  };

  const getSpO2Risk = (sp) => {
    if (sp === 0) return "--"; // Handle 0 case
    if (sp < 90) return "Critical";
    if (sp < 95) return "Alert";
    return "Stable";
  };

  const getBPRisk = (sys) => {
    if (sys === 0) return "--"; // Handle 0 case
    if (sys < 90) return "Critical";
    if (sys > 160) return "Alert";
    return "Stable";
  };

  const getColor = (risk) => {
    if (risk === "--") return "#334155"; // Grey for 0
    if (risk === "Critical") return "#ef4444";
    if (risk === "Alert") return "#f97316";
    return "#10b981";
  };

  const generateRandomId = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100; 
    return "PID" + randomNum;
  };

  const startMonitoring = () => {
    const newId = generateRandomId();
    setPatientId(newId);
    setRunning(true);
    // Note: We do NOT set values here. They remain 0 until the first interval tick.
  };

  const stopMonitoring = () => {
    if (!patientId) return;
    localStorage.removeItem("patient_" + patientId);
    localStorage.setItem(
      "arrived_" + patientId,
      JSON.stringify({ patientId, time: Date.now() })
    );
    setRunning(false);
    setPatientId(null);
    
    // Reset to 0 when stopped
    setHeartRate(0);
    setSpo2(0);
    setSystolic(0);
    setDiastolic(0);
  };

  useEffect(() => {
    if (!running || !patientId) return;

    // ✅ 2. LOGIC TO HANDLE 0 -> REAL DATA TRANSITION
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        // If 0, jump to a normal baseline (e.g., 70-90)
        if (prev === 0) return Math.floor(Math.random() * (90 - 70) + 70); 
        // Otherwise, fluctuate slightly
        return clamp(prev + Math.floor(Math.random() * 5 - 2), 40, 180);
      });

      setSpo2((prev) => {
        // If 0, jump to normal (e.g., 96-99)
        if (prev === 0) return Math.floor(Math.random() * (100 - 96) + 96);
        return clamp(prev + Math.floor(Math.random() * 3 - 1), 70, 100);
      });

      setSystolic((prev) => {
        // If 0, jump to normal (e.g., 110-130)
        if (prev === 0) return Math.floor(Math.random() * (130 - 110) + 110);
        return clamp(prev + Math.floor(Math.random() * 5 - 2), 70, 200);
      });

      setDiastolic((prev) => {
        // If 0, jump to normal (e.g., 70-85)
        if (prev === 0) return Math.floor(Math.random() * (85 - 70) + 70);
        return clamp(prev + Math.floor(Math.random() * 5 - 2), 40, 130);
      });

    }, 2000); // 2 second delay (1st second is 0, then data appears)

    return () => clearInterval(interval);
  }, [running, patientId]);

  // Sync with LocalStorage whenever values change
  useEffect(() => {
    if (running && patientId && heartRate !== 0) {
       const data = {
        patientId,
        heartRate,
        spo2,
        systolic,
        diastolic,
        hrRisk: getHRRisk(heartRate),
        spo2Risk: getSpO2Risk(spo2),
        bpRisk: getBPRisk(systolic),
        timestamp: Date.now()
      };
      localStorage.setItem("patient_" + patientId, JSON.stringify(data));
    }
  }, [heartRate, spo2, systolic, diastolic, running, patientId]);


  const hrRisk = getHRRisk(heartRate);
  const spo2Risk = getSpO2Risk(spo2);
  const bpRisk = getBPRisk(systolic);

  // --- UI SECTION ---
  return (
    <div style={styles.wrapper}>
      <div style={styles.deviceFrame}>
        {/* Device Status Bar - BATTERY REMOVED */}
        <div style={styles.statusBar}>
          <div style={styles.statusDot(running)}></div>
          <span>{running ? "TRANSMITTING DATA..." : "STANDBY MODE"}</span>
        </div>

        <div style={styles.screen}>
          <div style={styles.header}>
            AMBULANCE UNIT 
          </div>

          <div style={styles.patientIdBox}>
            {patientId ? `PATIENT: ${patientId}` : "NO PATIENT DETECTED"}
          </div>

          <div style={styles.grid}>
            {/* Heart Rate Block */}
            <div style={styles.vitalBox}>
              <div style={styles.label}>HEART RATE</div>
              {/* Only show color if not 0 */}
              <div style={{ ...styles.value, color: heartRate > 0 ? getColor(hrRisk) : "#334155" }}>
                {heartRate}
              </div>
              <div style={styles.subInfo}>
                <span style={styles.unit}>BPM</span>
                <span style={{ color: heartRate > 0 ? getColor(hrRisk) : "#334155", fontWeight: "bold" }}>
                  {hrRisk}
                </span>
              </div>
            </div>

            {/* SpO2 Block */}
            <div style={styles.vitalBox}>
              <div style={styles.label}>SpO₂ LEVEL</div>
              <div style={{ ...styles.value, color: spo2 > 0 ? getColor(spo2Risk) : "#334155" }}>
                {spo2}
              </div>
              <div style={styles.subInfo}>
                <span style={styles.unit}>%</span>
                <span style={{ color: spo2 > 0 ? getColor(spo2Risk) : "#334155", fontWeight: "bold" }}>
                  {spo2Risk}
                </span>
              </div>
            </div>

            {/* BP Block */}
            <div style={styles.vitalBoxWide}>
              <div style={styles.label}>BLOOD PRESSURE</div>
              <div style={{ ...styles.value, fontSize: "56px", color: systolic > 0 ? getColor(bpRisk) : "#334155" }}>
                {systolic}/{diastolic}
              </div>
              <div style={styles.subInfo}>
                <span style={styles.unit}>mmHg</span>
                <span style={{ color: systolic > 0 ? getColor(bpRisk) : "#334155", fontWeight: "bold" }}>
                  {bpRisk}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          {!running ? (
            <button style={styles.startBtn} onClick={startMonitoring}>
              INITIATE MONITORING
            </button>
          ) : (
            <button style={styles.stopBtn} onClick={stopMonitoring}>
              END SESSION & DISCHARGE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  wrapper: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Courier New', Courier, monospace",
  },
  deviceFrame: {
    width: "800px",
    backgroundColor: "#020617",
    padding: "20px",
    borderRadius: "30px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 2px #334155",
    border: "8px solid #1e293b",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "15px",
    padding: "0 10px",
  },
  statusDot: (active) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: active ? "#22c55e" : "#64748b",
    boxShadow: active ? "0 0 10px #22c55e" : "none",
  }),
  screen: {
    background: "#0f172a",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid #1e293b",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    textAlign: "center",
    fontSize: "20px",
    color: "#38bdf8",
    letterSpacing: "4px",
    marginBottom: "10px",
    opacity: 0.8,
  },
  patientIdBox: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "40px",
    background: "#1e293b",
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  vitalBox: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #334155",
  },
  vitalBoxWide: {
    gridColumn: "span 2",
    background: "#1e293b",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #334155",
  },
  label: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  value: {
    fontSize: "56px",
    fontWeight: "bold",
    textShadow: "0 0 20px rgba(0,0,0,0.3)",
    transition: "color 0.3s ease",
  },
  subInfo: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    marginTop: "5px",
    fontSize: "14px",
  },
  unit: {
    color: "#64748b",
  },
  footer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
  },
  startBtn: {
    width: "100%",
    padding: "18px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #357f50, #00ff5e)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 255, 94, 0.2)",
    transition: "transform 0.1s",
  },
  stopBtn: {
    width: "100%",
    padding: "18px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 0 #b91c1c",
  },
};

export default AmbulancePage;