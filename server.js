require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();

// Connect to Cloud PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret-key-123',
    resave: false,
    saveUninitialized: false
}));

// Initialize Database Tables
const initDB = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS customers (id SERIAL PRIMARY KEY, user_id INTEGER, name TEXT, phone TEXT)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS transactions (id SERIAL PRIMARY KEY, customer_id INTEGER, type TEXT, amount REAL, description TEXT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
};
initDB();

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/login');
};

// --- ROUTES ---
app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id", [username, hashedPassword]);
        req.session.userId = result.rows[0].id;
        res.redirect('/');
    } catch (err) {
        res.render('login', { error: 'Username already exists' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', isAuthenticated, async (req, res) => {
    const result = await pool.query("SELECT * FROM customers WHERE user_id = $1", [req.session.userId]);
    res.render('dashboard', { customers: result.rows });
});

app.post('/add-customer', isAuthenticated, async (req, res) => {
    const { name, phone } = req.body;
    await pool.query("INSERT INTO customers (user_id, name, phone) VALUES ($1, $2, $3)", [req.session.userId, name, phone]);
    res.redirect('/');
});

app.get('/customer/:id', isAuthenticated, async (req, res) => {
    const customerId = req.params.id;
    const custResult = await pool.query("SELECT * FROM customers WHERE id = $1 AND user_id = $2", [customerId, req.session.userId]);
    const customer = custResult.rows[0];
    
    if (!customer) return res.redirect('/');
    
    const transResult = await pool.query("SELECT * FROM transactions WHERE customer_id = $1 ORDER BY date DESC", [customerId]);
    const transactions = transResult.rows;
    
    let balance = 0;
    transactions.forEach(t => balance += (t.type === 'give' ? -t.amount : t.amount));
    
    res.render('customer', { customer, transactions, balance });
});

app.post('/add-transaction/:id', isAuthenticated, async (req, res) => {
    const { amount, type, description } = req.body;
    await pool.query("INSERT INTO transactions (customer_id, amount, type, description) VALUES ($1, $2, $3, $4)", [req.params.id, amount, type, description]);
    res.redirect('/customer/' + req.params.id);
});

// Use the PORT provided by the cloud host, or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));