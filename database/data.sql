USE star_coffee;

INSERT INTO users (id, first_name, last_name, email, password, photo, category) VALUES
  (1, 'Admin', 'Star Coffee', 'admin@starcoffee.com', 'scrypt$90af6455f90b67a2fc23f869c911007e$448e7282026f8515e1f59897e109b1bb3bc429c1abf832502d9c5118c8596e9cc33a66254305fb6e07117e23c50d81c784f28d2dd53b433cc9bb388287169da8', NULL, 'admin'),
  (2, 'Laura', 'Gómez', 'laura@gmail.com', 'scrypt$a651b86278baf29035d5d819b25948b9$a40086381703fbfdcdfd5f588479939104dc09510d339de2e86e6afac30a4b1a98453692d90f59fbb558d49ddd28d2a17def4d89855d6dba61317c1b512d7a48', NULL, 'customer'),
  (3, 'Carlos', 'Rojas', 'carlos@gmail.com', 'scrypt$cc80d148397f426c1ca769e4696592a8$bc77a9dc747859bcd2a2ea40ec793d5e8bcad3501b217697e465848fa076fae77067f5e599df80c1b8384030e6bfc5e214ae1a9269b06bac6c27ed0ffb30eefc', NULL, 'customer'),
  (4, 'Valentina', 'Pérez', 'valentina@gmail.com', 'scrypt$24793e6172f140c6007469177d245c92$d586ab85e1d2399abe2e7be2e89317febdb8cb8cf3815a3d55e4dc00b6d7d8e42e87d14011e6f583d3560074c63995410f05ee2628e8beeec3ee7dc588808d01', NULL, 'customer'),
  (5, 'Andrés', 'Torres', 'andres@gmail.com', 'scrypt$d0eac04dde8900abc5c6996008649caa$2bed5564f12fb172bef491033c044808317d669deb33dd71efeac377a3f811125222367fa8e406f30331eb8ab4c249ebe9f18d444ad19d213ed89f78f5db1113', NULL, 'customer');

INSERT INTO categories (id, name, slug) VALUES
  (1, 'Cafés', 'cafes'),
  (2, 'Bebidas frías', 'frias'),
  (3, 'Repostería', 'reposteria'),
  (4, 'Alimentos', 'alimentos');

INSERT INTO sizes (id, name) VALUES
  (1, 'Pequeño'),
  (2, 'Mediano'),
  (3, 'Grande');

INSERT INTO products (id, name, description, image, price, section, category_id) VALUES
  (1, 'Café Americano', 'Café 100% colombiano, suave y balanceado, perfecto para cualquier momento del día.', 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600', 6000, 'vendido', 1),
  (2, 'Capuchino', 'Café con leche espumosa y un toque de sabor.', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600', 6000, 'recomendado', 1),
  (3, 'Café Espresso', 'Café concentrado de sabor intenso y aroma profundo.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600', 5000, 'vendido', 1),
  (4, 'Latte', 'Espresso con abundante leche vaporizada, suave y cremoso.', 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600', 7000, 'vendido', 1),
  (5, 'Café Colombiano', 'Café de origen colombiano con notas achocolatadas.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600', 6500, 'recomendado', 1),
  (6, 'Torta de Chocolate', 'Torta de chocolate decorada con fresas frescas y crema.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 9500, 'recomendado', 3),
  (7, 'Sándwich Mixto', 'Sabores inolvidables.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600', 16500, 'recomendado', 4),
  (8, 'Croissant de Almendras', 'Croissant crujiente relleno de crema y almendras tostadas.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', 7900, 'vendido', 3),
  (9, 'Brownie de Chocolate', 'Brownie de chocolate cremoso por dentro y jugoso, ideal con café.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600', 8900, NULL, 3),
  (10, 'Frappé de Fresa', 'Con chips explosivos.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600', 11900, NULL, 2);

INSERT INTO product_size (product_id, size_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 2),
  (2, 3),
  (3, 1),
  (3, 2),
  (3, 3),
  (4, 1),
  (4, 2),
  (4, 3),
  (5, 1),
  (5, 2),
  (5, 3),
  (6, 1),
  (6, 2),
  (6, 3),
  (7, 1),
  (7, 2),
  (7, 3),
  (8, 1),
  (8, 2),
  (8, 3),
  (9, 1),
  (9, 2),
  (9, 3),
  (10, 1),
  (10, 2),
  (10, 3);
