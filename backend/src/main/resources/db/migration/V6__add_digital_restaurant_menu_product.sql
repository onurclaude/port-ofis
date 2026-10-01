-- Adds a third website design product, "Dijital Restoran Menüsü" (live
-- demo at /web-tasarimlari/dijital-restoran-menusu in the frontend). See
-- V3__add_website_design_category_and_product.sql for the category.

INSERT INTO products (category_id, slug, name, description, image_url, price, stock_status, display_order, is_active) VALUES
((SELECT id FROM categories WHERE slug = 'web-sitesi-tasarim-ve-destek'),
 'dijital-restoran-menusu', 'Dijital Restoran Menüsü',
 'Kafe ve restoranlar için QR kodla açılan, mobil uyumlu dijital menü. Kategoriler, arama, beslenme filtreleri, kalori ve alerjen bilgisi; marka renklerinize göre uyarlanır. Canlı örneği görmek için tıklayın.',
 '/web-tasarimlari/dijital-restoran-menusu/kapak.jpg', NULL, 'IN_STOCK', 3, TRUE);
