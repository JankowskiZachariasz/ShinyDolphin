import * as dotenv from 'dotenv'
dotenv.config()
import { publicProcedure, router, prisma } from '../server'
import { TRPCError } from '@trpc/server';
import crypto from 'crypto'
import { z } from 'zod';
var jwt = require('jsonwebtoken');

const JWT_CLAIM_MFA = 'JWT_CLAIM_MFA'
const JWT_CLAIM_AUTHENTICATED = 'JWT_CLAIM_AUTHENTICATED'

const AuthorizationHandler = router({

    login: publicProcedure.input(z.object({
        email: z.string(), 
        password: z.string()})).query(async ({ input }): Promise<{token: string|null, mfaToken: string|null, status: string, email: string}> => {
            let retrievedUser = await prisma.user.findFirst({select: {email: true, password: true, mfaRequired: true, role: true}, where: {email: input.email}});
            if(!retrievedUser){
                throw new TRPCError({code: 'UNAUTHORIZED', message: 'Invalid Credentials' });
            }
            const CRYPTO_KEY = process.env.CRYPTO_KEY? process.env.CRYPTO_KEY : null;
            const CRYPTO_IV = process.env.CRYPTO_IV? process.env.CRYPTO_IV : null;
            if(!CRYPTO_KEY || !CRYPTO_IV){
                throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
            }
            let encryptedText = Buffer.from(retrievedUser.password, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(CRYPTO_KEY), CRYPTO_IV);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            if(decrypted.toString() !== input.password){
                throw new TRPCError({code: 'UNAUTHORIZED', message: 'Invalid Credentials' });
            }
            const JWT_KEY_PRIVATE = process.env.JWT_KEY_PRIVATE?.replace(/\\n/g, '\n');
            if(retrievedUser.mfaRequired){
                const mfaToken = jwt.sign({ claims: JWT_CLAIM_MFA, role: '', email: input.email, password: input.password }, JWT_KEY_PRIVATE, 
                    { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: 60*60 });
                return {token: null, mfaToken, status: 'pending', email: retrievedUser.email};
                //let decoded = jwt.verify(toReturn, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true });
            }
            const token = jwt.sign({ claims: JWT_CLAIM_AUTHENTICATED, role: retrievedUser.role, email: input.email }, JWT_KEY_PRIVATE, 
                { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: 60*60 });
            return {token, mfaToken: null, status: 'success', email: retrievedUser.email};
    })
});

export default AuthorizationHandler;