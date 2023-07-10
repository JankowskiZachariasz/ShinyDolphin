import * as dotenv from 'dotenv'
dotenv.config()
var jwt = require('jsonwebtoken');
import type { SessionTokenPayload } from '../../types/shared'
import { Users } from '../metadata/User'

class BackendTokenProvider{

    private static EXPIRY_OFFSET = 60 * 10; // 10 minutes
    private static TOKEN_VALIDITY = 1 * 24 * 60 * 60; // 1 day
    private static INTEGRATION_USER = Users.Next_Server;

    private _authorizationToken :string = '';
    private expires :number = 0;

    public get authorizationToken() :string {
        if(!this._authorizationToken){
            this._authorizationToken = this.regenerateToken();
            return this._authorizationToken;
        }
        if(BackendTokenProvider.isTokenExpired(this.expires)){
            this._authorizationToken = this.regenerateToken();
        }
        return this._authorizationToken;
    }

    private static isTokenExpired(validUntill : number): boolean {
        return (validUntill - BackendTokenProvider.EXPIRY_OFFSET) < (Date.now()/1000);
    }

    private regenerateToken(): string {
        //@ts-ignore
        const JWT_KEY_PRIVATE = process.env.JWT_KEY_PRIVATE.replace(/\\n/g, '\n');
        const tokenPayload: SessionTokenPayload = {
            id : BackendTokenProvider.INTEGRATION_USER.id,
            firstName : BackendTokenProvider.INTEGRATION_USER.firstName,
            lastName : BackendTokenProvider.INTEGRATION_USER.lastName,
            email : BackendTokenProvider.INTEGRATION_USER.email,
            authProvider : BackendTokenProvider.INTEGRATION_USER.authProvider,
            role : BackendTokenProvider.INTEGRATION_USER.role,
            picture : BackendTokenProvider.INTEGRATION_USER.picture,
            sessionId : ''//session requirement is bypassed for this user
        }
        this.expires = (Date.now()/1000) + BackendTokenProvider.TOKEN_VALIDITY;
        return jwt.sign(tokenPayload, JWT_KEY_PRIVATE, { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: BackendTokenProvider.TOKEN_VALIDITY});
    }
}

export default new BackendTokenProvider();