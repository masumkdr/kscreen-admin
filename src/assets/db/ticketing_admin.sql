-- ---------- TENANCY / ACTORS ----------
CREATE TABLE organizations (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(150) NOT NULL,         -- e.g., K-SCREEN
  slug          VARCHAR(100) UNIQUE,
  status        ENUM('active','inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id        BIGINT NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(180) UNIQUE NOT NULL,
  phone         VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE roles (
  id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  name      ENUM('admin','supplier','customer') UNIQUE NOT NULL
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ---------- PRODUCT TAXONOMY ----------
CREATE TABLE product_types (
  id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  code      VARCHAR(50) UNIQUE NOT NULL,  -- 'cinema','bus','train','event','park'
  label     VARCHAR(100) NOT NULL
);

-- A "product" is the purchasable parent entity regardless of module.
-- Example: for cinema, the Product is the Movie-Show (showtime instance).
CREATE TABLE products (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id          BIGINT NOT NULL,
  product_type_id BIGINT NOT NULL,
  title           VARCHAR(200) NOT NULL,      -- e.g., "Avatar 3 - Hall 1 - 22 Oct Matinee"
  description     TEXT,
  status          ENUM('draft','on_sale','off_sale','archived') DEFAULT 'draft',
  sales_start_at  DATETIME,
  sales_end_at    DATETIME,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (product_type_id) REFERENCES product_types(id),
  INDEX (org_id, product_type_id, status)
);

-- Price books are optional (you can price at module level too). This keeps core uniform.
CREATE TABLE price_books (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id      BIGINT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  currency    CHAR(3) NOT NULL DEFAULT 'BDT',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- ---------- ORDERING ----------
CREATE TABLE orders (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id        BIGINT NOT NULL,
  user_id       BIGINT,                         -- nullable for guest checkout, store phone/email on payments
  order_code    VARCHAR(40) UNIQUE NOT NULL,
  status        ENUM('pending','paid','canceled','refunded','partial_refund')
                NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tickets are items in an order and point to a product "instance" (cinema showtime seat, bus seat, etc)
CREATE TABLE tickets (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id        BIGINT NOT NULL,
  product_id      BIGINT NOT NULL,
  unit_price      DECIMAL(12,2) NOT NULL,
  tax_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  fee_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount    DECIMAL(12,2) NOT NULL,              -- computed
  status          ENUM('reserved','issued','refunded','canceled') DEFAULT 'reserved',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX (product_id, status)
);

-- Payments (SSLCommerz, etc.)
CREATE TABLE payments (
  id               BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id         BIGINT NOT NULL,
  gateway          VARCHAR(50) NOT NULL,                -- 'sslcommerz'
  method           VARCHAR(50),                         -- 'bkash','card','nagad', etc.
  currency         CHAR(3) NOT NULL DEFAULT 'BDT',
  amount_authorized DECIMAL(12,2) NOT NULL,
  amount_captured   DECIMAL(12,2) NOT NULL DEFAULT 0,
  txn_ref          VARCHAR(120),                        -- gateway transaction id or val_id
  raw_payload      JSON,                                -- audit/verification blob
  status           ENUM('initiated','authorized','captured','failed','refunded')
                   NOT NULL DEFAULT 'initiated',
  customer_email   VARCHAR(180),
  customer_phone   VARCHAR(30),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX (txn_ref),
  INDEX (status)
);

-- Coupons/Discounts (global; can also be scoped per module in bridge tables)
CREATE TABLE coupons (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id       BIGINT NOT NULL,
  code         VARCHAR(50) UNIQUE NOT NULL,
  amount_type  ENUM('flat','percent') NOT NULL,
  amount_value DECIMAL(12,2) NOT NULL, -- percent uses 0-100
  starts_at    DATETIME,
  ends_at      DATETIME,
  usage_limit  INT,                     -- optional
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE order_coupons (
  order_id   BIGINT NOT NULL,
  coupon_id  BIGINT NOT NULL,
  PRIMARY KEY (order_id, coupon_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

