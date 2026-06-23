import { AppConfig } from "../types";

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000
const DB_USER = process.env.DB_USER || "postgres"
const DB_PASS = process.env.DB_PASS || "local_pass"
const DB_HOST = process.env.DB_HOST || "0.0.0.0"
const DB_PORT = Number(process.env.DB_PORT) || 5432

export const config: AppConfig = {
    port: SERVER_PORT,
    dbConfig: {
        user: DB_USER,
        password: DB_PASS,
        host: DB_HOST,
        port: DB_PORT,
    }
}
