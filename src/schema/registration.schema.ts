import Joi from "joi";


// const emailRegex = `^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`


const registrationSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8).max(32).required(),
    repeat_password: Joi.ref('password')
})

export default registrationSchema;