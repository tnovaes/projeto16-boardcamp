import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().integer().min(1),
    pricePerDay: joi.number().integer().min(1)
})