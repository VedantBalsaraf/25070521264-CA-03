# BorrowCircles

### A campus community app for sharing useful items

BorrowCircles helps students lend and borrow books, calculators, cameras, tools, and project equipment. It includes item listings, borrow requests, user accounts, dashboards, and community impact charts.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Recharts, GSAP |
| Backend | Node.js, Express, Mongoose, JWT |
| Database | MongoDB Community Server or MongoDB Atlas |
| Database viewer | MongoDB Compass (optional) |

## What you can do

- Create an account and sign in.
- Share items with photos, categories, condition, tags, and pickup location.
- Explore listings and send or manage borrow requests.
- View personal sharing and borrowing activity, plus community impact charts.
- Track listed items from the **My Items** dashboard tab.

## Prerequisites

Install these before starting:

1. **Node.js LTS and npm** — installs the JavaScript runtime and package manager.
2. **MongoDB Community Server** for a local database, or use your own MongoDB Atlas cluster.
3. **MongoDB Compass** is optional. It lets you browse the database; Compass does not run the database server.
4. **Git** if you are cloning this repository.

The project dependencies are listed in `client/package.json` and `server/package.json`. Run `npm ci` in each folder to install the exact locked versions; there is no separate dependency download list to maintain.

## Get the project

Clone the GitHub repository, then enter the folder that contains `client` and `server`:

```powershell
git clone <your-github-repository-url>
cd <repository-folder>
```

If the project is already downloaded, open PowerShell in its root folder — the folder that contains both `client` and `server`. Or enter that folder with its full path (quotes matter when the path contains spaces):

```powershell
Set-Location "C:\path\to\BorrowCircles"
```

Replace `C:\path\to\BorrowCircles` with the actual folder path on your computer. The commands below assume PowerShell is now at this project root.

## Configure the database and backend

From the project root, create the backend environment file if it does not already exist:

```powershell
if (!(Test-Path .\server\.env)) { Copy-Item .\server\.env.example .\server\.env }
```

Open `server/.env`. For MongoDB Community Server on the same computer, set:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/borrowcircles
```

Set `JWT_SECRET` to a private random value of at least 32 characters. Do not publish or commit `server/.env`.

### Start MongoDB Community Server on Windows

If MongoDB is installed as a Windows service, open PowerShell as Administrator and run:

```powershell
Start-Service MongoDB
```

If it is not installed as a service, start `mongod.exe` with the data directory used by your installation. Example for the `D:\MongoDB 2` installation on the developer's computer (check that this data folder exists first):

```powershell
& 'D:\MongoDB 2\bin\mongod.exe' --dbpath 'D:\MongoDB 2\data' --bind_ip 127.0.0.1 --port 27017 --logpath "$env:TEMP\borrowcircles-mongod.log" --logappend
```

Leave the MongoDB terminal running. On another computer, use that computer's MongoDB installation path. Do not start a second `mongod` if the service is already running.

### Use MongoDB Atlas instead

Set `MONGODB_URI` in `server/.env` to the Atlas connection string provided by Atlas. Replace the username and password placeholders with the Atlas **database user** credentials. Keep this URI private. To use Compass with Atlas, paste the same URI from `server/.env` into Compass; do not paste a real password into this public README.

## Install dependencies and start the app

Run each command from the project root. Start MongoDB first, then open **two PowerShell terminals**.

### Terminal 1 — Backend API

```powershell
cd .\server
npm ci
npm run dev
```

The API starts at <http://localhost:5100>. Health check: <http://localhost:5100/api/health>.

### Terminal 2 — Frontend

```powershell
cd .\client
npm ci
npm run dev
```

Open the website at **<http://localhost:5180>**. The Vite frontend forwards `/api` requests to the backend on port `5100`.

If you already installed dependencies, you can skip `npm ci` and run only `npm run dev` in each folder.

## View data in MongoDB Compass

For local MongoDB, open Compass, choose **Add new connection**, and paste the value of `MONGODB_URI` from `server/.env`. With the default local configuration, the URI is:

```text
mongodb://127.0.0.1:27017/borrowcircles
```

Click **Connect**, then open the `borrowcircles` database. It will appear after the application or seed script creates its first records. Compass and the backend see the same local data only when both use this URI on the same computer.

For Atlas, paste the Atlas URI from `server/.env` into Compass. Never commit or share a URI containing a password.

## Demo account

Seed demo data first in a new/empty database. From the project root, run:

```powershell
cd .\server
npm ci
npm run seed
```

Then sign in at <http://localhost:5180/login>:

| Email | Password |
| --- | --- |
| `arjun.patel@college.edu` | `Password123!` |

These are **demo-only credentials** created by the seed script. Do not use them in production. The seed command stops if the database already contains records, to protect existing data. Only reset disposable demo data if you deliberately want to erase all users, items, and borrow requests:

```powershell
$env:SEED_RESET = 'true'
npm run seed
Remove-Item Env:SEED_RESET
```

## Project structure

```text
BorrowCircles/
├── client/       # React frontend and Vite configuration
├── server/       # Express API, MongoDB models, routes, and seed script
├── README.md
└── .gitignore
```

## Security notes

- Keep `server/.env` and any real database URI private. Only commit the `.env.example` files.
- A local MongoDB database stays on its computer; cloning the GitHub project does not copy database records.
- If another person needs to access your data, use an appropriately secured shared database (for example, Atlas) and provide their own access. Do not share your personal database password.
