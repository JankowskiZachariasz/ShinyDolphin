import { router } from '../server'
import { z } from 'zod';
import Database from '../_openforce/Database'
import { ControllerUtility as CtrlUtil } from '../_openforce/ControllerUtility'
import { CarService } from './CarService'

export const CarController = router({

    getCars: CtrlUtil.anyAuthenticatedUserProcedure.mutation(async function() {
        try{
            return await Database.runUserContextTransaction('xddddd', async (db) => {
                let authService = new CarService(db);
                return await authService.getCars()
            });
        }
        catch(e : any){CtrlUtil.handleException(e);}
    }),

})