import { Routes } from "@angular/router";
import { FaceReportComponent } from "./face-report/face-report.component";
import { LprReportComponent } from "./lpr/lpr-report.component";
import { AlertReportComponent } from "./alert/alert-report.component";
export const ReportsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "faceAnalysisReport",
        component: FaceReportComponent,
      },
    ],
  },
  {
    path: "",
    children: [
      {
        path: "alertReport",
        component: AlertReportComponent,
      },
    ],
  },
  {
    path: "",
    children: [
      {
        path: "lprReport",
        component: LprReportComponent,
      },
    ],
  },
];
