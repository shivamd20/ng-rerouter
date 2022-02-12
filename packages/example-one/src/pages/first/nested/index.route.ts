import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  template: `pages/nested/index.ts

  <router-outlet></router-outlet>


  `
})
export default class C {

}

@NgModule({
  declarations: [C],
  imports: [RouterModule]
})
class Module {
}
