
import fs from "fs";

// Baca data.json
const data = JSON.parse(
    fs.readFileSync('./data.json', 'utf-8')
);

// Proses grouping
const result = data.reduce((acc, row) => {
    // Baris uraian
    if (row[0] === 'I' || typeof row[0] === 'string') {
        acc.push({
            id: 0,
            uraian: row[1],
            target: [],
        });

        return acc;
    }

    // Baris target
    if (typeof row[0] === 'number') {
        const current = acc[acc.length - 1];

        if (current) {
            current.target.push({
                name: row[1],
                satuan: row[2],
                base_line: 0,
                perhitungan: "akumulatif",
                is_iku: false,
                target: [
                    { tahun: 2025, tahun_ke: 1, target: 0 },
                    { tahun: 2026, tahun_ke: 2, target: row[3] },
                    { tahun: 2027, tahun_ke: 3, target: 0 },
                    { tahun: 2028, tahun_ke: 4, target: 0 },
                    { tahun: 2029, tahun_ke: 5, target: 0 },
                    { tahun: 2030, tahun_ke: 6, target: 0 },
                ],
            });
        }
    }

    return acc;
}, []);

// Tulis ke hasil.json
fs.writeFileSync(
    './hasil.json',
    JSON.stringify(result, null, 4),
    'utf-8'
);

console.log('Grouping berhasil!');
console.log(`Hasil disimpan ke hasil.json`);
