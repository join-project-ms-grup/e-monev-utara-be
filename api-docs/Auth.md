# Auth API Documentation

Dokumentasi ini menjelaskan proses autentikasi (Auth) dan cara mendapatkan token pada API.

## Endpoint Login

```
Role : All Role
```
```http
POST /api/auth/login
```

### Request Body

```json
{
       "username": "your_username",
       "password": "your_password"
}
```

### Proses Autentikasi

- Password yang dikirim akan diverifikasi menggunakan bcrypt di sisi backend (Node.js).
- Jika password valid, server akan menghasilkan token (misal JWT) untuk otorisasi selanjutnya.

### Response Sukses

```json
{
    "success": true,
    "message": "Authenticated ...",
    "data": {
        "nama": "Developer",
        "token": "e2203d2f-3b3d-40d5-9edb-99ba823a6cfa",
        "date": "2025-09-18 00:09:34",
        "roleId": 1,
        "roleName": "Developer",
        "opdId": null,
        "username": "dev_opt"
    }
}
```

### Response Gagal

```json
{
    "success": false,
    "message": "Username atau password salah ...",
    "data": []
}
```

## Cara Menggunakan Token

Setelah mendapatkan token, sertakan pada header setiap request:

```
Authorization: Bearer jwt_token_here
```

## Catatan

- Password pengguna disimpan dalam bentuk hash bcrypt, sehingga aman dari pencurian data.
- Token memiliki masa berlaku tertentu (`expires_in` reset setiap jam 12 malam).
- Jika token kadaluarsa, lakukan login ulang untuk mendapatkan token baru.
- Jangan bagikan token atau password Anda kepada pihak lain.

