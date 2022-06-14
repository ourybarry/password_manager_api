import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { UserCredential } from "./entity/UserCredential"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    // port: 5432,
    username: "oury",
    password: "admin",
    database: "password_manager",
    synchronize: true,
    logging: false,
    entities: [User, UserCredential],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize().catch((err)=>{
    console.log(err);
})