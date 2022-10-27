const bcrypt = require('bcryptjs');
const db = require('./../database/db');

exports.getAllUsers = async (req, res) => {
    try {
        db.query("SELECT * FROM users", (err, result, fields) => {
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
};

exports.getUser = async (req, res) => {
    const id = req.params.id;

    try {
        db.query("SELECT * FROM users WHERE id = ?", [id], (err, result, fields) => {
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
};

exports.createUser = async (req, res) => {
    const { email, firstname, lastname, password } = req.body;
    // Hash the password with cost of 12
    const passwordHash = await bcrypt.hash(password, 12);
    
    try {
        db.query(
            'INSERT INTO users(email, firstname, lastname, password) VALUES(?,?,?,?)',
            [email, firstname, lastname, passwordHash],
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
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { firstname, lastname } = req.body;

    try {
        db.query("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?", [firstname, lastname, id], (err, result, fields) => {
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
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        db.query("DELETE FROM users WHERE id = ?", [id], (err, result, fields) => {
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
};
