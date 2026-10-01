-- Adds a second website design product, "Tek Sayfa Tanıtım Sitesi" (live
-- demo at /web-tasarimlari/tek-sayfa-tanitim-sitesi in the frontend). See
-- V3__add_website_design_category_and_product.sql for the category.

INSERT INTO products (category_id, slug, name, description, image_url, price, stock_status, display_order, is_active) VALUES
((SELECT id FROM categories WHERE slug = 'web-sitesi-tasarim-ve-destek'),
 'tek-sayfa-tanitim-sitesi', 'Tek Sayfa Tanıtım Sitesi',
 'Hızlı yayına alınabilen, açık ve sade tasarımlı tek sayfalık tanıtım sitesi. Hizmetleriniz, galeriniz ve iletişim bilgileriniz tek bir kaydırmada. Canlı örneği görmek için tıklayın.',
 '/web-tasarimlari/standart-web-sitesi/kirtasiye.jpg', NULL, 'IN_STOCK', 2, TRUE);
