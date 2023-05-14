import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        const gameAvailable = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [gameId]);

        if (!customer.rowCount || !game.rowCount || gameAvailable.rowCount >= game.rows[0].stockTotal) return res.sendStatus(400);

        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*, customers.name AS customerName, games.name AS gameName
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id;`)

        const rentalsList = rentals.rows.map(r => ({
            ...r,
            customer: {
                id: r.customerId,
                name: r.customerName
            },
            game: {
                id: r.gameId,
                name: r.gameName
            }
        }));

        return res.status(200).send(rentalsList);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (!rental.rowCount) return res.sendStatus(404);
        if (!rental.rows[0].returnDate) return res.sendStatus(400);

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [rental.rows[0].gameId])

        const returnDate = dayjs().format('YYYY-MM-DD');
        const totalDays = dayjs(returnDate).diff(rental.rows[0].rentDate, "day");

        let delayFee = 0;
        if (totalDays > rental.rows[0].daysRented) {
            delayFee = (totalDays - rental.rows[0].daysRented) * game.rows[0].pricePerDay;
        }

        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [returnDate, delayFee, id])

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (!rental.rowCount) return res.sendStatus(404);

        if (!rental.rows[0].returnDate) return res.sendStatus(400);

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}