-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.44 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_coffee
CREATE DATABASE IF NOT EXISTS `db_coffee` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_coffee`;

-- Dumping structure for table db_coffee.menus
CREATE TABLE IF NOT EXISTS `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kopi` varchar(100) NOT NULL,
  `deskripsi` text,
  `harga` decimal(10,2) NOT NULL,
  `stok` int DEFAULT '0',
  `gambar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_coffee.menus: ~4 rows (approximately)
INSERT INTO `menus` (`id`, `nama_kopi`, `deskripsi`, `harga`, `stok`, `gambar`, `created_at`) VALUES
	(1, 'Aren Latte', 'Perpaduan espresso premium dengan manisnya gula aren asli nusantara.', 30000.00, 50, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&q=80', '2026-06-09 01:25:15'),
	(2, 'Avocado Coffee', 'Signature kopi khas dengan campuran alpukat segar dan es krim cokelat.', 38000.00, 30, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', '2026-06-09 01:25:15'),
	(3, 'Caramel Macchiato', 'Susu segar berpadu dengan sirup karamel lembut dan tembakan espresso.', 35000.00, 40, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80', '2026-06-09 01:25:15'),
	(4, 'Espresso Single Origin', 'Ekstrak kopi murni 30ml yang diekstraksi dari biji kopi pilihan. Memiliki crema tebal dengan profil rasa yang kuat dan intens.', 15000.00, 999, 'http://localhost:5000/uploads/1781167867003.jpg', '2026-06-11 08:51:07');

-- Dumping structure for table db_coffee.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_pelanggan` varchar(50) NOT NULL,
  `detail_pesanan` text NOT NULL,
  `total_harga` int NOT NULL,
  `uang_dibayar` int NOT NULL,
  `kembalian` int NOT NULL,
  `kasir` varchar(50) DEFAULT 'Kasir Utama',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(30) DEFAULT 'Menunggu',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_coffee.orders: ~9 rows (approximately)
INSERT INTO `orders` (`id`, `nama_pelanggan`, `detail_pesanan`, `total_harga`, `uang_dibayar`, `kembalian`, `kasir`, `created_at`, `status`) VALUES
	(1, 'Dimas', '1x Caramel Macchiato, 1x Aren Latte', 64000, 100000, 36000, 'Kasir Utama', '2026-06-11 05:17:46', 'Selesai'),
	(2, 'Akmal', '1x Avocado Coffee, 1x Aren Latte', 68000, 100000, 32000, 'Kasir Utama', '2026-06-11 05:57:30', 'Selesai'),
	(3, 'manda', '1x Caramel Macchiato', 35000, 50000, 15000, 'Kasir Utama', '2026-06-11 06:45:10', 'Selesai'),
	(4, 'dimas', '1x Caramel Macchiato', 35000, 50000, 15000, 'Kasir Utama', '2026-06-11 08:38:06', 'Selesai'),
	(5, 'akmal', '1x Avocado Coffee', 38000, 50000, 12000, 'Kasir Utama', '2026-06-11 08:41:27', 'Selesai'),
	(6, 'dimas', '1x Caramel Macchiato', 35000, 50000, 15000, 'Kasir Utama', '2026-06-11 09:01:06', 'Selesai'),
	(7, 'Akmal', '1x Espresso Single Origin, 1x Caramel Macchiato', 50000, 50000, 0, 'Kasir Utama', '2026-06-11 09:14:26', 'Selesai'),
	(8, 'Akmal', '1x Caramel Macchiato', 35000, 50000, 15000, 'Kasir Utama', '2026-06-25 08:51:49', 'Selesai'),
	(9, 'x', '1x Espresso Single Origin', 15000, 20000, 5000, 'Kasir Utama', '2026-06-25 09:19:24', 'Selesai');

-- Dumping structure for table db_coffee.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_coffee.users: ~3 rows (approximately)
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `created_at`) VALUES
	(1, 'Dimas', 'Dimas@gmail.com', '$2b$10$fY818evrk.SD2A9KF172ne45lhvl2xQQKhcr0yKPVVsDICkCmVO9e', 'customer', '2026-06-07 15:22:25'),
	(2, 'Dimas', 'fahdimas42@gmail.com', '$2b$10$JzzG/o0tztAz8D8kXqTbm.a.0I9S1m7dbX/zN4Lnpz3qRiFLjO4j.', 'customer', '2026-06-11 05:29:42'),
	(3, 'Fahdimas', 'fahdimas4@gmail.com', '$2b$10$ZZ75y9c.u41yjzBMMXEbZerQF3NsvMvdmkWdg2LQtDCox3JzYyJ3K', 'customer', '2026-06-25 09:03:10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
