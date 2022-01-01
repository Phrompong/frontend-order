import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as Chartist from "chartist";
import { TableData } from "src/app/md/md-table/md-table.component";
import Chart from "chart.js";
import axios from "axios";
import { environment } from "src/environments/environment";
import { throwError, Timestamp, VirtualTimeScheduler } from "rxjs";
import { DataFace, DataTrackFace } from "src/app/models/trackFace.model";
import Swal from "sweetalert2";
import { EventListenerFocusTrapInertStrategy } from "@angular/cdk/a11y";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { dateInputsHaveChanged } from "@angular/material/datepicker/datepicker-input-base";
import { resolveSanitizationFn } from "@angular/compiler/src/render3/view/template";
import { metaType } from "src/app/models/masTer.model";
import { getJSON } from "jquery";
declare const $: any;

@Component({
  selector: "app-alert-report",
  templateUrl: "./alert-report.component.html",
  styleUrls: ["./alert-report.component.css"],
})
export class AlertReportComponent implements OnInit {
  //path = "http://localhost:3007";
  path = environment.service_uri;
  simpleSlider = 40;

  doubleSlider = [20, 60];

  regularItems = ["Pizza", "Pasta", "Parmesan"];
  touch: boolean;

  selectedValue: string;
  currentCity: string[];

  selectTheme = "primary";
  cities = [];

  //   public ngOnInit() {}
  // =======
  //doubleSlider = [20, 60];
  dataFace: DataFace[];
  //regularItems = ["Pizza", "Pasta", "Parmesan"];
  //touch: boolean;
  faceReportData: any[];
  //selectedValue: string;
  //currentCity: string[];
  skinData: any[];
  ageData: any[];
  typeData: any[];
  hairData: any[];
  itemData: any[];
  shirtColor: any[];
  currentType = "";
  currentSkin = "";
  currentGen = "";
  currentHair = "";
  currentItem = "";
  currentShirt = "";
  currentBottom = "";
  currentAge = "";
  currentGlass = "";
  currentSunglass = "";
  currentMask = "";
  currentHat = "";
  currentColor = "";
  currentButton = "";
  ageFromS = "";
  endDateV: Date;
  startDateV: Date;
  loadingVisible = false;

  //selectTheme = "primary";
  // cities = [
  //   { value: "paris-0", viewValue: "Paris" },
  //   { value: "miami-1", viewValue: "Miami" },
  //   { value: "bucharest-2", viewValue: "Bucharest" },
  //   { value: "new-york-3", viewValue: "New York" },
  //   { value: "london-4", viewValue: "London" },
  //   { value: "barcelona-5", viewValue: "Barcelona" },
  //   { value: "moscow-6", viewValue: "Moscow" },
  // ];

  public ngOnInit() {
    this.loadingVisible = true;
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    this.startDateV = startDate;
    this.endDateV = startDate;
    axios
      .get(
        this.path +
          `/api/v1/faceImage/realTime?startDate=` +
          +startDate +
          `&endDate=` +
          +endDate
      )
      .then((res: any) => {
        let obj: any[] = [];
        let no: number = 1;
        this.dataFace = res.data.data;
        let shirtColorData: any[] = [];
        for (const result of this.dataFace) {
          shirtColorData.push(result.meta.upper_body_color);
          obj.push({
            no: no++,
            channelName: result.channelName,
            createdDate: result.createdDate,
            faceImageUri: result.faceImageUri,
            screenImageUri: result.screenImageUri,
            name: result.name,
            similarity: result.similarity,
            personType: result.personType,
            meta: {
              age: result.meta.age.name,
              gender: {
                id: result.meta.gender.id,
                name: result.meta.gender.id == 0 ? "Female" : "Male",
              },
              skin_color: {
                id: result.meta.skin_color.id,
                name: result.meta.skin_color.name,
              },
              hairstyle: {
                id: result.meta.hairstyle.id,
                name: result.meta.hairstyle.name,
              },
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
          });
        }
        this.faceReportData = obj;
        console.log("data response report page");
        console.log(this.dataFace);
        this.loadingVisible = false;
      })
      .catch((err) => {
        console.log(err.message);
        this.loadingVisible = false;
      });

    //age
    axios
      .get(this.path + `/api/v1/master/age`)
      .then((res: any) => {
        this.ageData = res.data.data;
        console.log(this.ageData);
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end age

    //skin
    axios
      .get(this.path + `/api/v1/master/skin`)
      .then((res: any) => {
        this.skinData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end skin

    //type
    axios
      .get(this.path + `/api/v1/master/type`)
      .then((res: any) => {
        this.typeData = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end type

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

    //color
    axios
      .get(this.path + `/api/v1/master/color`)
      .then((res: any) => {
        this.shirtColor = res.data.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    // end item

    this.loadingVisible = false;
  }

  search(e) {
    this.loadingVisible = true;
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;

    axios
      .get(
        this.path +
          `/api/v1/faceImage/realTime?startDate=` +
          startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        this.dataFace = res.data.data;
        console.log(this.dataFace);
        if (e.Type != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.personType.id == e.Type
          );
        }
        if (e.Age.toString() != "") {
          //console.log(e.Age);
          this.dataFace = this.dataFace.filter((w) => w.meta.age.id == e.Age);
          //console.log(this.dataFace);
        }
        if (e.Skin != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.skin_color.id == e.Skin
          );
        }
        if (e.Hair != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.hairstyle.id == e.Hair
          );
        }
        if (e.Gender != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.gender.id == e.Gender
          );
        }

        if (e.Glass != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.glasses == e.Glass
          );
        }
        if (e.Sunglass != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.sunglass == e.Sunglass
          );
        }
        if (e.Mask != "") {
          this.dataFace = this.dataFace.filter((w) => w.meta.mask == e.Mask);
        }
        if (e.Hat != "") {
          this.dataFace = this.dataFace.filter((w) => w.meta.hat == e.Hat);
        }
        if (e.Shirt != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.upper_body_color == e.Shirt
          );
        }

        let obj = [];
        let no = 1;
        for (let result of this.dataFace) {
          obj.push({
            channelName: result.channelName,
            no: no++,
            createdDate: result.createdDate,
            faceImageUri: result.faceImageUri,
            screenImageUri: result.screenImageUri,
            name: result.name,
            similarity: result.similarity,
            personType: result.personType,
            meta: {
              age: result.meta.age.name,
              gender: {
                id: result.meta.gender.id,
                name: result.meta.gender.id == 0 ? "Female" : "Male",
              },
              skin_color: {
                id: result.meta.skin_color.id,
                name: result.meta.skin_color.name,
              },
              hairstyle: {
                id: result.meta.hairstyle.id,
                name: result.meta.hairstyle.name,
              },

              upperbody_color: result.meta.upperbody_color.name,
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
          });
        }

        this.faceReportData = obj;

        this.loadingVisible = false;
      })
      .catch((err) => {
        console.log(err.message);
        this.loadingVisible = false;
      });
  }

  valuesAge = "";
  onKeyAge(event: any) {
    // without type info
    this.valuesAge = event.target.value;
    console.log(this.valuesAge);
  }
  onClickClear() {
    this.ageFromS = "";
    this.valuesAge = "";
    this.currentType = "";
    this.currentSkin = "";
    this.currentGen = "";
    this.currentHair = "";
    //this.currentItem = "";
    this.currentAge = "";
    this.currentShirt = "";
    this.currentBottom = "";
    this.currentGlass = "";
    this.currentSunglass = "";
    this.currentMask = "";
    this.currentHat = "";
    this.currentColor = "";
    this.currentButton = "";
    this.endDateV = new Date();
    this.startDateV = new Date();
  }
  //>>>>>>> dashboard-face
}
