const form = document.getElementById("form");
const input = document.getElementById("isi");
const daftar = document.getElementById("daftar");

// Ambil data dari server lalu tampilkan
async function muatCatatan() {
  const res = await fetch("/api/catatan");
  const data = await res.json();

  daftar.innerHTML = "";
  for (const c of data) {
    const li = document.createElement("li");

    const teks = document.createElement("span");
    teks.textContent = c.isi;

    const tombol = document.createElement("button");
    tombol.textContent = "Hapus";
    tombol.onclick = () => hapus(c.id);

    li.append(teks, tombol);
    daftar.append(li);
  }
}

// Kirim catatan baru
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // cegah halaman reload
  await fetch("/api/catatan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isi: input.value }),
  });
  input.value = "";
  muatCatatan();
});

// Hapus catatan
async function hapus(id) {
  await fetch("/api/catatan/" + id, { method: "DELETE" });
  muatCatatan();
}

muatCatatan(); // jalankan saat halaman pertama dibuka