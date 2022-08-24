DROP SCHEMA IF EXISTS `email_manager`;

CREATE SCHEMA `email_manager`;

USE `email_manager`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `emails` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject` VARCHAR(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `users_sent_emails` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `email_id` INT UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_user_id_users_idx` (`user_id`),
  CONSTRAINT `fk_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  KEY `fk_email_id_emails_idx` (`email_id`),
  CONSTRAINT `fk_email_id_emails` FOREIGN KEY (`email_id`) REFERENCES `emails` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);



LOCK TABLES `emails` WRITE;

INSERT INTO
  `emails` (
    `id`,
    `subject`,
    `body`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    '1',
    'Email 1',
    'Email 1',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '2',
    'Email 2',
    'This is email 2',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '3',
    'Email 3',
    'This is email 3',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '4',
    'Email 4',
    'This is email 4',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '5',
    'Email 5',
    'This is email 5',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '6',
    'Email 6',
    'This is email 6',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '7',
    'Email 7',
    'This is email 7',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '8',
    'Email 8',
    'This is email 8',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '9',
    'Email 9',
    'This is email 9',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  ),
  (
    '10',
    'Email 10',
    'This is email 10',
    '2021-02-18 08:11:47',
    '2021-02-18 08:11:47'
  );

UNLOCK TABLES;
