import { Routes } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { LoginComponent } from "./login/login.component";
import { PersonTypeComponent } from "./personType/personType.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "dashboard",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "personType",
    redirectTo: "personType",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: "./dashboard/dashboard.module#DashboardModule",
      },
      {
        path: "reports",
        loadChildren: "./reports/reports.module#ReportsModule",
      },
      {
        path: "personType",
        loadChildren: "./personType/personType.module#PersonTypeModule",
      },
      {
        path: "system",
        loadChildren: "./system/system.module#SystemModule",
      },
      {
        path: "smartDetections",
        loadChildren: "./smartDetection/smart.module#SmartModule",
      },
      {
        path: "widgets",
        loadChildren: "./widgets/widgets.module#WidgetsModule",
      },
      {
        path: "tables",
        loadChildren: "./tables/tables.module#TablesModule",
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "pages",
        loadChildren: "./pages/pages.module#PagesModule",
      },
    ],
  },
];
