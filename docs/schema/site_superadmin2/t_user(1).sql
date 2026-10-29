-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 11 sep. 2026 à 08:51
-- Version du serveur : 8.0.40
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `site_superadmin2`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_user`
--

CREATE TABLE `t_user` (
  `id` int UNSIGNED NOT NULL,
  `instagram_user` varchar(24) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT '',
  `tiktok_user` varchar(48) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `linkedin_user` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `google_user` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `username` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `password` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `gender` enum('Mr','Ms','Mrs') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `firstname` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `lastname` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `avatar_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `mobile` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `fax` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `birthday` date DEFAULT NULL,
  `number_of_profiles` int UNSIGNED NOT NULL DEFAULT '0',
  `language` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'fr',
  `is_online` enum('Y','N') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT 'N',
  `is_active` enum('Y','N') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_guess` enum('Y','N') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_locked` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_validated` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_completed` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_activated` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_blocked` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_secure_by_code` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_sms_code` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_email_code` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_in_trombi` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `is_email_login` enum('Y','N') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `locked_at` timestamp NULL DEFAULT NULL,
  `unlocked_by_id` int UNSIGNED DEFAULT NULL,
  `is_admin` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `blocked_at` timestamp NULL DEFAULT NULL,
  `unblocked_by_id` int UNSIGNED DEFAULT NULL,
  `number_of_try` int NOT NULL DEFAULT '0',
  `number_of_sessions` int UNSIGNED NOT NULL DEFAULT '0',
  `started_at` date DEFAULT NULL,
  `ended_at` date DEFAULT NULL,
  `last_password_gen` timestamp NULL DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL,
  `ms_lastlogin` int UNSIGNED NOT NULL,
  `email_tosend` enum('N','Y') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'N',
  `manager_id` int UNSIGNED DEFAULT NULL,
  `main_team_id` int UNSIGNED DEFAULT NULL,
  `creator_id` int UNSIGNED DEFAULT NULL,
  `status` enum('ACTIVE','DELETE') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `application` enum('admin','frontend','superadmin') CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `callcenter_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Déchargement des données de la table `t_user`
--

INSERT INTO `t_user` (`id`, `instagram_user`, `tiktok_user`, `linkedin_user`, `google_user`, `username`, `password`, `gender`, `firstname`, `lastname`, `email`, `avatar`, `avatar_path`, `phone`, `mobile`, `fax`, `birthday`, `number_of_profiles`, `language`, `is_online`, `is_active`, `is_guess`, `is_locked`, `is_validated`, `is_completed`, `is_activated`, `is_blocked`, `is_secure_by_code`, `is_sms_code`, `is_email_code`, `is_in_trombi`, `is_email_login`, `locked_at`, `unlocked_by_id`, `is_admin`, `blocked_at`, `unblocked_by_id`, `number_of_try`, `number_of_sessions`, `started_at`, `ended_at`, `last_password_gen`, `lastlogin`, `ms_lastlogin`, `email_tosend`, `manager_id`, `main_team_id`, `creator_id`, `status`, `created_at`, `updated_at`, `application`, `callcenter_id`) VALUES
(9, '', '', '', '', 'ggerg2hh0', '', 'Ms', 'gerger1hh', 'gerrt', 'tfeccst@gmail.com', 'avatar.jpg', '', '', '0767303860', '', '2026-02-13', 0, 'en', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', NULL, NULL, 'N', NULL, NULL, 0, 0, '2019-11-08', '2026-02-10', NULL, NULL, 0, 'N', NULL, NULL, 2, 'ACTIVE', '2026-02-23 08:54:34', '2026-02-23 08:54:34', 'admin', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`,`application`),
  ADD KEY `user_fk0` (`creator_id`),
  ADD KEY `user_fk3` (`manager_id`),
  ADD KEY `user_fk4` (`main_team_id`),
  ADD KEY `user_fk6` (`callcenter_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `t_user`
--
ALTER TABLE `t_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
