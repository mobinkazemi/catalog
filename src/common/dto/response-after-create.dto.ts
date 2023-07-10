export class ResponseAfterCreateDto {
    id?:string;

    constructor(data:any){
        this.id = data.id || data?._id?.toString() || null;
    }
}