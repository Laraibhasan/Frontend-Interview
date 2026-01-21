CA Monk Blog Application - Dashboard
This project is a modern, high-performance blog application built for the CA Monk Frontend Assignment. It demonstrates advanced state management using TanStack Query, a clean Two-Panel UI built with Tailwind CSS, and robust CRUD operations.

🚀 Key Features
Task 1: Real-time Blog Dashboard * Fetches the full blog list via GET /blogs.

Implements independent scrolling for the list view.

Handles loading states with skeletons/spinners and robust error handling.

Task 2: Dynamic Content Rendering

Implements a single-view panel that fetches content by ID via GET /blogs/:id.

Features a premium reading experience with cover images and formatted plain text.

Task 3: Mutation & Cache Invalidation

Features a custom modal for creating new blog posts using POST /blogs.

Uses TanStack Query's onSuccess mutation hook to invalidate the cache, ensuring the UI updates instantly without a page refresh.

Advanced Management: Integrated Delete functionality to manage posts directly from the UI using DELETE /blogs/:id.

🛠️ Technical Stack
Framework: React.js (Vite).

State Management: TanStack Query (v5) — Compulsory.

Styling: Tailwind CSS (v4) & shadcn/ui components — Compulsory.

API Client: Axios for structured REST requests.

Backend: JSON Server (running on port 3001).

📂 Project Structure
Plaintext

src/
├── main.tsx        # Entry point: Sets up QueryClientProvider
├── index.css       # Global styles: Tailwind v4 directives
├── App.tsx         # Main Logic: Two-panel layout & TanStack hooks
├── api.ts          # API Layer: Centralized Axios requests
└── db.json         # Database: JSON Server storage
🏁 Setup & Installation
Clone the Repository:

Bash

git clone <your-forked-repo-url>
cd camonk-interview
Install Dependencies:

Bash

npm install
Run the Backend (Terminal 1):

Bash

npm run server
# Running on http://localhost:3001
Run the Frontend (Terminal 2):

Bash

npm run dev
# Running on http://localhost:5173
Final Submission Checklist
[x] All TanStack Query hooks implemented (useQuery, useMutation).

[x] Two-Panel layout functional and responsive.

[x] Tailwind CSS v4 configured and styling visible.

[x] CRUD operations (Get, Create, Delete) verified.
