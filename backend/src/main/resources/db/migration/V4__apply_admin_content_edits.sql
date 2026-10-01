-- Captures content edits originally made through the admin panel on the
-- development database (2026-08-25) so fresh deployments get them too.
-- Rows are matched by slug; updated_at is bumped so caches see a change.

UPDATE categories SET
    image_url = 'https://www.sahinambalaj.com.tr/wp-content/uploads/2021/09/kirtasiye.jpg',
    updated_at = now()
WHERE slug = 'kirtasiye-urunleri';

UPDATE categories SET
    image_url = 'https://imgscdn.stargazete.com/imgsdisk/2021/08/17/a101-26-agustos-2021-okul-malzemeleri-ve-kirtasiye-urunleri-17082021162920180648732de1.jpg',
    updated_at = now()
WHERE slug = 'sarf-malzemeleri';

UPDATE products SET
    image_url = 'https://images.migrosone.com/sanalmarket/product/37092222/37092222-215ec3.jpg',
    price = 500.00,
    updated_at = now()
WHERE slug = 'a4-fotokopi-kagidi';

UPDATE products SET
    image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpq9XKkPMCvAzCrFtqVxmfVh-Xg9lplR3XBqVFRxwHlg&s=10',
    price = 1500.00,
    updated_at = now()
WHERE slug = 'hp-85a-muadil-toner';
