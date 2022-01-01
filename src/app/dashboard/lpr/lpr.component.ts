import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import axios from "axios";
import { environment } from "src/environments/environment";
import { DataFace, Data_lpr, lpr_detail } from "src/app/models/trackFace.model";

const dateFormat = require("dateformat");

@Component({
  selector: "app-lpr",
  templateUrl: "./lpr.component.html",
})
export class LprComponent implements OnInit {
  constructor() {}
  path = environment.service_uri;
  //path = `http://192.168.1.40:3006`;
  date: string = "03-Mar-21";
  dateM: string = "Mar-21";
  dateY: string = "21";
  dateFrom: string = "01-01-2021";
  dateTo: string = "01-03-2021";
  person: number = 0;
  personM: number = 0;
  personY: number = 0;
  dataColor: number[];
  labelColor: string[];
  lprColor: any[];
  totalPerson: number = 0;
  MONTHS = [
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
  ];
  blacklist: number = 0;
  whitelist: number = 0;
  test: number;

  // * age and gender
  male: number = 0;
  female: number = 0;

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
  normals: number[] = [];
  vip: number[] = [];
  //blacklist: number[] = [];

  //age 0-60
  age_5: number = 0;
  age_9: number = 0;
  age_19: number = 0;
  age_29: number = 0;
  age_39: number = 0;
  age_49: number = 0;
  age_59: number = 0;
  age_60: number = 0;
  dashLpr: any[];
  dataD: lpr_detail;

  ngOnInit() {
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    this.startDateV = startDate;
    this.endDateV = startDate;

    // * get between month
    axios
      .get(
        this.path +
          `/api/v1/lpr/dashboard?startDate=` +
          +startDate +
          `&endDate=` +
          +endDate
      )
      .then((res: any) => {
        //this.dataD = res.data.data;
        let dataLpr: Data_lpr[] = res.data.data;
        this.dashLpr = dataLpr;
        console.log("start filter");
        today = new Date();
        const date = today.getDate();
        const mm = today.getMonth(); //January is 0!
        const yyyy = today.getFullYear();
        this.person = dataLpr.filter(
          (w) =>
            new Date(w.createdDate).getDate() == date &&
            new Date(w.createdDate).getMonth() == mm &&
            new Date(w.createdDate).getFullYear() == yyyy
        ).length;

        this.personM = dataLpr.filter(
          (w) =>
            new Date(w.createdDate).getMonth() == mm &&
            new Date(w.createdDate).getFullYear() == yyyy
        ).length;

        let distinctMake = dataLpr
          .filter(
            (thing, i, arr) => arr.findIndex((t) => t.make === thing.make) === i
          )
          .map(({ make }) => make);
        let distinctColor = dataLpr
          .filter(
            (thing, i, arr) =>
              arr.findIndex((t) => t.vehicleColor === thing.vehicleColor) === i
          )
          .map(({ vehicleColor }) => vehicleColor);
        console.log(distinctColor);
        let distinctType = dataLpr
          .filter(
            (thing, i, arr) =>
              arr.findIndex((t) => t.vehicleType === thing.vehicleType) === i
          )
          .map(({ vehicleType }) => vehicleType);
        this.initTotalChart(dataLpr);
        this.initBrandlChart(dataLpr, distinctMake);
        this.initTypesChart(dataLpr, distinctType);
        this.initColorChart(dataLpr, distinctColor);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        // var mm = today.getMonth(); //January is 0!
        // var yyyy = today.getFullYear();
        var today = new Date();
        this.date = dd + "-" + this.MONTHS[mm] + "-" + yyyy;
        this.dateM = this.MONTHS[mm] + "-" + yyyy;
        this.dateY = yyyy.toString();
        var firstDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        ).getDate();
        var lastDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        this.dateFrom =
          firstDay.toString() + "-" + this.MONTHS[mm] + "-" + yyyy;
        this.dateTo = lastDay.toString() + "-" + this.MONTHS[mm] + "-" + yyyy;

        this.totalPerson = dataLpr.length;
        this.blacklist = 0;
        this.whitelist = 0;
      })
      .catch((err) => {
        console.log(err.message);
      });

    var firstYear = new Date(today.getFullYear(), 0, 1);
    var lastYear = new Date(today.getFullYear(), 11, 31);

    // * get between year
    axios
      .get(
        this.path +
          `/api/v1/lpr/dashboard?startDate=` +
          +firstYear +
          `&endDate=` +
          +lastYear
      )
      .then((res: any) => {
        //this.dataD = res.data.data;
        let dataLpr: Data_lpr[] = res.data.data;
        this.dashLpr = dataLpr;
        console.log(dataLpr);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        var today = new Date();
        // this.person = dataLpr.filter(
        //   (w) =>
        //     new Date(w.createdDate).getDate() == today.getDate() &&
        //     new Date(w.createdDate).getMonth() == mm &&
        //     new Date(w.createdDate).getFullYear() == yyyy
        // ).length;
        // this.personM = dataLpr.filter(
        //   (w) =>
        //     new Date(w.createdDate).getMonth() == mm &&
        //     new Date(w.createdDate).getFullYear() == yyyy
        // ).length;

        this.personY = dataLpr.filter(
          (w) => new Date(w.createdDate).getFullYear() == yyyy
        ).length;
      })
      .catch((err) => {
        console.log(err.message);
      });

    axios
      .get(
        this.path +
          `/api/v1/faceImage?startDate=` +
          +startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        let dataFace: DataFace[] = res.data.data;
        this.blacklist = dataFace.filter((w) => w.personType.id == 1).length;
        this.whitelist = dataFace.filter((w) => w.personType.id != 1).length;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  search(e) {
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;

    this.callService(startDate, endDate);
  }

  callService(startDate: number, endDate: number) {
    axios
      .get(
        this.path +
          `/api/v1/lpr/dashboard?startDate=` +
          startDate +
          `&endDate=` +
          endDate //+
        //`&page=1&limit=10`
      )
      .then((res: any) => {
        let dataLpr: Data_lpr[] = res.data.data;
        this.dashLpr = dataLpr;
        console.log(dataLpr);
        let distinctMake = dataLpr
          .filter(
            (thing, i, arr) => arr.findIndex((t) => t.make === thing.make) === i
          )
          .map(({ make }) => make);
        let distinctColor = dataLpr
          .filter(
            (thing, i, arr) =>
              arr.findIndex((t) => t.vehicleColor === thing.vehicleColor) === i
          )
          .map(({ vehicleColor }) => vehicleColor);
        let distinctType = dataLpr
          .filter(
            (thing, i, arr) =>
              arr.findIndex((t) => t.vehicleType === thing.vehicleType) === i
          )
          .map(({ vehicleType }) => vehicleType);
        this.initTotalChart(dataLpr);
        this.initBrandlChart(dataLpr, distinctMake);
        this.initColorChart(dataLpr, distinctColor);
        this.initTypesChart(dataLpr, distinctType);
        var today = new Date(startDate);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        var fromday = new Date(endDate);
        var fdd = String(today.getDate()).padStart(2, "0");
        var fmm = today.getMonth(); //January is 0!
        var fyyyy = today.getFullYear();

        this.dateFrom = dateFormat(new Date(startDate), "dd-mmm-yyyy");
        this.dateTo = dateFormat(new Date(endDate), "dd-mmm-yyyy");

        this.totalPerson = dataLpr.length;
      })
      .catch((err) => {
        console.log(err.message);
      });
    axios
      .get(
        this.path +
          `/api/v1/faceImage?startDate=` +
          startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        let dataFace: DataFace[] = res.data.data;
        this.blacklist = dataFace.filter((w) => w.personType.id == 1).length;
        this.whitelist = dataFace.filter((w) => w.personType.id != 1).length;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initTotalChart(lpr: Data_lpr[]) {
    new Chart("totalChart", {
      type: "bar",
      data: {
        labels: this.MONTHS,
        datasets: [
          {
            label: "Populations",
            data: [
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 1)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 2)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 3)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 4)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 5)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 6)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 7)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 8)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 9)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 10)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 11)
                .length,
              lpr.filter((w) => new Date(w.createdDate).getMonth() + 1 == 12)
                .length,
            ],
            backgroundColor: [
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
              "#03989E",
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
  }

  initBrandlChart(lpr: Data_lpr[], ban: string[]) {
    let data = [];
    let label = [];

    for (let index = 0; index < ban.length; index++) {
      label.push(ban[index]);
      data.push(lpr.filter((w) => w.make == ban[index]).length);
    }
    new Chart("brandlChart", {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            label: "Populations",
            data: data,
            backgroundColor: [
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
              "#CB6CE6",
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
              ticks: {
                min: 0,
                stepSize: 1,
              },
              scaleLabel: {
                display: true,
                //labelString: "Years",
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
  }

  initColorChart(lpr: Data_lpr[], color: string[]) {
    let data = [];
    for (let index = 0; index < color.length; index++) {
      //this.label.push(color[index]);
      data.push(lpr.filter((w) => w.vehicleColor == color[index]).length);
    }
    this.labelColor = color;
    this.dataColor = data;

    let no = 1;
    let obj: any[] = [];
    for (const result of color) {
      obj.push({
        no: no++,
        color: result,
        count: lpr.filter((w) => w.vehicleColor == result).length,
      });
    }
    this.lprColor = obj;
    // colorChart
    // new Chart("colorChart", {
    //   type: "pie",
    //   data: {
    //     labels: label,
    //     datasets: [
    //       {
    //         label: "Populations",
    //         data: data,
    //         backgroundColor: label,
    //         // [
    //         //   "Black",
    //         //   "#FFFFFF",
    //         //   "#D7D7D7",
    //         //   "#7E7E7E",
    //         //   "#0070BF",
    //         //   "#FF0000",
    //         //   "#FFD766",
    //         //   "#9D480E",
    //         //   "#91CF50",
    //         //   "#FF9797",
    //         // ],
    //         hoverBackgroundColor: ["#66A2EB", "#FCCE56"],
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //   },
    // });
  }

  initTypesChart(lpr: Data_lpr[], type: string[]) {
    let data = [];
    let label = [];

    for (let index = 0; index < type.length; index++) {
      console.log(type[index]);
      if (!type[index]) {
        label.push("Unknown");
      }

      if (type[index]) {
        label.push(type[index]);
      }

      data.push(lpr.filter((w) => w.vehicleType == type[index]).length);
    }
    // typeChart
    new Chart("typesChart", {
      type: "doughnut",
      data: {
        labels: label,
        datasets: [
          {
            label: "Populations",
            data: data,
            backgroundColor: [
              "#5271FF",
              "#A978F1",
              "#D786E1",
              "#F29ED6",
              "#FFBBD4",
              "#C995BD",
            ],
            hoverBackgroundColor: ["#66A2EB", "#FCCE56"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
