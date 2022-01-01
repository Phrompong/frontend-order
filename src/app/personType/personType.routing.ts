import { Routes } from "@angular/router";
import { PersonTypeComponent } from "./personType.component";

export const PersonTypeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: PersonTypeComponent,
      },
    ],
  },
];
