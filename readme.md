# 📒 Khatabook Clone

A lightweight, full-stack digital ledger application inspired by Khatabook. This application allows business owners and individuals to securely register, manage their customers, track daily transactions (credit and debit), and generate printable invoices.

## 🚀 Live Demo
**[View the Live Application Here](https://khatabook-clone-six.vercel.app/)**

## ✨ Features
- **User Authentication:** Secure user registration and login system with encrypted passwords.
- **Customer Management:** Easily add and keep track of multiple customers in your dashboard.
- **Transaction Logging:** Record "You Gave" (debit/red) and "You Got" (credit/green) transactions.
- **Dynamic Ledger:** Automatically calculates the real-time net balance for each customer.
- **Printable Invoices:** A clean, print-ready invoice view to share offline records with customers.
- **Persistent SQL Storage:** Reliably saves all users, customers, and transactions in a relational database.

## 🛠️ Tech Stack
- **Frontend:** HTML5, Tailwind CSS, EJS (Embedded JavaScript templating)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Cloud) / SQLite (Local)
- **Deployment:** Vercel (Hosting)

## 💻 Local Installation & Setup

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/harshanandbadal/khatabook-clone.git
cd khatabook-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory of your project and add your database connection string (if using PostgreSQL):
```env
DATABASE_URL=your_postgresql_connection_string_here
PORT=3000
```
*(Note: If you are using the SQLite version, the `.env` database string may not be required).*

### 4. Start the Application
```bash
npm start
```
The server will start, and you can view the application by navigating to `http://localhost:3000` in your web browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/harshanandbadal/khatabook-clone/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).