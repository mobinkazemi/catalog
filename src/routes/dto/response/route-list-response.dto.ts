import { Route } from 'src/routes/schema/routes.schema';

export class RouteListResponse extends Route {
  constructor(data: Partial<Route>) {
    super();

    this._id = data._id;
    this.path = data.path;
    this.method = data.method;
    this.isPublic = data.isPublic;
    this.roles = data.roles;
  }
}
