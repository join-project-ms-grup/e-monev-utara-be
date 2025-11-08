import axios from 'axios';
import FormData from 'form-data';

const form = new FormData();
form.append('appmode', '2');
form.append('menu', 'dak1');
form.append('act', 'csTable');
form.append('pgPer', '50');
form.append('pgNow', '1');
form.append('dvar', 'idaerah|itahun|iskpd|iurubid');
form.append('itahun', '2025');
form.append('iskpd', '699');

axios.post('https://monev-dak.bengkuluutarakab.go.id/new/mod/transaksi/proc1.php', form, {
       headers: {
              ...form.getHeaders(),
              'x-requested-with': 'XMLHttpRequest',
              'jkl-auth': 'noauth',
              'Cookie': 'PHPSESSID=k65ad4qagjk0envtmvkkmitcb0', // ← ambil dari browser kamu
              'Referer': 'https://monev-dak.bengkuluutarakab.go.id/new/admin/dak1',
              'Origin': 'https://monev-dak.bengkuluutarakab.go.id',
       },
})
       .then(res => console.log(res.data))
       .catch(err => console.error('Error:', err.response?.status, err.response?.statusText));
