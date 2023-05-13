import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.string().trim(),
    stockTotal: joi.number().integer().min(1),
    pricePerDay: joi.number().integer().min(1)
})