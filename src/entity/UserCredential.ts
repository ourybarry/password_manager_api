import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class UserCredential{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 255})
    domain: string;

    @Column({length: 255, nullable: true})
    username?: string;

    @Column({length: 255, nullable: true})
    email?: string;

    @Column({length: 255})
    password: string;

    @ManyToOne(()=> User, (user)=> user.credentials)
    owner?: User;
}