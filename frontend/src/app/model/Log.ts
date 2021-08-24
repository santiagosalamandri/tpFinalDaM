export class Log{
    private _logId: number;
    private _fecha: Date; 
    private _apertura: number;
    private _electrovalvulaId: number;

    constructor(log,fecha,apertura,electrovalvulaId){
        this._logId=log;
        this._fecha=fecha;
        this._apertura=apertura;
        this._electrovalvulaId=electrovalvulaId;
    }

    public get logId(): number {
        return this._logId;
    }
    public set logId(value: number) {
        this._logId = value;
    }

    public get fecha(): Date {
        return this._fecha;
    }
    public set fecha(value: Date) {
        this._fecha = value;
    }

    public get apertura(): number {
        return this._apertura;
    }
    public set apertura(value: number) {
        this._apertura = value;
    }
    
    public get electrovalvulaId(): number {
        return this._electrovalvulaId;
    }
    public set electrovalvulaId(value: number) {
        this._electrovalvulaId = value;
    }
}