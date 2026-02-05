## 📌 Problem Statement

Many ambulances lack equipment for continuous monitoring of Blood Pressure, Heart Rate, and SpO₂, preventing doctors from assessing patient condition before hospital arrival.

## 💡 Project Overview

This project proposes a Real-Time Ambulance Patient Monitoring System that continuously measures vital signs and transmits them to doctors through cloud connectivity, enabling early medical assessment and preparation.

The system is software-focused, while hardware is conceptually designed using Tinkercad.

## 🎯 Objectives

Continuous monitoring of BP, Heart Rate, SpO₂

Real-time cloud transmission

Alert generation for abnormal vitals

Remote access for doctors

## 🧠 System Architecture

The system follows a **Client–Server Architecture**:

| Module | Description |
|--------|-------------|
| **Hardware (Simulated)** | Sensor-based monitoring using Tinkercad conceptual model |
| **Signal Processing** | Noise filtering and signal enhancement using MATLAB (Butterworth Bandpass Filter) |
| **Cloud Backend** | Handles API requests, data processing, and communication between device and dashboard |
| **Database** | Stores patient vitals, monitoring logs, and historical health data |
| **Frontend Dashboard** | Web-based interface (HTML, CSS, JavaScript, React.js) for real-time visualization |

## 🔬 Working Principle
📍 Signal Acquisition

Uses Photoplethysmography (PPG) technique:

IR light reflects based on blood volume changes

Signal converted via ADC

Processed by microcontroller

🧩 Sensor Used

MAX30102

Emits red & IR light

Detects reflected light

Provides digital Heart Rate & SpO₂ data

## 🧮 MATLAB Signal Processing

4th Order Butterworth Bandpass Filter

Removes motion & environmental noise

Improves PPG signal accuracy

## 🌐 Software Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML, CSS, JavaScript, React.js |
| **Backend** | Server APIs for data processing and communication |
| **Database** | Cloud Database for storing patient vitals and logs |
| **Simulation** | MATLAB for signal filtering and analysis |
| **Hardware Design** | Tinkercad for conceptual circuit simulation |

## 🔄 System Workflow

Sensors collect vital signs

Data transmitted to cloud

Database stores data

Dashboard fetches live data

Doctors monitor remotely

Alerts for abnormal readings

## 📊 Results

✔ Continuous real-time monitoring
✔ Reliable data transmission
✔ Early detection of abnormal vitals
✔ Centralized data access for doctors

## ✅ Advantages

Real-time remote monitoring

Improves emergency response

Scalable cloud architecture

Cost-effective solution

## ⚠️ Limitations

Optical sensing not effective on burn injuries

## 🚀 Future Enhancements

Integration with real medical IoT devices

AI-based patient deterioration prediction

5G low-latency transmission
