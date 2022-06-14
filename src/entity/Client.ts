import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Client{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    appName: string;

    @Column()
    appSecret: string;
}