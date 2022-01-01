import { Component, OnInit, AfterViewInit } from "@angular/core";

import * as Chartist from "chartist";
import { TableData } from "src/app/md/md-table/md-table.component";
import Chart from "chart.js";
import axios from "axios";
import { environment } from "src/environments/environment";
import { throwError, Timestamp, VirtualTimeScheduler } from "rxjs";
import {
  DataFace,
  DataTrackFace,
  RootObject,
} from "src/app/models/trackFace.model";
import Swal from "sweetalert2";
import {
  EventListenerFocusTrapInertStrategy,
  LIVE_ANNOUNCER_ELEMENT_TOKEN_FACTORY,
} from "@angular/cdk/a11y";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { dateInputsHaveChanged } from "@angular/material/datepicker/datepicker-input-base";
import { utils } from "protractor";

declare const $: any;

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit {
  //path = `http://localhost:3007`;
  path = environment.service_uri;
  faceReportData: any[];
  itemReportData: any[];
  ageGenderReportData: any[];
  ageGenderVisible = false;
  itemVisible = false;
  skinVisible = false;
  hairVisible = false;
  typeVisible = false;

  modalType = {
    ageAndGender: 1,
    item: 2,
    skin: 3,
    hair: 4,
    type: 5,
  };

  test: number;

  // * age and gender
  male: number = 0;
  female: number = 0;

  //skin "white", "Beige", "Brown", "Black"]
  white: number = 0;
  Beige: number = 0;
  Brown: number = 0;
  Black: number = 0;
  // * items
  glasses: number = 0;
  sunGlasses: number = 0;
  mask: number = 0;
  hat: number = 0;

  // * Hairstyle
  shaven: number = 0;
  baid: number = 0;
  buzzcut: number = 0;
  short: number = 0;
  medium: number = 0;
  tress: number = 0;
  snood: number = 0;
  unknown: number = 0;
  startDateV: any;
  endDateV: any;

  // * repositories
  dataRepo: number[][] = [];
  normals: number[] = [];
  vip: number[] = [];
  blacklist: number[] = [];

  //age 0-60
  age_5: number = 0;
  age_9: number = 0;
  age_19: number = 0;
  age_29: number = 0;
  age_39: number = 0;
  age_49: number = 0;
  age_59: number = 0;
  age_unknow: number = 0;

  color = [
    "#FFBD59",
    "#b7b6ff",
    "#9a99ff",
    "#8b8bff",
    "#6F6EFF",
    "#ec8dff",
    "#b7b6ff",
    "#9a99ff",
  ];

  public ngOnInit() {
    var date = new Date();
    let perPerson = 0;
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    this.startDateV = startDate;
    this.endDateV = startDate;
    axios
      .get(
        // `http://4c0c8c922d4e.ngrok.io/api/v1/faceImage?startDate=`+Math.floor(Date.now())+`&endDate=`+Math.floor(Date.now())
        this.path +
          `/api/v1/faceImage/realTime?startDate=` +
          +startDate +
          `&endDate=` +
          +endDate
      )
      .then((res: any) => {
        let dataFace: DataFace[] = res.data.data;

        let no = 1;
        let obj: any[] = [];
        for (const result of dataFace) {
          obj.push({
            no: no++,
            ...result,
          });
        }

        no = 1;
        let itemObj: any[] = [];
        for (const result of dataFace) {
          itemObj.push({
            no: no++,
            faceImageUri: result.faceImageUri,
            createdDate: result.createdDate,
            faceId: result.faceId,
            meta: {
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
          });
        }

        no = 1;
        let ageAndGenderObj: any[] = [];
        for (const result of dataFace) {
          ageAndGenderObj.push({
            no: no++,
            faceImageUri: result.faceImageUri,
            createdDate: result.createdDate,
            faceId: result.faceId,
            meta: {
              age: result.meta.age.name,
              gender: {
                id: result.meta.gender.id,
                name: result.meta.gender.id == 0 ? "Female" : "Male",
              },
            },
          });
        }

        this.ageGenderReportData = ageAndGenderObj;
        this.itemReportData = itemObj;
        this.faceReportData = obj;

        console.log(dataFace);
        perPerson = dataFace.length;
        this.age_5 = dataFace.filter((w) => w.meta.age.id == 0).length;
        this.age_9 = dataFace.filter((w) => w.meta.age.id == 1).length;
        this.age_19 = dataFace.filter((w) => w.meta.age.id == 2).length;
        this.age_29 = dataFace.filter((w) => w.meta.age.id == 3).length;
        this.age_39 = dataFace.filter((w) => w.meta.age.id == 4).length;
        this.age_49 = dataFace.filter((w) => w.meta.age.id == 5).length;
        this.age_59 = dataFace.filter((w) => w.meta.age.id == 6).length;
        this.age_unknow = dataFace.filter((w) => w.meta.age.id == -1).length;
        this.male = dataFace.filter((w) => w.meta.gender.id == 1).length;
        this.female = dataFace.filter((w) => w.meta.gender.id == 0).length;
        this.glasses = dataFace.filter((w) => w.meta.glasses == 1).length;
        this.sunGlasses = dataFace.filter((w) => w.meta.sunglass == 1).length;
        this.mask = dataFace.filter((w) => w.meta.mask == 1).length;
        this.hat = dataFace.filter((w) => w.meta.hat == 1).length;
        this.shaven = dataFace.filter((w) => w.meta.hairstyle.id == 3).length;
        this.baid = dataFace.filter((w) => w.meta.hairstyle.id == 0).length;
        this.buzzcut = dataFace.filter((w) => w.meta.hairstyle.id == 1).length;
        this.short = dataFace.filter((w) => w.meta.hairstyle.id == 4).length;
        this.medium = dataFace.filter((w) => w.meta.hairstyle.id == 2).length;
        this.tress = dataFace.filter((w) => w.meta.hairstyle.id == 6).length;
        this.snood = dataFace.filter((w) => w.meta.hairstyle.id == 5).length;
        this.unknown = dataFace.filter((w) => w.meta.hairstyle.id == -1).length;
        this.white = dataFace.filter((w) => w.meta.skin_color.id == 1).length;
        this.Beige = dataFace.filter((w) => w.meta.skin_color.id == 2).length;
        this.Brown = dataFace.filter((w) => w.meta.skin_color.id == 3).length;
        this.Black = dataFace.filter((w) => w.meta.skin_color.id == 4).length;

        // console.log(this.male);
        // this.male =
        //   this.male > 0 ? +((this.male * 100) / perPerson).toFixed(2) : 0;
        // this.female =
        //   this.female > 0 ? +((this.female * 100) / perPerson).toFixed(2) : 0;
        //genser
        this.initAgeGender(
          perPerson,
          this.age_5,
          this.age_9,
          this.age_19,
          this.age_29,
          this.age_39,
          this.age_49,
          this.age_59,
          this.age_unknow
        );

        //item
        this.initItems();

        //skin
        this.initSkin();

        //Hair stye
        this.initHairStyle();

        //--------------------------------

        axios
          .get(this.path + `/api/v1/repository`)
          .then((res: any) => {
            let repo: RootObject[] = res.data.data.repositories;
            console.log(repo);
            this.initType(repo, dataFace);
          })
          .catch((err) => {
            console.log(err.message);
          });

        // for (const data of this.testData) {
        //   this.groupType(data.timestamp.toString(), "Normal");
        // }
      })
      .catch((err) => {
        clear();
        console.log(err.message);
      });
  }

  search(e) {
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;

    console.log(e.startDate);
    console.log(e.endDate);
    this.callService(startDate, endDate);
    //this.initType();
  }

  async callService(startDate: number, endDate: number) {
    this.normals = [];
    this.vip = [];
    this.blacklist = [];
    axios
      .get(
        this.path +
          `/api/v1/faceImage/realTime?startDate=` +
          startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        let dataFace: DataFace[] = res.data.data;
        console.log(dataFace);
        let perPerson = 0;
        perPerson = dataFace.length;
        this.age_5 = dataFace.filter((w) => w.meta.age.id == 0).length;
        this.age_9 = dataFace.filter((w) => w.meta.age.id == 1).length;
        this.age_19 = dataFace.filter((w) => w.meta.age.id == 2).length;
        this.age_29 = dataFace.filter((w) => w.meta.age.id == 3).length;
        this.age_39 = dataFace.filter((w) => w.meta.age.id == 4).length;
        this.age_49 = dataFace.filter((w) => w.meta.age.id == 5).length;
        this.age_59 = dataFace.filter((w) => w.meta.age.id == 6).length;
        this.age_unknow = dataFace.filter((w) => w.meta.age.id == -1).length;
        this.male = dataFace.filter((w) => w.meta.gender.id == 1).length;
        this.female = dataFace.filter((w) => w.meta.gender.id == 0).length;
        this.glasses = dataFace.filter((w) => w.meta.glasses == 1).length;
        this.sunGlasses = dataFace.filter((w) => w.meta.sunglass == 1).length;
        this.mask = dataFace.filter((w) => w.meta.mask == 1).length;
        this.hat = dataFace.filter((w) => w.meta.hat == 1).length;
        this.shaven = dataFace.filter((w) => w.meta.hairstyle.id == 3).length;
        this.baid = dataFace.filter((w) => w.meta.hairstyle.id == 0).length;
        this.buzzcut = dataFace.filter((w) => w.meta.hairstyle.id == 1).length;
        this.short = dataFace.filter((w) => w.meta.hairstyle.id == 4).length;
        this.medium = dataFace.filter((w) => w.meta.hairstyle.id == 2).length;
        this.tress = dataFace.filter((w) => w.meta.hairstyle.id == 6).length;
        this.snood = dataFace.filter((w) => w.meta.hairstyle.id == 5).length;
        this.unknown = dataFace.filter((w) => w.meta.hairstyle.id == -1).length;
        this.white = dataFace.filter((w) => w.meta.skin_color.id == 1).length;
        this.Beige = dataFace.filter((w) => w.meta.skin_color.id == 2).length;
        this.Brown = dataFace.filter((w) => w.meta.skin_color.id == 3).length;
        this.Black = dataFace.filter((w) => w.meta.skin_color.id == 4).length;

        this.initAgeGender(
          perPerson,
          this.age_5,
          this.age_9,
          this.age_19,
          this.age_29,
          this.age_39,
          this.age_49,
          this.age_59,
          this.age_unknow
        );
        this.initItems();
        this.initSkin();
        this.initHairStyle();

        axios
          .get(this.path + `/api/v1/repository`)
          .then((res: any) => {
            let repo: RootObject[] = res.data.data.repositories;
            this.initType(repo, dataFace);
          })
          .catch((err) => {
            console.log(err.message);
          });

        // * Get by datagrid age and gender
        let no = 1;
        let ageAndGenderObj: any[] = [];
        for (const result of dataFace) {
          ageAndGenderObj.push({
            no: no++,
            faceImageUri: result.faceImageUri,
            createdDate: result.createdDate,
            faceId: result.faceId,
            meta: {
              age: result.meta.age.name,
              gender: {
                id: result.meta.gender.id,
                name: result.meta.gender.id == 0 ? "Female" : "Male",
              },
            },
          });
        }

        this.ageGenderReportData = ageAndGenderObj;

        // * Get by datagrid items
        no = 1;
        let itemObj: any[] = [];
        for (const result of dataFace) {
          itemObj.push({
            no: no++,
            faceImageUri: result.faceImageUri,
            createdDate: result.createdDate,
            faceId: result.faceId,
            meta: {
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
          });
        }

        this.itemReportData = itemObj;

        // * Get by skin

        no = 1;
        let obj: any[] = [];
        for (const result of dataFace) {
          obj.push({
            no: no++,
            ...result,
          });
        }

        this.faceReportData = obj;
      })
      .catch((err) => {
        clear();
        console.log(err.message);
      });
  }

  initAgeGender(
    person,
    Child,
    Teen,
    Youth,
    Junior,
    Mid,
    Senior,
    Elderly,
    Unknown
  ) {
    const data = {
      labels: [
        "Child",
        "Teen",
        "Youth",
        "Junior",
        "Mid-aged",
        "Senior",
        "Elderly",
        "Unknown",
      ],
      datasets: [
        {
          label: "Dataset 1",
          data: Mid,
          backgroundColor: "ec8dff",
        },
        {
          label: "Dataset 2",
          data: Senior,
          backgroundColor: "9a99ff",
        },
        {
          label: "Dataset 3",
          data: Unknown,
          backgroundColor: "ec8dff",
        },
      ],
    };
    console.log(Teen);
    console.log(Child);
    let perPerson = person;
    new Chart("ageGenderChartAlert", {
      type: "horizontalBar",
      //data,
      data: {
        labels: [
          "Child",
          "Teen",
          "Youth",
          "Junior",
          "Mid-aged",
          "Senior",
          "Elderly",
          "Unknown",
        ],
        datasets: [
          {
            label: "Data 1",
            data: Child,
            backgroundColor: "#ec8dff",
          },
          {
            label: "Data 2",
            data: Teen,
            backgroundColor: "#b7b6ff",
          },
          {
            label: "Person",
            data: [
              {
                label: "Data 1",
                data: Senior,
                backgroundColor: "#ec8dff",
              },
              {
                label: "Data 2",
                data: Teen,
                backgroundColor: "#b7b6ff",
              },
              Child,
              Teen,
              Youth,
              Junior,
              Mid,
              Senior,
              Elderly,
              Unknown,
            ],
            backgroundColor: [
              "#ec8dff",
              "#b7b6ff",
              "#9a99ff",
              "#8b8bff",
              "#6F6EFF",
              "#ec8dff",
              "#b7b6ff",
              "#9a99ff",
            ],
            hoverBackgroundColor: ["#66A2EB", "#FCCE56"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Chart.js Bar Chart",
          },
        },
        scales: {
          // xAxes: [
          //   {
          //     ticks: {
          //       min: 0,
          //     },
          //   },
          // ],
          // yAxes: [
          //   {
          //     scaleLabel: {
          //       display: true,
          //       labelString: "Years",
          //     },
          //   },
          // ],
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        legend: {
          display: false,
        },
        // tooltips: {
        //   callbacks: {
        //     label: function (tooltipItem) {
        //       return tooltipItem.yLabel;
        //     },
        //   },
        // },
      },
    });
  }

  initSkin() {
    var chart = new Chart("skinChartAlert", {
      type: "doughnut",
      data: {
        labels: ["white", "Beige", "Brown", "Black"],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: ["#255B98", "#1787BA", "#2BB4D4 ", "#5CE1E6"],
            data: [
              this.white || -1,
              this.Beige || -1,
              this.Brown || -1,
              this.Black || -1,
            ],
          },
        ],
      },

      // Configuration options go here
      options: {
        legend: {
          display: true,
        },
      },
    });
  }

  initItems() {
    let glasses: number = 0;
    let sunGlasses: number = 0;
    let mask: number = 0;
    let hat: number = 0;
  }

  initHairStyle() {
    var chart = new Chart("hairStyleAlert", {
      type: "doughnut",
      data: {
        labels: [
          "Shaven",
          "Bald",
          "Buzzcut",
          "Short",
          "Medium",
          "Tress",
          "Snood",
          "Unknow",
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: [
              "#6D4A82",
              "#A46693",
              "#D58AA4 ",
              "#5CE1E6",
              "#35B4D2",
              "#2188B8",
              "#285C96",
              "#2D326B",
            ],
            data: [
              this.shaven || -1,
              this.baid || -1,
              this.buzzcut || -1,
              this.short || -1,
              this.medium || -1,
              this.tress || -1,
              this.snood || -1,
              this.unknown || -1,
            ],
          },
        ],
      },
      // Configuration options go here
      options: {
        legend: {
          display: true,
        },
      },
    });
  }

  groupType(createDate: string, repoName: string, repoId: number) {
    if (!createDate) {
      return null;
    }

    let month = new Date(+createDate).getMonth();
    //console.log(month);
    //console.log("repo");
    this.dataRepo[repoId][month] = 1;
    console.log(this.dataRepo[repoId][month]);
    if (repoName == "Normal") {
      if (!this.normals[month]) {
        this.normals[month] = 1;
      } else {
        this.normals[month] = this.normals[month] + 1;
      }
    } else if (repoName == "VIP") {
      this.vip[month] = this.vip[month]++;
    } else if (repoName == "Blacklist") {
      if (!this.blacklist[month]) {
        console.log(month);
        this.blacklist[month] = 1;
      } else {
        this.blacklist[month] = this.blacklist[month] + 1;
      }
      // console.log('test');
      // this.blacklist[month] = this.blacklist[month]++;
    }

    // console.log(`Month ${month} ${this.normals[month]}`);
    // console.log(`Month ${month} ${this.normals[month]}`);
  }

  initType(repo: RootObject[], dataD: DataFace[]) {
    let data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [],
    };
    repo.forEach((e) => {
      // console.log(e.name);
      const newDataset = {
        label: e.name,
        backgroundColor:
          e.name == "Blacklist"
            ? "#F9232C"
            : e.name == "Normal"
            ? "#FFBD59"
            : e.name == "VIP"
            ? "#FF9D61"
            : this.color[e.id],
        borderWidth: 1,
        scaleStartValue: 0,
        data: [
          dataD.filter((w) => w.personType.id == e.id && w.month == 1).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 2).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 3).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 4).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 5).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 6).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 7).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 8).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 9).length ||
            -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 10)
            .length || -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 11)
            .length || -1,
          dataD.filter((w) => w.personType.id == e.id && w.month == 12)
            .length || -1,
        ], //Utils.numbers({count: data.labels.length, min: -100, max: 100}),
      };
      data.datasets.push(newDataset);
      //chart.update();
    });

    var chart = new Chart("typeChartAlert", {
      // The type of chart we want to create
      type: "bar",
      data: data,
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                stepSize: 5,
              },
            },
          ],
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Chart.js Bar Chart",
          },
        },
      },
    });
  }

  openModal(type: number) {
    switch (type) {
      case this.modalType.ageAndGender:
        this.ageGenderVisible = true;
        break;
      case this.modalType.item:
        this.itemVisible = true;
        break;
      case this.modalType.skin:
        this.skinVisible = true;
        break;
      case this.modalType.hair:
        this.hairVisible = true;
        break;
      case this.modalType.type:
        this.typeVisible = true;
        break;
    }
  }
}

function isBigEnough(element, index, array) {
  return element >= 10;
}

function clear() {
  this.age_5 = 0;
  this.age_9 = 0;
  this.age_19 = 0;
  this.age_29 = 0;
  this.age_39 = 0;
  this.age_49 = 0;
  this.age_59 = 0;
  this.age_60 = 0;
  this.male = 0;
  this.female = 0;
  this.glasses = 0;
  this.sunGlasses = 0;
  this.sunGlasses = 0;
  this.mask = 0;
  this.hat = 0;
  this.shaven = 0;
  this.baid = 0;
  this.buzzcut = 0;
  this.short = 0;
  this.medium = 0;
  this.tress = 0;
  this.snood = 0;
  this.unknown = 0;
  this.white = 0;
  this.Beige = 0;
  this.Brown = 0;
  this.Black = 0;
  new Chart("ageGenderChartAlert", {
    type: "horizontalBar",
    data: {
      labels: [
        "60 >",
        "50 - 59",
        "40 - 49",
        "30 - 39",
        "20 - 29",
        "10 - 19",
        "5 - 9",
        "< 5",
      ],
      datasets: [
        {
          label: "Populations",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: [
            "#ec8dff",
            "#b7b6ff",
            "#9a99ff",
            "#8b8bff",
            "#6F6EFF",
            "#ec8dff",
            "#b7b6ff",
            "#9a99ff",
          ],
          hoverBackgroundColor: ["#66A2EB", "#FCCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Years",
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel;
          },
        },
      },
    },
  });
  new Chart("skinChartAlert", {
    type: "doughnut",
    data: {
      labels: ["white", "Beige", "Brown", "Black"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: ["#255B98", "#1787BA", "#2BB4D4 ", "#5CE1E6"],
          data: [0, 0, 0, 0],
        },
      ],
    },

    // Configuration options go here
    options: {
      legend: {
        display: true,
      },
    },
  });
  new Chart("hairStyle", {
    type: "doughnut",
    data: {
      labels: [
        "Shaven",
        "Bald",
        "Buzzcut",
        "Short",
        "Medium",
        "Tress",
        "Snood",
        "Unknow",
      ],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: [
            "#6D4A82",
            "#A46693",
            "#D58AA4 ",
            "#5CE1E6",
            "#35B4D2",
            "#2188B8",
            "#285C96",
            "#2D326B",
          ],
          data: [0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
    // Configuration options go here
    options: {
      legend: {
        display: true,
      },
    },
  });
}
