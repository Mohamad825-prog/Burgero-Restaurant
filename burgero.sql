-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2025 at 08:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `burgero`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$11FUkGNe/P6eqksuV88B4OVDH.TJZY7twkLhD/vx7VHY7bMb2hdH.', '2025-12-27 11:07:51');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `message`, `is_read`, `created_at`) VALUES
(1, 'Mohamad', 'mohamad@gmail.com', 'Hello', 1, '2025-12-27 13:25:31'),
(2, 'Ali', 'ali@gmail.com', '71222333', 1, '2025-12-27 19:07:45');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image_url`, `is_default`, `created_at`) VALUES
(1, 'Classic Burger', 7.50, 'A timeless favorite with lettuce, tomato, and cheese.', '/images/ClassicBurger.jpg', 1, '2025-12-27 11:07:51'),
(2, 'The Lebanese', 9.00, 'Featuring a blend of spices and fresh veggies.', '/images/TheLebanese.jpg', 1, '2025-12-27 11:07:51'),
(3, 'Mushroom Vibes', 10.00, 'Sauteed mushrooms with Swiss cheese and garlic aioli.', '/images/MushroomVibes.jpg', 1, '2025-12-27 11:07:51'),
(4, 'The Burgero', 7.00, 'Our signature burger with special sauce and pickles.', '/images/TheBurgero.jpg', 1, '2025-12-27 11:07:51'),
(5, 'The Mozz', 10.00, 'Mozzarella-stuffed patty with marinara sauce.', '/images/TheMozz.jpg', 1, '2025-12-27 11:07:51'),
(6, 'The Smash Burger', 11.00, 'Double patty smashed to perfection with crispy edges.', '/images/TheSmashBurger.jpg', 1, '2025-12-27 11:07:51'),
(7, 'Chicken Tortilla', 15.00, 'Tasty', '/uploads/1766841009958-372844200.jpg', 0, '2025-12-27 13:10:09'),
(8, 'Mozzarella Sticks', 12.00, 'Yummy', '/uploads/1766862673800-817989157.jpg', 0, '2025-12-27 19:11:13');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `order_details` text NOT NULL,
  `order_time` time NOT NULL,
  `status` enum('pending','preparing','ready','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `phone`, `order_details`, `order_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Mohamad', '76944185', 'Classic Burger', '15:24:00', 'ready', '2025-12-27 13:24:04', '2025-12-27 19:03:50'),
(2, 'Ali', '71222333', 'Chicken Tortilla', '21:06:00', 'pending', '2025-12-27 19:06:29', '2025-12-27 19:06:29');

-- --------------------------------------------------------

--
-- Table structure for table `special_items`
--

CREATE TABLE `special_items` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stars` decimal(3,1) DEFAULT 4.5,
  `image_url` varchar(500) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `special_items`
--

INSERT INTO `special_items` (`id`, `title`, `price`, `stars`, `image_url`, `is_default`, `created_at`) VALUES
(1, 'Pepper Maize', 10.00, 4.5, '/images/PepperMaize.jpg', 1, '2025-12-27 11:07:51'),
(2, 'Truffle Burger', 9.00, 4.5, '/images/TruffleBurger.jpg', 1, '2025-12-27 11:07:51'),
(3, 'Burgerita', 11.00, 4.5, '/images/Burgerita.jpg', 1, '2025-12-27 11:07:51'),
(4, 'Mozzarella Sticks', 11.00, 4.0, '/uploads/1766842106629-83560276.jpg', 0, '2025-12-27 13:28:26'),
(5, 'Tex Max Chicken', 8.00, 4.0, '/uploads/1766862756183-990826295.jpg', 0, '2025-12-27 19:12:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_default` (`is_default`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `special_items`
--
ALTER TABLE `special_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_default` (`is_default`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `special_items`
--
ALTER TABLE `special_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
