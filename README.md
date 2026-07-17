<div align="center">

# 📊 TeamPulse

**Team Performance Dashboard with OKR Tracking, Sprint Analytics, Meeting Notes & Retrospectives**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A comprehensive team performance management platform designed for engineering managers. Track OKRs (Objectives & Key Results), monitor sprint velocity, manage 1-on-1 meeting notes, run sprint retrospectives, and visualize team workload — all in one place.

</div>

---

## ✨ Features

### 🎯 OKR Tracker
- Set quarterly objectives with measurable key results
- Progress bars with color-coded status (on track / at risk / behind)
- Company → Team → Individual OKR hierarchy
- Historical OKR completion trends

### 📊 Sprint Analytics
- Sprint velocity chart (story points across sprints)
- Burndown trends and completion rates
- Individual contributor performance metrics
- Sprint-over-sprint improvement tracking

### 📝 Meeting Notes
- 1-on-1 meeting templates with agenda items
- Action items with assignees and due dates
- Follow-up tracking from previous meetings
- Meeting history archive

### 🔄 Retrospectives
- What went well / What to improve / Action items
- Anonymous feedback support
- Categorized insights with voting
- Retro-to-retro action item tracking

### 👥 Team Overview
- Member profiles with skills and roles
- Workload heatmap visualization
- Availability and capacity tracking
- Performance trend indicators

---

## 🏗️ Architecture

```
TeamPulse/
├── client/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Demo data and helpers
│   │   ├── hooks/             # Custom React hooks
│   │   └── styles/            # CSS with dark theme
│   └── package.json
├── server/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── models/            # Pydantic models
│   │   └── routers/           # API route handlers
│   └── requirements.txt
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript | Interactive dashboard UI |
| Backend | **Python + FastAPI** | REST API with auto-docs |
| Charts | Chart.js + react-chartjs-2 | Data visualization |
| Styling | CSS with glassmorphism | Premium dark theme |

## 🚀 Quick Start

### Frontend Only (Demo Mode)
```bash
cd client
npm install
npm run dev
```

### Full Stack
```bash
# Terminal 1 - Backend
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

### API Documentation
FastAPI auto-generates interactive docs at `http://localhost:8000/docs` (Swagger UI).

## 📝 License
MIT License - see [LICENSE](LICENSE) file.

---
<div align="center">

Built by [Khaled Noaman](https://github.com/KHALEDNOAMAN) — Aspiring Engineering Manager 🚀

*"What gets measured gets managed."* — Peter Drucker

</div>
