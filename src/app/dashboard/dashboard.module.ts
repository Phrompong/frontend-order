import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdModule } from "../md/md.module";
import { MaterialModule } from "../app.module";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { LprComponent } from "./lpr/lpr.component";
import { FaceComponent } from "./face/face.component";
import { StatisticComponent } from "./statistic/statistic.component";
import { AlertComponent } from "./alert/alert.component";
import {
  DxButtonModule,
  DxPopupModule,
  DxDataGridModule,
  DxScrollViewModule,
  DxLoadPanelModule,
} from "devextreme-angular";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    MdModule,
    MaterialModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    DxScrollViewModule,
    DxLoadPanelModule,
  ],
  declarations: [
    DashboardComponent,
    FaceComponent,
    LprComponent,
    StatisticComponent,
    AlertComponent,
  ],
})
export class DashboardModule {}
