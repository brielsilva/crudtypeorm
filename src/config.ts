import {registerAs} from '@nestjs/config';

export default registerAs('config',() => ({
    JWT_ACCESS_TOKEN_SECRET: process.env. JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    DATABASE_TYPE: process.env.DATABASE_TYP,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT:process.env.DATABASE_PORT,
    DATABASE_PASSWORD:process.env.DATABASE_PASSWORD,
    DATABASE_USERNAME:process.env.DATABASE_USERNAME,
    DATABASE_DB:process.env.DATABASE_DB,
    SENDGRID_USER:process.env.SENDGRID_USER,
    SENDGRID_PASS:process.env.SENDGRID_PASS,
}))