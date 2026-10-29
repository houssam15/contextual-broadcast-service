--
-- Structure de la table `t_users`
--

CREATE TABLE IF NOT EXISTS `t_users2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_bin NOT NULL,
  `password` varchar(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `sex` enum('Mr','Ms','Mrs') DEFAULT NULL,
  `firstname` varchar(16) COLLATE utf8_bin DEFAULT NULL,
  `lastname` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `picture` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `phone` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT '',
  `mobile` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT '',
  `birthday` date DEFAULT NULL,
  `team_id` int(11) unsigned NOT NULL,
  `is_active` enum('YES','NO') COLLATE utf8_bin NOT NULL DEFAULT 'NO',
  `is_guess` enum('YES','NO') COLLATE utf8_bin NOT NULL DEFAULT 'NO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_password_gen` timestamp NULL DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL,
  `email_tosend` ENUM( "YES", "NO" ) DEFAULT "NO" NOT NULL,   
  `application` enum('admin','frontend','superadmin') COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),  
  UNIQUE KEY `username` (`username`,`application`),
  UNIQUE KEY `email` (`email`,`application`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `t_users2_team` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,            
        `name` varchar(64)  NOT NULL,    
        `manager_id` int(11) NOT NULL,    
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT NULL,      
     PRIMARY KEY (`id`)      
) ENGINE=InnoDB DEFAULT CHARSET=utf8  AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `t_users2_team_users` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,            
        `team_id` int(11) unsigned NOT NULL,
        `user_id` int(11)  NOT NULL,    
     PRIMARY KEY (`id`)      
) ENGINE=InnoDB DEFAULT CHARSET=utf8  AUTO_INCREMENT=1;

ALTER TABLE `t_users2_team_users` ADD CONSTRAINT `users2_team_users_0` FOREIGN KEY (`user_id`) REFERENCES `t_users2` (`id`) ON DELETE CASCADE;
ALTER TABLE `t_users2_team_users` ADD CONSTRAINT `users2_team_users_1` FOREIGN KEY (`team_id`) REFERENCES `t_users2_team` (`id`) ON DELETE CASCADE;

