import { Labels as Labels_de } from './Label_de'

export const Labels : { [key : string]: {en:string, pl:string, de?:any}} = {
    SD_helloWorld: {
        en:'Easy-Peasy',
        pl:'Prościzna'
    },
    example2: {
        en:'car',
        pl:'samochód'
    }
};

Object.keys(Labels).forEach(label => {
    Labels[label].de = Labels_de[label]?.de;
})

export const LabelsUsage = {
    '/{0}': {SD_helloWorld: Labels.SD_helloWorld},
    '/{0}/services': {SD_helloWorld: Labels.SD_helloWorld},
}