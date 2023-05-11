import { Router } from "express";
import { getGames, insertGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validationSchema.middleware.js";
import { gamesSchema } from "../schemas/games.schemas.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gamesSchema), insertGames);

export default gamesRouter;