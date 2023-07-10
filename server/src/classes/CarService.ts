import Database from '../_openforce/Database'
import CarSelector from './CarSelector'
import { ControllerUtility as CtrlUtil } from '../_openforce/ControllerUtility'

export class CarService{

    private db : Database;

    constructor(db : Database){
        this.db = db;
    }

    public async getCars(){
        const carSelector = new CarSelector(this.db);
        return await carSelector.selectAllCars();
    }
}