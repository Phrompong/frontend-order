import { Routes } from "@angular/router";
import { SmartFaceComponent } from "./smart-face/smart-face.component";
import { SmartLprComponent } from "./smart-lpr/smart-lpr.component";
import { SmartAlertComponent } from "./smart-alert/smart-alert.component";


export const SmartRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "smartFace",
        component: SmartFaceComponent,
      },
    ],
  },
  {
    path: "",
    children: [
      {
        path: "smartAlert",
        component: SmartAlertComponent,
      },
    ],
  },
  {
    path: "",
    children: [
      {
        path: "smartLpr",
        component: SmartLprComponent,
      },
    ],
  },
];
