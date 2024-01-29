import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"
import { Categoria } from "./Categoria"

@Entity()
export class Transacoes {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.id)
    usuario: number

    @Column({
        type: "date",
        default: () => "CURRENT_DATE",
        nullable: false
    })
    data: string

    @Column({
        type: "varchar",
        length: 10,
        nullable: false
    })
    tipo: string

    @Column({
        type: "float",
        scale: 2
    })
    valor: number

    @Column({nullable: false})
    descricao: string

    @ManyToOne(() => Categoria, categoria => categoria.id)
    categoria: number
}
