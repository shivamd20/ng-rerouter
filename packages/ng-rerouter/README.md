# ng-rerouter
File base routing for angular

✅ Generates route configuration by reading your directory structure
<br>
✅ supports dynamic routes, wildcard routes
<br>
✅ Embraces upcoming standalone components
<br>
🚧 router outlet
<br>
🚧 Lazy loaded modules
<br>
🚧 Additional configuration (guards, resolvers, etc)

# Getting Started

* in your angular application, create a directory named `pages` in the `src` directory 
```bash
 mkdir src/pages
 ```
* create file `index.route.ts` in the `src/pages` directory

```ts
import { Component, NgModule } from '@angular/core';
@Component({
  template: `root`
})
export default class RouteComponent{
}
@NgModule({
  declarations: [RouteComponent]
})
class Module{}
```
* run `npx ng-rerouter --watch`

* `page.routing.ts` should be generated in the `src` directory

* import routes in AppModule 
```typescript
import {routes } from '../app/page.routing';
```

* use generated routes for your routing config
```typescript
    RouterModule.forRoot(routes)
```

# API
```
  -V, --version      output the version number
  --output <path>    output path for the generated routes (default: "src/page.routing.ts")
  --pageRoot <path>  pages dir (default: "src/pages")
  --tsconfig <path>  tsconfig of the angular application (default: "tsconfig.app.json")
  --watch [boolean]  watch for file changes (default: false)
  -h, --help         display help for command
```
