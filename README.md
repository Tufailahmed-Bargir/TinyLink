# 🔗 TinyLink - A High-Performance URL Shortener Service

**TinyLink** is a modern, full-stack URL shortening service inspired by bit.ly. It provides core functionality for link creation, robust click tracking, link management, and dedicated statistics pages. The application is built for performance and testability, adhering strictly to defined API and URL conventions.
# <div align="center">  Landing Page  </div>
<img width="1893" height="800" alt="Screenshot 2025-12-05 233653" src="https://github.com/user-attachments/assets/2b9cb22b-c55d-4e9c-8295-6f3af10b88e3" /></br>
# <div align="center">  Dashboard Page  </div>
<img width="1583" height="754" alt="Screenshot 2025-12-05 233718" src="https://github.com/user-attachments/assets/1f371fc4-873f-4d5b-960d-fe0dc526a726" /></br>
# <div align="center">  Stat of link  </div>
<img width="1146" height="858" alt="Screenshot 2025-12-06 190839" src="https://github.com/user-attachments/assets/8624f692-c849-4283-842f-e5bec6615fb7" />
</br>
# <div align="center">  Deleting functionality  </div>
<img width="743" height="347" alt="Screenshot 2025-12-05 233739" src="https://github.com/user-attachments/assets/9977b46f-a47f-4898-9a0e-79d30a63069d" /></br>
# <div align="center">Signin using google using next authentication (Optional Not mentioned in the assignment)</div>
<img width="905" height="426" alt="Screenshot 2025-12-06 080433" src="https://github.com/user-attachments/assets/dcf5a029-5162-4e72-9834-c09f249cbe0a" />
</br>

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
| **Framework** | **Next.js (App Router)** | Full-stack React framework for SSR and API Routes. |
| **Database** | **PostgreSQL** | A robust relational database . |
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
***

## 🗺️ API Endpoints and Public Routes

| Category | Path | Description |
| :--- | :--- | :--- |
| **Public Route (UI Page)** | **/** | Dashboard UI — Create, list, and delete short links. (`app/page.tsx`) |
| **Public Route (UI Page)** | **/code/:code** | Shows detailed click analytics for a specific short link. (`app/code/[code]/page.tsx`) |
| **Public API Route** | **/:code** | Redirect handler — increments click count + redirects to target URL. (`app/[code]/route.ts`) |
| **Public API Route** | **/healthz** | Health check endpoint that returns system status. (`app/healthz/route.ts`) |

---

## 🌍 Public Routes / UI Pages

| Purpose | Path | File Location | Action |
| :--- | :--- | :--- | :--- |
| **Dashboard** | **/** | `app/page.tsx` | Main UI — Create, list, delete links |
| **Stats Page** | **/code/:code** | `app/code/[code]/page.tsx` | Displays detailed link analytics |
| **Redirect Handler** | **/:code** | `app/[code]/route.ts` | Increments click count + redirects |
| **Health Check** | **/healthz** | `app/healthz/route.ts` | Confirms service status |

---

## 🔁 Status Code Rules

| Path | Status Codes | Expected Behavior |
| :--- | :--- | :--- |
| **/:code** | **302 Redirect** or **404 Not Found** | Update `totalClicks` before redirect; return 404 if invalid or deleted |
| **/healthz** | **200 OK** | Must return valid JSON → `{ "ok": true }` |

---

## 🔌 REST API Endpoints

Used by frontend components — stateless + JSON responses.

| Method | Path | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/links` | Create short link w/ validation | 200, 400, 409 |
| **GET** | `/api/links` | List all links | 200 |
| **GET** | `/api/links/:code` | Fetch single link stats for Stats page | 200, 404 |
| **DELETE** | `/api/links/:code` | Remove a link | 200, 404 |

---

## 🛠️ Setup & Local Development

### 1️⃣ Clone

```bash
git clone https://github.com/Tufailahmed-Bargir/TinyLink
cd tinylink
```

### 2️⃣ Install Packages

```bash
bun  install
```

### 3️⃣ Create Environment File

cp .env.example .env

### 4️⃣ Apply Database Migrations

```bash
npx prisma migrate dev --name init
```

### 5️⃣ Run Dev Server

```bash
bun dev
```

Visit → http://localhost:3000

---
