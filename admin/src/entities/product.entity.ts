import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    imgAd: string

    @Column({default: 0})
    likes?: number
}