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
import {
  DataFace,
  DataTrackFace,
  Data_lpr,
  lpr_detail,
} from "src/app/models/trackFace.model";

@Component({
  selector: "app-smart-lpr",
  templateUrl: "./smart-lpr.component.html",
  styleUrls: ["./smart-lpr.component.css"],
})
export class SmartLprComponent implements OnInit {
  path = environment.service_uri;
  freeRepository: number = 0;
  onlineChannel: number = 0;
  totalChannel: number = 0;
  faceNumberAll: number = 0;
  repositoriesNumber: number = 0;
  skinData: any[];
  typeData: any[];
  hairData: any[];
  itemData: any[];
  dataFace: any[];
  laneName = "";
  faceReportData: any[];
  countryData: any[];
  brandData: any[];
  modelData: any[];
  vehicleColorData: any[];
  plateNumberData: any[];
  country = "";
  make: any;
  model = "";
  vehicleColor = "";
  plateNumber = "";
  vehicleList = "";
  startDateV: any;
  endDateV: any;
  lprReportData: any[];
  dataLpt: Data_lpr[];
  dataD: lpr_detail;
  meta: any;
  cPage = "1";
  cPages = 0;
  vehicleListData: any[];
  laneNameData: any[];
  loadingVisible = false;

  constructor() {}

  ngOnInit() {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    this.startDateV = startDate;
    this.endDateV = startDate;
    //this.initSmart();
    this.initSkin();
    this.initType();
    this.initHairStyle();
    this.initItem();
    this.initMasterCountry();
    this.initMasterBrand();
    this.initMasterModel();
    this.initMasterColor();
    this.initMasterPlateNumber();
    this.initFilter();
  }

  initFilter() {
    this.loadingVisible = true;
    //this.currentAge = 2;
    axios
      .get(`${this.path}/api/v1/settings?type=2`)
      .then((res) => {
        let data = res.data.data;
        console.log(data);
        this.startDateV = new Date(+data.startDate);
        this.endDateV = new Date(+data.endDate);
        this.country = data.country; //== "" ? "" : +data.age;
        this.make = data.make; //== "" ? "" : +data.skin;
        this.model = data.model.toString();
        this.vehicleColor = data.vehicleColor;
        this.plateNumber = data.plateNumber;
        this.vehicleList = data.vehicleList ?? "";

        //console.log(this.currentAge);
        //console.log(this.currentSkin);
        this.getFaceImage(
          +this.startDateV,
          +this.endDateV,
          this.country,
          this.make,
          this.model,
          this.vehicleColor,
          this.plateNumber,
          this.vehicleList
        );
        this.loadingVisible = false;
      })
      .catch((error) => {
        this.loadingVisible = false;
        console.log(error.message);
      });
  }

  getFaceImage(
    startDate,
    endDate,
    country,
    make,
    model,
    vehicleColor,
    plateNumber,
    vehicleList
  ) {
    this.loadingVisible = true;
    axios

      .get(
        this.path +
          `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}` +
          `&country=${country}&make=${make}&model=${model}&vehicleColor=${vehicleColor}` +
          `&plateNumber=${plateNumber}&vehicleList=${vehicleList}&page=1&limit=10`
        //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}`
      )
      .then((res: any) => {
        this.dataD = res.data.data.lpr[0];
        this.dataLpt = this.dataD.lpr;
        console.log(this.dataLpt);
        this.meta = res.data.data._metadata;
        this.cPage = this.meta.page.toString();
        this.cPages = this.meta.pages;
        // if (country != undefined && country != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.country == country);
        // }
        // if (make != undefined && make != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.make == make);
        // }
        // if (model != undefined && model != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.model == model);
        // }
        // if (vehicleColor != undefined && vehicleColor != "") {
        //   this.dataLpt = this.dataLpt.filter(
        //     (w) => w.vehicleColor == vehicleColor
        //   );
        // }
        // if (plateNumber != undefined && plateNumber != "") {
        //   this.dataLpt = this.dataLpt.filter(
        //     (w) => w.vehicleColor == plateNumber
        //   );
        // }
        let no = 1;
        let obj: any[] = [];
        //console.log(this.dataLpt);
        for (const result of this.dataLpt) {
          obj.push({
            no: no++,
            ...result,
          });
        }
        this.lprReportData = obj;
        this.loadingVisible = false;
      })
      .catch((err) => {
        console.log(err.message);
        this.loadingVisible = false;
      });
  }

  save(e) {
    this.loadingVisible = true;
    let body = {
      startDate: +e.startDate,
      endDate: +e.endDate,
      country: e.country,
      make: e.make,
      model: e.model,
      vehicleColor: e.vehicleColor,
      plateNumber: e.plateNumber,
      vehicleList: e.vehicleList,
    };

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
    axios
      .get(
        this.path +
          `/api/v1/lpr?startDate=${startDate}&endDate=${endDate}` +
          `&country=${e.country}&make=${e.make}&model=${e.model}&vehicleColor=${e.vehicleColor}` +
          `&plateNumber=${e.plateNumber}&vehicleList=${e.vehicleList}&laneName=${e.laneName}&page=1&limit=10`
        //`/api/v1/lpr?startDate=${startDate}&endDate=${endDate}`
      )
      .then((res: any) => {
        this.dataD = res.data.data.lpr[0];
        this.dataLpt = this.dataD.lpr;
        this.meta = res.data.data._metadata;
        this.cPage = this.meta.page.toString();
        this.cPages = this.meta.pages;

        // if (e.country != undefined && e.country != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.country == e.country);
        // }
        // if (e.make != undefined && e.make != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.make == e.make);
        // }
        // if (e.model != undefined && e.model != "") {
        //   this.dataLpt = this.dataLpt.filter((w) => w.model == e.model);
        // }
        // if (e.vehicleColor != undefined && e.vehicleColor != "") {
        //   this.dataLpt = this.dataLpt.filter(
        //     (w) => w.vehicleColor == e.vehicleColor
        //   );
        // }
        // if (e.plateNumber != undefined && e.plateNumber != "") {
        //   this.dataLpt = this.dataLpt.filter(
        //     (w) => w.vehicleColor == e.plateNumber
        //   );
        // }

        let no = 1;
        let obj: any[] = [];
        for (const result of this.dataLpt) {
          obj.push({
            no: no++,
            ...result,
          });
        }
        this.lprReportData = obj;

        axios
          .post(this.path + `/api/v1/settings?type=2`, { ...body })
          .then((res: any) => {
            console.log("Save success");
            axios
              .post(this.path + `/api/v1/notification?type=2`, {
                count: obj.length,
              })
              .then((res: any) => {
                console.log("Save success");
              })
              .catch((err) => {
                console.log(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });

        console.log("data response report page");
        this.loadingVisible = false;
        alert("Save success");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  changePage(event) {
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
        this.dataD = res.data.data.lpr[0];
        this.dataLpt = this.dataD.lpr;
        console.log(res.data.data);
        let no = 1 + (+event.value - 1) * 10;
        let obj: any[] = [];
        for (const result of this.dataLpt) {
          obj.push({
            no: no++,
            ...result,
          });
        }
        console.log(obj);
        this.lprReportData = obj;
        console.log("data response report page");
        //console.log(this.lprReportData);
        this.loadingVisible = false;
      })
      .catch((err) => {
        this.loadingVisible = false;
        console.log(err.message);
      });
  }

  initSmart() {
    axios
      .get(`${this.path}/api/v1/settings/lpr`)
      .then((res: any) => {
        this.dataFace = res.data.data;

        let no = 1;
        let itemObj: any[] = [];
        for (const result of this.dataFace) {
          itemObj.push({
            no: no++,
            faceImageUri: result.faceImageUri,
            screenImageUri: result.screenImageUri,
            createdDate: result.createdDate,
            faceId: result.faceId,
            channel: result.channel,
            personType: {
              id: result.personType.id,
              name: result.personType.name,
            },
            meta: {
              gender: result.meta.gender,
              age: result.meta.age < 0 ? "-" : result.meta.age,
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

        this.faceReportData = itemObj;
      })
      .catch((err) => {
        console.log(err.message);
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
        console.log(this.brandData);
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
  }
  counter(i: number) {
    return new Array(i);
  }
}
