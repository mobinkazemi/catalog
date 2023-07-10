import { FilterBaseDto } from "src/common/dto/request-filter-base.dto";

export class FilterUserDto extends FilterBaseDto{
    username?:string;
    roles?:Array<string>;

    constructor(data){
        super(data);
        this.username = data.username;
        this.roles = data.roles;
    }
}