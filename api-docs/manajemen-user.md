# Manajemen User | dokumentasi api

CheatSheet default role user: 
```
  1. Operator Developer
  2. Admin
  3. User RKPD
  4. User DAK
```

## 1 - Add User
Berikut merupakan panduan proses menambahkan user baru pada sistem

```
Role : Dev dan Admin
```

endpoint: ```user/add```
method: POST

```
Authorization : Bearer {{ token }}
```

#### Body Request

```json
{
     "name": string,
       "fullname": string,
       "email": string/format-email,
       "role_id": int,
       "skpd_id": int/null,
       "password": string/null
}
```

#### Response
201 | Created

```json
{
       "success": true,
       "message": "User created succesfully...",
       "data": [
              {
                     "id": 1,
                     "name": "dev_opt",
                     "fullname": "Developer",
                     "avatar": null,
                     "email": "dev@mail.com",
                     "role_id": 1,
                     "skpd_id": null,
                     "status": true,
                     "created_at": "2025-09-02T09:26:33.000Z",
                     "updated_at": "2025-09-17T07:04:44.342Z"
              }
              // ... more users
       ]
}
```

400 | Bad Request

```json
{
       "success": false,
       "message" : "Email sudah digunakan, gunakan email lain",
       "data" : []
}
```
---
## 2 - Update User
Berikut merupakan panduan proses mengupdate data user pada sistem

```
Role : Dev dan Admin
```

endpoint : ```user/update/:id```
method   : PUT

```
Authorization: Bearer {{ token }}
```

#### Body Request
```json
{
       "name": string,
       "fullname": string,
       "email": string/format-email,
       "role_id": int,
       "skpd_id": int/null
}
```

#### Response

200 | OK
```json
{
       "success": true,
       "message": "User updated successfully",
       "data": {
              "id": 1,
              "name": "dev_opt",
              "fullname": "Developer",
              "avatar": null,
              "email": "dev@mail.com",
              "role_id": 1,
              "skpd_id": null,
              "status": true,
              "created_at": "2025-09-02T09:26:33.000Z",
              "updated_at": "2025-09-17T07:04:44.342Z"
       }
}
```

400 | Bad Request
```json
{
       "success": false,
       "message": "Email sudah terdaftar, gunakan email lain",
       "data": {}
}
```

---

## 3 - Update Password
Berikut merupakan panduan proses mengupdate data user pada sistem

```
Role : Dev dan Admin
```

endpoint : ```user/change-password```
method   : PUT

```
Authorization: Bearer {{ token }}
```

#### Body Request
```json
{
       "id": Int,
       "password": string
}
```

#### Response

200 | OK
```json
{
       "success": true,
       "message": "User updated successfully",
       "data": {
              "id": 1,
              "name": "dev_opt",
              "fullname": "Developer",
              "avatar": null,
              "email": "dev@mail.com",
              "role_id": 1,
              "skpd_id": null,
              "status": true,
              "created_at": "2025-09-02T09:26:33.000Z",
              "updated_at": "2025-09-17T07:04:44.342Z"
       }
}
```

404 | Not Found
```json
{
       "success": false,
       "message": "User tidak ditemukan...",
       "data": {}
}
```

---

## 4 - List User
Berikut merupakan panduan untuk mendapatkan daftar user

```
Role : Dev dan Admin
```

endpoint : ```user/list```
method   : GET

```
Authorization: Bearer {{ token }}
```

<!-- #### Query Params (opsional)
- `page`: int (default: 1)
- `limit`: int (default: 10)
- `search`: string -->

#### Response

200 | OK
```json
{
       "success": true,
       "message": "List user",
       "data": [
              {
                     "id": 1,
                     "name": "dev_opt",
                     "fullname": "Developer",
                     "avatar": null,
                     "email": "dev@mail.com",
                     "role_id": 1,
                     "skpd_id": null,
                     "status": true,
                     "created_at": "2025-09-02T09:26:33.000Z",
                     "updated_at": "2025-09-17T07:04:44.342Z"
              }
              // ... more users
       ]
}
```

---

## 5 - Delete User
Berikut merupakan panduan untuk menghapus user

```
Role : Dev dan Admin
```

endpoint : ```user/delete/:id```
method   : DELETE

```
Authorization: Bearer {{ token }}
```

#### Response

200 | OK
```json
{
       "success": true,
       "message": "User deleted successfully"
}
```

404 | Not Found
```json
{
       "success": false,
       "message": "User tidak ditemukan"
}
```