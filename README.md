# The Sticky Notes Web Application

## Overview

The Sticky Notes is a modern, responsive web application built with React and Vite, designed to help users create, manage, and organize their notes efficiently. The application features authentication, note creation, editing, and deletion functionalities.

## Features

- User Authentication (Signup/Login)
- Create new notes with custom colors and formatting
- Edit existing notes
- Delete notes
- Persistent storage using Appwrite

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14.0.0 or later)
- npm (version 6.0.0 or later)
- Git

## Technology Stack

- React
- Vite
- Appwrite (Backend as a Service)
- Tailwind CSS
- React Router

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/OmMTelrandhe/The_Notes.git
cd TheStckyNotes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Appwrite

1. Create an account on [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project
3. Set up Authentication (Email/Password)
4. Create a new Database and Collection for notes

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_APPWRITE_URL=your_appwrite_project_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

Replace the placeholders with your actual Appwrite project details.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

To build the project for production:

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

- Ensure all environment variables are correctly set
- Check that you have the latest version of Node.js
- Verify Appwrite project configurations

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Om Telrandhe - omtelrandhe30@gmail.com

Project Link: [https://github.com/OmMTelrandhe/The_Notes](https://github.com/OmMTelrandhe/The_Notes)
