-- Create tables for SBD Store
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    balance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price BIGINT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CLEANUP OLD DATA
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Insert sample users
INSERT INTO users (name, username, email, phone, password, balance) VALUES
('Reyhan Batara', 'reyhan', 'reyhan@funkomart.com', '08123456789', 'admin123', 1000000000);

-- Insert 8 Specific High-End Items
INSERT INTO items (name, price, stock) VALUES
('Iphone 17 Pro Max', 20000000, 10),
('Logitech G PRO X SUPERSTRIKE', 2800000, 50),
('Keychron Q5 Max', 5000000, 30),
('Monitor MSI PRO MP251P', 4500000, 40),
('Asus ROG Zephyrus G14 2026', 45000000, 5),
('Apple Watch Ultra', 18000000, 15),
('Mac Mini 2025', 50000000, 20),
('Ipad Pro 2026', 22000000, 12);