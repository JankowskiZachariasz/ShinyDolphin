
import type { availableProviders } from '../../server/src/_openforce/UserProvisioningService'

export type SessionTokenPayload = {
    id : string | undefined
    firstName : String | undefined
    lastName : String | undefined
    email : String | undefined
    authProvider : String | undefined
    role : String | undefined
    picture : String | undefined | null
    sessionId? : string
}

export type ProvisionUserTokenPayload = {
    email : string,
    authProvider : availableProviders,
    firstName : string,
    lastName : string,
    picture? : string,
}