CREATE TABLE t_user_user (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    requester_id int UNSIGNED NOT NULL,
    target_id int UNSIGNED NOT NULL,
    permission_status ENUM('ALLOWED', 'BLOCKED', 'PENDING') NOT NULL DEFAULT 'ALLOWED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_requester_target UNIQUE (requester_id, target_id),

    CONSTRAINT fk_user_user_requester FOREIGN KEY (requester_id) REFERENCES t_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_user_target FOREIGN KEY (target_id) REFERENCES t_user(id) ON DELETE CASCADE
);

ALTER TABLE `t_user_user` CHANGE `id` `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, add PRIMARY KEY (`id`);

-- Sample relationships using existing user IDs (54, 53, 52, 51, 50, 48)
INSERT INTO `t_user_user` (`requester_id`, `target_id`, `permission_status`) VALUES
-- User 54 (tdestgdddfd) allowed to chat with User 53 & User 52
(54, 53, 'ALLOWED'),
(54, 52, 'ALLOWED'),

-- User 54 blocked communication with User 51
(54, 51, 'BLOCKED'),

-- User 53 sent a pending request to User 50
(53, 50, 'PENDING'),

-- User 52 allowed to chat with User 48
(52, 48, 'ALLOWED'),

-- User 51 allowed to chat with User 50
(51, 50, 'ALLOWED');





-- 2. Test relationships for User 64
INSERT INTO `t_user_user` (`requester_id`, `target_id`, `permission_status`) VALUES
-- User 64 initiated -> User 54 (ALLOWED) -> WILL SHOW
(46, 54, 'ALLOWED'),

-- User 53 initiated -> User 64 (ALLOWED) -> WILL SHOW (Tests bidirectional query)
(53, 46, 'ALLOWED'),

-- User 64 initiated -> User 52 (ALLOWED) -> WILL SHOW
(46, 52, 'ALLOWED'),

-- User 64 initiated -> User 51 (BLOCKED) -> WILL NOT SHOW (Filtered out)
(46, 51, 'BLOCKED'),

-- User 50 initiated -> User 64 (PENDING) -> WILL NOT SHOW (Filtered out)
(50, 46, 'PENDING');