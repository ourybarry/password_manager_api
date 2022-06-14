import express, {Request, Response, Router } from 'express';
import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';
import argon2 from 'argon2'
import jsonWebToken from 'jsonwebtoken'
import { createClient } from 'redis';

import RegistrationSchema from '../../schema/registration.schema';
import LoginSchema from '../../schema/login.schema';

const router : Router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const redisClient = createClient();
router.post('/register', async (req: Request, res: Response)=>{
    const data = req.body;
    
    try {
        await RegistrationSchema.validateAsync(data)
    } catch (error) {
        return res.status(400).json(error)
    }
    //Save new user to database

    //Hashing password before saving it into database
    const hashedPassword = await argon2.hash(data.password).catch((err)=>{
        return res.status(500).json(err)
    });
    const newUser: User = {email: data.email, password: hashedPassword.toString() , credentials: []};
    await userRepository.save(newUser).catch((err)=>{
        res.status(500).json(err);
    })
    res.json({"id": newUser.id, "email": newUser.email})
})

router.post('/login', async (req: Request, res: Response)=>{
    const data = req.body;
    
    try {
        await LoginSchema.validateAsync(data)
    } catch (error) {
        return res.status(400).json(error)
    }


    //Verifying credentials

    const user : User = await userRepository.findOneBy({email: data.email})
    //If user was not found return bad credentials error
    if(user == null){
        return res.status(403).send("User not found");
    }
    
    //Verify that password matches
    try {
        //If password matches hash in database, create a jwt token and send it as response, else, return a bad credentials response
        if(await argon2.verify(user.password, data.password)){
            const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60) //Token expires after 1 day
            const payload = {
                "user" : {"id": user.id, "email": user.email},
            };
            const token = jsonWebToken.sign({exp: exp, data: payload}, process.env.APP_JWT_SECRET);
            // //Save plaintext password to cache for future usage
            // await redisClient.connect();
            // const passwordCacheKey = `user_${user.email}_password`;
            // await redisClient.set(passwordCacheKey, data.password);


            return res.json({token, exp});
        }
        return res.status(403).json({"error": "Bad Credentials"});
    } catch (error) {
        return res.status(500).send(error);
    }
})

export default router;