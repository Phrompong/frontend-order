import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import axios from "axios";
import {
  CpuModel,
  DiskModel,
  RamModel,
  ResourceModel,
} from "src/app/models/resource.model";
import { RepositoryModel } from "src/app/models/repository.model";
import { ChannelModel } from "src/app/models/channel.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-system",
  templateUrl: "./system.component.html",
  styleUrls: ["./system.component.css"],
})
export class SystemComponent implements OnInit {
  freeRepository: number = 0;

  onlineChannel: number = 0;
  totalChannel: number = 0;

  faceNumberAll: number = 0;
  repositoriesNumber: number = 0;

  constructor() {}

  ngOnInit() {
    let ram: RamModel = {
      free: 100,
      total: 100,
      usage_rate: 100,
    };
    this.initGraphRam(ram);
    let disk: DiskModel = {
      free: 100,
      total: 100,
      usage_rate: 100,
    };
    this.initDisk(disk);
    let cpu: CpuModel = {
      idle: 100,
      total: 100,
      usage_rate: 100,
    };
    this.initCpu(cpu);

    this.getRepository();
    this.getResource();
    this.getChannel();
  }

  getChannel() {
    axios
      .get(`${environment.service_uri}/api/v1/channel`)
      .then((res: any) => {
        console.log(res);
        let data = res.data.data as ChannelModel[];

        this.onlineChannel = data.filter((o) => o.status == 1).length;
        this.totalChannel = data.length;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  getRepository() {
    axios
      .get(`${environment.service_uri}/api/v1/repository`)
      .then((res: any) => {
        console.log(res);
        let data = res.data.data as RepositoryModel;
        this.repositoriesNumber = data.repositories.length;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  getResource() {
    axios
      .get(`${environment.service_uri}/api/v1/resource`)
      .then((res: any) => {
        const resource = res.data.data as ResourceModel;

        this.initGraphRam(resource.ram);

        this.initDisk(resource.disk);

        this.initCpu(resource.cpu);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initGraphRam(ramData: RamModel) {
    let percentage: number = +((ramData.free * 100) / ramData.total).toFixed(2);

    new Chart("ramDonut", {
      type: "doughnut",
      data: {
        labels: ["Free", "Total"],
        datasets: [
          {
            label: "Populations",
            data: [ramData.free, ramData.total],
            backgroundColor: ["#03989E", "#A5CEDF"],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `Ram ${percentage} %`,
          position: "bottom",
          fontSize: 24,
        },
      },
    });
  }

  initDisk(diskData: DiskModel) {
    let percentage: number = +((diskData.free * 100) / diskData.total).toFixed(
      2
    );

    new Chart("diskDonut", {
      type: "doughnut",
      data: {
        labels: ["Free", "Total"],
        datasets: [
          {
            label: "Populations",
            data: [diskData.free, diskData.total],
            backgroundColor: ["#BA3B61", "#E3A5B8"],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `Disk ${percentage} %`,
          position: "bottom",
          fontSize: 24,
        },
      },
    });
  }

  initCpu(cpuData: CpuModel) {
    let percentage: number = +((cpuData.idle * 100) / cpuData.total).toFixed(2);
    new Chart("cpuDonut", {
      type: "doughnut",
      data: {
        labels: ["Idle", "Total"],
        datasets: [
          {
            label: "Populations",
            data: [cpuData.idle, cpuData.total],
            backgroundColor: ["#2F5F98", "#A9C4E5"],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `Cpu ${percentage} %`,
          position: "bottom",
          fontSize: 24,
        },
      },
    });
  }
}
