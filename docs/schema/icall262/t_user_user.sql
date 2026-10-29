-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 14, 2026 at 03:06 PM
-- Server version: 8.0.40
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `site_icall261`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_user_user`
--  

CREATE TABLE `t_user_user` (
  `id` int UNSIGNED NOT NULL,
  `requester_id` int UNSIGNED NOT NULL,
  `target_id` int UNSIGNED NOT NULL,
  `permission_status` enum('ALLOWED','BLOCKED','PENDING') NOT NULL DEFAULT 'ALLOWED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_user_user`
--
ALTER TABLE `t_user_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_user_fk0` (`requester_id`),
  ADD KEY `user_user_fk1` (`target_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_user_user`
--
ALTER TABLE `t_user_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `t_user_user`
--
ALTER TABLE `t_user_user`
  ADD CONSTRAINT `user_user_fk0` FOREIGN KEY (`requester_id`) REFERENCES `t_user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_user_fk1` FOREIGN KEY (`target_id`) REFERENCES `t_user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
