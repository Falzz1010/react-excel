# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub repository dengan kode React Excel Hub
- Akun Vercel
- Supabase project

## Step-by-Step Deployment

### 1. **Setup Environment Variables di Vercel**

Setelah connect repository ke Vercel, tambahkan environment variables berikut:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 2. **Build Settings di Vercel**

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. **File Konfigurasi**

Pastikan file berikut ada di root project:

#### `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### `vite.config.ts`
- Sudah dikonfigurasi untuk production
- Base path: `/`
- Minifier: `esbuild`
- Output: `dist`

### 4. **Troubleshooting**

#### Jika tampilan putih:
1. Cek browser console untuk error
2. Pastikan environment variables sudah di-set
3. Cek network tab untuk failed requests
4. Pastikan Supabase URL dan key benar

#### Jika routing tidak berfungsi:
1. Pastikan `vercel.json` ada dan benar
2. Cek apakah semua routes di-handle oleh React Router

#### Jika build gagal:
1. Cek build logs di Vercel dashboard
2. Pastikan semua dependencies terinstall
3. Cek apakah ada TypeScript errors

### 5. **Environment Variables yang Diperlukan**

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.xlsx,.xls,.csv
```

### 6. **Deploy Commands**

```bash
# Local build test
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

## ✅ Checklist Deployment

- [ ] Repository connected ke Vercel
- [ ] Environment variables di-set
- [ ] Build berhasil tanpa error
- [ ] Preview local berfungsi
- [ ] Routing SPA berfungsi
- [ ] Supabase connection berfungsi
- [ ] File upload berfungsi

## 🔧 Common Issues & Solutions

### White Screen
- **Cause**: Missing environment variables atau routing issue
- **Solution**: Cek environment variables dan vercel.json

### Build Failed
- **Cause**: TypeScript errors atau missing dependencies
- **Solution**: Fix errors dan pastikan semua dependencies terinstall

### 404 on Refresh
- **Cause**: SPA routing tidak dikonfigurasi
- **Solution**: Pastikan vercel.json ada dengan rewrites

### Supabase Connection Error
- **Cause**: Wrong URL atau key
- **Solution**: Double-check environment variables
