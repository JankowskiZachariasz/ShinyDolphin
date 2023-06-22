import { LabelsUsage } from '../../../server/src/metadata/Label'
import {supportedLocales} from '../middleware'

export const getFilesystemLabelsForRoute = (route : keyof typeof LabelsUsage, locale : string | undefined | string[]) => {
    //@ts-ignore
    let toReturn : {[key in keyof typeof LabelsUsage[typeof route]] : string} = {};
    Object.keys(LabelsUsage[route]).forEach(key => {
        //@ts-ignore
        toReturn[key] = LabelsUsage?.[route]?.[key]?.[locale]
    })
    return toReturn;
}