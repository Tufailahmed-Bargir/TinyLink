# 🔗 TinyLink - A High-Performance URL Shortener Service

**TinyLink** is a modern, full-stack URL shortening service inspired by bit.ly. It provides core functionality for link creation, robust click tracking, link management, and dedicated statistics pages. The application is built for performance and testability, adhering strictly to defined API and URL conventions.
#  Landing page
<img width="1893" height="800" alt="Screenshot 2025-12-05 233653" src="https://github.com/user-attachments/assets/2b9cb22b-c55d-4e9c-8295-6f3af10b88e3" />
# Dashboard page
<img width="1583" height="754" alt="Screenshot 2025-12-05 233718" src="https://github.com/user-attachments/assets/1f371fc4-873f-4d5b-960d-fe0dc526a726" />
# Stat page of the link
<img width="842" height="734" alt="Screenshot 2025-12-05 233817" src="https://github.com/user-attachments/assets/2cdf8282-d78d-46fc-b5cc-c2550903a9f4" />
# Deleting functionality
<img width="842" height="734" alt="Screenshot 2025-12-05 233817" src="https://github.com/user-attachments/assets/3a7e75de-9b51-467e-8e43-5c48299f5a3e" />


## 🚀 Core Features

The application implements all required functionalities[cite: 1]:

1.  **Create Short Links:** Users can shorten long URLs and optionally provide a custom short code (e.g., `docs`)[cite: 1].
    **Validation:** Target URLs are validated before saving[cite: 1].
    * **Conflict Handling:** If a custom code already exists, the API returns a **409 Conflict** status[cite: 4, 1].
    * **Code Rules:** Codes must be 6-8 alphanumeric characters (`[A-Za-z0-9]{6,8}`).
2.  **Redirection & Tracking:**
    * Visiting the short URL (`/:code`) performs an **HTTP 302 Redirect** to the target URL[cite: 3, 1].
    * Each redirect atomically **increments the `totalClicks` count** and **updates the `lastClickedAt` time**[cite: 2].
3.  **Link Management:** Users can delete existing links[cite: 2].
    * After deletion, the short URL must return a **404 Not Found** status[cite: 2, 3].
4.  [**Dashboard (`/`)**: A table showing all links, including Short code, Target URL, Total clicks, and Last clicked time[cite: 2, 3].
5.  **Stats Page (`/code/:code`)**: A dedicated page for viewing detailed click statistics for a single link.
6.  **Healthcheck (`/healthz`)**: A public endpoint returning status 200 and system details.

***

## ⚙️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Full-stack React framework for SSR and API Routes[cite: 1]. |
| **Database** | **PostgreSQL** | A robust relational database (e.g., hosted on Neon)[cite: 1]. |
| **ORM** | **Prisma** | Database toolkit used for migrations and type-safe data access. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid and responsive UI development. |
| **Hosting** | **Vercel** | Recommended deployment platforms. |

***

## 📂 Folder Structure

The project utilizes the **Next.js App Router** structure. Dynamic route segments are defined using brackets (e.g., `[code]`).



```text
app/
├── api/
│   └── links/
│       ├── [code]/          <-- Maps to /api/links/:code
│       │   └── route.ts     <-- GET (Stats) & DELETE (Link Deletion)
│       └── route.ts         <-- Maps to /api/links (POST: Create, GET: List)
├── healthz/
│   └── route.ts             <-- Handles GET /healthz
├── code/
│   └── [code]/
│       └── page.tsx         <-- UI for /code/:code (Stats Page)
├── [code]/
│   └── route.ts             <-- CRITICAL: Handles GET /:code (The Redirect Logic)
└── page.tsx                 <-- UI for / (Dashboard/Home Page)
```

