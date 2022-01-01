import { Component, OnInit, AfterViewInit } from "@angular/core";
import { TableData } from "../md/md-table/md-table.component";
import { LegendItem, ChartType } from "../md/md-chart/md-chart.component";
import { io } from "socket.io-client";

import * as Chartist from "chartist";
import { environment } from "src/environments/environment";
import axios from "axios";

declare const $: any;
@Component({
  selector: "app-personType",
  templateUrl: "./personType.component.html",
  styleUrls: ["./personType.component.css"],
})
export class PersonTypeComponent implements OnInit {
  personTypeData: any[] = [];
  index: number = 0;
  socket;
  digit: string = "00";
  path = environment.service_uri;

  constructor() {
    // this.socket = io(environment.socket_endpoint, {
    //   reconnectionDelayMax: 10000,
    // });
  }

  ngOnInit() {
    setInterval(() => {
      console.log("test");
      console.log(
        this.path +
          `/api/v1/faceImage?startDate=` +
          1614531600 +
          `&endDate=` +
          1616778000
      );
      axios
        .get(
          this.path +
            `/api/v1/faceImage?startDate=` +
            1614531600 +
            `&endDate=` +
            1616778000
        )
        .then((res: any) => {
          console.log(res.data.data);
          this.personTypeData = res.data.data;
        })
        .catch((err) => {
          console.log("Catch");
          console.log(err.message);
        });
    }, 1 * 1000);
  }

  convertDigit(data: number) {
    return `${this.digit.substr(
      0,
      this.digit.length - data.toString().length
    )}${data}`;
  }

  initPersonType() {}
}
