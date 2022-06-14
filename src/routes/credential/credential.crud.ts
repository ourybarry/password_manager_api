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
    const user: User = await retrieveUserFromHeaders(req);

    const credentials = await credentialsRepository.findOneBy({id: parseInt(credentialId)});
    if(credentials == null) return res.status(404).json({"error":"Couldn't find credentials with that id"});
    const encryptionSecret = user.password.substring(0,16);
    const decodedBytes = cryptoJS.AES.decrypt(credentials.password, encryptionSecret);
    const decryptedPassword = decodedBytes.toString(cryptoJS.enc.Utf8);
    return res.json({"password": decryptedPassword});
})

//List all user credentials
router.get('/all', async (req: Request, res: Response)=>{
    const user: User = await retrieveUserFromHeaders(req);
    const userCredentials: UserCredential[] = await credentialsRepository.findBy({owner: user});
    res.json(userCredentials);
})

//Save new credentials
router.post('/new', async (req: Request, res: Response)=>{
    const user: User = await retrieveUserFromHeaders(req);
    
    const data = req.body;

    try{
        await CredentialSchema.validateAsync(data)
    }catch(err){
        return res.status(400).json({'error': err})
    }

    const encryptionSecret = user.password.substring(0,16);
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