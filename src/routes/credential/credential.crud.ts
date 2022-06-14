import express, {Request, Response} from 'express';


import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';
import { UserCredential } from '../../entity/UserCredential';


import CredentialSchema from '../../schema/credential.schema'
import { retrieveUserFromHeaders } from '../../util/retrieveUserFromRequestHeader';

import cryptoJS from 'crypto-js'

const router = express.Router();

const userRepository = AppDataSource.getRepository(User)
const credentialsRepository = AppDataSource.getRepository(UserCredential)


//Decrypt single password
router.get('/decrypt/:id', async (req: Request, res: Response)=>{
    const credentialId = req.params.id
    const userPassword = req.headers['x-user-password']

    const credentials = await credentialsRepository.findOneBy({id: parseInt(credentialId)});
    if(credentials == null) return res.status(404).json({"error":"Couldn't find credentials with that id"});
    const encryptionSecret = `${userPassword}${credentials.email.toString().substring(0, credentials.domain.toString().length)}`
    const decodedBytes = cryptoJS.AES.decrypt(credentials.password, encryptionSecret);
    const decryptedPassword = decodedBytes.toString(cryptoJS.enc.Utf8);
    return res.json({"password": decryptedPassword});
})

//List all user credentials
router.get('/all', async (req: Request, res: Response)=>{
    const userId = req.headers['user']; //User id was previously added to headers by the userauthentication middleware
    const user: User = await userRepository.findOneBy({id: parseInt(userId.toString())})
    const userCredentials: UserCredential[] = await credentialsRepository.findBy({owner: user});
    res.json(userCredentials);
})

//Save new credentials
router.post('/new', async (req: Request, res: Response)=>{
    const user: User = await retrieveUserFromHeaders(req);

    const userPassword = req.headers['x-user-password']
    const data = req.body;

    try{
        await CredentialSchema.validate(data)
    }catch(err){
        return res.status(400).json({'error': err})
    }

    const encryptionSecret = `${userPassword}${data.email.toString().substring(0, data.domain.toString().length)}`
    const cypherText = cryptoJS.AES.encrypt(data.password.toString(), encryptionSecret);

    const credentials: UserCredential = {
        domain: data.domain,
        username: data.username || null,
        email: data.email,
        password: cypherText.toString(),
        owner: user,
    }
    try {
        await credentialsRepository.save(credentials);
        return res.json({"message": "Credentials saved successfully"})
    } catch (error) {
        return res.status(500).json({error});
    }
})



export default router;