-- Adds the "Web Sitesi Tasarım ve Destek" category and its first product,
-- "Standart Web Sitesi" (live demo at /web-tasarimlari/standart-web-sitesi
-- in the frontend). See V2__insert_initial_data.sql for the seeding pattern.

INSERT INTO categories (slug, name, description, image_url, display_order, is_active) VALUES
('web-sitesi-tasarim-ve-destek', 'Web Sitesi Tasarım ve Destek',
 'İşletmeniz için modern, hızlı ve mobil uyumlu web sitesi tasarımı ve teknik destek hizmetleri.',
 '/web-tasarimlari/standart-web-sitesi/hero.jpg', 7, TRUE);

INSERT INTO products (category_id, slug, name, description, image_url, price, stock_status, display_order, is_active) VALUES
((SELECT id FROM categories WHERE slug = 'web-sitesi-tasarim-ve-destek'),
 'standart-web-sitesi', 'Standart Web Sitesi',
 'Tek sayfa, modern ve mobil uyumlu tasarımlı kurumsal web sitesi paketi. Hizmetlerinizi, iletişim bilgilerinizi ve galerinizi profesyonel bir tasarımla sergileyin. Canlı örneği görmek için tıklayın.',
 '/web-tasarimlari/standart-web-sitesi/hero.jpg', NULL, 'IN_STOCK', 1, TRUE);
