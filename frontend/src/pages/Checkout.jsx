import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from '../api'; 

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [uangDibayar, setUangDibayar] = useState("");
  const [struk, setStruk] = useState(null); // Menyimpan data struk
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const validCart = Array.isArray(cart) ? cart : [];
  const totalHarga = validCart.reduce((total, item) => total + (item.harga * item.qty), 0);
  const kembalian = uangDibayar ? Number(uangDibayar) - totalHarga : 0;

  const hapusItem = (id) => {
    const newCart = validCart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const buatDetailPesanan = () => validCart.map(item => `${item.qty}x ${item.nama_kopi}`).join(", ");

  const handlePembayaran = async (e) => {
    e.preventDefault();
    if (!namaPelanggan) return alert("Kasir wajib mengisi Nama Pelanggan!");
    if (uangDibayar < totalHarga) return alert("Uang pembayaran kurang dari total tagihan!");

    try {
      await axios.post(`${API_URL}/api/orders`, {
        nama_pelanggan: namaPelanggan,
        detail_pesanan: buatDetailPesanan(),
        total_harga: totalHarga,
        uang_dibayar: Number(uangDibayar),
        kembalian: kembalian
      });
      
      // FITUR BARU: Memunculkan Struk
      setStruk({
        nama: namaPelanggan,
        items: validCart,
        total: totalHarga,
        bayar: uangDibayar,
        kembali: kembalian,
        tanggal: new Date().toLocaleString("id-ID")
      });
      
      localStorage.removeItem("cart");
    } catch (error) {
      alert("Gagal memproses pembayaran ke Database.");
      console.error(error);
    }
  };

  const tutupStruk = () => {
    setStruk(null);
    navigate("/");
  };

  // JIKA STRUK MUNCUL
  if (struk) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#5D4037", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "10px", width: "400px", fontFamily: "monospace", color: "black", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <h2 style={{ textAlign: "center", margin: "0 0 10px 0" }}>☕ KEDAIKU</h2>
          <p style={{ textAlign: "center", margin: "0 0 20px 0", borderBottom: "1px dashed black", paddingBottom: "10px" }}>Struk Pembayaran</p>
          
          <p>Tanggal : {struk.tanggal}</p>
          <p>Pelanggan: {struk.nama}</p>
          <p style={{ borderBottom: "1px dashed black", paddingBottom: "10px" }}>Kasir  : Barista Utama</p>

          <div style={{ marginTop: "15px", marginBottom: "15px" }}>
            {struk.items.map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span>{item.qty}x {item.nama_kopi}</span>
                <span>Rp {item.harga * item.qty}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px dashed black", paddingTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px" }}>
              <span>Total:</span><span>Rp {struk.total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tunai:</span><span>Rp {struk.bayar}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Kembali:</span><span>Rp {struk.kembali}</span>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "30px", fontSize: "12px" }}>Terima kasih atas kunjungannya!</p>

          {/* Tombol Aksi (Tidak ikut terprint) */}
          <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
            <button onClick={() => window.print()} style={{ flex: 1, backgroundColor: "#3E2723", color: "white", padding: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }}>🖨️ Cetak</button>
            <button onClick={tutupStruk} style={{ flex: 1, backgroundColor: "#D7CCC8", color: "#3E2723", padding: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Selesai</button>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN KASIR NORMAL
  return (
    <div style={{ padding: "40px", backgroundColor: "#F5F1EE", minHeight: "100vh", display: "flex", gap: "20px", justifyContent: "center", alignItems: "flex-start" }}>
      
      <div style={{ flex: "1", maxWidth: "600px", backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #EFEBE9", paddingBottom: "15px" }}>
          <h1 style={{ color: "#3E2723", fontSize: "24px", fontWeight: "bold" }}>Pesanan Saat Ini</h1>
          <Link to="/" style={{ color: "#8D6E63", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>← Kembali</Link>
        </div>

        {validCart.length === 0 ? (
          <p style={{ color: "#8D6E63", textAlign: "center", padding: "20px 0" }}>Belum ada kopi yang dipilih.</p>
        ) : (
          <div>
            {validCart.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px", backgroundColor: "#FAFAFA", border: "1px solid #EFEBE9", padding: "10px", borderRadius: "8px" }}>
                <img src={item.gambar} alt={item.nama_kopi} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#4E342E", fontSize: "16px", margin: 0 }}>{item.nama_kopi}</h3>
                  <p style={{ color: "#6D4C41", margin: "4px 0 0 0", fontSize: "14px" }}>Rp {item.harga} x {item.qty}</p>
                </div>
                <div style={{ fontWeight: "bold", color: "#3E2723" }}>Rp {item.harga * item.qty}</div>
                <button onClick={() => hapusItem(item.id)} style={{ backgroundColor: "#D32F2F", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>X</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: "350px", backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)", position: "sticky", top: "40px" }}>
        <h2 style={{ color: "#3E2723", fontSize: "20px", marginBottom: "20px", borderBottom: "2px solid #EFEBE9", paddingBottom: "10px" }}>Pembayaran Kasir</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#6D4C41", marginBottom: "5px", fontSize: "14px" }}>Nama Pelanggan:</label>
          <input 
            type="text" 
            placeholder="Ketik nama pelanggan..." 
            value={namaPelanggan}
            onChange={(e) => setNamaPelanggan(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #D7CCC8", backgroundColor: "#FAFAFA" }}
          />
        </div>

        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#EFEBE9", borderRadius: "8px" }}>
          <p style={{ color: "#6D4C41", margin: "0 0 5px 0", fontSize: "14px" }}>Total Tagihan:</p>
          <h2 style={{ color: "#3E2723", margin: 0, fontSize: "28px" }}>Rp {totalHarga}</h2>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#6D4C41", marginBottom: "5px", fontSize: "14px" }}>Uang Diterima (Rp):</label>
          <input 
            type="number" 
            placeholder="0" 
            value={uangDibayar}
            onChange={(e) => setUangDibayar(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #D7CCC8", fontSize: "18px", fontWeight: "bold", color: "#3E2723" }}
          />
        </div>

        <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: kembalian >= 0 ? "#E8F5E9" : "#FFEBEE", borderRadius: "8px" }}>
          <p style={{ color: kembalian >= 0 ? "#2E7D32" : "#C62828", margin: "0 0 5px 0", fontSize: "14px" }}>Kembalian:</p>
          <h3 style={{ color: kembalian >= 0 ? "#1B5E20" : "#B71C1C", margin: 0, fontSize: "20px" }}>
            Rp {uangDibayar === "" ? 0 : kembalian}
          </h3>
        </div>

        <button 
          onClick={handlePembayaran}
          disabled={validCart.length === 0}
          style={{ width: "100%", backgroundColor: validCart.length === 0 ? "#A1887F" : "#3E2723", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: validCart.length === 0 ? "not-allowed" : "pointer" }}
        >
          Proses Pembayaran
        </button>
      </div>
    </div>
  );
}