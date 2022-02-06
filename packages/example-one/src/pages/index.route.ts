import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  template: `data: <div>{{data}}</div>`
})
export default class RouteComponent{
  data: any;

  constructor(route: ActivatedRoute) {
    route.data.subscribe( d => {
      this.data = (d['title']);
    } );
  }


}

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule]
})
class Module{}

export const routeConfig: Partial<Route> = {
  data: {
    title: 'ramesh'
  }
};

