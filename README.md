This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

Before running the development server, you need to configure your database and initialize the Prisma client. Follow these steps:

### 1. Prerequisites
- **Node.js**: Make sure Node.js (v20+ recommended) is installed.
- **Database**: Make sure a **MySQL** or **MariaDB** server is running locally (e.g., via XAMPP).

### 2. Configure Environment Variables
1. Duplicate the `.env.example` file in the root directory and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the `DATABASE_URL` with your local database connection details:
   - **If your MySQL has a password** (replace `username`, `password`, and `3306` with your credentials/port):
     ```env
     DATABASE_URL="mysql://username:password@localhost:3306/gi_calc"
     ```
   - **If your MySQL has NO password** (e.g., standard XAMPP setup):
     ```env
     DATABASE_URL="mysql://root@localhost:3306/gi_calc"
     ```

### 3. Install Dependencies
Install all required Node.js packages by running:
```bash
npm install
```

### 4. Database Setup & Initialization
You must create the database structure and generate the Prisma Client. Choose **one** of the two approaches below:

#### Approach A: Run SQL Script (Recommended)
1. Open your database management tool (e.g., MySQL Workbench, DBeaver, phpMyAdmin, or SQL CLI).
2. Open and run the [gi_stat_db.sql](file:///c:/Users/Henry Budiana/Documents/GitHub/gi-dmg-calculator/gi_stat_db.sql) script located in the root directory. This script automatically creates the database `gi_calc`, the `Build` and `Rotation` tables, and inserts a sample seed build.
3. Generate the Prisma Client locally:
   ```bash
   npx prisma generate
   ```

#### Approach B: Prisma Migrations
1. Create an empty database named `gi_calc` in your local MySQL/MariaDB server.
2. Run Prisma migrations to deploy the schema to your database:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate the Prisma Client locally:
   ```bash
   npx prisma generate
   ```

---

### 5. Seed the Talent Scaling Data
The damage calculator requires character talent multiplier tables to be seeded in the database. Run the database seed script:
```bash
npm run db:seed
```

Once completed, you are ready to launch the web server!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
