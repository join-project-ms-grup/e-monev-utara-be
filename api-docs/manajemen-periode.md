# Manajemen Periode | dokumentasi API
Dokumentasi ini menjelaskan proses manajemen periode (Renstra) pada API.

## 1 - Add Periode
 Berikut merupakan cara menambahkan data periode ke sistem

```
Role: Dev dan Admin
```

endpoint : ```periode/add```
method : **POST**

```
Authorization: Bearer {{ token }}
```

**Body Request:**
```json
{
       "mulai" : Int,
       "akhir" : Int,
       "status" : Boolean
}
```

**Response:**
201 : crated
```json
{
       "success" : true,
       "message" : "Periode created successfully",
       "data" : [
              {
                     "id": 1,
                     "mulai": 2025,
                     "akhir": 2029,
                     "status": true,
                     "created_at": "2025-09-10T08:19:34.315Z",
                     "updated_at": "2025-09-10T08:19:34.315Z"
              },
              // more periode ...
       ]
}
```

400 | Bad Request
```json
{
       "success" : false,
       "message" : "Mohon maaf data belum sesuai dengan format yang diminta",
       "data" : null
}
```

---

## 2 - Update Periode
Berikut merupakan cara mengubah data periode yang sudah ada di sistem

```role
Role: Dev dan Admin
```

endpoint: ```periode/update```
params: ```id (numeric)```
example: ```periode/update/1```
method : **PUT**

```
Authorization: Bearer {{ token }}
```

**Body Request**
```json
{
       "mulai" : Int,
       "akhir" :Int,
       "Status" : Boolean
}
```

**Response**

200 | OK
```json
{
       "success" : true,
       "message" : "Periode updated successfully",
       "data" :[
              {
                     "id": 1,
                     "mulai": 2025,
                     "akhir": 2029,
                     "status": true,
                     "created_at": "2025-09-10T08:19:34.315Z",
                     "updated_at": "2025-09-10T08:19:34.315Z"
              },
              // more periode ...
       ]
}
```

404 | Not Found

```json
{
       "success": false,
       "message" : "Data periode tidak ditemukan",
       "data" : []
}
```

403 | Bad Request
``` json
{
       "success" : false,
       "message" : "Data belum sesuai dengan format yang diminta, periksa parameter data",
       "data" : []
}
```

---
## 3 - List Periode
Berikut merupakan cara mengambil list periode yang sudah tersimpan di server/sistem

```Role: All Role```

endpoint : ```periode/list```
method : **GET**

```
Authorization: Bearer {{ token }}
```

**Response**
```json
{
       "success" : true,
       "message" : "List periode berhasil diambil",
       "data" : [
              {
                     "id": 1,
                     "mulai": 2025,
                     "akhir": 2029,
                     "status": true,
                     "created_at": "2025-09-10T08:19:34.315Z",
                     "updated_at": "2025-09-10T08:19:34.315Z"
              },
              // more periode ...
       ]
}
```

---
## 4 - Delete Periode
Berikut cata menghapus data periode dari server/sistem

```Role: Dev dan Admin```

endpoint : ```periode/delete```
params : ```id (numeric)```
example: ```periode/delete/1```
method: **DELETE**

```
Authorization : Bearer {{ token }}
```

**Response**
200 | OK
```json
{
       "success" : true,
       "message" : "Data periode berhasil dihapus",
       "data" : [
              {
                     "id": 1,
                     "mulai": 2025,
                     "akhir": 2029,
                     "status": true,
                     "created_at": "2025-09-10T08:19:34.315Z",
                     "updated_at": "2025-09-10T08:19:34.315Z"
              },
              // more periode or  null
       ]
}
```

404 | Not Found
```json
{
       "success" : false,
       "message" : "Data periode tidak ditemukan",
       "data" : []
}
```

