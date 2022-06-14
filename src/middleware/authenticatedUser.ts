//Middleware used to check if an app is authorized to use this api

import express, {Request, Response} from 'express'
import jsonWebToken from 'jsonwebtoken'

const router = express.Router()

const USER_AUTH_HEADER_KEY = 'x-user-token';

router.use((req: Request, res: Response, next : CallableFunction)=>{
    // console.log('We being called')
    const userToken = req.headers[USER_AUTH_HEADER_KEY];
    if(!userToken) return res.status(401).send("Must provide user token");
    //TODO: Verify userToken !!!

    try {
        const credentials : any = jsonWebToken.verify(userToken.toString(), process.env.APP_JWT_SECRET);
        req.headers['x-user-id'] = credentials.id;
        next();
    } catch (error) {
        return res.status(401).json({error})
    }
})

export default router;