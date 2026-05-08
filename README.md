# FieldOps

A professional field service management system designed to streamline communication and task delegation between admins, workers, and clients.

## Description

I developed FieldOps to solve the complexity of managing on-field operations and task lifecycles. This platform allows administrators to assign jobs to specific workers while giving clients a transparent view of their service status. With integrated AI for task optimization, it removes the manual effort of writing detailed job descriptions and ensures a smooth workflow from pending to completion.

## Tech Stack

* **Frontend:** React, Tailwind CSS, React Icons, Axios, React Router Dom
* **Backend:** Node.js, Express, JWT, Bcrypt, Groq API, Cors
* **Database & Hosting:** MongoDB with Mongoose, Github, Vercel

## Core Features

* **Admin Task Delegation:** Admins can assign specific tasks to workers with complete client details.
* **AI-Assisted Workflow:** Integrated Groq AI suggests improved task titles and generates full descriptions to help admins work faster.
* **Real-time Status Tracking:** Workers can update job stages (Pending, In-Progress, or Confirmed) so everyone stays in the loop.
* **Client Transparency:** Clients can view the progress of their specific tasks and have the authority to cancel if needed.
* **Professional Reporting:** Dedicated views for pending, active, and completed milestones to keep operations organized.

## Live Demo
Experience the application live: [field-ops-flame.vercel.app](field-ops-flame.vercel.app)

## Setup Instructions

The frontend and backend are both located in this single repository. Follow these steps to run it locally:

1. **Clone the repository**

```bash
git clone https://github.com/MuhammadShahzaib607/Spendl.git
```

2. **Backend Setup**

Navigate to the server folder, install dependencies, and configure your **.env variables** (PORT, MONGO_URI, JWT_SECRET, API_KEY).

```bash
npm install
```

```bash
npm run start
```

3. **Frontend Setup**

```bash
npm install
```

```bash
npm run dev
```
