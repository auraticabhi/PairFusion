<div>
<div align="center">
  <!-- <img src="https://i.ibb.co/BSFdWWm/pairfusionlogo-modified.png" alt="PairFusion Logo" width="50px" /> -->
  <h1>PairFusion</h1>
  <p><strong>The Collaborative Canvas for Code.</strong></p>
  <p>A real-time, scalable and feature-rich collaborative IDE built for modern development teams. Experience seamless pair programming, instant feedback, and a professional-grade toolset designed for maximum productivity.</p>
  
  <p>
    <a href="https://pair-fusion.vercel.app/"><strong>Live Demo</strong></a>
  </p>

<br />

<p align="center">
  <img src="https://i.ibb.co/tpV29L4m/Screenshot-1156.png" alt="PairFusion Screenshot" width="100%">
</p>
</div>

---

## 🚀 About PairFusion

**PairFusion** is not just a code editor; it's a complete collaborative ecosystem. It is developed from the ground up to address the core challenges of remote pair programming: latency, state synchronization, and user experience. It provides a robust platform where multiple developers can join a room, share a unique session, and work on a shared codebase as if they were in the same room.

The project's foundation is built on principles of **scalability, resiliency, and professional UX**, making it a showcase of modern full-stack web development.

## ✨ Key Features

*   **Real-Time Multi-Cursor Editing:** See your collaborators' cursors, typing and movements instantly as they happen.
*   **Synchronized File System:** A shared file explorer where creating, renaming, or deleting files and directories is instantly reflected for all users.
*   **Professional IDE Layout:** An intuitive, VS Code-inspired interface with a resizable sidebar and a dedicated bottom panel for code execution output.
*   **AI-Powered Copilot:** An integrated AI assistant to generate code snippets, solve errors, and help overcome developer blocks.
*   **Multi-Language Code Execution:** Securely run code in over 50+ languages within a sandboxed environment, powered by the Piston API.
*   **Integrated Chat:** A real-time group chat for seamless communication within your workspace.
*   **Advanced UX:** A polished experience with custom modals, keyboard shortcuts, and a responsive design that feels fluid and modern.

## 🛠️ Architectural Highlights

This project was built to demonstrate proficiency in creating production-grade, scalable systems.

*   **Scalable Backend Architecture:** The Node.js backend is architected to be **stateless**. All transient application data (user sessions, room state) is managed by a centralized **Redis** instance. This approach eliminates any single point of failure.
*   **Horizontally Scalable Real-Time Layer:** Real-time events are broadcast across multiple server instances using the **Socket.IO Redis Adapter**, which leverages Redis Pub/Sub. This allows the application to handle a massive number of concurrent users by simply adding more server instances.
*   **Resilient State Synchronization:** The application is self-healing. A client that temporarily disconnects due to network issues will automatically request and receive the latest workspace state from other peers in the room upon reconnection, ensuring a consistent and bug-free experience.
*   **Containerized Full-Stack Deployment:** The entire application stack (React Frontend, Node.js Backend, Redis) is containerized using **Docker** and orchestrated with **Docker Compose**. This guarantees a consistent, one-command setup for any developer and prepares the application for modern cloud deployment.
*   **Professional UI/UX:** Comes with a polished and modern UI, intuitive interactions, meticulously designed for a seamless and professional user flow. Every element contributes to a truly modern feel, ensuring an experience.

## 💻 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Framer Motion, CodeMirror |
| **Backend** | Node.js, Express, Socket.IO, TypeScript |
| **Database/Cache** | Redis |
| **Deployment** | Docker, Docker Compose, GCP, Vercel, Cloudflare(as Reverse Proxy) |
| **APIs** | Piston API (Code Execution), Pollinations AI (Copilot) |

## ⚙️ Getting Started

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/) must be installed on your system.

### Installation & Launch

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/auraticabhi/PairFusion.git
    cd PairFusion
    ```

2.  **Set up environment variables:**
    You will need to create a `.env` file in the `server` directory and a `.env` file in the `client` directory if you are customizing URLs.

    ```env
    client
    VITE_BACKEND_URL=""

    server
    REDIS_URL=redis://127.0.0.1:6379
    PORT=3000

3.  **Run the application stack:**
    The entire application (frontend, backend, Redis) can be launched with a single command.
    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**
    *   **Client (Frontend):** `http://localhost:5173`
    *   **Server (Backend):** `http://localhost:3000`

---
  For any questions or feedback, please reach out via GitHub Issues or email: abhijeetgupta989@gmail.com.