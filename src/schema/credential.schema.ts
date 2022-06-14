import Joi from "joi";


const domainRegex = "^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$";

const credentialSchema = Joi.object({
    domain: Joi.string().pattern(new RegExp(domainRegex)).required(),
    username: Joi.string().max(64),
    email: Joi.string().email(),
    password: Joi.string().max(32).required(),
})

export default credentialSchema;