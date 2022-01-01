import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { PersonTypeComponent } from "./personType.component";
import { PersonTypeRoutes } from "./personType.routing";
import { DxDataGridModule } from "devextreme-angular";

@NgModule({
  imports: [
    RouterModule.forChild(PersonTypeRoutes),
    CommonModule,
    FormsModule,
    MaterialModule,
    DxDataGridModule,
  ],
  declarations: [PersonTypeComponent],
})
export class PersonTypeModule {}
