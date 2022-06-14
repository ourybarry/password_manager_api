import express, {Request, Response} from 'express';
import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';
import { UserCredential } from '../../entity/UserCredential';
import CredentialSchema from '../../schema/credential.schema'

const router = express.Router();
const userRepository = AppDataSource.getRepository(User)
const credentialsRepository = AppDataSource.getRepository(UserCredential)

//List all user credentials
router.get('/', async (req: Request, res: Response)=>{
    const userId = req.headers['user']; //User id was previously added to headers by the userauthentication middleware
    const user: User = await userRepository.findOneBy({id: parseInt(userId.toString())})
    const userCredentials: UserCredential[] = await credentialsRepository.findBy({owner: user});
    res.json(userCredentials);
})

//Save new credentials
router.post('/', async (req: Request, res: Response)=>{
    const user: User = await retrieveUserFromHeaders(req);
    const data = req.body;

    try{
        await CredentialSchema.validate(data)
    }catch(err){
        return res.status(400).json({'error': err})
    }
    
    const credentials: UserCredential = {
        domain: data.domain,
        username: data.username || null,
        email: data.email,
        password: encryptedPassword,
        owner: user,
    }
    try {
        await credentialsRepository.save(credentials);
        return res.json({"message": "Credentials saved successfully"})
    } catch (error) {
        return res.status(500).json({error});
    }
})

//Util functions

var retrieveUserFromHeaders = async (req: Request): Promise<User> =>{
    const userId = req.headers['user']; //User id was previously added to headers by the userauthentication middleware
    const user: User = await userRepository.findOneBy({id: parseInt(userId.toString())})
    return user;
}