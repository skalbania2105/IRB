const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: 'mysql.agh.edu.pl', 
  port: 3306,               
  user: 'skalban2',         
  password: 'zxtTUNDBQZTeTYkW', 
  database: 'skalban2'      
});

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z MySQL:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

// Klucz tajny JWT
const JWT_SECRET = 'v8uV@F*6QnMZ$2lG1t!jRkXz&Nw9pBhKx3TcS';

// Rejestracja użytkownika
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Błąd rejestracji:', err);
      return res.status(500).json({ error: 'Błąd rejestracji' });
    }
    res.status(201).json({ message: 'Rejestracja zakończona pomyślnie' });
  });
});


// Logowanie użytkownika
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Niepoprawny email lub hasło' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Niepoprawny email lub hasło' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Logowanie zakończone pomyślnie' });
  });
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});


