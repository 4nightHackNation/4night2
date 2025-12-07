<h1 align="center">

<a href="#"> Radar Legislacyjny </a>

</h1>

<h3 align="center">Comprehensive monitoring of legislative processes in Poland</h3>

<h4 align="center">

     Status: In Development

</h4>

<p align="center">

<a href="#about">About</a> •

<a href="#features">Features</a> •

<a href="#how-it-works">How it works</a> •

<a href="#tech-stack">Tech Stack</a> •

<a href="#author">Author</a> •

<a href="#user-content-license">License</a>

</p>

## About

**Radar Legislacyjny** is an interactive platform for tracking legislative processes with a built-in public consultation system. The platform enables citizens, government officers, and administrators to monitor, participate in, and manage legislative acts from initiation to enactment.

The project provides full transparency of the legislative process, allowing users to:

- Track legal changes from pre-consultations to publication in the Journal of Laws
- Participate in public consultations and influence the shape of law
- Understand the impact of regulations on citizens, businesses, and public administration
- Manage legislative projects and officer accounts (for administrators)

---

## Features

### For Citizens

- [x] Browse legislative acts and their status
- [x] Subscribe to categories and projects for notifications
- [x] Add opinions during public consultation periods
- [x] View personal opinions and track legislative progress
- [x] Multi-language support (Polish, English, German, Ukrainian)

### For Officers

- [x] Create and edit legislative act projects
- [x] Review citizen submissions and opinions
- [x] Approve opinions for public consultations
- [x] Manage legislative progress and timelines
- [x] Access personal project dashboard

### For Administrators

- [x] Manage officer and administrator accounts (CRUD operations)
- [x] Generate secure passwords (12-character with letters, numbers, symbols)
- [x] System statistics (active officers, total projects)
- [x] Real-time search and filtering of accounts
- [x] Copy login credentials to clipboard
- [x] Account status management (activate/deactivate)
- [x] Full system administration access

---

## How it works

The project is divided into two parts:

1. **Backend** (separate repository)

2. **Frontend** (this repository)

This repository contains only the Frontend part. The Frontend requires the Backend to be running to work properly.

### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:

[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) (v18 or higher).

In addition, it is good to have an editor to work with the code like [VSCode](https://code.visualstudio.com/)

#### Running the web application (Frontend)

```bash



# Clone this repository

$ git clone git@github.com:yourusername/4night.git



# Access the project folder in your terminal

$ cd 4night



# Install the dependencies

$ npm install



# Run the application in development mode

$ npm run dev



# The application will open on the port: 8080 - go to http://localhost:8080



```

#### Building for production

```bash



# Build the application

$ npm run build



# Preview the production build

$ npm run preview



```

### Login Credentials

#### Citizen Account

- Email: `obywatel@example.com`
- Password: `obywatel123`
- Tab: **Citizen**

#### Officer Account

- Email: `urzednik@gov.pl`
- Password: `urzednik123`
- Tab: **Officer**

#### Administrator Account

- Email: `admin@gov.pl`
- Password: `admin123`
- Tab: **Administrator**
- Access: `/admin-zarzadzanie` - Account management panel

---

## Tech Stack

The following tools were used in the construction of the project:

#### **Platform** ([React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/))

- **[React Router Dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)** - Client-side routing

- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library (via Lucide React)

- **[TanStack Query](https://tanstack.com/query)** - Data fetching and state management

- **[React Hook Form](https://react-hook-form.com/)** - Form handling and validation

- **[Zod](https://zod.dev/)** - Schema validation

- **[i18next](https://www.i18next.com/)** - Internationalization framework

- **[shadcn/ui](https://ui.shadcn.com/)** - UI component library

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

- **[date-fns](https://date-fns.org/)** - Date utility library

- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

> See the file [package.json](https://github.com/fszreder/4night/blob/master/package.json)

#### **Utils**

- API: Backend API integration (to be implemented)

- Editor: **[Visual Studio Code](https://code.visualstudio.com/)**

- Icons: **[Lucide React](https://lucide.dev/)**

- Fonts: System fonts with Tailwind CSS typography

- Build Tool: **[Vite](https://vitejs.dev/)** - Next generation frontend tooling

---

## Authors

 <a href="https://github.com/kaspares">

 <img style="border-radius: 50%;" src="https://github.com/kaspares.png" width="70px;" alt="Author"/>

 <p><b>Kacper Kazimierczuk</b></p></a>

  <a href="https://github.com/mpisak">

 <img style="border-radius: 50%;" src="https://github.com/mpisak.png" width="70px;" alt="Author"/>

 <p><b>Mateusz Pisański</b></p></a>

  <a href="https://github.com/weedfi">

 <img style="border-radius: 50%;" src="https://github.com/weedfi.png" width="70px;" alt="Author"/>

 <p><b>Dawid Filas</b></p></a>

<a href="https://github.com/damigus">

 <img style="border-radius: 50%;" src="https://github.com/damigus.png" width="70px;" alt="Author"/>

 <p><b>Damian Guz</b></p></a>

<a href="https://github.com/fszreder">

 <img style="border-radius: 50%;" src="https://github.com/fszreder.png" width="70px;" alt="Author"/>

 <p><b>Filip Szreder</b></p></a>
 
  <a href="https://github.com/piaskar">

 <img style="border-radius: 50%;" src="https://github.com/piaskar.png" width="70px;" alt="Author"/>

 <p><b>Maciej Piasecki</b></p></a>

---

## Licencja

Projekt opracowany dla HackNations 2025

---

## Learn More

This project was created and bootstrapped with [Vite](https://vitejs.dev/).

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).

For shadcn/ui components, visit the [shadcn/ui documentation](https://ui.shadcn.com/).
