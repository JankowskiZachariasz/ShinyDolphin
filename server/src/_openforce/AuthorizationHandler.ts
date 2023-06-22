import * as dotenv from 'dotenv'
dotenv.config()
import { publicProcedure, router } from '../server'
import { TRPCError } from '@trpc/server';
import crypto from 'crypto'
import { z } from 'zod';
var jwt = require('jsonwebtoken');

const JWT_CLAIM_MFA = 'JWT_CLAIM_MFA'
const JWT_CLAIM_AUTHENTICATED = 'JWT_CLAIM_AUTHENTICATED'

const AuthorizationHandler = router({

    login: publicProcedure.input(z.object({
        email: z.string(), 
        password: z.string()})).query(async ({ input }) => {
            console.log('Started executing request');
            console.log('C1');
            const CRYPTO_KEY = process.env.CRYPTO_KEY? process.env.CRYPTO_KEY : null;
            const CRYPTO_IV = process.env.CRYPTO_IV? process.env.CRYPTO_IV : null;
            if(!CRYPTO_KEY || !CRYPTO_IV){
                throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
            }
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(CRYPTO_KEY), CRYPTO_IV);
    })
});

export default AuthorizationHandler;