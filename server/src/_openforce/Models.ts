import Prisma from '@prisma/client'

export interface SObject{_modelName : Prisma.Prisma.ModelName, id? : string}
export type Car = Partial<Prisma.Car> & SObject;
export type Label__mtd = Partial<Prisma.Label__mtd> & SObject;
export type User = Partial<Prisma.User> & SObject & {sessions? : Array<Session>, individual? : Individual};
export type Session = Partial<Prisma.Session> & SObject;
export type Individual = Partial<Prisma.Individual> & SObject;