import express, {Request, Response} from 'express'

const router = express.Router()

router.use((req: Request, res: Response, next)=>{
    console.log(`[${new Date().toLocaleString()}] - ${req.ip} : ${req.method} ${req.path}`)
    next()
})

export default router;