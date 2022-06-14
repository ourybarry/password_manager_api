import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserCredential } from "./UserCredential"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number

    @Column({length: 255})
    email: string

    @Column({length: 255})
    password: string

    @OneToMany(()=> UserCredential, (credential)=> credential.owner)
    credentials: UserCredential[];

}
