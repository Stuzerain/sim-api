import { AppConfig } from "../types";

export const config: AppConfig = {
    port: 3000,
    dbConfig: {
        user: "postgres",
        password: "local_pass",
        host: "0.0.0.0",
        port: 5432,
    }
}
