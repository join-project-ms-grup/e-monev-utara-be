# Manajemen Master | dokumentasi API
Dokumentasi ini menjelaskan proses manajemen data master pada API.

## 1 - Add Master

Berikut cara menambahkan data master pada server

```Role: Dev dan Admin```

endpoint: ```master/add```
method : **POST**

```
Authorization: Bearer {{ token }}
```

**Body Request**
```json
{
    "kode" : String,
    "name" : String,
    "type" : String, //urusan, bidang, program, kegiatan, subKegiatan
    "parent": Int, //boleh null untuk urusan
}
```

**Response**
201 | Created
```json
{
    "success": true,
    "message": "Master created successfully",
    "data": {
        "id": 6323,
        "parent_id": null,
        "type": "urusan",
        "kode": "11",
        "name": "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR",
        "status": true,
        "created_at": "2025-09-17T13:23:56.939Z",
        "updated_at": "2025-09-17T13:23:56.939Z"
    }
}
```
400 | Bad Request
```json
{
    "success": false,
    "message": "Mohon maaf data belum sesuai format yang diminta",
    "data": [
        {
            "type": "\"type\" is required"
        }
    ]
}
```

---
## 2 - Update Master

Berikut cara menangubah data master pada server

```Role: Dev dan Admin```

endpoint: ```master/update```
params : ```id (numeric)```
example: ```master/update/1```
method : **PUT**

```
Authorization: Bearer {{ token }}
```

**Body Request**
```json
{
    "kode" : String,
    "name" : String,
    "type" : String, //urusan, bidang, program, kegiatan, subKegiatan
    "parent": Int, //boleh null untuk urusan
}
```

**Response**
200 | OK
```json
{
    "success": true,
    "message": "Master updated successfully",
    "data": {
        "id": 6323,
        "parent_id": null,
        "type": "urusan",
        "kode": "11",
        "name": "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR",
        "status": true,
        "created_at": "2025-09-17T13:23:56.939Z",
        "updated_at": "2025-09-17T13:23:56.939Z"
    }
}
```
400 | Bad Request
```json
{
    "success": false,
    "message": "Mohon maaf data belum sesuai format yang diminta",
    "data": [
        {
            "type": "\"type\" is required"
        }
    ]
}
```

---
## 3 - List Urusan

Berikut cara mengambil data urusan pada server

```Role: Dev dan Admin```

endpoint: ```master/list/urusan```
method : **GET**

```
Authorization: Bearer {{ token }}
```

**Response**
```json
{
    "success": true,
    "message": "List of Urusan retrieved successfully",
    "data": [
        {
            "id": 545,
            "kode": "1",
            "name": "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR"
        },
        //more urusan ...
    ]
}
```

## 4 - List Children

Berikut cara mengambil data children master pada server

```Role: Dev dan Admin```

endpoint: ```master/list/children```
params: ```id (numeric)```  ->  _id dari urusan/bidang/program/kegiatan_
example: ```master/list/children/1```
method : **GET**

```
Authorization: Bearer {{ token }}
```

**Response**
```json
{
    "success": true,
    "message": "List of Children retrieved successfully",
    "data": [
        {
            "id": 2027,
            "kode": "02",
            "name": "PROGRAM PEMBERDAYAAN SOSIAL",
            "type": "program",
            "parent_id": 2026
        },
        //MORE CHILDREN
    ]
}
```

## 5 - List Semua data Master
Berikut cara mengambil semua data master pada server

```Role: Dev dan Admin```

endpoint: ```master/list/all```
method : **GET**

```
Authorization: Bearer {{ token }}
```

**Response**
```json
{
    "success": true,
    "message": "List of Master retrieved successfully",
    "data": [
        {
            "id": 545,
            "kode": "1",
            "name": "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR",
            "bidang": [
                {
                    "id": 546,
                    "kode": "01",
                    "name": "URUSAN PEMERINTAHAN BIDANG PENDIDIKAN",
                    "program": [
                        {
                            "id": 547,
                            "kode": "02",
                            "name": "PROGRAM PENGELOLAAN PENDIDIKAN",
                            "kegiatan": [
                                {
                                    "id": 548,
                                    "kode": "1.01",
                                    "name": "Pengelolaan Pendidikan Sekolah Menengah Atas",
                                    "subKegiatan": [
                                        {
                                            "id": 549,
                                            "kode": "0001",
                                            "name": "Pembangunan USB (Unit Sekolah Baru)"
                                        },
                                        //more subkegiatan ...
                                    ]
                                },
                                //more kegiatan ...
                            ]
                        }
                        //more program ...
                    ]
                },
                // more bidang ...
            ]
        },
        //more urusan
    ]
```