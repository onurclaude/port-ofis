-- Port Ofis Kirtasiye - initial schema
-- See docs/DATABASE_SCHEMA.md for the binding contract this migration implements.

CREATE TABLE services (
    id                  BIGSERIAL PRIMARY KEY,
    slug                VARCHAR(120)  NOT NULL,
    name                VARCHAR(150)  NOT NULL,
    short_description   VARCHAR(200)  NOT NULL,
    description         TEXT          NOT NULL,
    icon_key            VARCHAR(50)   NOT NULL,
    display_order       INTEGER       NOT NULL DEFAULT 0,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT services_slug_key UNIQUE (slug)
);

CREATE INDEX idx_services_active_order ON services (is_active, display_order);

CREATE TABLE categories (
    id                  BIGSERIAL PRIMARY KEY,
    slug                VARCHAR(120)  NOT NULL,
    name                VARCHAR(150)  NOT NULL,
    description         TEXT          NULL,
    image_url           VARCHAR(500)  NULL,
    display_order       INTEGER       NOT NULL DEFAULT 0,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT categories_slug_key UNIQUE (slug)
);

CREATE INDEX idx_categories_active_order ON categories (is_active, display_order);

CREATE TABLE products (
    id                  BIGSERIAL PRIMARY KEY,
    category_id         BIGINT        NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    slug                VARCHAR(150)  NOT NULL,
    name                VARCHAR(200)  NOT NULL,
    description         TEXT          NULL,
    image_url           VARCHAR(500)  NULL,
    price               NUMERIC(10, 2) NULL,
    stock_status        VARCHAR(20)   NOT NULL DEFAULT 'IN_STOCK',
    display_order       INTEGER       NOT NULL DEFAULT 0,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT products_slug_key UNIQUE (slug),
    CONSTRAINT products_stock_status_check CHECK (stock_status IN ('IN_STOCK', 'OUT_OF_STOCK', 'ON_ORDER'))
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_active_order ON products (is_active, display_order);

CREATE TABLE contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(30)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    subject     VARCHAR(150) NOT NULL,
    message     TEXT         NOT NULL,
    status      VARCHAR(10)  NOT NULL DEFAULT 'NEW',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT contact_messages_status_check CHECK (status IN ('NEW', 'READ'))
);

CREATE INDEX idx_contact_messages_status_created ON contact_messages (status, created_at DESC);

CREATE TABLE site_settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(80) NOT NULL,
    value       TEXT        NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT site_settings_key_key UNIQUE (key)
);

CREATE TABLE admin_users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(60)  NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT admin_users_username_key UNIQUE (username)
);
