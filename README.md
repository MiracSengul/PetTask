# 🐾 Petlove - Frontend

React + Redux Toolkit + Vite ile geliştirilmiş evcil hayvan platformu.

## Kurulum

```bash
npm install
npm run dev
```

## Teknolojiler

- **React 18** — UI framework
- **Redux Toolkit** — State management
- **React Router v6** — Routing
- **Axios** — HTTP istekleri
- **React Hook Form + Yup** — Form doğrulama
- **React Select** — Gelişmiş dropdown
- **React Toastify** — Bildirimler
- **Vite** — Build tool

## Proje Yapısı

```
src/
├── api/          # Axios instance
├── components/
│   ├── Header/   # Header + burger menü
│   ├── Modals/   # Tüm modal bileşenler
│   └── common/   # Title, SearchField, Pagination, Loader, PetBlock, PrivateRoute, PublicRoute
├── pages/
│   ├── Home/
│   ├── News/
│   ├── Notices/
│   ├── Friends/
│   ├── Register/
│   ├── Login/
│   ├── Profile/
│   ├── AddPet/
│   └── NotFound/
└── redux/
    ├── slices/authSlice.js
    └── store.js
```

## Sayfalar

| Sayfa | Yol | Erişim |
|-------|-----|--------|
| Home | `/home` | Herkese açık |
| News | `/news` | Herkese açık |
| Notices | `/notices` | Herkese açık |
| Our Friends | `/friends` | Herkese açık |
| Register | `/register` | Yalnızca yetkisiz |
| Login | `/login` | Yalnızca yetkisiz |
| Profile | `/profile` | Yalnızca yetkili |
| Add Pet | `/add-pet` | Yalnızca yetkili |

## Backend API

`https://petlove.b.goit.study/api-docs/`

## Özellikler

- ✅ Responsive tasarım (320px → 768px → 1280px)
- ✅ JWT token ile kimlik doğrulama
- ✅ LocalStorage'de token saklama
- ✅ React Hook Form + Yup doğrulama
- ✅ Server-side pagination
- ✅ Haber arama
- ✅ İlan filtreleme (kategori, cinsiyet, tür, sıralama)
- ✅ Favori ilanlar
- ✅ Evcil hayvan ekleme/silme
- ✅ Profil düzenleme
- ✅ Responsive burger menü
- ✅ Toast bildirimleri
- ✅ Modal bileşenler (Escape / backdrop ile kapatma)
