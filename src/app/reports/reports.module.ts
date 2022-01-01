import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { DxLoadPanelModule, DxCheckBoxModule } from "devextreme-angular";

import { ReportsRoutes } from "./reports-routing";
import { FaceReportComponent } from "./face-report/face-report.component";
import { LprReportComponent } from "./lpr/lpr-report.component";
import { AlertReportComponent } from "./alert/alert-report.component";

import { DxButtonModule } from "devextreme-angular";
import { DxDataGridModule } from "devextreme-angular";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    FormsModule,
    MaterialModule,
    DxButtonModule,
    DxDataGridModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
  declarations: [FaceReportComponent, LprReportComponent, AlertReportComponent],
})
export class ReportsModule {}
