import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './index.route.html'
})
export default class RouteComponent {
  data: any;

  constructor(route: ActivatedRoute) {
    route.data.subscribe(d => {
      this.data = (d['title']);
    });
  }


}

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule, RouterModule]
})
class Module {
}

export const routeConfig: Partial<Route> = {
  data: {
    title: 'ramesh'
  }
};

export const outletConfig = {
  root: true,
  lazy: true
};
