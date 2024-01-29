import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "a",
    database: "tesouraria",
    synchronize: true,
    logging: false,
    entities: ['src/database/entity/**/*.ts'],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => console.log("Database connected"))
    .catch((err: Error) => console.log(err))
