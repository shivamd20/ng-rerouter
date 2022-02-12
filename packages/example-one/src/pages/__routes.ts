
import { Routes } from '@angular/router';
import Indexroute_0 from "./index.route";
import { routeConfig as Indexroute_0_routeConfig } from "./index.route";
import Item1route_1 from "./item1.route";
import { routeConfig as Item1route_1_routeConfig } from "./item1.route";
import Item2route_2 from "./item2.route";
import { routeConfig as Item2route_2_routeConfig } from "./item2.route";
import Oneroute_3 from "./one.route";
import { routeConfig as Oneroute_3_routeConfig } from "./one.route";
import Tworoute_10 from "./nested/two.route";
import { routeConfig as Tworoute_10_routeConfig } from "./nested/two.route";
import Indexroute_11 from "./second/first/nested/index.route";
import Item1route_12 from "./second/first/nested/item1.route";
import { routeConfig as Item1route_12_routeConfig } from "./second/first/nested/item1.route";
import Item2route_13 from "./second/first/nested/item2.route";
import { routeConfig as Item2route_13_routeConfig } from "./second/first/nested/item2.route";
import Indexroute_14 from "./second/first/nested/ramu/first/nested/index.route";
import Item1route_15 from "./second/first/nested/ramu/first/nested/item1.route";
import { routeConfig as Item1route_15_routeConfig } from "./second/first/nested/ramu/first/nested/item1.route";
import Item2route_16 from "./second/first/nested/ramu/first/nested/item2.route";
import { routeConfig as Item2route_16_routeConfig } from "./second/first/nested/ramu/first/nested/item2.route";
import Indexroute_17 from "./second/first/nested/ramu/first/nested/second/first/nested/index.route";
import Item1route_18 from "./second/first/nested/ramu/first/nested/second/first/nested/item1.route";
import { routeConfig as Item1route_18_routeConfig } from "./second/first/nested/ramu/first/nested/second/first/nested/item1.route";
import Item2route_19 from "./second/first/nested/ramu/first/nested/second/first/nested/item2.route";
import { routeConfig as Item2route_19_routeConfig } from "./second/first/nested/ramu/first/nested/second/first/nested/item2.route";
import Routes_1 from "./first/nested/__routes";

export const routes: Routes = [
    {
        path: "",
        component: Indexroute_0,
        ...Indexroute_0_routeConfig
    },
    {
        path: "item1",
        component: Item1route_1,
        ...Item1route_1_routeConfig
    },
    {
        path: "item2",
        component: Item2route_2,
        ...Item2route_2_routeConfig
    },
    {
        path: "one",
        component: Oneroute_3,
        ...Oneroute_3_routeConfig
    },
    {
        path: "nested/two",
        component: Tworoute_10,
        ...Tworoute_10_routeConfig
    },
    {
        path: "second/first/nested",
        component: Indexroute_11
    },
    {
        path: "second/first/nested/item1",
        component: Item1route_12,
        ...Item1route_12_routeConfig
    },
    {
        path: "second/first/nested/item2",
        component: Item2route_13,
        ...Item2route_13_routeConfig
    },
    {
        path: "second/first/nested/ramu/first/nested",
        component: Indexroute_14
    },
    {
        path: "second/first/nested/ramu/first/nested/item1",
        component: Item1route_15,
        ...Item1route_15_routeConfig
    },
    {
        path: "second/first/nested/ramu/first/nested/item2",
        component: Item2route_16,
        ...Item2route_16_routeConfig
    },
    {
        path: "second/first/nested/ramu/first/nested/second/first/nested",
        component: Indexroute_17
    },
    {
        path: "second/first/nested/ramu/first/nested/second/first/nested/item1",
        component: Item1route_18,
        ...Item1route_18_routeConfig
    },
    {
        path: "second/first/nested/ramu/first/nested/second/first/nested/item2",
        component: Item2route_19,
        ...Item2route_19_routeConfig
    },
    {
        path: "first/nested",
        loadChildren: () => import("./first/nested/__routes").then(m => m.default)
    }
];
