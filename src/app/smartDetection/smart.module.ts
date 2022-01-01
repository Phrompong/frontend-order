import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { DxButtonModule } from "devextreme-angular";
import { DxDataGridModule } from "devextreme-angular";
import { DxLoadPanelModule, DxCheckBoxModule } from "devextreme-angular";
import { SmartFaceComponent } from "./smart-face/smart-face.component";
import { SmartRoutes } from "./smart-routing";
import { SmartLprComponent } from "./smart-lpr/smart-lpr.component";
import { SmartAlertComponent } from "./smart-alert/smart-alert.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SmartRoutes),
    FormsModule,
    MaterialModule,
    DxButtonModule,
    DxDataGridModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
  declarations: [SmartFaceComponent, SmartLprComponent, SmartAlertComponent],
})
export class SmartModule {}
