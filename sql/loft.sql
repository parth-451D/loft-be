/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.32 : Database - loft
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`loft` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `loft`;

/*Table structure for table `amenities` */

DROP TABLE IF EXISTS `amenities`;

CREATE TABLE `amenities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint DEFAULT '1',
  `is_delete` tinyint DEFAULT '0',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `amenities` */

insert  into `amenities`(`id`,`title`,`description`,`is_active`,`is_delete`) values 
(1,'test','psajfopjsdp soif nasidjnf apisdnf asdf\n',1,0);

/*Table structure for table `bookings` */

DROP TABLE IF EXISTS `bookings`;

CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `bookings` */

insert  into `bookings`(`id`,`room_id`,`start_date`,`start_time`,`end_date`,`end_time`,`is_confirmed`,`user_id`,`is_active`,`is_delete`) values 
(1,2,'2023-03-11','20:44:00','2023-03-12','20:45:00',0,2,1,1),
(2,2,'2023-05-14',NULL,'2023-05-15',NULL,0,4,1,0);

/*Table structure for table `complaints` */

DROP TABLE IF EXISTS `complaints`;

CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `unit_number` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `complaints` */

insert  into `complaints`(`id`,`name`,`mobile_number`,`unit_number`,`subject`,`message`,`is_active`,`is_delete`) values 
(1,'Manthan Dave','9909178848','11','asdasdasdf','SDc szdf sd',1,0),
(2,'Manthan Dave','9909178848','11','asdasdasdf','SDc szdf sd',1,0);

/*Table structure for table `gallery` */

DROP TABLE IF EXISTS `gallery`;

CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `file_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `gallery` */

insert  into `gallery`(`id`,`category_id`,`image`,`file_name`,`is_active`,`is_delete`) values 
(1,2,'./uploads/preloader1.6a82038f7666ca930b57.gif','preloader1.6a82038f7666ca930b57.gif',1,0),
(2,1,'','',1,1),
(3,4,'./uploads/preloader (2).gif','preloader (2).gif',1,0),
(4,2,'./uploads/preloader1.6a82038f7666ca930b57.gif','preloader1.6a82038f7666ca930b57.gif',1,0);

/*Table structure for table `gallery_category` */

DROP TABLE IF EXISTS `gallery_category`;

CREATE TABLE `gallery_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `gallery_category` */

insert  into `gallery_category`(`id`,`name`,`is_active`,`is_delete`) values 
(1,'Exterior1',1,1),
(2,'Exterior',1,0),
(3,'test1',1,1),
(4,'tst',1,0);

/*Table structure for table `rooms` */

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_no` varchar(20) DEFAULT NULL,
  `floor_no` varchar(20) DEFAULT NULL,
  `price` varchar(20) DEFAULT NULL,
  `status` enum('available','sold') DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rooms` */

insert  into `rooms`(`id`,`room_no`,`floor_no`,`price`,`status`,`capacity`) values 
(1,'101','1','500$','available',2),
(2,'201','2','600$','sold',3);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `user_type` varchar(45) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `amenities_description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`user_name`,`password`,`user_type`,`name`,`amenities_description`,`is_active`,`is_delete`) values 
(1,'admin','admin','admin','Loft Company',NULL,1,0),
(2,'user','user','user','Manthan Dave',NULL,1,1),
(3,'test1','test','user','Test',NULL,1,0),
(4,'manthandave1331@gmail.com','a','user','Manthan',NULL,1,0),
(5,'1','1','user','1',NULL,1,1);


/* new code from here */

/*Table structure for table `property` */
DROP TABLE IF EXISTS `property`;

CREATE TABLE property (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(100) NOT NULL,
main_pic VARCHAR(200).
price DECIMAL(10, 2),
description TEXT, 
square_foot INT, 
room_capacity VARCHAR(20),
num_washroom INT,
is_delete tinyint(1) DEFAULT '0',
);

/*Table structure for table `testimonial` */
DROP TABLE IF EXISTS `testimonial`;

CREATE TABLE testimonial (
id INT PRIMARY KEY AUTO_INCREMENT,
image VARCHAR(100),
name VARCHAR(50) NOT NULL, description TEXT,
city VARCHAR(50)
);

/*Table structure for table `blog` */
DROP TABLE IF EXISTS `blog`;

CREATE TABLE blog (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(50) NOT NULL,
createddate date,
image VARCHAR(100),
description TEXT
);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
