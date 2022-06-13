import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.send("Hello, world");
})

app.listen(process.env.APP_DEFAULT_PORT, ()=>{
    console.log(`Listening on ${process.env.APP_DEFAULT_PORT}`)
})