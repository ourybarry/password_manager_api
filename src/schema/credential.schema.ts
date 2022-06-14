import Joi from "joi";


const domainRegex = "https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)";

const credentialSchema = Joi.object({
    domain: Joi.string().pattern(new RegExp(domainRegex)).required(),
    username: Joi.string().max(64),
    email: Joi.string().email(),
    password: Joi.string().max(32),
})

export default credentialSchema;