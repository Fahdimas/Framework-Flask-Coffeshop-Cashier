import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from '../api'; 

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gunakan 127.0.0.1 agar lebih stabil dibanding localhost
      await axios.post(`${API_URL}/api/register`, {
        nama,
        email,
        password,
      });
      alert("Registrasi berhasil! Silakan login untuk mulai bertugas.");
      navigate("/login");
    } catch (error) {
      alert("Gagal registrasi. Pastikan email belum terdaftar.");
      console.error(error);
    }
  };

  return (
    <div className="wrapper" style={{ minHeight: "100vh", backgroundColor: "#FDFDFD", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-container" style={{ display: "flex", maxWidth: "900px", width: "90%", backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        
        {/* =======================================================
           BAGIAN KIRI: GAMBAR NUANSA KOPI (Estetik)
           ======================================================= */}
        <div 
          className="auth-image" 
          style={{ 
            flex: "1", 
            // Gambar barista sedang menuang kopi (estetik)
            backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative"
          }}
        >
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(62, 39, 35, 0.3)" }}></div>
        </div>
        
        {/* Bagian Form Kanan */}
        <div className="auth-form-container" style={{ flex: "1", padding: "50px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <h1 style={{ color: "#3E2723", fontSize: "32px", fontWeight: "bold", marginBottom: "5px" }}>Kedaiku</h1>
          <h2 style={{ color: "#8D6E63", fontSize: "18px", marginBottom: "30px", fontWeight: "normal" }}>Daftar Akun Staf Baru</h2>
          
          <form onSubmit={handleRegister} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#EFEBE9", fontSize: "15px" }}
            />
            <input
              type="email"
              placeholder="Email Barista"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#EFEBE9", fontSize: "15px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D7CCC8", backgroundColor: "#EFEBE9", fontSize: "15px" }}
            />
            
            <button 
                type="submit" 
                style={{ 
                    padding: "15px", 
                    backgroundColor: "#5D4037", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    fontSize: "16px", 
                    fontWeight: "bold", 
                    cursor: "pointer", 
                    marginTop: "10px",
                    transition: "background 0.3s" 
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#3E2723"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#5D4037"}
            >
                Daftar Sekarang
            </button>
          </form>
          
          <p className="auth-link" style={{ marginTop: "25px", textAlign: "center", color: "#6D4C41" }}>
            Sudah punya akun? <Link to="/login" style={{ color: "#3E2723", fontWeight: "bold", textDecoration: "none" }}>Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}