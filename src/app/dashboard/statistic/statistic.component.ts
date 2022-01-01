import { Component, OnInit } from "@angular/core";
import axios from "axios";
import Chart from "chart.js";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-statistic",
  templateUrl: "./statistic.component.html",
  styleUrls: ["./statistic.component.css"],
})
export class StatisticComponent implements OnInit {
  path = environment.service_uri;
  alertCount: number = 0;
  snapshotCount: number = 0;
  loadingVisible = true;
  startDateV: Date;
  endDateV: Date;
  constructor() {}

  ngOnInit() {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    this.startDateV = startDate;
    this.endDateV = endDate;

    this.getGraphLine(+startDate, +endDate);
  }

  search(e) {
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;
    this.getGraphLine(startDate, endDate);
  }

  getGraphLine(startDate: number, endDate: number) {
    let countAlertArr = [];
    let countSnapShotArr = [];

    axios
      .get(
        `${this.path}/api/v1/statistics?startDate=${startDate}&endDate=${endDate}`
      )
      .then((res: any) => {
        let data = res.data.data;

        console.log(data);
        if (Array.isArray(data.alert) && Array.isArray(data.snapshot)) {
          for (const resultAlert of data.alert) {
            let month = new Date(resultAlert.createdDate).getMonth();
            if (!countAlertArr[month]) {
              countAlertArr[month] = 0;
            }
            countAlertArr[month] = +countAlertArr[month] + 1;
          }

          this.alertCount = data.alert.length;

          for (const resultSnapshot of data.snapshot) {
            let month = new Date(resultSnapshot.createdDate).getMonth();

            if (!countSnapShotArr[month]) {
              countSnapShotArr[month] = 0;
            }
            countSnapShotArr[month] = countSnapShotArr[month] + 1;
          }

          this.snapshotCount = data.snapshot.length;

          var chart = new Chart("staticReport", {
            // The type of chart we want to create
            type: "line",

            // The data for our dataset
            data: {
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
              datasets: [
                {
                  label: "Alerts",
                  borderColor: "#FF5757",
                  fill: false,
                  lineTension: 0,
                  data: countAlertArr,
                },
                {
                  label: "Snapshots",
                  borderColor: "#FF9D61",
                  fill: false,
                  lineTension: 0,
                  data: countSnapShotArr,
                },
              ],
            },

            // Configuration options go here
            options: {
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                      stepSize: 10,
                    },
                  },
                ],
              },
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message);
      });
  }
}
