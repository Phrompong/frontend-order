import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { SystemComponent } from "./system.component";
import { SystemRoutes } from "./system.routing";

@NgModule({
  imports: [
    RouterModule.forChild(SystemRoutes),
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [SystemComponent],
})
export class SystemModule {}
