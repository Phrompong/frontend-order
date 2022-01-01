import { Routes } from "@angular/router";

import { SystemComponent } from "./system.component";

export const SystemRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SystemComponent,
      },
    ],
  },
];
