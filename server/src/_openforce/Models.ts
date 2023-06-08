import Prisma from '@prisma/client'

export interface SObject{_modelName : Prisma.Prisma.ModelName}
export type User = Partial<Prisma.User> & SObject;
export type Car = Partial<Prisma.Car> & SObject;

