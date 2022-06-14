//Middleware used to check if an app is authorized to use this api

import express, {Request, Response} from 'express'

const app = express()

const USER_AUTH_HEADER_KEY = 'x-user-token';

app.use((req: Request, res: Response, next : CallableFunction)=>{
    const userToken = req.headers[USER_AUTH_HEADER_KEY];
    if(!userToken) return res.status(401).send("Must provide user token");
    //TODO: Verify userToken !!!
    next()
})

export default app;