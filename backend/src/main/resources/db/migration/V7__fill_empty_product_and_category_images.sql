-- Fills product/category image_url values that were left empty, using
-- photos shipped in frontend/public/gorseller. Rows are matched by slug and
-- only touched while image_url IS NULL, so images set via the admin panel
-- are never overwritten.

UPDATE categories SET image_url = '/gorseller/baski-makinesi.jpg', updated_at = now()
WHERE slug = 'toner-kartus' AND image_url IS NULL;

UPDATE categories SET image_url = '/gorseller/oyuncak.jpg', updated_at = now()
WHERE slug = 'oyuncak' AND image_url IS NULL;

UPDATE categories SET image_url = '/gorseller/hediyelik.jpg', updated_at = now()
WHERE slug = 'hediyelik-urunler' AND image_url IS NULL;

UPDATE categories SET image_url = '/gorseller/kisiye-ozel-baski.jpg', updated_at = now()
WHERE slug = 'kisiye-ozel-baski-urunleri' AND image_url IS NULL;

UPDATE products SET image_url = '/gorseller/kirtasiye.jpg', updated_at = now()
WHERE slug IN ('tukenmez-kalem-seti', 'spiralli-defter-a4', 'zimba-teli-standart') AND image_url IS NULL;

UPDATE products SET image_url = '/gorseller/baski-makinesi.jpg', updated_at = now()
WHERE slug IN ('canon-725-muadil-toner', 'kisiye-ozel-kartvizit-baskisi') AND image_url IS NULL;

UPDATE products SET image_url = '/gorseller/oyuncak.jpg', updated_at = now()
WHERE slug IN ('karisik-oyuncak-seti', 'egitici-yapboz') AND image_url IS NULL;

UPDATE products SET image_url = '/gorseller/hediyelik.jpg', updated_at = now()
WHERE slug IN ('hediyelik-kalem-seti', 'hediyelik-anahtarlik') AND image_url IS NULL;

UPDATE products SET image_url = '/gorseller/kupa-baski.jpg', updated_at = now()
WHERE slug = 'kisiye-ozel-kupa-baski' AND image_url IS NULL;
