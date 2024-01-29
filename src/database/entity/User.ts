import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    nome: string

    @Column({nullable: false})
    sobrenome: string

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: false})
    senha: string

    @Column({nullable: false})
    cargo: string

}
