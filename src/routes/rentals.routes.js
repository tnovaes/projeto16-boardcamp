import { Router } from "express";
import { deleteRental, getRentals, insertRental, returnRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validationSchema.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schemas.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), insertRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;