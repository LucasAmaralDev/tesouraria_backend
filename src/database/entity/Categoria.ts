import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    nome: string

    @Column({nullable: false})
    descricao: string
}
