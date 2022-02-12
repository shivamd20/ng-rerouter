
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import Indexroute_4 from "./index.route";
import Item1route_5 from "./item1.route";
import { routeConfig as Item1route_5_routeConfig } from "./item1.route";
import Item2route_6 from "./item2.route";
import { routeConfig as Item2route_6_routeConfig } from "./item2.route";
import Indexroute_7 from "./second/first/nested/index.route";
import Item1route_8 from "./second/first/nested/item1.route";
import { routeConfig as Item1route_8_routeConfig } from "./second/first/nested/item1.route";
import Item2route_9 from "./second/first/nested/item2.route";
import { routeConfig as Item2route_9_routeConfig } from "./second/first/nested/item2.route";

const routes: Routes = [
    {
        path: "",
        component: Indexroute_4
    },
    {
        path: "item1",
        component: Item1route_5,
        ...Item1route_5_routeConfig
    },
    {
        path: "item2",
        component: Item2route_6,
        ...Item2route_6_routeConfig
    },
    {
        path: "second/first/nested",
        component: Indexroute_7
    },
    {
        path: "second/first/nested/item1",
        component: Item1route_8,
        ...Item1route_8_routeConfig
    },
    {
        path: "second/first/nested/item2",
        component: Item2route_9,
        ...Item2route_9_routeConfig
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class RoutingModule { }
