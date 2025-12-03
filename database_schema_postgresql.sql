-- ============================================
-- SILIANOS VOYAGE DATABASE SCHEMA
-- PostgreSQL Version
-- ============================================

-- Connect to the database first:
-- psql -U silianos_user -d silianos_voyage

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_admin_username ON admin_users(username);
CREATE INDEX idx_admin_email ON admin_users(email);

-- ============================================
-- 2. BOOKINGS TABLE
-- ============================================
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'paid', 'failed');

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    destination VARCHAR(200),
    departure_date DATE NOT NULL,
    return_date DATE,
    number_of_travelers INTEGER NOT NULL DEFAULT 1,
    status booking_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_email ON bookings(email);
CREATE INDEX idx_booking_departure_date ON bookings(departure_date);
CREATE INDEX idx_booking_created_at ON bookings(created_at);

-- ============================================
-- 3. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_image VARCHAR(500),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonial_verified ON testimonials(verified);
CREATE INDEX idx_testimonial_rating ON testimonials(rating);
CREATE INDEX idx_testimonial_date ON testimonials(date);

-- ============================================
-- 4. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image VARCHAR(500),
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_date ON blog_posts(date);
CREATE INDEX idx_blog_author ON blog_posts(author);
CREATE INDEX idx_blog_tags ON blog_posts USING GIN(tags);

-- ============================================
-- 5. CONTACT MESSAGES TABLE
-- ============================================
CREATE TYPE message_status AS ENUM ('new', 'read', 'replied');

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status message_status DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_status ON contact_messages(status);
CREATE INDEX idx_message_email ON contact_messages(email);
CREATE INDEX idx_message_created_at ON contact_messages(created_at);

-- ============================================
-- 6. GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_category ON gallery_images(category);
CREATE INDEX idx_gallery_date ON gallery_images(date);

-- ============================================
-- 7. SERVICES TABLE
-- ============================================
CREATE TYPE service_status AS ENUM ('active', 'inactive');

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    about TEXT,
    image VARCHAR(500),
    icon VARCHAR(50),
    color VARCHAR(100),
    status service_status DEFAULT 'active',
    benefits JSONB,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_status ON services(status);
CREATE INDEX idx_service_title ON services(title);

-- ============================================
-- 8. PRICING PACKAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TND',
    period VARCHAR(50),
    image VARCHAR(500),
    badge VARCHAR(50),
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pricing_active ON pricing_packages(is_active);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================
-- IMPORTANT: Replace the password_hash with a proper bcrypt hash
-- Generate one at: https://bcrypt-generator.com/
-- Default password: admin123 (CHANGE THIS!)

INSERT INTO admin_users (username, email, password_hash, full_name) 
VALUES ('admin', 'admin@silianos.com', '$2b$10$rOzJ8KqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample Booking
INSERT INTO bookings (customer_name, email, phone, service_type, destination, departure_date, return_date, number_of_travelers, status, payment_status, total_amount, notes)
VALUES ('Ahmed Ben Ali', 'ahmed@example.com', '+216 98 123 456', 'Omra', 'Makkah', '2025-03-15', '2025-03-25', 2, 'confirmed', 'approved', 2500.00, 'Préférence pour hôtel proche de la mosquée')
ON CONFLICT DO NOTHING;

-- Sample Testimonial
INSERT INTO testimonials (customer_name, rating, comment, service, date, verified)
VALUES ('Ahmed Ben Ali', 5, 'Service exceptionnel pour notre Omra. Tout était parfaitement organisé.', 'Omra & Hajj', '2024-12-15', TRUE)
ON CONFLICT DO NOTHING;

-- Sample Contact Message
INSERT INTO contact_messages (name, email, phone, subject, message, status)
VALUES ('Karim Ben Salah', 'karim@example.com', '+216 98 111 222', 'Demande de devis Omra', 'Bonjour, je souhaite obtenir un devis pour une Omra en mars 2025 pour 2 personnes.', 'new')
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================






