# 📊 React Excel Hub

Aplikasi web modern dan powerful untuk mengelola data Excel dengan kolaborasi real-time, dibangun menggunakan React, TypeScript, dan Supabase.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?logo=tailwindcss)

## ✨ Fitur

- 📁 **Manajemen File Excel** - Upload, lihat, dan kelola file Excel
- 🔍 **Filter Data Lanjutan** - Filter data berdasarkan kolom, tanggal, dan kriteria kustom
- 📊 **Visualisasi Data** - Chart dan grafik interaktif
- 🔄 **Kolaborasi Real-time** - Beberapa user dapat bekerja bersamaan
- 🎨 **UI/UX Modern** - Interface yang indah dibangun dengan komponen shadcn/ui
- 🌙 **Mode Gelap/Terang** - Toggle antar tema
- 📱 **Desain Responsif** - Bekerja di desktop, tablet, dan mobile
- 🔐 **Autentikasi** - Autentikasi user yang aman dengan Supabase
- 📤 **Opsi Export** - Export data ke berbagai format
- 🔍 **Pencarian & Sorting** - Kemampuan pencarian dan sorting yang powerful

## 🚀 Mulai Cepat

### Persyaratan

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Akun Supabase

### Tutorial Instalasi

#### 1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/react-excel-hub.git
   cd react-excel-hub
   ```

#### 2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

#### 3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Isi kredensial Supabase di file `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### 4. **Setup Database Supabase**

**Langkah 1: Buat Project Supabase**
1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Login atau daftar akun
4. Klik "New Project"
5. Pilih organization dan isi detail project:
   - Name: `react-excel-hub`
   - Database Password: (buat password yang kuat)
   - Region: pilih yang terdekat (Singapore untuk Indonesia)
6. Klik "Create new project"

**Langkah 2: Setup Database Schema**
1. Setelah project selesai dibuat, buka SQL Editor
2. Copy isi file `supabase/migrations/20250924105945_aebf19a1-8e56-426f-8e8e-f3625af9402f.sql`
3. Paste ke SQL Editor dan klik "Run"

**Langkah 3: Dapatkan API Keys**
1. Buka Settings > API
2. Copy "Project URL" dan "anon public" key
3. Masukkan ke file `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Langkah 4: Setup Authentication (Opsional)**
1. Buka Authentication > Settings
2. Enable "Email" provider
3. Atur "Site URL" ke `http://localhost:8080`
4. Atur "Redirect URLs" ke `http://localhost:8080/**`

#### 5. **Jalankan Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

#### 6. **Buka Browser**
   Navigasi ke `http://localhost:8080`

## 🛠️ Script yang Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run build:dev` - Build dalam mode development
- `npm run preview` - Preview production build
- `npm run lint` - Jalankan ESLint

## 🏗️ Struktur Project

```
src/
├── components/          # Komponen UI yang dapat digunakan ulang
│   ├── ui/             # Komponen shadcn/ui
│   ├── ExcelDashboard.tsx
│   ├── DataTable.tsx
│   ├── FileUpload.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useExcelData.ts
│   └── useItems.ts
├── pages/              # Komponen halaman
│   ├── Dashboard.tsx
│   ├── ExcelPage.tsx
│   ├── Auth.tsx
│   └── ...
├── integrations/       # Integrasi layanan eksternal
│   └── supabase/
├── layouts/            # Komponen layout
├── providers/          # Context providers
└── lib/               # Fungsi utility
```

## 🎨 Tech Stack

### Frontend
- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool dan dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Library komponen UI
- **React Router** - Client-side routing
- **React Query** - Data fetching dan caching
- **React Hook Form** - Manajemen form
- **Zod** - Validasi schema

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Keamanan data

### Library Tambahan
- **XLSX** - Pemrosesan file Excel
- **Recharts** - Visualisasi data
- **Lucide React** - Icons
- **Date-fns** - Utility tanggal
- **SweetAlert2** - Alert yang indah

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env` di root directory:

```env
# Konfigurasi Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Opsional: Konfigurasi tambahan
NODE_ENV=development
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.xlsx,.xls,.csv
```

### Setup Supabase

1. Buat project Supabase baru
2. Jalankan file migration: `supabase/migrations/20250924105945_aebf19a1-8e56-426f-8e8e-f3625af9402f.sql`
3. Enable Row Level Security pada tabel
4. Setup authentication providers jika diperlukan

## 📱 Ringkasan Fitur

### Dashboard
- Overview semua file yang diupload
- Akses cepat ke file terbaru
- Statistik data dan chart

### Manajemen Excel
- Upload file Excel (.xlsx, .xls, .csv)
- Lihat data dalam format tabel
- Edit data secara inline
- Simpan perubahan kembali ke file

### Filter Data
- Filter berdasarkan kolom apapun
- Filter berdasarkan range tanggal
- Query pencarian kustom
- Opsi filtering lanjutan

### Opsi Export
- Export ke Excel
- Export ke PDF
- Export ke CSV
- Print data

## 🚀 Deployment

### Vercel (Direkomendasikan)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

### Netlify

1. Build project: `npm run build`
2. Deploy folder `dist` ke Netlify
3. Tambahkan environment variables di Netlify dashboard

### Platform Lain

Aplikasi dapat di-deploy ke platform apapun yang mendukung static sites:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- DigitalOcean App Platform

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch: `git checkout -b feature/fitur-menarik`
3. Commit perubahan: `git commit -m 'Tambahkan fitur menarik'`
4. Push ke branch: `git push origin feature/fitur-menarik`
5. Buat Pull Request

## 📝 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Ucapan Terima Kasih

- [shadcn/ui](https://ui.shadcn.com/) untuk komponen UI yang indah
- [Supabase](https://supabase.com/) untuk infrastruktur backend
- [Vite](https://vitejs.dev/) untuk build tool yang luar biasa
- [React](https://reactjs.org/) untuk library UI yang fantastis

## 📞 Dukungan

Jika ada pertanyaan atau butuh bantuan, silakan:

1. Cek halaman [Issues](https://github.com/yourusername/react-excel-hub/issues)
2. Buat issue baru jika masalah belum dilaporkan
3. Hubungi maintainers

---

Dibuat dengan ❤️ oleh Naufal Rizky Putera