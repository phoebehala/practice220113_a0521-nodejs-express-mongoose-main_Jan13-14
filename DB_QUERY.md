CREATE TABLE `products` (
    `id` int NOT NULL PRIMARY KEY, 
    `title` varchar(255) NOT NULL, 
    `imageUrl` varchar(255) NOT NULL, 
    `description` text NOT NULL, 
    `price` double NOT NULL
);

INSERT INTO `products` (`title`, `description`, `imageUrl`,`price`) VALUES (
    'Nice Shoes', 'some nice shoes', 'niceshoes.jpg', 20
);