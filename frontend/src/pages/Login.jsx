import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from '../api'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Pastikan backend kamu menggunakan PORT yang benar (5000)
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert(`Selamat bertugas, Barista ${response.data.user.nama}!`);
      navigate("/");
    } catch (error) {
      alert("Login gagal. Email atau Password salah.");
      console.error(error);
    }
  };

  return (
    <div className="wrapper" style={{ minHeight: "100vh", backgroundColor: "#FDFDFD" }}>
      <div className="auth-container" style={{ display: "flex", maxWidth: "900px", margin: "50px auto", backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        
        {/* =======================================================
           BAGIAN KIRI: GAMBAR NUANSA KOPI (Estetik)
           Sifatnya menutupi seluruh div
           ======================================================= */}
        <div 
          className="auth-image" 
          style={{ 
            flex: "1", 
            // Kita gunakan gambar estetik biji kopi & cangkir dari Unsplash
            backgroundImage: "url('https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=2069&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // Tambahkan overlay warna coklat tipis agar form kanan terlihat menyatu
            position: "relative"
          }}
        >
            {/* Overlay gelap opsional biar teks judul lebih menonjol */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(62, 39, 35, 0.2)" }}></div>
        </div>
        
        {/* Bagian Form Kanan */}
        <div className="auth-form-container" style={{ flex: "1", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <h1 style={{ color: "#3E2723", fontSize: "32px", fontWeight: "bold", marginBottom: "5px" }}>Kedaiku</h1>
          <h2 style={{ color: "#8D6E63", fontSize: "18px", marginBottom: "40px", fontWeight: "normal" }}>Masuk ke Terminal Kasir</h2>
          
          <form onSubmit={handleLogin} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input
              type="email"
              placeholder="Email Barista"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "15px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#EFEBE9", fontSize: "16px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "15px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#EFEBE9", fontSize: "16px" }}
            />
            
            {/* Tombol warna coklat kopi */}
            <button 
                type="submit" 
                style={{ 
                    padding: "15px", 
                    backgroundColor: "#5D4037", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    fontSize: "18px", 
                    fontWeight: "bold", 
                    cursor: "pointer", 
                    transition: "background 0.3s" 
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#3E2723"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#5D4037"}
            >
                Start Shift
            </button>
          </form>
          
          <p className="auth-link" style={{ marginTop: "30px", textAlign: "center", color: "#6D4C41" }}>
            Staf baru? <Link to="/register" style={{ color: "#3E2723", fontWeight: "bold", textDecoration: "none" }}>Daftar Akun di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}