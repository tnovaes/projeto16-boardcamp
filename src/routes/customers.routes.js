import { Router } from "express";
import { getCustomers, getCustomersById, insertCustomers, updateCustomers } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validationSchema.middleware.js";
import { customersSchema } from "../schemas/customers.schemas.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", validateSchema(customersSchema), insertCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.put("/customers/:id", validateSchema(customersSchema), updateCustomers);

export default customersRouter;