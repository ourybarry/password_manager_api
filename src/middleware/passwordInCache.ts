//Middleware that checks if user password is saved in cache
//We need that because we use the user password to encrypt his credentials
//If the password is not cached, we redirect the user to an url where he can submit his password
//The user won't have to worry about some random MITM attack because :
//1.We are using https
//2.All requests's bodies are encrypted

import express, {Request, Response} from 'express';
import { createClient } from 'redis';
import { retrieveUserFromHeaders } from '../util/retrieveUserFromRequestHeader';


const redisClient = createClient();
const USER_CREDENTIALS_CACHE_KEY = 'user_';
const app = express();
app.use(async(req:Request, res: Response, next: CallableFunction)=>{
    // console.log('We being called...')
    const user = await retrieveUserFromHeaders(req);
    await redisClient.connect().catch((err)=>{
        console.log(err)
    });
    const userCredentials = await redisClient.get(`${USER_CREDENTIALS_CACHE_KEY}${user.email}_password`);
    if(!userCredentials) return res.status(301).json({"message": "You have to re-enter your password"});
    //Credentials are already in cache, we can pass them to the header and continue
    req.headers['x-user-password'] = userCredentials;
    next() 
})

export default app;
