# Manajemen ROLE | dokumentasi api

## 1 - Add ROLE
Berikut merupakan panduan proses menambahkan role baru pada sistem

```
Role : Developer
```

endpoint: ```role/add```
method: POST

```
Authorization : Bearer {{ token }}
```

#### Body Request

```json
{
    "kode" : Int,
    "name" : String,
}
```

#### Response
201 | Created

```json
{
    "success": true,
    "message": "Role berhasil ditambahkan",
    "data": [
        {
            "id": 31,
            "kode": 5,
            "name": "Test",
            "author_id": 1,
            "created_at": "2025-09-17T09:44:01.114Z",
            "updated_at": "2025-09-17T09:44:01.114Z"
        },
        // more role ...
    ]
}
```

400 | Bad Request

```json
{
       "success": false,
       "message" : "Mohon maaf data belum sesuai format yang diminta",
       "data" : []
}
```

---

## 2 - Update ROLE
Berikut merupakan panduan proses mengupdate data role pada sistem

```
Role : Developer
```

endpoint : ```role/update```
params   : ```id (numeric)```
example  : ```role/update/1```
method   : PUT

```
Authorization: Bearer {{ token }}
```

#### Body Request
```json
{
    "kode" : Int,
    "name" : String,
}
```

#### Response
200 | OK

```json
{
    "success": true,
    "message": "Role berhasil diubah",
    "data": [
        {
            "id": 31,
            "kode": 5,
            "name": "Test",
            "author_id": 1,
            "created_at": "2025-09-17T09:44:01.114Z",
            "updated_at": "2025-09-17T09:44:01.114Z"
        },
        // more role ...
    ]
}
```

400 | Bad Request

```json
{
       "success": false,
       "message" : "Mohon maaf data belum sesuai format yang diminta",
       "data" : []
}
```

---

## 3 - List ROLE Developer
Berikut merupakan panduan untuk mendapatkan daftar role untuk manajemen user pada developer

```
Role : Developer
```

endpoint : ```role/list/dev```
method   : GET

```
Authorization: Bearer {{ token }}
```


#### Response

200 | OK
```json
{
    "success": true,
    "message": "Request data berhasil",
    "data": [
        {
            "id": 25,
            "kode": 1,
            "name": "Developer",
            "author_id": 1,
            "created_at": "2025-09-02T09:15:53.000Z",
            "updated_at": "2025-09-02T09:15:53.000Z"
        },
        // more roles ...
    ]
}
```

---

## 4 - List Role Dev dan Admin
List ini biasa digunakan untuk proses penambahan data yang membutuhkan role sebagai foreing key

```
Role : Dev dan Admin
```

endpoint : ```role/list```
method : GET

```
Authorization: Bearer {{ token }}
```

#### Response
200 : OK
```json
{
       "success": true,
       "message" : "Berhasil mengambil list role",
       "data" : [
              {
                     "kode": 1,
                     "name" : "Developer"
              }
       ]
}
```

---

## 5 - Delete Role
Berikut merupakan panduan untuk menghapus role

```
Role : Developer
```

endpoint : ```role/delete```
params   : ```id (numeric)```
example  : ```role/delete/1```
method   : DELETE

```
Authorization: Bearer {{ token }}
```

#### Response

200 | OK
```json
{
       "success": true,
       "message": "Role deleted successfully"
}
```

404 | Not Found
```json
{
       "success": false,
       "message": "Role tidak ditemukan"
}
```