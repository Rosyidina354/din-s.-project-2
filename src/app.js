document.addEventListener('alpine:init', () => {
    Alpine.data('menu', () => ({
        items: [
            { id: 1, name: 'Iga Bakar lada hitam', img: '1.jpg', price: 35000 },
            { id: 2, name: 'Ayam Asam Manis', img: '2.jpg', price: 20000 },
            { id: 3, name: 'Ayam Dalkgengjong', img: '3.jpg', price: 20000 },
            { id: 4, name: 'Ayam Goreng Tampah', img: '4.jpg', price: 20000 },
            { id: 5, name: 'Ayam Bakar Tampah', img: '5.jpeg', price: 20000 },
            { id: 6, name: 'Ayam Mozarella Sambal Lalapan', img: '6.jpg', price: 20000 },
            { id: 7, name: 'Nasi Sop Iga', img: '7.jpg', price: 30000 },
            { id: 8, name: 'Nasi Telor Kecap', img: '8.jpg', price: 17000 },
            { id: 9, name: 'Otak Otak', img: '9.jpg', price: 10000 },
            { id: 10, name: 'Mie Ayam Bakso', img: '10.jpeg', price: 16000 },
            { id: 11, name: 'Mie Yamin Bakso', img: '11.jpeg', price: 16000 },
            { id: 12, name: 'Mie Chili oil', img: '12.jpg', price: 18000 },
            { id: 13, name: 'Bakso Urat', img: '13.jpeg', price: 17000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if(!cartItem) {
             this.items.push({...newItem, quantity: 1, total: newItem.price });
             this.quantity++;
             this.total += newItem.price;
            } else {
            // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
             this.items = this.items.map((item) => {
                // jika barang berbeda
                if(item.id !== newItem.id) {
                    return item;
                } else {
                    // jika barang sudah ada, tambah quantity dan totalnya
                    item.quantity++;
                    item.total = item.price * item.quantity;
                    this.quantity++;
                    this.total += item.price;
                    return item;
                }
            });
            }
        },
        remove(id) {
            // ambil item yang mau di remove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

            //  jika item lebih dari satu
            if(cartItem.quantity > 1) {
                // telusuri satu satu
                this.items = this.items.map((item) => {
                    // jika barang yang bukan di klik
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa satu
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    });
});

// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', async function (e) {
  e.preventDefault();

  // ambil data cart dari Alpine.store
  const cart = Alpine.store("cart");

  // buat input hidden untuk items
  const hiddenItems = document.createElement("input");
  hiddenItems.type = "hidden";
  hiddenItems.name = "items";
  hiddenItems.value = JSON.stringify(cart.items);

  // buat input hidden untuk total
  const hiddenTotal = document.createElement("input");
  hiddenTotal.type = "hidden";
  hiddenTotal.name = "total";
  hiddenTotal.value = cart.total;

  // tambahkan ke form
  form.appendChild(hiddenItems);
  form.appendChild(hiddenTotal);

  // ambil data form + hidden input
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  // format dan kirim pesan ke WhatsApp
//   const message = formatMessage(objData);
//   window.open(
//     "https://wa.me/6285784510300?text=" + encodeURIComponent(message)
//   );

// minta transaction token menggunakan ajax /fetch
try {
    const response = await fetch('php/placeOrder.php', {
        method: 'POST',
        body: data,
    });
    const token = await response.text();
     console.log("Token dari Midtrans:", token);
    // console.log(token);
    window.snap.pay(token);
} catch (err) {
    console.log(err.message);
}

});


// format pesan whatsapp
const formatMessage = (obj) => {
  let items = [];

  try {
    const parsed = JSON.parse(obj.items);
    items = Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch (err) {
    console.error("Gagal parse obj.items:", err);
  }

  return `Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}
Data Pesanan:
${items
  .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`)
  .join('\n')}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};


// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};