# 📊 React Excel Hub

A powerful and modern web application for managing Excel data with real-time collaboration, built with React, TypeScript, and Supabase.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?logo=tailwindcss)

## ✨ Features

- 📁 **Excel File Management** - Upload, view, and manage Excel files
- 🔍 **Advanced Data Filtering** - Filter data by columns, dates, and custom criteria
- 📊 **Data Visualization** - Interactive charts and graphs
- 🔄 **Real-time Collaboration** - Multiple users can work simultaneously
- 🎨 **Modern UI/UX** - Beautiful interface built with shadcn/ui components
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📤 **Export Options** - Export data to various formats
- 🔍 **Search & Sort** - Powerful search and sorting capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/react-excel-hub.git
   cd react-excel-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in the `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration file in `supabase/migrations/` to set up your database
   - Copy your project URL and anon key to the `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ExcelDashboard.tsx
│   ├── DataTable.tsx
│   ├── FileUpload.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useExcelData.ts
│   └── useItems.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── ExcelPage.tsx
│   ├── Auth.tsx
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/
├── layouts/            # Layout components
├── providers/          # Context providers
└── lib/               # Utility functions
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data security

### Additional Libraries
- **XLSX** - Excel file processing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Date-fns** - Date utilities
- **SweetAlert2** - Beautiful alerts

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional configuration
NODE_ENV=development
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.xlsx,.xls,.csv
```

### Supabase Setup

1. Create a new Supabase project
2. Run the migration file: `supabase/migrations/20250924105945_aebf19a1-8e56-426f-8e8e-f3625af9402f.sql`
3. Enable Row Level Security on your tables
4. Set up authentication providers if needed

## 📱 Features Overview

### Dashboard
- Overview of all uploaded files
- Quick access to recent files
- Data statistics and charts

### Excel Management
- Upload Excel files (.xlsx, .xls, .csv)
- View data in a table format
- Edit data inline
- Save changes back to the file

### Data Filtering
- Filter by any column
- Date range filtering
- Custom search queries
- Advanced filtering options

### Export Options
- Export to Excel
- Export to PDF
- Export to CSV
- Print data

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Other Platforms

The app can be deployed to any platform that supports static sites:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vite](https://vitejs.dev/) for the amazing build tool
- [React](https://reactjs.org/) for the fantastic UI library

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/react-excel-hub/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

Made with ❤️ by [Your Name]