import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  template: `data:
  <div>two</div>
  `
})
export default class RouteComponent {
  data: any;

  constructor(route: ActivatedRoute) {

  }
}

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule]
})
class Module {
}

export const routeConfig: Partial<Route> = {
  data: {
    title: 'ramesh'
  }
};

