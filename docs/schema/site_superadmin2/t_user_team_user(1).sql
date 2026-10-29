-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Hôte : 163.172.149.197:22765
-- Généré le : ven. 04 sep. 2026 à 11:18
-- Version du serveur : 8.0.21
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `site2_superadmin`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_user_team_user`
--

CREATE TABLE `t_user_team_user` (
  `id` int UNSIGNED NOT NULL,
  `team_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `is_active` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `t_user_team_user`
--

INSERT INTO `t_user_team_user` (`id`, `team_id`, `user_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(2, 2, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(3, 3, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(4, 4, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(5, 5, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(6, 6, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(7, 7, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(8, 8, 46, 'Y', '2026-07-14 15:25:52', '2026-07-14 15:25:52'),
(9, 1, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(10, 2, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(11, 3, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(12, 4, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(13, 5, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(14, 6, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(15, 7, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(16, 8, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(17, 9, 47, 'Y', '2026-07-17 14:32:24', '2026-07-17 14:32:24'),
(18, 1, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(19, 2, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(20, 3, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(21, 4, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(22, 5, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(23, 6, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(24, 7, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(25, 8, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44'),
(26, 9, 54, 'Y', '2026-07-20 16:09:44', '2026-07-20 16:09:44');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `t_user_team_user`
--
ALTER TABLE `t_user_team_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_team_user_fk0` (`team_id`),
  ADD KEY `user_team_user_fk1` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `t_user_team_user`
--
ALTER TABLE `t_user_team_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
