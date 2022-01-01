import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as Chartist from "chartist";
import { TableData } from "src/app/md/md-table/md-table.component";
import Chart from "chart.js";
import axios from "axios";
import { environment } from "src/environments/environment";
import {
  combineLatest,
  throwError,
  Timestamp,
  VirtualTimeScheduler,
} from "rxjs";
import {
  DataFace,
  DataTrackFace,
  Data_lpr,
  lpr_detail,
} from "src/app/models/trackFace.model";
import Swal from "sweetalert2";
import { EventListenerFocusTrapInertStrategy } from "@angular/cdk/a11y";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { dateInputsHaveChanged } from "@angular/material/datepicker/datepicker-input-base";

declare const $: any;

@Component({
  selector: "app-face",
  templateUrl: "./lpr-report.component.html",
  styleUrls: ["./lpr-report.component.css"],
})
export class LprReportComponent implements OnInit {
  simpleSlider = 40;
  //path = `http://514fbc3638d2.ngrok.io`;
  path = environment.service_uri;
  countryData: any[];
  brandData: any[];
  modelData: any[];
  vehicleColorData: any[];
  plateNumberData: any[];
  skinData: any[];
  typeData: any[];
  hairData: any[];
  itemData: any[];
  doubleSlider = [20, 60];
  dataLpt: Data_lpr[];
  dataD: lpr_detail;

  lprReportData: any[];
  regularItems = ["Pizza", "Pasta", "Parmesan"];
  touch: boolean;
  startDateV: any;
  endDateV: any;
  selectedValue: string;
  currentCity: string[];
  plateNumber = "";
  vehicleColor = "";
  model = "";
  make = "";
  country = "";
  vehicleList = "";
  meta: any;
  cPage = "1";
  cPages = 10000;
  vehicleListData: any[];
  laneNameData: any[];
  laneName = "";
  loadingVisible = false;

  selectTheme = "primary";
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  public ngOnInit() {
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() - 1 + 1, 0);
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    this.startDateV = startDate;
    this.endDateV = startDate;

    this.initMasterBrand();
    this.initMasterCountry();
    this.initMasterModel();
    this.initMasterColor();
    this.initMasterPlateNumber();
    this.initMasterVehicleList();
    this.initMasterLanename();

    this.getDataLpr(+startDate, +endDate, "", "", "", "", "", "", 1);
  }

  search(e) {
    this.loadingVisible = true;
    //console.log(e.startDate );
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;
    this.startDateV = e.startDate;
    this.endDateV = e.endDate;
    this.country = e.country;
    this.make = e.make;
    this.model = e.model;
    this.vehicleColor = e.vehicleColor;
    this.plateNumber = e.plateNumber;
    this.vehicleList = e.vehicleList;
    this.laneName = e.laneName;

    if (e.startDate != undefined && e.endDate != undefined) {
      //this.getDataLpr(startDate, endDate);
      //console.log(startDate);
      axios
        .get(
          this.path +
            `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}` +
            `&country=${e.country}&make=${e.make}&model=${e.model}&vehicleColor=${e.vehicleColor}` +
            `&plateNumber=${e.plateNumber}&vehicleList=${e.vehicleList}&laneName=${e.laneName}&page=1&limit=10`
          //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`
        )
        .then((res: any) => {
          // this.dataD = res.data.data.lpr[0];
          // this.dataLpt = this.dataD.lpr;
          // console.log(res.data.data);
          this.meta = res.data.data._metadata;
          // this.cPage = this.meta.page.toString();
          // this.cPages = this.meta.pages;
          let lprData = res.data.data.lpr;
          this.cPage = this.meta.page.toString();
          //this.cPages = this.meta.pages;
          let no = 1;
          let obj: any[] = [];
          for (const result of lprData) {
            obj.push({
              no: no++,
              ...result,
            });
          }
          //console.log(obj);
          this.lprReportData = obj;

          // if (e.country != undefined && e.country != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.country == e.country
          //   );
          // }
          // if (e.make != undefined && e.make != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.make == e.make
          //   );
          // }
          // if (e.model != undefined && e.model != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.model == e.model
          //   );
          // }
          // if (e.vehicleColor != undefined && e.vehicleColor != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.vehicleColor == e.vehicleColor
          //   );
          // }
          // if (e.plateNumber != undefined && e.plateNumber != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.vehicleColor == e.plateNumber
          //   );
          // }
          console.log("data response report page");
          this.loadingVisible = false;
          //console.log(this.lprReportData);
        })
        .catch((err) => {
          console.log(err.message);
          this.loadingVisible = false;
        });
    } else {
      startDate = +new Date().setHours(0, 0, 0, 0);
      endDate = +new Date().setHours(23, 59, 59, 999);
      // this.getDataLpr(startDate, endDate);
      axios
        .get(
          this.path +
            `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}` +
            `&country=${e.country}&make=${e.make}&model=${e.model}&vehicleColor=${e.vehicleColor}` +
            `&plateNumber=${e.plateNumber}&vehicleList=${e.vehicleList}&page=1&limit=10`
          //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`
        )
        .then((res: any) => {
          this.dataD = res.data.data.lpr[0];
          this.dataLpt = this.dataD.lpr;
          this.meta = res.data.data._metadata;
          let lprData = res.data.data.lpr;
          this.cPage = this.meta.page.toString();
          //this.cPages = this.meta.pages;
          let no = 1;
          let obj: any[] = [];
          for (const result of lprData) {
            obj.push({
              no: no++,
              ...result,
            });
          }

          this.lprReportData = obj;

          // if (e.country != undefined && e.country != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.country == e.country
          //   );
          // }
          // if (e.make != undefined && e.make != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.make == e.make
          //   );
          // }
          // if (e.model != undefined && e.model != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.model == e.model
          //   );
          // }
          // if (e.vehicleColor != undefined && e.vehicleColor != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.vehicleColor == e.vehicleColor
          //   );
          // }
          // if (e.plateNumber != undefined && e.plateNumber != "") {
          //   this.lprReportData = this.lprReportData.filter(
          //     (w) => w.vehicleColor == e.plateNumber
          //   );
          // }
          console.log("data response report page");
          this.loadingVisible = false;
          //console.log(this.lprReportData);
        })
        .catch((err) => {
          this.loadingVisible = false;
          console.log(err.message);
        });
    }
  }

  changePage(event) {
    console.log(event.value);
    console.log(this.country);
    this.loadingVisible = true;
    axios
      .get(
        this.path +
          `/api/v1/lpr?startDate=${+this.startDateV}&endDate=${+this
            .endDateV}` +
          `&country=${this.country}&make=${this.make}&model=${this.model}&vehicleColor=${this.vehicleColor}` +
          `&plateNumber=${this.plateNumber}&vehicleList=${
            this.vehicleList
          }&page=${+event.value}&limit=10`
        //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`
      )
      .then((res: any) => {
        this.meta = res.data.data._metadata;
        // this.cPage = this.meta.page.toString();
        // this.cPages = this.meta.pages;
        let lprData = res.data.data.lpr;
        this.cPage = this.meta.page.toString();
        //this.cPages = this.meta.pages;
        let no = 1 + (+event.value - 1) * 10;
        let obj: any[] = [];
        for (const result of lprData) {
          obj.push({
            no: no++,
            ...result,
          });
        }
        console.log(obj);
        this.lprReportData = obj;
        console.log("data response report page");
        this.loadingVisible = false;
        //console.log(this.lprReportData);
      })
      .catch((err) => {
        console.log(err.message);
        this.loadingVisible = false;
      });
  }

  getDataLpr(
    startDate,
    endDate,
    country,
    make,
    model,
    vehicleColor,
    plateNumber,
    vehicleList,
    page
  ) {
    this.loadingVisible = true;

    axios
      .get(
        this.path +
          `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}` +
          `&country=${country}&make=${make}&model=${model}&vehicleColor=${vehicleColor}` +
          `&plateNumber=${plateNumber}&vehicleList=${vehicleList}&page=${page}&limit=10`
        //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`
        // `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`
      )
      .then((res: any) => {
        // this.dataD = res.data.data.lpr[0];
        // this.dataLpt = this.dataD.lpr;
        // console.log(res.data.data);
        this.meta = res.data.data._metadata;
        // this.cPage = this.meta.page.toString();
        // this.cPages = this.meta.pages;
        let lprData = res.data.data.lpr;
        this.cPage = this.meta.page.toString();
        //this.cPages = 10;
        let no = 1;
        let obj: any[] = [];
        for (const result of lprData) {
          obj.push({
            no: no++,
            ...result,
          });
        }
        //console.log(obj);
        this.lprReportData = obj;
        this.loadingVisible = false;
      })
      .catch((err) => {
        console.log(err.message);
        this.loadingVisible = false;
      });
  }

  initSkin() {
    //skin
    axios
      .get(this.path + `/api/v1/master/skin`)
      .then((res: any) => {
        this.skinData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initType() {
    //type
    axios
      .get(this.path + `/api/v1/master/type`)
      .then((res: any) => {
        this.typeData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initHairStyle() {
    //Hair
    axios
      .get(this.path + `/api/v1/master/hairStyle`)
      .then((res: any) => {
        this.hairData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end Hair
  }

  initItem() {
    //item
    axios
      .get(this.path + `/api/v1/master/item`)
      .then((res: any) => {
        this.itemData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end item
  }

  initMasterCountry() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=country`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }
        this.countryData = obj;
        //console.log(this.brandData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterBrand() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=make`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }
        this.brandData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterModel() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=model`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }

        this.modelData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterColor() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=vehicleColor`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }

        this.vehicleColorData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterPlateNumber() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=plateNumber`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }
        this.plateNumberData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterVehicleList() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=vehicleList`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }

        this.vehicleListData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initMasterLanename() {
    axios
      .get(this.path + `/api/v1/lpr/normal?feild=laneName`)
      .then((res: any) => {
        let obj: any = [];

        for (const data of res.data.data) {
          if (data) {
            obj.push(data);
          }
        }

        this.laneNameData = obj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  onClickClear() {
    this.plateNumber = "";
    this.vehicleColor = "";
    this.model = "";
    this.make = "";
    this.country = "";
    this.endDateV = "";
    this.startDateV = "";
    this.vehicleList = "";
  }
  counter(i: number) {
    return new Array(i);
  }
}
