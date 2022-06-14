import { Request, } from 'express'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source';


const userRepository = AppDataSource.getRepository(User);

/**
 * helper function for retrieving user entity from request headers
 * @param req Request headers
 * @returns @User
 */
export const retrieveUserFromHeaders = async (req: Request): Promise<User> => {
    const userId = req.headers['x-user-id']; //User id was previously added to headers by the userauthentication middleware
    if(!userId) console.log("Couldn't retrieve user id")
    const user: User = await userRepository.findOneBy({ id: parseInt(userId.toString()) })
    return user;
}