-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Host: 163.172.149.197:22765
-- Generation Time: Oct 19, 2026 at 12:57 PM
-- Server version: 8.0.21
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `site2_superadmin`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_user_team`
--

CREATE TABLE `t_user_team` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `assistant_id` int UNSIGNED DEFAULT NULL,
  `manager_id` int UNSIGNED DEFAULT NULL,
  `area_manager_id` int UNSIGNED DEFAULT NULL,
  `director_id` int UNSIGNED DEFAULT NULL,
  `administrator_id` int UNSIGNED DEFAULT NULL,
  `number_of_users` int UNSIGNED NOT NULL DEFAULT '0',
  `zones` varchar(255) NOT NULL,
  `is_active` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `status` enum('ACTIVE','DELETE') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_user_team`
--

INSERT INTO `t_user_team` (`id`, `name`, `assistant_id`, `manager_id`, `area_manager_id`, `director_id`, `administrator_id`, `number_of_users`, `zones`, `is_active`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Marrakech', NULL, NULL, NULL, NULL, NULL, 3, '', 'N', 'ACTIVE', '2021-07-07 21:49:44', '2021-11-05 13:19:15'),
(2, 'Tanger', NULL, NULL, NULL, NULL, NULL, 3, '', 'Y', 'ACTIVE', '2021-07-12 13:55:19', '2022-02-28 15:44:15'),
(3, 'Rabat', NULL, NULL, NULL, NULL, NULL, 3, '', 'N', 'ACTIVE', '2021-08-20 21:01:51', '2022-03-01 22:36:14'),
(4, 'Casablanca', NULL, NULL, NULL, NULL, NULL, 3, '', 'N', 'ACTIVE', '2021-08-20 21:01:58', '2021-11-05 13:19:11'),
(5, 'Agadir', NULL, NULL, NULL, NULL, NULL, 3, '', 'Y', 'ACTIVE', '2021-08-20 21:02:06', '2022-02-28 15:58:02'),
(6, 'Safi', NULL, NULL, NULL, NULL, NULL, 3, '', 'Y', 'ACTIVE', '2021-08-20 21:02:13', '2021-12-03 13:55:01'),
(7, 'Test', NULL, NULL, NULL, NULL, NULL, 3, '', 'N', 'ACTIVE', '2021-08-21 23:15:27', '2021-11-05 13:19:14'),
(8, 'Dakhla', NULL, NULL, NULL, NULL, NULL, 3, '', 'Y', 'ACTIVE', '2021-11-05 12:18:36', '2021-11-05 12:18:42'),
(9, 'testfff', NULL, 46, NULL, NULL, NULL, 2, '10', 'Y', 'ACTIVE', '2026-07-15 10:01:08', '2026-07-15 10:04:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_user_team`
--
ALTER TABLE `t_user_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_teamr_fk0` (`manager_id`),
  ADD KEY `user_team_fk1` (`director_id`),
  ADD KEY `user_team_fk2` (`assistant_id`),
  ADD KEY `user_team_fk3` (`area_manager_id`),
  ADD KEY `user_team_fk4` (`administrator_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_user_team`
--
ALTER TABLE `t_user_team`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `t_user_team`
--
ALTER TABLE `t_user_team`
  ADD CONSTRAINT `user_team_fk3` FOREIGN KEY (`area_manager_id`) REFERENCES `t_user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_team_fk4` FOREIGN KEY (`administrator_id`) REFERENCES `t_user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
