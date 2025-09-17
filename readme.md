# e-Monev Bengkulu Utara Backend

Sistem backend untuk aplikasi e-Monev Kabupaten Bengkulu Utara. Proyek ini bertujuan untuk mendukung monitoring dan evaluasi program pemerintah secara digital.

## Fitur Utama

- Manajemen data program dan kegiatan
- Autentikasi pengguna
- API RESTful untuk integrasi frontend
- Laporan dan statistik

---

## Tools & Teknologi yang Digunakan

| Tools      | Icon                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| Node.js    | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)    |
| Express.js | ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) |
| MongoDB    | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)    |

---
## Instalasi

```bash
git clone https://github.com/rafinandika/e-monev-utara-be.git
cd e-monev-utara-be
npm install
```
---
## Menjalankan Server

```bash
npm start
```
---
## Dokumentasi API

Dokumentasi API tersedia di endpoint `/api-docs` setelah server dijalankan.
Kamu juga bisa join ke [Postman Workspace](https://app.getpostman.com/join-team?invite_code=dcb38adf2b04cb531b709cddf81cf0112c69c4221a899daaf4bb286825ed6c47&target_code=dcb4ed5a420476c36e0061a18b3d0610)

---

## Migration Guide

Setelah menyelesaikan proses instalasi, lakukan migrasi dengan menjalankan perintah

```bash
npm run migrate
npm run generate
```

Tambahkan User Admin

```bash
npm run seed
```

Fetch data master dari kepmendagri nomor 050-5889 tahun 2021 
``` bash
npm run seed-master
```

---
## Kontribusi

Silakan buat pull request atau buka issue untuk perbaikan dan pengembangan lebih lanjut.
