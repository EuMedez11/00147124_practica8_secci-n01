import pool from "../data/connection.js";
import bcrypt from "bcrypt";

export const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (err, results) => {
        if (err) throw err;
        res.status(200).json(results.rows);
    });
};

export const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
        if (err) throw err;
        res.status(200).json(results.rows);
    });
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, hashedPassword];

        const result = await pool.query(query, values);
        res.status(201).json({ message: `User added with ID: ${result.rows[0].id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al actualizar usuario" });
            }
            if (results.rowCount === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ message: `Usuario modificado con ID: ${id}` });
        }
    );
};

export const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query("DELETE FROM users WHERE id = $1", [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al eliminar usuario" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: `Usuario eliminado con ID: ${id}` });
    });
};
