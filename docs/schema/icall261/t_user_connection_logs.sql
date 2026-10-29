CREATE TABLE `t_user_connection_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `connected_at` DATETIME NOT NULL,
    `disconnected_at` DATETIME NULL,
    `duration_seconds` INT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_connected` (`user_id`, `connected_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `t_user_connection_logs` 
ADD COLUMN `user_agent` VARCHAR(512) NULL AFTER `ip_address`;