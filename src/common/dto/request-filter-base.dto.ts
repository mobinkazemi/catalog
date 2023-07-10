export class FilterBaseDto {
    id:string;
    createdAt?:Date;
    updatedAt?:Date
    deletedAt?: Date;

    constructor(data:any){
        this.id = data.id || data?._id?.toString() || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
        this.deletedAt = data.deletedAt || null;
    }
}