import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Post {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;
    
    @Column()
    content!: string;
}
