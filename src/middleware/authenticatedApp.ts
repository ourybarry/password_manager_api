//Middleware used to check if an app is authorized to use this api

import express, {Request, Response} from 'express'

const app = express()

const APP_AUTH_HEADER_KEY = 'x-app-token';

app.use((req: Request, res: Response, next : CallableFunction)=>{
    const appToken = req.headers[APP_AUTH_HEADER_KEY];
    if(!appToken) return res.status(401).send("Must provide app token");
    //TODO: Verify appToken !!!
    next()
})

export default app;