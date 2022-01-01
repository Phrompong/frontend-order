import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { environment } from "src/environments/environment";
import { DxButtonModule } from "devextreme-angular";
import axios from "axios";

declare var $: any;

@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, OnDestroy {
  path = environment.service_uri;
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  username: string = "";
  orderData: any;
  constructor(private element: ElementRef, private router: Router) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.getOrder();
  }

  sidebarToggle() {
    // var toggleButton = this.toggleButton;
    // var body = document.getElementsByTagName("body")[0];
    // var sidebar = document.getElementsByClassName("navbar-collapse")[0];
    // if (this.sidebarVisible == false) {
    //   setTimeout(function () {
    //     toggleButton.classList.add("toggled");
    //   }, 500);
    //   body.classList.add("nav-open");
    //   this.sidebarVisible = true;
    // } else {
    //   this.toggleButton.classList.remove("toggled");
    //   this.sidebarVisible = false;
    //   body.classList.remove("nav-open");
    // }
  }

  ngOnDestroy() {
    // const body = document.getElementsByTagName("body")[0];
    // body.classList.remove("login-page");
    // body.classList.remove("off-canvas-sidebar");
  }

  login(username, password) {
    if (username == "admin" && password == "admin123.") {
      this.router.navigate(["/dashboard"]);
    } else {
      alert("Unable to login");
    }
    // axios
    //   .post(this.path + `/api/v1/rbac`, {
    //     username: username,
    //     password: password,
    //   })
    //   .then((res: any) => {
    //     alert("Login success");
    //     this.router.navigate(["/dashboard"]);
    //   })
    //   .catch((err) => {
    //     alert("Unable to login");
    //   });
  }

  getOrder() {
    axios
      .get(`https://134.209.108.248:3000/api/v1/transaction`)
      .then((res: any) => {
        this.orderData = res.data.data;
        console.log(this.orderData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}
