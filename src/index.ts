import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

//Middlewares
import RequestLogger from './middleware/requestLogger'
import AppAuthenticator from './middleware/authenticatedApp'
import UserAuthenticator from './middleware/authenticatedUser'
import PasswordInCache from './middleware/passwordInCache'

//Routes
import AuthenticationRoutes from './routes/global/authentication.routes'
import CredentialController from './routes/credential/credential.crud'

//Setting up env vars
dotenv.config();

const app = express();

//Handling cors requests
app.use(cors())

//Parsing request bodies as json
app.use(bodyParser.json())

//Middlewares
app.use(RequestLogger)
app.use(AppAuthenticator)

//Routes
app.use('/auth', AuthenticationRoutes)

app.use('/credentials', UserAuthenticator, CredentialController);






app.listen(process.env.APP_DEFAULT_PORT, () => {
    console.log(`Listening on ${process.env.APP_DEFAULT_PORT}`)
}).on('error', handleListeningError);

function handleListeningError(error) {
    console.error(`Error while trying to launch server ${error.message}`)
}