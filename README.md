# GridSync: Advanced Decentralized Grid Reliability Platform

GridSync is a "Golden Standard" production-ready dashboard designed to monitor, manage, and optimize decentralized microgrids. Built with React, Three.js, and Leaflet, it provides an immersive, data-dense interface for grid operators to handle demand response, peer-to-peer energy trading, storage array management, and live grid compliance.

## 🚀 Key Features

*   **Interactive 3D Holographic View:** A live, rotating 3D topology of the microgrid. Watch energy flows and see visual feedback (e.g., Ice Blue glowing effects) when smart cooling protocols or load shedding events are triggered.
*   **Geographic Node Map:** Built with `react-leaflet`, providing a real-world geographic map of energy producers and consumers with real-time status markers.
*   **Peer-to-Peer (P2P) Trading Ledger:** A real-time blockchain-style ledger showing active energy trades between nodes, complete with CSV export functionality.
*   **Advanced Storage Array Control:** Monitor State of Charge (SOC), core temperatures, and degradation metrics. Includes manual overrides for forcing charge/discharge with autonomous AI.
*   **Grid Compliance (DISCOM Sync):** Monitor phase stability, THD (Harmonics), and grid frequency. Initiate Island Mode or re-sync to the national grid with a click.
*   **Demand Response Load Management:** Categorized views of Critical (Must Run) vs Flexible loads. Operators can manually toggle individual HVAC sectors or trigger emergency curtailment.
*   **AI Forecasting Simulator:** A dynamic, simulated generative AI matrix charting 24-hour supply vs demand predictions against ambient weather parameters.
*   **Glass-morphism UI & Animations:** Beautifully crafted dark-mode interface with glowing interactive buttons, custom confirmation modals, and CSS pulse highlighting for successful actions.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite)
*   **3D Rendering:** `@react-three/fiber`, `@react-three/drei`, `three`
*   **Mapping:** `leaflet`, `react-leaflet`
*   **Icons:** `lucide-react`
*   **Backend Simulator:** Express.js (Node.js) for live polling endpoints

## ⚙️ Installation & Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Backend API (Simulator) and Frontend:**
    ```bash
    npm run dev
    ```
    *(Ensure you are running the backend script `server.cjs` if separated, or rely on your unified dev command).*
3.  **View the Dashboard:**
    Open `http://localhost:5173` in your browser.

## 🔒 Action Confirmations

GridSync employs a rigorous safety protocol. Every manual override (e.g., Force Discharge, Settle Market, Initiate Island Mode) triggers a custom Confirmation Modal. Upon proceeding, the UI dynamically highlights the affected telemetry section, ensuring operators have clear visual feedback of their actions.
