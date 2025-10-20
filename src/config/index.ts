import { config } from "dotenv";

config();

export default {
    PORT: Number(process.env.PORT),
    DEV_DB_URL: (process.env.DEV_DB_URL) as string,
    ACCESTOKEN_KEY: process.env.ACCESTOKEN_KEY as string,
    ACCESTOKEN_TIME: process.env.ACCESTOKEN_TIME as string,
    RERESHTOKEN_KEY: process.env.RERESHTOKEN_KEY as string,
    RERESHTOKEN_TIME: process.env.RERESHTOKEN_TIME as string,
    SP_ADMIN_LOGIN: process.env.SP_ADMIN_LOGIN as string,
    SP_ADMIN_PASSWORD: process.env.SP_ADMIN_PASSWORD as string
}