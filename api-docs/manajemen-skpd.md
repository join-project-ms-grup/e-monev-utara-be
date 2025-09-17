# Manajemen SKPD | dokumentasi api

``` catatan
Catatan : Sebelum menambahkan SKPD mohon tambahkan data periode terlebih dahulu.
```

## 1 - Add SKPD
Berikut merupakan panduan proses menambahkan SKPD baru pada sistem

```
Role : Dev dan Admin
```

endpoint: ```skpd/add```
method: POST

```
Authorization : Bearer {{ token }}
```

#### Body Request

```json
{
    "kode" : Int,
    "name" : String,
    "shortname":  String
}
```

#### Response
201 | Created

```json
{
    "success": true,
    "message": "SKPD berhasil ditambahkan",
    "data": [
        {
            "id": 1,
            "kode": 1,
            "name": "Nama opd",
            "shortname": "Singkatan",
            "status": true,
            "created_at": "2025-09-09T05:55:08.755Z",
            "updated_at": "2025-09-10T07:44:51.161Z"
        },
        //more skpd...
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

## 2 - Update SKPD
Berikut merupakan panduan proses mengupdate data skpd pada sistem

```
Role : Dev dan Admin
```

endpoint : ```skpd/update```
params   : ```id (numeric)```
example  : ```skpd/update/1```
method   : PUT

```
Authorization: Bearer {{ token }}
```

#### Body Request
```json
{
    "kode" : Int,
    "name" : String,
    "shortname":  String,
    "status": Boolean
}
```

#### Response

200 | OK
```json
{
    "success": true,
    "message": "SKPD berhasil diubah",
    "data": [
        {
            "id": 1,
            "kode": 1,
            "name": "Nama opd",
            "shortname": "Singkatan",
            "status": true,
            "created_at": "2025-09-09T05:55:08.755Z",
            "updated_at": "2025-09-10T07:44:51.161Z"
        },
        //more skpd...
    ]
}
```

400 | Bad Request
```json
{
       "success": false,
       "message": "Mohon maaf data tidak sesuai dengan format yang diminta",
       "data": {}
}
```

---

## 3 - List SKPD
Berikut merupakan panduan untuk mendapatkan daftar skpd

```
Role : Dev dan Admin
```

endpoint : ```skpd/list```
method   : GET

```
Authorization: Bearer {{ token }}
```


#### Response

200 | OK
```json
{
    "success": true,
    "message": "List SKPD",
    "data": [
        {
            "id": 1,
            "kode": 1,
            "name": "Badan Perencanaan Pembangunan",
            "shortname": "BAPPELITBANGDA",
            "status": false,
            "created_at": "2025-09-09T05:55:08.755Z",
            "updated_at": "2025-09-10T07:44:51.161Z"
        },
        // more skpd ...
    ]
}
```

---

## 4 - Delete skpd
Berikut merupakan panduan untuk menghapus skpd

```
Role : Dev dan Admin
```

endpoint : ```skpd/delete```
params   : ```id (numeric)```
example  : ```skpd/delete/1```
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