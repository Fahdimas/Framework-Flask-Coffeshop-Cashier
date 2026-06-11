import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/menus");
        setMenus(response.data);
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handlePesan = (kopi) => {
    const exist = cart.find((item) => item.id === kopi.id);
    if (exist) {
      setCart(cart.map((item) => (item.id === kopi.id ? { ...exist, qty: exist.qty + 1 } : item)));
    } else {
      setCart([...cart, { ...kopi, qty: 1 }]);
    }
  };

  const handleLogout = () => {
    const konfirmasi = window.confirm("Yakin ingin mengakhiri shift dan logout?");
    if (konfirmasi) {
      localStorage.clear(); 
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#F5F1EE", minHeight: "100vh", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "auto", paddingBottom: "80px" }}>
        
        {/* Header POS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", backgroundColor: "#FFFFFF", padding: "20px 30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(62, 39, 35, 0.05)" }}>
          <div>
            <h1 style={{ color: "#3E2723", fontSize: "28px", fontWeight: "bold", margin: 0 }}>Terminal Kasir Kedaiku</h1>
            <p style={{ color: "#8D6E63", margin: "5px 0 0 0" }}>Mode Barista Aktif</p>
          </div>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/admin/menu" style={{ backgroundColor: "#5D4037", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
              ⚙️ Panel Admin
            </Link>
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: "#D32F2F", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Grid Menu */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
          {menus.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", color: "#8D6E63" }}>Menu kosong. Tambahkan menu di Panel Admin.</p>
          ) : (
            menus.map((kopi) => (
              <div key={kopi.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(62, 39, 35, 0.08)" }}>
                <img src={kopi.gambar || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80"} alt={kopi.nama_kopi} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <div style={{ padding: "20px" }}>
                  <h3 style={{ color: "#4E342E", fontSize: "20px", marginBottom: "8px" }}>{kopi.nama_kopi}</h3>
                  <p style={{ fontWeight: "bold", fontSize: "18px", color: "#6D4C41", marginBottom: "15px" }}>Rp {kopi.harga}</p>
                  
                  <button 
                    onClick={() => handlePesan(kopi)}
                    style={{ width: "100%", backgroundColor: "#5D4037", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    + Tambah Pesanan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div 
          onClick={() => navigate('/checkout')}
          style={{ position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#3E2723", color: "white", padding: "15px 30px", borderRadius: "50px", boxShadow: "0 10px 25px rgba(62, 39, 35, 0.3)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", fontSize: "18px", zIndex: 1000 }}
        >
          <span>Lanjut Pembayaran ({cart.reduce((a, c) => a + c.qty, 0)} Item)</span>
          <span>➜</span>
        </div>
      )}
    </div>
  );
}