export class CreateResponseDto {
    id?:string;

    constructor(data:any){
        this.id = data.id || data?._id?.toString() || null;
    }
}