import { FilterBaseRequestDto } from 'src/common/dto/request-filter-base.dto';
import { BaseResponseFilterDto } from 'src/common/dto/response-filter-base.dto';

export class FilterRequestUserDto extends FilterBaseRequestDto {
  username?: string;
  roles?: Array<string>;

  constructor(data) {
    super(data);
    data.username ? (this.username = data.username) : null;
    data.roles ? (this.roles = data.roles) : null;
  }
}

export class UserResponseListDto extends BaseResponseFilterDto {
  username?: string;
  roles?: Array<string>;

  constructor(data) {
    super(data);
    this.username = data.username;
    this.roles = data.roles;
  }
}
