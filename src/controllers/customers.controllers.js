import { json } from "express";
import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`);

        res.send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfVerification = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (cpfVerification.rows[0]) return res.status(409).send("Customer already registered");

        await db.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;

    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if (!customers.rows[0]) return res.status(404).send("Customer not registered")

        res.send(customers.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomers(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfVerification = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (cpfVerification.rows[0].id.toString() !== id) return res.status(409).send("CPF already registered");

        await db.query(`
        UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
            WHERE id = $5;`, [name, phone, cpf, birthday, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}