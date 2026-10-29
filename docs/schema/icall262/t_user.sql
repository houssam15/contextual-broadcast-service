-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Host: 163.172.149.197:22765
-- Generation Time: Oct 19, 2026 at 12:56 PM
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
-- Table structure for table `t_user`
--

CREATE TABLE `t_user` (
  `id` int UNSIGNED NOT NULL,
  `instagram_user` varchar(24) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `tiktok_user` varchar(48) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `linkedin_user` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `google_user` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `gender` enum('Mr','Ms','Mrs') CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `firstname` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `lastname` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `avatar_path` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `fax` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `birthday` date DEFAULT NULL,
  `number_of_profiles` int UNSIGNED NOT NULL DEFAULT '0',
  `language` varchar(2) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'fr',
  `is_online` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_bin DEFAULT 'N',
  `is_active` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_guess` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_locked` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_validated` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_completed` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_activated` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_blocked` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_secure_by_code` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_sms_code` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_email_code` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_in_trombi` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `is_email_login` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `locked_at` timestamp NULL DEFAULT NULL,
  `unlocked_by_id` int UNSIGNED DEFAULT NULL,
  `is_admin` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `blocked_at` timestamp NULL DEFAULT NULL,
  `unblocked_by_id` int UNSIGNED DEFAULT NULL,
  `number_of_try` int NOT NULL DEFAULT '0',
  `number_of_sessions` int UNSIGNED NOT NULL DEFAULT '0',
  `started_at` date DEFAULT NULL,
  `ended_at` date DEFAULT NULL,
  `last_password_gen` timestamp NULL DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL,
  `ms_lastlogin` int UNSIGNED NOT NULL,
  `email_tosend` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `manager_id` int UNSIGNED DEFAULT NULL,
  `main_team_id` int UNSIGNED DEFAULT NULL,
  `creator_id` int UNSIGNED DEFAULT NULL,
  `status` enum('ACTIVE','DELETE') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `application` enum('admin','frontend','superadmin') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `callcenter_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `t_user`
--

INSERT INTO `t_user` (`id`, `instagram_user`, `tiktok_user`, `linkedin_user`, `google_user`, `username`, `password`, `gender`, `firstname`, `lastname`, `email`, `avatar`, `avatar_path`, `phone`, `mobile`, `fax`, `birthday`, `number_of_profiles`, `language`, `is_online`, `is_active`, `is_guess`, `is_locked`, `is_validated`, `is_completed`, `is_activated`, `is_blocked`, `is_secure_by_code`, `is_sms_code`, `is_email_code`, `is_in_trombi`, `is_email_login`, `locked_at`, `unlocked_by_id`, `is_admin`, `blocked_at`, `unblocked_by_id`, `number_of_try`, `number_of_sessions`, `started_at`, `ended_at`, `last_password_gen`, `lastlogin`, `ms_lastlogin`, `email_tosend`, `manager_id`, `main_team_id`, `creator_id`, `status`, `created_at`, `updated_at`, `application`, `callcenter_id`) VALUES
(1, '', '', '', '', 'fmallet', '202cb962ac59075b964b07152d234b70', 'Mr', 'fred', 'mallet', 'fd.mallet@ewebsolutions.fr', '', '', '', '', '', NULL, 0, 'fr', 'Y', 'Y', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 1, NULL, NULL, '2021-02-11 18:04:09', '2026-10-16 14:22:39', 80521, 'N', NULL, NULL, NULL, 'ACTIVE', '2020-08-22 17:43:20', '2026-10-16 14:29:47', 'superadmin', NULL),
(2, '', '', '', '', 'fmalletad', '202cb962ac59075b964b07152d234b70', 'Mr', 'fredad', 'mallet', 'fd.mallet@ewebsolutions.fr', 'avatar.jpg', '/site2_superadmin/admin/data/users/2/avatar.jpg', '', '', '', NULL, 0, '', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'Y', NULL, NULL, 0, 0, NULL, NULL, '2023-08-29 17:49:06', '2026-10-19 11:29:24', 17554, 'N', NULL, NULL, NULL, 'ACTIVE', '2020-08-22 16:43:20', '2026-10-19 11:29:24', 'admin', NULL),
(4, '', '', '', '', 'test10', '202cb962ac59075b964b07152d234b70', 'Mr', 'test', 'test', 'test@gmail.com', '', '', '', '0767303860', '', NULL, 0, 'en', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'Y', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, NULL, 'ACTIVE', '2026-02-19 08:00:43', '2026-02-20 08:01:30', 'admin', NULL),
(5, '', '', '', '', 'jawad20', '', 'Mr', 'testg', 'testg', 'rzsstf@gmail.com', '', '', '', '0767303860', '', NULL, 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-21', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-19 08:07:41', '2026-02-19 08:07:41', 'admin', NULL),
(6, '', '', '', '', 'test47', '', 'Mr', 'test', '30', 'tehst@gmal.com', 'avatar.png', '/site_icall262/admin/data/users/6/avatar.png', '', '0767303860', '', NULL, 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'N', NULL, 2, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-19 08:17:08', '2026-03-03 08:32:41', 'admin', NULL),
(7, '', '', '', '', 'jawad46', '', 'Ms', 'test55', 'test22', 'test@ggm.com', '', '', '', '0755689750', '', '2026-02-26', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-10', '2026-02-25', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-20 10:23:54', '2026-02-20 10:23:54', 'admin', NULL),
(8, '', '', '', '', 'ggerg20', '', 'Ms', 'gerger1', 'ger', 'teccst@gmail.com', 'avatar.png', '/site_icall262/admin/data/users/8avatar.png', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 08:53:57', '2026-02-25 13:51:48', 'admin', NULL),
(9, '', '', '', '', 'ggerg2hh0', '', 'Ms', 'gerger1hh', 'gerrt', 'tfeccst@gmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2019-11-08', '2026-02-10', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 08:54:34', '2026-02-23 08:54:34', 'admin', NULL),
(10, '', '', '', '', 'fggerg2hh0', '', 'Ms', 'gerger1hhf', 'gerrtf', 'tfffeccst@gmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2019-11-08', '2026-02-10', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 08:55:43', '2026-02-23 08:55:43', 'admin', NULL),
(11, '', '', '', '', 'fggerg2hh044', '', 'Ms', 'ge44rger1hhf', 'gerrtf44', 'tfff44eccst@gmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2019-11-08', '2026-02-10', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 09:09:59', '2026-02-23 09:09:59', 'admin', NULL),
(12, '', '', '', '', 'fggefrg2hh044', '', 'Ms', 'ge4f4rger1hhf', 'gerrtf44', 'tfff44ceccst@gmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 09:10:36', '2026-02-26 13:48:25', 'admin', NULL),
(13, '', '', '', '', 'gercx', '', 'Mr', 'gexger', 'ger', 'ccctest@gcmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-04', '2026-02-18', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 09:16:24', '2026-02-23 09:16:24', 'admin', NULL),
(15, '', '', '', '', 'dze', '', 'Mr', 'dze', 'dze', 'dezf@gmail.com', 'avatar.JPG', '', '', '0767303860', '', '2026-02-11', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-09', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-24 14:24:54', '2026-02-24 14:24:54', 'admin', NULL),
(16, '', '', '', '', 'dze50f', '', 'Mr', 'dzefzefezfze', 'dze', 'dfzefezezf@gmacil.com', 'avatar.JPG', '', '', '0767303860', '', '2026-02-11', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-09', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-24 14:26:00', '2026-02-24 14:26:00', 'admin', NULL),
(17, '', '', '', '', 'dze50f10', '', 'Mr', 'fzefzegre', 'dzegerdz', 'dfzexfezezf@gmacil.com', '/site_icall262/admin/data/users/avatar.JPG', '', '', '0767303860', '', '2026-02-11', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-09', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-25 08:52:56', '2026-02-25 08:52:56', 'admin', NULL),
(18, '', '', '', '', 'dzere50f10f', '', 'Mr', 'fzefzegreger', 'dzegerdz', 'dfzexfeffergerzezf@gmacil.com', 'avatar.JPG', '/site_icall262/admin/data/users/avatar.JPG', '', '0767303860', '', '2026-02-11', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-09', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-25 09:11:34', '2026-02-25 09:11:34', 'admin', NULL),
(25, '', '', '', '', 'fze', '', 'Ms', 'fze', 'fze', 'fzecd@gmail.com', 'avatar.png', '/site_icall262/admin/data/users//avatar.png', '', '0767303860', '', '2026-02-25', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-18', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-26 13:42:26', '2026-02-26 13:42:26', 'admin', NULL),
(26, '', '', '', '', 'fzefze', '', 'Mrs', 'fzefez', 'fze', 'fzefezcd@gmail.com', 'avatar.png', '/site_icall262/admin/data/users//avatar.png', '', '0767303860', '', '2026-02-25', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-18', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-26 13:42:43', '2026-02-26 13:42:43', 'admin', NULL),
(27, '', '', '', '', 'fzefzefze', '', 'Mrs', 'fzfzeefez', 'fze', 'fzefefzezcd@gmail.com', 'avatar.png', '/site_icall262/admin/data/users//avatar.png', '', '0767303860', '', '2026-02-25', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-17', '2026-02-18', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-26 13:43:22', '2026-02-26 13:43:22', 'admin', NULL),
(28, '', '', '', '', 'fzeezf', '', 'Mr', 'fez', 'fez', 'fzefdfe@gmail.com', '', '', '', '0767303860', '', '2026-02-10', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-26 13:47:10', '2026-02-26 13:48:09', 'admin', NULL),
(29, '', '', '', '', 'fezc', '', 'Mr', 'xv', 'fezd', 'tedgr@gmail.com', '', '', '', '0767303860', '', '2026-03-05', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-02-24', '2026-04-01', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-03-03 13:08:06', '2026-03-03 13:08:06', 'admin', NULL),
(30, '', '', '', '', 'test452', '', 'Mr', 'hrgf', 'ge', 'tefs@gmail.comd', '', '', '', '0767303860', '', '2026-03-10', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-03-04 07:12:16', '2026-03-04 09:29:39', 'admin', NULL),
(31, '', '', '', '', 'gesdc', '', 'Ms', 'vsdgzr', 'gerht', 'vfdgre@gmail.com', '', '', '', '0767303860', '', '2026-03-20', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'N', 'N', 'N', 'N', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-03-04 07:33:32', '2026-03-04 09:18:50', 'admin', NULL),
(46, '', '', '', '', 'gerf', '', 'Mr', 'gerf', 'gerf', 'greddg@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303861', '', '2026-07-16', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-14 15:25:51', '2026-07-14 15:26:02', 'admin', NULL),
(47, '', '', '', '', 'testf', '', 'Ms', 'testf', 'testf', 'fzeazs@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '07673030860', '', '2026-07-16', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-08', '2026-07-18', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-17 14:32:23', '2026-07-17 14:32:23', 'admin', NULL),
(48, '', '', '', '', 'testg', '', 'Ms', 'testg', 'testgg', 'testf@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 15:49:07', '2026-07-20 15:49:07', 'admin', NULL),
(49, '', '', '', '', 'testgd', '', 'Ms', 'testgd', 'testggd', 'tdestf@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:05:38', '2026-07-20 16:05:38', 'admin', NULL),
(50, '', '', '', '', 'testgdf', '', 'Ms', 'testgdf', 'testggdf', 'tdestff@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:06:13', '2026-07-20 16:06:13', 'admin', NULL),
(51, '', '', '', '', 'testgdfd', '', 'Ms', 'testgdfd', 'testggdfd', 'dtdestff@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:06:49', '2026-07-20 16:06:49', 'admin', NULL),
(52, '', '', '', '', 'testgddfd', '', 'Ms', 'testgddfd', 'testggddfd', 'dtddestff@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:07:33', '2026-07-20 16:07:33', 'admin', NULL),
(53, '', '', '', '', 'tedstgddfd', '', 'Ms', 'tdestgddfd', 'testggdddfd', 'dtdddestff@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:09:22', '2026-07-20 16:09:22', 'admin', NULL),
(54, '', '', '', '', 'tedstgdddfd', '', 'Ms', 'tdestgdddfd', 'testgdgdddfd', 'dtddddestff@gmail.com', 'avatar.png', '/site2_superadmin/admin/data/users//avatar.png', '', '0767303860', '', '2026-07-12', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'N', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2026-07-13', '2026-07-24', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-07-20 16:09:43', '2026-07-20 16:09:43', 'admin', NULL),
(55, '', '', '', '', 'fmalletad2', '202cb962ac59075b964b07152d234b70', 'Mr', 'fredad', 'mallet', 'fd.mallet1@ewebsolutions.fr', 'avatar.jpg', '/site2_superadmin/admin/data/users/2/avatar.jpg', '', '', '', NULL, 0, '', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', NULL, NULL, 'Y', NULL, NULL, 0, 0, NULL, NULL, '2023-08-29 17:49:06', '2026-10-16 15:46:31', 55402, 'N', NULL, NULL, NULL, 'ACTIVE', '2020-08-22 16:43:20', '2026-10-16 15:46:31', 'admin', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`,`application`),
  ADD KEY `user_fk0` (`creator_id`),
  ADD KEY `user_fk3` (`manager_id`),
  ADD KEY `user_fk4` (`main_team_id`),
  ADD KEY `user_fk6` (`callcenter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_user`
--
ALTER TABLE `t_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
