-- Port Ofis Kirtasiye - seed data. See docs/DATABASE_SCHEMA.md §7.

-- 7.1 services (exact 6)
INSERT INTO services (slug, name, short_description, description, icon_key, display_order, is_active) VALUES
('dijital-baski', 'Dijital Baskı', 'Renkli ve siyah-beyaz baskı, fotokopi, tarama ve daha fazlası.',
 'Renkli ve siyah-beyaz dijital baskı, fotokopi, tarama, ciltleme ve kupa/fotoğraf baskı hizmetleri sunuyoruz. Öğrenci ödevlerinden kurumsal sunumlara kadar her ihtiyaca hızlı ve kaliteli çözüm sağlıyoruz.',
 'printer', 1, TRUE),
('kirtasiye', 'Kırtasiye', 'Okul ve ofis kırtasiye ihtiyaçlarınız için geniş ürün yelpazesi.',
 'Kalem, defter, dosya, çanta ve okul çağı ürünlerinden ofis sarf malzemelerine kadar geniş bir kırtasiye ürün yelpazesi sunuyoruz. Öğrenciler ve işletmeler için uygun fiyatlı, kaliteli seçenekler mevcuttur.',
 'pen-nib', 2, TRUE),
('sarf-malzemeleri', 'Sarf Malzemeleri', 'Toner, kartuş ve ofis sarf malzemelerinde geniş stok.',
 'Yazıcı toner ve kartuşları başta olmak üzere ofisinizin ihtiyaç duyduğu tüm sarf malzemelerini uygun fiyatlarla tedarik ediyoruz. Orijinal ve muadil ürün seçenekleriyle kesintisiz ofis düzeni sağlıyoruz.',
 'box', 3, TRUE),
('kisiye-ozel-baski', 'Kişiye Özel Baskı', 'Kupa, kartvizit ve daha fazlasında kişiye özel tasarım baskı.',
 'Kupa baskısından kartvizit baskısına, hediyelik ürünlerden özel tasarım baskılara kadar kişiye ve kuruma özel baskı çözümleri sunuyoruz. Kendi tasarımınızı getirin, biz hayata geçirelim.',
 'sparkles', 4, TRUE),
('oyuncak-hediyelik', 'Oyuncak & Hediyelik', 'Çocuklar için oyuncaklar ve her yaşa uygun hediyelik eşyalar.',
 'Çocuklar için eğitici ve eğlenceli oyuncaklardan, her yaş grubuna uygun hediyelik eşyalara kadar geniş bir ürün yelpazesi sunuyoruz. Doğum günü ve özel gün hediyeleri için ideal seçenekler.',
 'gift', 5, TRUE),
('kase-kurumsal-cozumler', 'Kaşe & Kurumsal Çözümler', 'Kaşe, kurumsal baskı ve kurumsal kırtasiye tedariği.',
 'İşletmeniz için kaşe imalatı, kurumsal evrak baskısı ve toplu kurumsal kırtasiye tedariği hizmetleri sunuyoruz. Ofisinizin tüm kurumsal ihtiyaçlarını tek noktadan, güvenilir şekilde karşılıyoruz.',
 'building', 6, TRUE);

-- 7.2 categories (minimum 6)
INSERT INTO categories (slug, name, description, image_url, display_order, is_active) VALUES
('kirtasiye-urunleri', 'Kırtasiye Ürünleri', 'Okul ve ofis için kalem, defter, dosya ve daha fazlası.', NULL, 1, TRUE),
('sarf-malzemeleri', 'Sarf Malzemeleri', 'Ofisiniz için gerekli sarf malzemeleri.', NULL, 2, TRUE),
('toner-kartus', 'Toner & Kartuş', 'Yazıcılarınız için orijinal ve muadil toner/kartuş seçenekleri.', NULL, 3, TRUE),
('oyuncak', 'Oyuncak', 'Çocuklar için eğlenceli ve eğitici oyuncaklar.', NULL, 4, TRUE),
('hediyelik-urunler', 'Hediyelik Ürünler', 'Her yaşa ve her özel güne uygun hediyelik eşyalar.', NULL, 5, TRUE),
('kisiye-ozel-baski-urunleri', 'Kişiye Özel Baskı Ürünleri', 'Kupa, kartvizit ve daha fazlasında kişiye özel baskı ürünleri.', NULL, 6, TRUE);

-- 7.3 products (at least 2 per category)
INSERT INTO products (category_id, slug, name, description, image_url, price, stock_status, display_order, is_active) VALUES
((SELECT id FROM categories WHERE slug = 'kirtasiye-urunleri'), 'tukenmez-kalem-seti', 'Tükenmez Kalem Seti', 'Farklı renk seçenekleriyle günlük kullanım için tükenmez kalem seti.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'kirtasiye-urunleri'), 'spiralli-defter-a4', 'Spiralli Defter A4', 'Çizgili A4 boyutunda spiralli defter.', NULL, NULL, 'IN_STOCK', 2, TRUE),
((SELECT id FROM categories WHERE slug = 'sarf-malzemeleri'), 'a4-fotokopi-kagidi', 'A4 Fotokopi Kağıdı (500 Yaprak)', 'Ofis ve okul kullanımı için 80gr A4 fotokopi kağıdı.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'sarf-malzemeleri'), 'zimba-teli-standart', 'Standart Zımba Teli', 'Standart boy zımba makineleri için zımba teli.', NULL, NULL, 'IN_STOCK', 2, TRUE),
((SELECT id FROM categories WHERE slug = 'toner-kartus'), 'hp-85a-muadil-toner', 'HP 85A Muadil Toner', 'HP lazer yazıcılar için muadil toner kartuşu.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'toner-kartus'), 'canon-725-muadil-toner', 'Canon 725 Muadil Toner', 'Canon lazer yazıcılar için muadil toner kartuşu.', NULL, NULL, 'ON_ORDER', 2, TRUE),
((SELECT id FROM categories WHERE slug = 'oyuncak'), 'karisik-oyuncak-seti', 'Karışık Oyuncak Seti', 'Çocuklar için karışık küçük oyuncak seti.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'oyuncak'), 'egitici-yapboz', 'Eğitici Yapboz', 'Çocuklar için eğitici ahşap yapboz.', NULL, NULL, 'IN_STOCK', 2, TRUE),
((SELECT id FROM categories WHERE slug = 'hediyelik-urunler'), 'hediyelik-kalem-seti', 'Hediyelik Kalem Seti', 'Özel kutusunda hediyelik kalem seti.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'hediyelik-urunler'), 'hediyelik-anahtarlik', 'Hediyelik Anahtarlık', 'Çeşitli desenlerde hediyelik anahtarlık.', NULL, NULL, 'IN_STOCK', 2, TRUE),
((SELECT id FROM categories WHERE slug = 'kisiye-ozel-baski-urunleri'), 'kisiye-ozel-kupa-baski', 'Kişiye Özel Kupa Baskı', 'İstediğiniz görsel veya yazıyla kişiye özel kupa baskısı.', NULL, NULL, 'IN_STOCK', 1, TRUE),
((SELECT id FROM categories WHERE slug = 'kisiye-ozel-baski-urunleri'), 'kisiye-ozel-kartvizit-baskisi', 'Kişiye Özel Kartvizit Baskısı', 'İşletmeniz için özel tasarım kartvizit baskısı.', NULL, NULL, 'IN_STOCK', 2, TRUE);

-- 7.4 site_settings (all 10 keys)
INSERT INTO site_settings (key, value) VALUES
('site_name', 'Port Ofis Kırtasiye'),
('phone', '0312 911 81 02'),
('address', 'Eryaman Port AVM, Etimesgut / Ankara'),
('website_url', 'https://portofiskirtasiye.com.tr'),
('whatsapp_number', ''),
('instagram_url', ''),
('facebook_url', ''),
('working_hours', ''),
('map_embed_url', ''),
('footer_note', '© 2026 Port Ofis Kırtasiye. Tüm hakları saklıdır.');
