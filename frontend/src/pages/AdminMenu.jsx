import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminMenu() {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    nama_kopi: "", deskripsi: "", harga: ""
  });
  const [fileGambar, setFileGambar] = useState(null); // Menyimpan file upload

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/orders");
      setOrders(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/menus");
      setMenus(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFileGambar(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Karena kita mengirim File, kita wajib menggunakan FormData, bukan JSON biasa
    const dataKirim = new FormData();
    dataKirim.append("nama_kopi", formData.nama_kopi);
    dataKirim.append("deskripsi", formData.deskripsi);
    dataKirim.append("harga", formData.harga);
    if (fileGambar) {
      dataKirim.append("gambar", fileGambar);
    }

    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:5000/api/menus/${editId}`, dataKirim, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Menu kopi berhasil diperbarui!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://127.0.0.1:5000/api/menus", dataKirim, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Menu kopi baru berhasil ditambahkan!");
      }
      // Reset form
      setFormData({ nama_kopi: "", deskripsi: "", harga: "" });
      setFileGambar(null);
      document.getElementById('inputGambar').value = ""; // Reset input file
      fetchMenus(); 
    } catch (error) {
      alert("Gagal memproses menu.");
      console.error(error);
    }
  };

  const handleEditClick = (menu) => {
    setIsEditing(true);
    setEditId(menu.id);
    setFormData({
      nama_kopi: menu.nama_kopi,
      deskripsi: menu.deskripsi,
      harga: menu.harga
    });
    setFileGambar(null); // File gambar harus diupload ulang jika ingin diganti
  };

  const handleBatalEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ nama_kopi: "", deskripsi: "", harga: "" });
    setFileGambar(null);
  };

  const handleSelesaiOrder = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/orders/${id}`, { status: "Selesai" });
      fetchOrders(); 
    } catch (error) { console.error(error); }
  };

  const handleDeleteMenu = async (id) => {
    if(window.confirm("Yakin ingin menghapus menu ini dari Kasir?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/menus/${id}`);
        fetchMenus(); 
      } catch (error) { alert("Gagal menghapus menu."); }
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#F5F1EE", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1300px", margin: "auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#3E2723", fontSize: "32px", fontWeight: "bold" }}>Panel Admin Kedaiku</h1>
          <Link to="/" style={{ backgroundColor: "#FFFFFF", color: "#5D4037", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", border: "2px solid #5D4037" }}>← Kembali ke Kasir</Link>
        </div>

        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          <div style={{ flex: "1", minWidth: "350px", display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* FORM TAMBAH/EDIT DENGAN UPLOAD FILE */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)" }}>
              <h2 style={{ color: "#4E342E", marginBottom: "20px", borderBottom: "2px solid #EFEBE9", paddingBottom: "10px" }}>
                {isEditing ? "📝 Edit Menu Kopi" : "Tambah Menu Baru"}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input type="text" name="nama_kopi" placeholder="Nama Kopi" value={formData.nama_kopi} onChange={handleChange} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#FAFAFA" }} />
                <input type="text" name="deskripsi" placeholder="Deskripsi Singkat" value={formData.deskripsi} onChange={handleChange} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#FAFAFA" }} />
                <input type="number" name="harga" placeholder="Harga Jual (Rp)" value={formData.harga} onChange={handleChange} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#FAFAFA" }} />
                
                {/* INPUT UPLOAD GAMBAR */}
                <div>
                  <label style={{ fontSize: "14px", color: "#8D6E63", display: "block", marginBottom: "5px" }}>Upload Gambar Kopi:</label>
                  <input id="inputGambar" type="file" accept="image/*" onChange={handleFileChange} style={{ padding: "10px", borderRadius: "8px", border: "1px dashed #D7CCC8", width: "100%", backgroundColor: "#FAFAFA", cursor: "pointer" }} />
                  {isEditing && <small style={{ color: "#F57C00" }}>*Kosongkan jika tidak ingin ganti gambar.</small>}
                </div>
                
                <button type="submit" style={{ backgroundColor: isEditing ? "#10B981" : "#5D4037", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "5px" }}>
                  {isEditing ? "Simpan Perubahan harga" : "Simpan Menu"}
                </button>
                
                {isEditing && (
                  <button type="button" onClick={handleBatalEdit} style={{ backgroundColor: "#94A3B8", color: "white", padding: "10px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                    Batal Edit
                  </button>
                )}
              </form>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)" }}>
              <h2 style={{ color: "#4E342E", marginBottom: "15px", borderBottom: "2px solid #EFEBE9", paddingBottom: "10px" }}>Daftar Menu Kasir</h2>
              {menus.length === 0 ? (
                <p style={{ color: "#8D6E63", textAlign: "center", padding: "10px 0" }}>Belum ada menu kopi di kasir.</p>
              ) : (
                menus.map(menu => (
                  <div key={menu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EFEBE9", paddingBottom: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      {/* Tampilkan Thumbnail Gambar di Daftar Menu */}
                      <img src={menu.gambar || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=100&q=80"} alt="kopi" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }} />
                      <div>
                        <strong style={{ color: "#3E2723" }}>{menu.nama_kopi}</strong><br/>
                        <small style={{ color: "#8D6E63" }}>Rp {menu.harga}</small>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button onClick={() => handleEditClick(menu)} style={{ backgroundColor: "#F57C00", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                      <button onClick={() => handleDeleteMenu(menu.id)} style={{ backgroundColor: "#D32F2F", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>Hapus</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ flex: "2", minWidth: "600px", backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)" }}>
            <h2 style={{ color: "#4E342E", marginBottom: "20px", borderBottom: "2px solid #EFEBE9", paddingBottom: "10px" }}>Riwayat Penjualan Kasir</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#EFEBE9", color: "#3E2723" }}>
                    <th style={{ padding: "12px", borderBottom: "2px solid #D7CCC8" }}>ID</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #D7CCC8" }}>Pelanggan</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #D7CCC8" }}>Pesanan</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #D7CCC8" }}>Total</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #D7CCC8" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#8D6E63" }}>Belum ada transaksi.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid #EFEBE9" }}>
                        <td style={{ padding: "12px", color: "#8D6E63" }}>#{order.id}</td>
                        <td style={{ padding: "12px", fontWeight: "bold", color: "#3E2723" }}>{order.nama_pelanggan}</td>
                        <td style={{ padding: "12px", color: "#6D4C41", fontSize: "14px" }}>{order.detail_pesanan}</td>
                        <td style={{ padding: "12px", fontWeight: "bold", color: "#3E2723" }}>Rp {order.total_harga}</td>
                        <td style={{ padding: "12px" }}>
                          {order.status === "Selesai" ? (
                            <span style={{ color: "#2E7D32", fontWeight: "bold", backgroundColor: "#E8F5E9", padding: "6px 12px", borderRadius: "50px", fontSize: "13px", display: "inline-block" }}>✅ Selesai</span>
                          ) : (
                            <button onClick={() => handleSelesaiOrder(order.id)} style={{ backgroundColor: "#F57C00", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>⏳ Tandai Selesai</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}