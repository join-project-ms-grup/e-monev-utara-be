import prisma from "../src/config/database.js";
import response from "../src/utility/response.js";
import fs from "fs";

const urusan_data = [
       {
              no: "1",
              id: "11",
              kode: "1",
              nama: "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR"
       },
       {
              no: "2",
              id: "12",
              kode: "2",
              nama: "URUSAN PEMERINTAHAN WAJIB YANG TIDAK BERKAITAN DENGAN PELAYANAN DASAR"
       },
       {
              no: "3",
              id: "13",
              kode: "3",
              nama: "URUSAN PEMERINTAHAN PILIHAN"
       },
       {
              no: "4",
              id: "14",
              kode: "4",
              nama: "UNSUR PENDUKUNG URUSAN PEMERINTAHAN"
       },
       {
              no: "5",
              id: "15",
              kode: "5",
              nama: "UNSUR PENUNJANG URUSAN PEMERINTAHAN"
       },
       {
              no: "6",
              id: "16",
              kode: "6",
              nama: "UNSUR PENGAWASAN URUSAN PEMERINTAHAN"
       },
       {
              no: "7",
              id: "17",
              kode: "7",
              nama: "UNSUR KEWILAYAHAN"
       },
       {
              no: "8",
              id: "18",
              kode: "8",
              nama: "UNSUR PEMERINTAHAN UMUM"
       },
       {
              no: "9",
              id: "19",
              kode: "9",
              nama: "UNSUR KEKHUSUSAN DAN KEISTIMEWAAN"
       },
       {
              no: "10",
              id: "20",
              kode: "X",
              nama: "NON URUSAN"
       }
];

const bidang_data = [
       {
              id: "201",
              id1: "11",
              kode: "1.01",
              nama: "URUSAN PEMERINTAHAN BIDANG PENDIDIKAN"
       },
       {
              id: "202",
              id1: "11",
              kode: "1.02",
              nama: "URUSAN PEMERINTAHAN BIDANG KESEHATAN"
       },
       {
              id: "203",
              id1: "11",
              kode: "1.03",
              nama: "URUSAN PEMERINTAHAN BIDANG PEKERJAAN UMUM DAN PENATAAN RUANG"
       },
       {
              id: "204",
              id1: "11",
              kode: "1.04",
              nama: "URUSAN PEMERINTAHAN BIDANG PERUMAHAN DAN KAWASAN PERMUKIMAN"
       },
       {
              id: "205",
              id1: "11",
              kode: "1.05",
              nama: "URUSAN PEMERINTAHAN BIDANG KETENTERAMAN DAN KETERTIBAN UMUM SERTA PERLINDUNGAN MASYARAKAT"
       },
       {
              id: "206",
              id1: "11",
              kode: "1.06",
              nama: "URUSAN PEMERINTAHAN BIDANG SOSIAL"
       },
       {
              id: "207",
              id1: "12",
              kode: "2.07",
              nama: "URUSAN PEMERINTAHAN BIDANG TENAGA KERJA"
       },
       {
              id: "208",
              id1: "12",
              kode: "2.08",
              nama: "URUSAN PEMERINTAHAN BIDANG PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK"
       },
       {
              id: "209",
              id1: "12",
              kode: "2.09",
              nama: "URUSAN PEMERINTAHAN BIDANG PANGAN"
       },
       {
              id: "210",
              id1: "12",
              kode: "2.10",
              nama: "URUSAN PEMERINTAHAN BIDANG PERTANAHAN"
       },
       {
              id: "211",
              id1: "12",
              kode: "2.11",
              nama: "URUSAN PEMERINTAHAN BIDANG LINGKUNGAN HIDUP"
       },
       {
              id: "212",
              id1: "12",
              kode: "2.12",
              nama: "URUSAN PEMERINTAHAN BIDANG ADMINISTRASI KEPENDUDUKAN DAN PENCATATAN SIPIL"
       },
       {
              id: "213",
              id1: "12",
              kode: "2.13",
              nama: "URUSAN PEMERINTAHAN BIDANG PEMBERDAYAAN MASYARAKAT DAN DESA"
       },
       {
              id: "214",
              id1: "12",
              kode: "2.14",
              nama: "URUSAN PEMERINTAHAN BIDANG PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA"
       },
       {
              id: "215",
              id1: "12",
              kode: "2.15",
              nama: "URUSAN PEMERINTAHAN BIDANG PERHUBUNGAN"
       },
       {
              id: "216",
              id1: "12",
              kode: "2.16",
              nama: "URUSAN PEMERINTAHAN BIDANG KOMUNIKASI DAN INFORMATIKA"
       },
       {
              id: "217",
              id1: "12",
              kode: "2.17",
              nama: "URUSAN PEMERINTAHAN BIDANG KOPERASI, USAHA KECIL, DAN MENENGAH"
       },
       {
              id: "218",
              id1: "12",
              kode: "2.18",
              nama: "URUSAN PEMERINTAHAN BIDANG PENANAMAN MODAL"
       },
       {
              id: "219",
              id1: "12",
              kode: "2.19",
              nama: "URUSAN PEMERINTAHAN BIDANG KEPEMUDAAN DAN OLAHRAGA"
       },
       {
              id: "220",
              id1: "12",
              kode: "2.20",
              nama: "URUSAN PEMERINTAHAN BIDANG STATISTIK"
       },
       {
              id: "221",
              id1: "12",
              kode: "2.21",
              nama: "URUSAN PEMERINTAHAN BIDANG PERSANDIAN"
       },
       {
              id: "222",
              id1: "12",
              kode: "2.22",
              nama: "URUSAN PEMERINTAHAN BIDANG KEBUDAYAAN"
       },
       {
              id: "223",
              id1: "12",
              kode: "2.23",
              nama: "URUSAN PEMERINTAHAN BIDANG PERPUSTAKAAN"
       },
       {
              id: "224",
              id1: "12",
              kode: "2.24",
              nama: "URUSAN PEMERINTAHAN BIDANG KEARSIPAN"
       },
       {
              id: "225",
              id1: "13",
              kode: "3.25",
              nama: "URUSAN PEMERINTAHAN BIDANG KELAUTAN  DAN PERIKANAN"
       },
       {
              id: "226",
              id1: "13",
              kode: "3.26",
              nama: "URUSAN PEMERINTAHAN BIDANG PARIWISATA"
       },
       {
              id: "227",
              id1: "13",
              kode: "3.27",
              nama: "URUSAN PEMERINTAHAN BIDANG PERTANIAN"
       },
       {
              id: "228",
              id1: "13",
              kode: "3.28",
              nama: "URUSAN PEMERINTAHAN BIDANG KEHUTANAN"
       },
       {
              id: "229",
              id1: "13",
              kode: "3.29",
              nama: "URUSAN PEMERINTAHAN BIDANG ENERGI  DAN SUMBER DAYA MINERAL"
       },
       {
              id: "230",
              id1: "13",
              kode: "3.30",
              nama: "URUSAN PEMERINTAHAN BIDANG PERDAGANGAN"
       },
       {
              id: "231",
              id1: "13",
              kode: "3.31",
              nama: "URUSAN PEMERINTAHAN BIDANG PERINDUSTRIAN"
       },
       {
              id: "232",
              id1: "13",
              kode: "3.32",
              nama: "URUSAN PEMERINTAHAN BIDANG TRANSMIGRASI"
       },
       {
              id: "233",
              id1: "14",
              kode: "4.01",
              nama: "SEKRETARIAT DAERAH"
       },
       {
              id: "234",
              id1: "14",
              kode: "4.02",
              nama: "SEKRETARIAT DPRD"
       },
       {
              id: "235",
              id1: "15",
              kode: "5.01",
              nama: "PERENCANAAN"
       },
       {
              id: "236",
              id1: "15",
              kode: "5.02",
              nama: "KEUANGAN"
       },
       {
              id: "237",
              id1: "15",
              kode: "5.03",
              nama: "KEPEGAWAIAN"
       },
       {
              id: "238",
              id1: "15",
              kode: "5.04",
              nama: "PENDIDIKAN DAN PELATIHAN"
       },
       {
              id: "239",
              id1: "15",
              kode: "5.05",
              nama: "PENELITIAN DAN PENGEMBANGAN"
       },
       {
              id: "240",
              id1: "15",
              kode: "5.06",
              nama: "PENGELOLAAN PERBATASAN"
       },
       {
              id: "241",
              id1: "15",
              kode: "5.07",
              nama: "PENGELOLAAN PENGHUBUNG"
       },
       {
              id: "242",
              id1: "16",
              kode: "6.01",
              nama: "INSPEKTORAT DAERAH"
       },
       {
              id: "243",
              id1: "17",
              kode: "7.01",
              nama: "KECAMATAN"
       },
       {
              id: "244",
              id1: "17",
              kode: "7.01",
              nama: "KECAMATAN ADMINISTRASI"
       },
       {
              id: "245",
              id1: "17",
              kode: "7.02",
              nama: "KOTA ADMINISTRASI"
       },
       {
              id: "246",
              id1: "17",
              kode: "7.03",
              nama: "KABUPATEN ADMINISTRASI"
       },
       {
              id: "247",
              id1: "18",
              kode: "8.01",
              nama: "KESATUAN BANGSA DAN POLITIK"
       },
       {
              id: "248",
              id1: "19",
              kode: "9.01",
              nama: "KEKHUSUSAN ACEH"
       },
       {
              id: "249",
              id1: "19",
              kode: "9.02",
              nama: "KEKHUSUSAN PAPUA"
       },
       {
              id: "255",
              id1: "19",
              kode: "9.03",
              nama: "KEKHUSUSAN PAPUA BARAT"
       },
       {
              id: "251",
              id1: "20",
              kode: "X.XX",
              nama: "URUSAN PEMERINTAHAN BIDANG XX"
       }
];

const program_data = [
       {
              id: "1000",
              id1: "11",
              id2: "201",
              kode: "1.01.02",
              nama: "PROGRAM PENGELOLAAN PENDIDIKAN",
       },
       {
              id: "1001",
              id1: "11",
              id2: "201",
              kode: "1.01.03",
              nama: "PROGRAM PENGEMBANGAN KURIKULUM",
       },
       {
              id: "1002",
              id1: "11",
              id2: "201",
              kode: "1.01.04",
              nama: "PROGRAM PENDIDIK DAN TENAGA KEPENDIDIKAN",
       },
       {
              id: "1003",
              id1: "11",
              id2: "201",
              kode: "1.01.05",
              nama: "PROGRAM PENGENDALIAN PERIZINAN PENDIDIKAN",
       },
       {
              id: "1004",
              id1: "11",
              id2: "201",
              kode: "1.01.06",
              nama: "PROGRAM PENGEMBANGAN BAHASA DAN SASTRA",
       },
       {
              id: "1007",
              id1: "11",
              id2: "202",
              kode: "1.02.02",
              nama: "PROGRAM PEMENUHAN UPAYA KESEHATAN PERORANGAN DAN UPAYA KESEHATAN MASYARAKAT",
       },
       {
              id: "1008",
              id1: "11",
              id2: "202",
              kode: "1.02.03",
              nama: "PROGRAM PENINGKATAN KAPASITAS SUMBER DAYA MANUSIA KESEHATAN",
       },
       {
              id: "1009",
              id1: "11",
              id2: "202",
              kode: "1.02.04",
              nama: "PROGRAM SEDIAAN FARMASI, ALAT KESEHATAN DAN MAKANAN MINUMAN",
       },
       {
              id: "1010",
              id1: "11",
              id2: "202",
              kode: "1.02.05",
              nama: "PROGRAM PEMBERDAYAAN MASYARAKAT BIDANG KESEHATAN",
       },
       {
              id: "1011",
              id1: "11",
              id2: "202",
              kode: "1.02.07",
              nama: "PORGRAM AKREDITASI PELAYANAN KESEHATAN",
       },
       {
              id: "1012",
              id1: "11",
              id2: "203",
              kode: "1.03.02",
              nama: "PROGRAM PENGELOLAAN SUMBER DAYA AIR (SDA)",
       },
       {
              id: "1013",
              id1: "11",
              id2: "203",
              kode: "1.03.03",
              nama: "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM PENYEDIAAN AIR MINUM",
       },
       {
              id: "1014",
              id1: "11",
              id2: "203",
              kode: "1.03.04",
              nama: "PROGRAM PENGEMBANGAN SISTEM DAN PENGELOLAAN PERSAMPAHAN REGIONAL",
       },
       {
              id: "1015",
              id1: "11",
              id2: "203",
              kode: "1.03.05",
              nama: "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM AIR LIMBAH",
       },
       {
              id: "1016",
              id1: "11",
              id2: "203",
              kode: "1.03.06",
              nama: "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM DRAINASE",
       },
       {
              id: "1017",
              id1: "11",
              id2: "203",
              kode: "1.03.07",
              nama: "PROGRAM PENGEMBANGAN PERMUKIMAN",
       },
       {
              id: "1018",
              id1: "11",
              id2: "203",
              kode: "1.03.08",
              nama: "PROGRAM PENATAAN BANGUNAN GEDUNG",
       },
       {
              id: "1019",
              id1: "11",
              id2: "203",
              kode: "1.03.09",
              nama: "PROGRAM PENATAAN BANGUNAN DAN LINGKUNGANNYA",
       },
       {
              id: "1020",
              id1: "11",
              id2: "203",
              kode: "1.03.10",
              nama: "PROGRAM PENYELENGGARAAN JALAN",
       },
       {
              id: "1021",
              id1: "11",
              id2: "203",
              kode: "1.03.11",
              nama: "PROGRAM PENGEMBANGAN JASA KONSTRUKSI",
       },
       {
              id: "1022",
              id1: "11",
              id2: "203",
              kode: "1.03.12",
              nama: "PROGRAM PENYELENGGARAAN PENATAAN RUANG",
       },
       {
              id: "1023",
              id1: "11",
              id2: "203",
              kode: "1.03.13",
              nama: "PROGRAM PENYELENGGARAAN KEISTIMEWAAN YOGYAKARTA URUSAN TATA RUANG",
       },
       {
              id: "1024",
              id1: "11",
              id2: "204",
              kode: "1.04.02",
              nama: "PROGRAM PENGEMBANGAN PERUMAHAN",
       },
       {
              id: "1025",
              id1: "11",
              id2: "204",
              kode: "1.04.03",
              nama: "PROGRAM KAWASAN PERMUKIMAN",
       },
       {
              id: "1026",
              id1: "11",
              id2: "204",
              kode: "1.04.04",
              nama: "PROGRAM PERUMAHAN DAN KAWASAN PERMUKIMAN KUMUH",
       },
       {
              id: "1027",
              id1: "11",
              id2: "204",
              kode: "1.04.05",
              nama: "PROGRAM PENINGKATAN PRASARANA, SARANA DAN UTILITAS UMUM (PSU)",
       },
       {
              id: "1028",
              id1: "11",
              id2: "204",
              kode: "1.04.06",
              nama: "PROGRAM PENINGKATAN PELAYANAN SERTIFIKASI, KUALIFIKASI, KLASIFIKASI, DAN REGISTRASI BIDANG PERUMAHAN DAN KAWASAN PERMUKIMAN",
       },
       {
              id: "1029",
              id1: "11",
              id2: "205",
              kode: "1.05.02",
              nama: "PROGRAM PENINGKATAN KETENTERAMAN DAN KETERTIBAN UMUM",
       },
       {
              id: "1030",
              id1: "11",
              id2: "205",
              kode: "1.05.03",
              nama: "PROGRAM PENANGGULANGAN BENCANA",
       },
       {
              id: "1031",
              id1: "11",
              id2: "205",
              kode: "1.05.04",
              nama: "PROGRAM PENCEGAHAN, PENANGGULANGAN, PENYELAMATAN KEBAKARAN DAN PENYELAMATAN NON KEBAKARAN",
       },
       {
              id: "1032",
              id1: "11",
              id2: "206",
              kode: "1.06.02",
              nama: "PROGRAM PEMBERDAYAAN SOSIAL",
       },
       {
              id: "1033",
              id1: "11",
              id2: "206",
              kode: "1.06.03",
              nama: "PROGRAM PENANGANAN WARGA NEGARA MIGRAN KORBAN TINDAK KEKERASAN",
       },
       {
              id: "1034",
              id1: "11",
              id2: "206",
              kode: "1.06.04",
              nama: "PROGRAM REHABILITASI SOSIAL",
       },
       {
              id: "1035",
              id1: "11",
              id2: "206",
              kode: "1.06.05",
              nama: "PROGRAM PERLINDUNGAN DAN JAMINAN SOSIAL",
       },
       {
              id: "1036",
              id1: "11",
              id2: "206",
              kode: "1.06.06",
              nama: "PROGRAM PENANGANAN BENCANA",
       },
       {
              id: "1037",
              id1: "11",
              id2: "206",
              kode: "1.06.07",
              nama: "PROGRAM PENGELOLAAN TAMAN MAKAM PAHLAWAN",
       },
       {
              id: "1038",
              id1: "12",
              id2: "207",
              kode: "2.07.02",
              nama: "PROGRAM PERENCANAAN TENAGA KERJA",
       },
       {
              id: "1039",
              id1: "12",
              id2: "207",
              kode: "2.07.03",
              nama: "PROGRAM PELATIHAN KERJA DAN PRODUKTIVITAS TENAGA KERJA",
       },
       {
              id: "1040",
              id1: "12",
              id2: "207",
              kode: "2.07.04",
              nama: "PROGRAM PENEMPATAN TENAGA KERJA",
       },
       {
              id: "1041",
              id1: "12",
              id2: "207",
              kode: "2.07.05",
              nama: "PROGRAM HUBUNGAN INDUSTRIAL",
       },
       {
              id: "1042",
              id1: "12",
              id2: "208",
              kode: "2.08.02",
              nama: "PROGRAM PENGARUSUTAMAAN GENDER DAN PEMBERDAYAAN PEREMPUAN",
       },
       {
              id: "1043",
              id1: "12",
              id2: "208",
              kode: "2.08.03",
              nama: "PROGRAM PERLINDUNGAN PEREMPUAN",
       },
       {
              id: "1044",
              id1: "12",
              id2: "208",
              kode: "2.08.04",
              nama: "PROGRAM PENINGKATAN KUALITAS KELUARGA",
       },
       {
              id: "1045",
              id1: "12",
              id2: "208",
              kode: "2.08.05",
              nama: "PROGRAM PENGELOLAAN SISTEM DATA GENDER DAN ANAK",
       },
       {
              id: "1046",
              id1: "12",
              id2: "208",
              kode: "2.08.06",
              nama: "PROGRAM PEMENUHAN HAK ANAK (PHA)",
       },
       {
              id: "1047",
              id1: "12",
              id2: "208",
              kode: "2.08.07",
              nama: "PROGRAM PERLINDUNGAN KHUSUS ANAK",
       },
       {
              id: "1048",
              id1: "12",
              id2: "209",
              kode: "2.09.02",
              nama: "PROGRAM PENGELOLAAN SUMBER DAYA EKONOMI UNTUK KEDAULATAN dan KEMANDIRIAN PANGAN",
       },
       {
              id: "1049",
              id1: "12",
              id2: "209",
              kode: "2.09.03",
              nama: "PROGRAM PENINGKATAN DIVERSIFIKASI DAN KETAHANAN PANGAN MASYARAKAT",
       },
       {
              id: "1050",
              id1: "12",
              id2: "209",
              kode: "2.09.04",
              nama: "PROGRAM PENANGANAN KERAWANAN PANGAN",
       },
       {
              id: "1051",
              id1: "12",
              id2: "209",
              kode: "2.09.05",
              nama: "PROGRAM PENGAWASAN KEAMANAN PANGAN",
       },
       {
              id: "3001",
              id1: "12",
              id2: "210",
              kode: "2.10.02",
              nama: "PROGRAM PENGELOLAAN IZIN LOKASI",
       },
       {
              id: "1052",
              id1: "12",
              id2: "210",
              kode: "2.10.03",
              nama: "PROGRAM PENGADAAN TANAH UNTUK KEPENTINGAN UMUM",
       },
       {
              id: "1053",
              id1: "12",
              id2: "210",
              kode: "2.10.04",
              nama: "PROGRAM PENYELESAIAN SENGKETA TANAH GARAPAN",
       },
       {
              id: "1054",
              id1: "12",
              id2: "210",
              kode: "2.10.05",
              nama: "PROGRAM PENYELESAIAN GANTI KERUGIAN DAN SANTUNAN TANAH UNTUK PEMBANGUNAN",
       },
       {
              id: "1055",
              id1: "12",
              id2: "210",
              kode: "2.10.06",
              nama: "PROGRAM REDISTRIBUSI TANAH, DAN GANTI KERUGIAN PROGRAM TANAH KELEBIHAN MAKSIMUM DAN TANAH ABSENTEE",
       },
       {
              id: "1056",
              id1: "12",
              id2: "210",
              kode: "2.10.07",
              nama: "PROGRAM PENETAPAN TANAH ULAYAT",
       },
       {
              id: "1057",
              id1: "12",
              id2: "210",
              kode: "2.10.08",
              nama: "PROGRAM PENGELOLAAN TANAH KOSONG",
       },
       {
              id: "1058",
              id1: "12",
              id2: "210",
              kode: "2.10.09",
              nama: "PROGRAM PENGELOLAAN IZIN MEMBUKA TANAH",
       },
       {
              id: "1059",
              id1: "12",
              id2: "210",
              kode: "2.10.10",
              nama: "PROGRAM PENATAGUNAAN TANAH ",
       },
       {
              id: "1246",
              id1: "12",
              id2: "210",
              kode: "2.10.11",
              nama: "PROGRAM PENYELENGGARAAN KEISTIMEWAAN YOGYAKARTA URUSAN PERTANAHAN",
       },
       {
              id: "1061",
              id1: "12",
              id2: "210",
              kode: "2.10.12",
              nama: "PROGRAM PENGURUSAN HAK HAK ATAS TANAH",
       },
       {
              id: "1062",
              id1: "12",
              id2: "210",
              kode: "2.10.13",
              nama: "PROGRAM SURVEI, PENGUKURAN DAN PEMETAAN",
       },
       {
              id: "1063",
              id1: "12",
              id2: "210",
              kode: "2.10.14",
              nama: "PROGRAM PENGEMBANGAN DAN PEMBINAAN SDM DAN KELEMBAGAAN PERTANAHAN",
       },
       {
              id: "1064",
              id1: "12",
              id2: "210",
              kode: "2.10.15",
              nama: "PROGRAM PENGATURAN PERTANAHAN DI WILAYAH PESISIR, LAUT DAN PULAU",
       },
       {
              id: "1065",
              id1: "12",
              id2: "210",
              kode: "2.10.16",
              nama: "PROGRAM PENGELOLAAN SISTEM INFORMASI PERTANAHAN",
       },
       {
              id: "1066",
              id1: "12",
              id2: "210",
              kode: "2.10.17",
              nama: "PROGRAM PENANGANAN KONFLIK, SENGKETA DAN PERKARA PERTANAHAN",
       },
       {
              id: "1067",
              id1: "12",
              id2: "211",
              kode: "2.11.02",
              nama: "PROGRAM PERENCANAAN LINGKUNGAN HIDUP",
       },
       {
              id: "1068",
              id1: "12",
              id2: "211",
              kode: "2.11.03",
              nama: "PROGRAM PENGENDALIAN PENCEMARAN DAN/ATAU KERUSAKAN LINGKUNGAN HIDUP",
       },
       {
              id: "1069",
              id1: "12",
              id2: "211",
              kode: "2.11.04",
              nama: "PROGRAM PENGELOLAAN KEANEKARAGAMAN HAYATI (KEHATI)",
       },
       {
              id: "1070",
              id1: "12",
              id2: "211",
              kode: "2.11.05",
              nama: "PROGRAM PENGENDALIAN BAHAN BERBAHAYA DAN BERACUN (B3) DAN LIMBAH BAHAN BERBAHAYA DAN BERACUN (LIMBAH B3)",
       },
       {
              id: "1071",
              id1: "12",
              id2: "211",
              kode: "2.11.06",
              nama: "PROGRAM PEMBINAAN DAN PENGAWASAN TERHADAP IZIN LINGKUNGAN DAN IZIN PERLINDUNGAN DAN PENGELOLAAN LINGKUNGAN HIDUP (PPLH)",
       },
       {
              id: "1072",
              id1: "12",
              id2: "211",
              kode: "2.11.07",
              nama: "PROGRAM PENGAKUAN KEBERADAAN MASYARAKAT HUKUM ADAT (MHA), KEARIFAN LOKAL DAN HAK MHA YANG TERKAIT DENGAN PPLH",
       },
       {
              id: "1073",
              id1: "12",
              id2: "211",
              kode: "2.11.08",
              nama: "PROGRAM PENINGKATAN PENDIDIKAN, PELATIHAN DAN PENYULUHAN LINGKUNGAN HIDUP UNTUK MASYARAKAT",
       },
       {
              id: "1074",
              id1: "12",
              id2: "211",
              kode: "2.11.09",
              nama: "PROGRAM PENGHARGAAN LINGKUNGAN HIDUP UNTUK MASYARAKAT",
       },
       {
              id: "1075",
              id1: "12",
              id2: "211",
              kode: "2.11.10",
              nama: "PROGRAM PENANGANAN PENGADUAN LINGKUNGAN HIDUP",
       },
       {
              id: "1076",
              id1: "12",
              id2: "211",
              kode: "2.11.11",
              nama: "PROGRAM PENGELOLAAN PERSAMPAHAN",
       },
       {
              id: "1077",
              id1: "12",
              id2: "212",
              kode: "2.12.02",
              nama: "PROGRAM PENDAFTARAN PENDUDUK",
       },
       {
              id: "1078",
              id1: "12",
              id2: "212",
              kode: "2.12.03",
              nama: "PROGRAM PENCATATAN SIPIL",
       },
       {
              id: "1079",
              id1: "12",
              id2: "212",
              kode: "2.12.04",
              nama: "PROGRAM PENGELOLAAN INFORMASI ADMINISTRASI KEPENDUDUKAN",
       },
       {
              id: "1080",
              id1: "12",
              id2: "212",
              kode: "2.12.05",
              nama: "PROGRAM PENGELOLAAN PROFIL KEPENDUDUKAN",
       },
       {
              id: "1081",
              id1: "12",
              id2: "213",
              kode: "2.13.02",
              nama: "PROGRAM PENATAAN DESA",
       },
       {
              id: "1082",
              id1: "12",
              id2: "213",
              kode: "2.13.03",
              nama: "PROGRAM PENINGKATAN KERJA SAMA DESA",
       },
       {
              id: "1083",
              id1: "12",
              id2: "213",
              kode: "2.13.04",
              nama: "PROGRAM ADMINISTRASI PEMERINTAHAN DESA",
       },
       {
              id: "1084",
              id1: "12",
              id2: "213",
              kode: "2.13.05",
              nama: "PROGRAM PEMBERDAYAAN LEMBAGA KEMASYARAKATAN, LEMBAGA ADAT DAN MASYARAKAT HUKUM ADAT",
       },
       {
              id: "1085",
              id1: "12",
              id2: "213",
              kode: "2.13.06",
              nama: "PROGRAM PEMBERDAYAAN MASYARAKAT DAN KAMPUNG PAPUA",
       },
       {
              id: "1086",
              id1: "12",
              id2: "213",
              kode: "2.13.07",
              nama: "PROGRAM PEMBERDAYAAN MASYARAKAT DAN KAMPUNG PAPUA BARAT",
       },
       {
              id: "1087",
              id1: "12",
              id2: "213",
              kode: "2.13.08",
              nama: "PROGRAM PEMBANGUNAN KAMPUNG DAN PERKAMPUNGAN",
       },
       {
              id: "1088",
              id1: "12",
              id2: "214",
              kode: "2.14.02",
              nama: "PROGRAM PENGENDALIAN PENDUDUK",
       },
       {
              id: "1089",
              id1: "12",
              id2: "214",
              kode: "2.14.03",
              nama: "PROGRAM PEMBINAAN KELUARGA BERENCANA (KB)",
       },
       {
              id: "1090",
              id1: "12",
              id2: "214",
              kode: "2.14.04",
              nama: "PROGRAM PEMBERDAYAAN DAN PENINGKATAN KELUARGA SEJAHTERA (KS)",
       },
       {
              id: "1091",
              id1: "12",
              id2: "215",
              kode: "2.15.02",
              nama: "PROGRAM PENYELENGGARAAN LALU LINTAS DAN ANGKUTAN JALAN (LLAJ)",
       },
       {
              id: "1092",
              id1: "12",
              id2: "215",
              kode: "2.15.03",
              nama: "PROGRAM PENGELOLAAN PELAYARAN",
       },
       {
              id: "1093",
              id1: "12",
              id2: "215",
              kode: "2.15.04",
              nama: "PROGRAM PENGELOLAAN PENERBANGAN",
       },
       {
              id: "1094",
              id1: "12",
              id2: "215",
              kode: "2.15.05",
              nama: "PROGRAM PENGELOLAAN PERKERETAAPIAN",
       },
       {
              id: "1095",
              id1: "12",
              id2: "216",
              kode: "2.16.02",
              nama: "PROGRAM PENGELOLAAN INFORMASI DAN KOMUNIKASI PUBLIK",
       },
       {
              id: "1096",
              id1: "12",
              id2: "216",
              kode: "2.16.03",
              nama: "PROGRAM PENGELOLAAN APLIKASI INFORMATIKA",
       },
       {
              id: "1097",
              id1: "12",
              id2: "217",
              kode: "2.17.02",
              nama: "PROGRAM PELAYANAN IZIN USAHA SIMPAN PINJAM",
       },
       {
              id: "1098",
              id1: "12",
              id2: "217",
              kode: "2.17.03",
              nama: "PROGRAM PENGAWASAN DAN PEMERIKSAAN KOPERASI",
       },
       {
              id: "1099",
              id1: "12",
              id2: "217",
              kode: "2.17.04",
              nama: "PROGRAM PENILAIAN KESEHATAN KSP/USP KOPERASI",
       },
       {
              id: "1100",
              id1: "12",
              id2: "217",
              kode: "2.17.05",
              nama: "PROGRAM PENDIDIKAN DAN LATIHAN PERKOPERASIAN",
       },
       {
              id: "1101",
              id1: "12",
              id2: "217",
              kode: "2.17.06",
              nama: "PROGRAM PEMBERDAYAAN DAN PERLINDUNGAN KOPERASI",
       },
       {
              id: "1102",
              id1: "12",
              id2: "217",
              kode: "2.17.07",
              nama: "PROGRAM PEMBERDAYAAN USAHA MENENGAH, USAHA KECIL, DAN USAHA MIKRO (UMKM)",
       },
       {
              id: "1103",
              id1: "12",
              id2: "217",
              kode: "2.17.08",
              nama: "PROGRAM PENGEMBANGAN UMKM",
       },
       {
              id: "1104",
              id1: "12",
              id2: "217",
              kode: "2.17.09",
              nama: "PROGRAM PENGUATAN BADAN HUKUM KOPERASI",
       },
       {
              id: "1105",
              id1: "12",
              id2: "218",
              kode: "2.18.02",
              nama: "PROGRAM PENGEMBANGAN IKLIM PENANAMAN MODAL",
       },
       {
              id: "1106",
              id1: "12",
              id2: "218",
              kode: "2.18.03",
              nama: "PROGRAM PROMOSI PENANAMAN MODAL",
       },
       {
              id: "1107",
              id1: "12",
              id2: "218",
              kode: "2.18.04",
              nama: "PROGRAM PELAYANAN PENANAMAN MODAL",
       },
       {
              id: "1108",
              id1: "12",
              id2: "218",
              kode: "2.18.05",
              nama: "PROGRAM PENGENDALIAN PELAKSANAAN PENANAMAN MODAL",
       },
       {
              id: "1109",
              id1: "12",
              id2: "218",
              kode: "2.18.06",
              nama: "PROGRAM PENGELOLAAN DATA DAN SISTEM INFORMASI PENANAMAN MODAL",
       },
       {
              id: "1110",
              id1: "12",
              id2: "219",
              kode: "2.19.02",
              nama: "PROGRAM PENGEMBANGAN KAPASITAS DAYA SAING KEPEMUDAAN",
       },
       {
              id: "1111",
              id1: "12",
              id2: "219",
              kode: "2.19.03",
              nama: "PROGRAM PENGEMBANGAN KAPASITAS DAYA SAING KEOLAHRAGAAN",
       },
       {
              id: "1112",
              id1: "12",
              id2: "219",
              kode: "2.19.04",
              nama: "PROGRAM PENGEMBANGAN KAPASITAS KEPRAMUKAAN",
       },
       {
              id: "1113",
              id1: "12",
              id2: "220",
              kode: "2.20.02",
              nama: "PROGRAM PENYELENGGARAAN STATISTIK SEKTORAL",
       },
       {
              id: "1114",
              id1: "12",
              id2: "221",
              kode: "2.21.02",
              nama: "PROGRAM PENYELENGGARAAN PERSANDIAN UNTUK PENGAMANAN INFORMASI",
       },
       {
              id: "1115",
              id1: "12",
              id2: "222",
              kode: "2.22.02",
              nama: "PROGRAM PENGEMBANGAN KEBUDAYAAN",
       },
       {
              id: "1116",
              id1: "12",
              id2: "222",
              kode: "2.22.03",
              nama: "PROGRAM PENGEMBANGAN KESENIAN TRADISIONAL",
       },
       {
              id: "1117",
              id1: "12",
              id2: "222",
              kode: "2.22.04",
              nama: "PROGRAM PEMBINAAN SEJARAH",
       },
       {
              id: "1118",
              id1: "12",
              id2: "222",
              kode: "2.22.05",
              nama: "PROGRAM PELESTARIAN DAN PENGELOLAAN CAGAR BUDAYA",
       },
       {
              id: "1119",
              id1: "12",
              id2: "222",
              kode: "2.22.06",
              nama: "PROGRAM PENGELOLAAN PERMUSEUMAN",
       },
       {
              id: "1120",
              id1: "12",
              id2: "222",
              kode: "2.22.07",
              nama: "PROGRAM MAJELIS ADAT ACEH (MAA)",
       },
       {
              id: "1122",
              id1: "12",
              id2: "222",
              kode: "2.22.10",
              nama: "PROGRAM PERFILMAN NASIONAL",
       },
       {
              id: "1123",
              id1: "12",
              id2: "223",
              kode: "2.23.02",
              nama: "PROGRAM PEMBINAAN PERPUSTAKAAN",
       },
       {
              id: "1124",
              id1: "12",
              id2: "223",
              kode: "2.23.03",
              nama: "PROGRAM PELESTARIAN KOLEKSI NASIONAL DAN NASKAH KUNO",
       },
       {
              id: "1125",
              id1: "12",
              id2: "224",
              kode: "2.24.02",
              nama: "PROGRAM PENGELOLAAN ARSIP",
       },
       {
              id: "1126",
              id1: "12",
              id2: "224",
              kode: "2.24.03",
              nama: "PROGRAM PERLINDUNGAN DAN PENYELAMATAN ARSIP",
       },
       {
              id: "1127",
              id1: "12",
              id2: "224",
              kode: "2.24.04",
              nama: "PROGRAM PERIZINAN PENGGUNAAN ARSIP",
       },
       {
              id: "1128",
              id1: "13",
              id2: "225",
              kode: "3.25.03",
              nama: "PROGRAM PENGELOLAAN PERIKANAN TANGKAP",
       },
       {
              id: "1129",
              id1: "13",
              id2: "225",
              kode: "3.25.04",
              nama: "PROGRAM PENGELOLAAN PERIKANAN BUDIDAYA",
       },
       {
              id: "1130",
              id1: "13",
              id2: "225",
              kode: "3.25.05",
              nama: "PROGRAM PENGAWASAN SUMBER DAYA KELAUTAN DAN PERIKANAN",
       },
       {
              id: "1131",
              id1: "13",
              id2: "225",
              kode: "3.25.06",
              nama: "PROGRAM PENGOLAHAN DAN PEMASARAN HASIL PERIKANAN",
       },
       {
              id: "1132",
              id1: "13",
              id2: "226",
              kode: "3.26.02",
              nama: "PROGRAM PENINGKATAN DAYA TARIK DESTINASI PARIWISATA",
       },
       {
              id: "1133",
              id1: "13",
              id2: "226",
              kode: "3.26.03",
              nama: "PROGRAM PEMASARAN PARIWISATA",
       },
       {
              id: "1134",
              id1: "13",
              id2: "226",
              kode: "3.26.04",
              nama: "PROGRAM PENGEMBANGAN EKONOMI KREATIF MELALUI PEMANFAATAN DAN PERLINDUNGAN HAK KEKAYAAN INTELEKTUAL",
       },
       {
              id: "1135",
              id1: "13",
              id2: "226",
              kode: "3.26.05",
              nama: "PROGRAM PENGEMBANGAN SUMBER DAYA PARIWISATA DAN EKONOMI KREATIF",
       },
       {
              id: "1136",
              id1: "13",
              id2: "227",
              kode: "3.27.02",
              nama: "PROGRAM PENYEDIAAN DAN PENGEMBANGAN SARANA PERTANIAN",
       },
       {
              id: "1137",
              id1: "13",
              id2: "227",
              kode: "3.27.03",
              nama: "PROGRAM PENYEDIAAN DAN PENGEMBANGAN PRASARANA PERTANIAN",
       },
       {
              id: "1138",
              id1: "13",
              id2: "227",
              kode: "3.27.04",
              nama: "PROGRAM PENGENDALIAN KESEHATAN HEWAN DAN KESEHATAN MASYARAKAT VETERINER",
       },
       {
              id: "1139",
              id1: "13",
              id2: "227",
              kode: "3.27.05",
              nama: "PROGRAM PENGENDALIAN DAN PENANGGULANGAN BENCANA PERTANIAN",
       },
       {
              id: "1140",
              id1: "13",
              id2: "227",
              kode: "3.27.06",
              nama: "PROGRAM PERIZINAN USAHA PERTANIAN",
       },
       {
              id: "1141",
              id1: "13",
              id2: "227",
              kode: "3.27.07",
              nama: "PROGRAM PENYULUHAN PERTANIAN",
       },
       {
              id: "1142",
              id1: "13",
              id2: "228",
              kode: "3.28.04",
              nama: "PROGRAM KONSERVASI SUMBER DAYA ALAM HAYATI DAN EKOSISTEMNYA",
       },
       {
              id: "1143",
              id1: "13",
              id2: "228",
              kode: "3.28.08",
              nama: "PROGRAM PENGELOLAAN HUTAN ADAT",
       },
       {
              id: "1144",
              id1: "13",
              id2: "229",
              kode: "3.29.02",
              nama: "PROGRAM PENGELOLAAN ASPEK GEOLOGI",
       },
       {
              id: "1145",
              id1: "13",
              id2: "229",
              kode: "3.29.05",
              nama: "PROGRAM PENGELOLAAN ENERGI BARU TERBARUKAN",
       },
       {
              id: "1146",
              id1: "13",
              id2: "230",
              kode: "3.30.02",
              nama: "PROGRAM PERIZINAN DAN PENDAFTARAN PERUSAHAAN",
       },
       {
              id: "1147",
              id1: "13",
              id2: "230",
              kode: "3.30.03",
              nama: "PROGRAM PENINGKATAN SARANA DISTRIBUSI PERDAGANGAN",
       },
       {
              id: "1148",
              id1: "13",
              id2: "230",
              kode: "3.30.04",
              nama: "PROGRAM STABILISASI HARGA BARANG KEBUTUHAN POKOK DAN BARANG PENTING",
       },
       {
              id: "1149",
              id1: "13",
              id2: "230",
              kode: "3.30.05",
              nama: "PROGRAM PENGEMBANGAN EKSPOR",
       },
       {
              id: "1150",
              id1: "13",
              id2: "230",
              kode: "3.30.06",
              nama: "PROGRAM STANDARDISASI DAN PERLINDUNGAN KONSUMEN",
       },
       {
              id: "1151",
              id1: "13",
              id2: "230",
              kode: "3.30.07",
              nama: "PROGRAM PENGGUNAAN DAN PEMASARAN PRODUK DALAM NEGERI",
       },
       {
              id: "1152",
              id1: "13",
              id2: "231",
              kode: "3.31.02",
              nama: "PROGRAM PERENCANAAN DAN PEMBANGUNAN INDUSTRI",
       },
       {
              id: "1153",
              id1: "13",
              id2: "231",
              kode: "3.31.03",
              nama: "PROGRAM PENGENDALIAN IZIN USAHA INDUSTRI",
       },
       {
              id: "1154",
              id1: "13",
              id2: "231",
              kode: "3.31.04",
              nama: "PROGRAM PENGELOLAAN SISTEM INFORMASI INDUSTRI NASIONAL",
       },
       {
              id: "1155",
              id1: "13",
              id2: "232",
              kode: "3.32.02",
              nama: "PROGRAM PERENCANAAN KAWASAN TRANSMIGRASI",
       },
       {
              id: "1156",
              id1: "13",
              id2: "232",
              kode: "3.32.03",
              nama: "PROGRAM PEMBANGUNAN KAWASAN TRANSMIGRASI",
       },
       {
              id: "1157",
              id1: "13",
              id2: "232",
              kode: "3.32.04",
              nama: "PROGRAM PENGEMBANGAN KAWASAN TRANSMIGRASI",
       },
       {
              id: "1158",
              id1: "14",
              id2: "233",
              kode: "4.01.02",
              nama: "PROGRAM PEMERINTAHAN DAN KESEJAHTERAAN RAKYAT",
       },
       {
              id: "1159",
              id1: "14",
              id2: "233",
              kode: "4.01.03",
              nama: "PROGRAM PEREKONOMIAN DAN PEMBANGUNAN",
       },
       {
              id: "1161",
              id1: "14",
              id2: "234",
              kode: "4.02.02",
              nama: "PROGRAM DUKUNGAN PELAKSANAAN TUGAS DAN FUNGSI DPRD",
       },
       {
              id: "1162",
              id1: "15",
              id2: "235",
              kode: "5.01.02",
              nama: "PROGRAM PERENCANAAN, PENGENDALIAN DAN EVALUASI PEMBANGUNAN DAERAH",
       },
       {
              id: "1163",
              id1: "15",
              id2: "235",
              kode: "5.01.03",
              nama: "PROGRAM KOORDINASI DAN SINKRONISASI PERENCANAAN PEMBANGUNAN DAERAH",
       },
       {
              id: "1164",
              id1: "15",
              id2: "236",
              kode: "5.02.02",
              nama: "PROGRAM PENGELOLAAN KEUANGAN DAERAH",
       },
       {
              id: "1165",
              id1: "15",
              id2: "236",
              kode: "5.02.03",
              nama: "PROGRAM PENGELOLAAN BARANG MILIK DAERAH",
       },
       {
              id: "1166",
              id1: "15",
              id2: "236",
              kode: "5.02.04",
              nama: "PROGRAM PENGELOLAAN PENDAPATAN DAERAH",
       },
       {
              id: "1167",
              id1: "15",
              id2: "237",
              kode: "5.03.02",
              nama: "PROGRAM KEPEGAWAIAN DAERAH",
       },
       {
              id: "1168",
              id1: "15",
              id2: "238",
              kode: "5.04.02",
              nama: "PROGRAM PENGEMBANGAN SUMBER DAYA MANUSIA",
       },
       {
              id: "1169",
              id1: "15",
              id2: "239",
              kode: "5.05.02",
              nama: "PROGRAM PENELITIAN DAN PENGEMBANGAN DAERAH",
       },
       {
              id: "3003",
              id1: "15",
              id2: "239",
              kode: "5.05.03",
              nama: "PROGRAM RISET DAN INOVASI DAERAH",
       },
       {
              id: "1170",
              id1: "15",
              id2: "240",
              kode: "5.06.02",
              nama: "PROGRAM PENGELOLAAN PERBATASAN",
       },
       {
              id: "1171",
              id1: "16",
              id2: "242",
              kode: "6.01.02",
              nama: "PROGRAM PENYELENGGARAAN PENGAWASAN",
       },
       {
              id: "1172",
              id1: "16",
              id2: "242",
              kode: "6.01.03",
              nama: "PROGRAM PERUMUSAN KEBIJAKAN, PENDAMPINGAN DAN ASISTENSI",
       },
       {
              id: "1173",
              id1: "17",
              id2: "243",
              kode: "7.01.02",
              nama: "PROGRAM PENYELENGGARAAN PEMERINTAHAN DAN PELAYANAN PUBLIK",
       },
       {
              id: "1174",
              id1: "17",
              id2: "243",
              kode: "7.01.03",
              nama: "PROGRAM PEMBERDAYAAN MASYARAKAT DESA DAN KELURAHAN",
       },
       {
              id: "1175",
              id1: "17",
              id2: "243",
              kode: "7.01.04",
              nama: "PROGRAM KOORDINASI KETENTRAMAN DAN KETERTIBAN UMUM",
       },
       {
              id: "1176",
              id1: "17",
              id2: "243",
              kode: "7.01.05",
              nama: "PROGRAM PENYELENGGARAAN URUSAN PEMERINTAHAN UMUM",
       },
       {
              id: "1177",
              id1: "17",
              id2: "243",
              kode: "7.01.06",
              nama: "PROGRAM PEMBINAAN DAN PENGAWASAN PEMERINTAHAN DESA",
       },
       {
              id: "1178",
              id1: "18",
              id2: "247",
              kode: "8.01.02",
              nama: "PROGRAM PENGUATAN IDEOLOGI PANCASILA DAN KARAKTER KEBANGSAAN",
       },
       {
              id: "1179",
              id1: "18",
              id2: "247",
              kode: "8.01.03",
              nama: "PROGRAM PENINGKATAN PERAN PARTAI POLITIK DAN LEMBAGA PENDIDIKAN MELALUI PENDIDIKAN POLITIK DAN PENGEMBANGAN ETIKA SERTA BUDAYA POLITIK",
       },
       {
              id: "1180",
              id1: "18",
              id2: "247",
              kode: "8.01.04",
              nama: "PROGRAM PEMBERDAYAAN DAN PENGAWASAN ORGANISASI KEMASYARAKATAN",
       },
       {
              id: "1181",
              id1: "18",
              id2: "247",
              kode: "8.01.05",
              nama: "PROGRAM PEMBINAAN DAN PENGEMBANGAN KETAHANAN EKONOMI, SOSIAL, DAN BUDAYA",
       },
       {
              id: "1182",
              id1: "18",
              id2: "247",
              kode: "8.01.06",
              nama: "PROGRAM PENINGKATAN KEWASPADAAN NASIONAL DAN PENINGKATAN KUALITAS DAN FASILITASI PENANGANAN KONFLIK SOSIAL",
       },
       {
              id: "1186",
              id1: "20",
              id2: "251",
              kode: "X.XX.01",
              nama: "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
       }
]

export const seedMaster = async (req, res, next) => {
       try {
              const urusan = [];

              for (const ur of urusan_data) {
                     const bidang = [];
                     const bind_bidang = bidang_data.filter(item => item.id1 === ur.id);

                     for (const b of bind_bidang) {
                            const program = [];
                            const bind_program = program_data.filter(item => item.id1 === ur.id && item.id2 === b.id);

                            for (const p of bind_program) {
                                   const kegiatan = [];
                                   const kegiatan_data = JSON.parse(fs.readFileSync('./seeder/kegiatan.json', 'utf8'));
                                   const bind_kegiatan = kegiatan_data.filter(item => item.id1 === ur.id && item.id2 === b.id && item.id3 === p.id);

                                   for (const k of bind_kegiatan) {
                                          const subKegiatan = [];
                                          const skegiatan_data = JSON.parse(fs.readFileSync('./seeder/sub.json', 'utf8'));
                                          const bind_skegiatan = skegiatan_data.filter(item => item.id1 === ur.id && item.id2 === b.id && item.id3 === p.id && item.id4 === k.id);

                                          for (const sk of bind_skegiatan) {
                                                 subKegiatan.push({
                                                        kode: sk.kode.split(".")[5],
                                                        name: sk.nama
                                                 })
                                          }


                                          kegiatan.push({
                                                 kode: `${k.kode.split(".")[3]}.${k.kode.split(".")[4]}`,
                                                 name: k.name,
                                                 subKegiatan
                                          })
                                   }
                                   program.push({
                                          kode: p.kode.split(".")[2],
                                          name: p.nama,
                                          kegiatan
                                   })
                            }

                            bidang.push({
                                   kode: b.kode.split('.')[1],
                                   name: b.nama,
                                   program
                            })
                     }

                     urusan.push({
                            kode: ur.kode,
                            name: ur.nama,
                            bidang
                     });
              }

              const success = [];

              for (const u of urusan) {
                     if (u.bidang.length === 0) continue;
                     const addU = await prisma.master.create({
                            data: {
                                   type: "urusan",
                                   name: u.name,
                                   kode: u.kode,
                                   parent_id: null
                            }
                     });
                     success.push(addU);

                     for (const b of u.bidang) {
                            if (b.program.length === 0) continue;
                            const addB = await prisma.master.create({
                                   data: {
                                          type: "bidang",
                                          name: b.name,
                                          kode: b.kode,
                                          parent_id: addU.id
                                   }
                            });
                            success.push(addB);

                            for (const p of b.program) {
                                   if (p.kegiatan.length === 0) continue;
                                   const addP = await prisma.master.create({
                                          data: {
                                                 type: "program",
                                                 name: p.name,
                                                 kode: p.kode,
                                                 parent_id: addB.id
                                          }
                                   });
                                   success.push(addP);

                                   for (const k of p.kegiatan) {
                                          if (k.subKegiatan.length === 0) continue;
                                          const addK = await prisma.master.create({
                                                 data: {
                                                        type: "kegiatan",
                                                        name: k.name,
                                                        kode: k.kode,
                                                        parent_id: addP.id
                                                 }
                                          });
                                          success.push(addK);

                                          for (const sk of k.subKegiatan) {
                                                 const addSK = await prisma.master.create({
                                                        data: {
                                                               type: "subKegiatan",
                                                               name: sk.name,
                                                               kode: sk.kode,
                                                               parent_id: addK.id
                                                        }
                                                 })
                                                 success.push(addSK);
                                          }
                                   }
                            }
                     }

              };

              console.table(success);
              return response(res, 200, true, "data seeder", success);

       } catch (error) {
              next(error)
       }

}

