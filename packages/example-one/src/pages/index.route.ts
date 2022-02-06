import { Component, NgModule } from '@angular/core';
import { Route } from '@angular/router';
@Component({
  template: `root`
})
export default class RouteComponent{
}

@NgModule({
  declarations: [RouteComponent]
})
class Module{}

export const routeConfig: Partial<Route> = {
  data: {
    title: 'ramesh'
  }
};

