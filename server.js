const express = require('express');
const mysql = require('mysql');

const app = express();
// Middleware
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'nodejs_mysql',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err);
        return;
    }

    console.log('MySQL successfully connected!');
});

// Routes
app.get('/users', async (req, res) => {
    try {
        connection.query("SELECT * FROM users", (err, result, fields) => {
            if (err) {
                console.log(err);
                res.status(400).send();
            }

            res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result, fields) => {
            if (err) {
                console.log(err);
                res.status(400).send();
            }

            res.status(200).json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.post('/users', async (req, res) => {
    const { email, firstname, lastname, password } = req.body;

    try {
        connection.query(
            'INSERT INTO users(email, firstname, lastname, password) VALUES(?,?,?,?)',
            [email, firstname, lastname, password],
            (err, result, fields) => {
                if (err) {
                    console.log('Error inserting a user into the database', err);
                    res.status(400).send();
                }

                res.status(201).json({
                    message: 'New user successfully created!'
                });
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { firstname, lastname } = req.body;

    try {
        connection.query("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?", [firstname, lastname, id], (err, result, fields) => {
            if (err) {
                console.log(err);
                res.status(400).send();
            }

            res.status(200).json({ message: 'User updated successfully!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        connection.query("DELETE FROM users WHERE id = ?", [id], (err, result, fields) => {
            if (err) {
                console.log(err);
                res.status(400).send();
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No user with that id' });
            }
            res.status(200).json({ message: 'User deleted successfully!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running no ${port}`);
});
