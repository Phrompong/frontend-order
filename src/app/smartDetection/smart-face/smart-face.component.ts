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
import {
  DataFace,
  DataTrackFace,
  setFace,
} from "src/app/models/trackFace.model";
import { ChannelModel } from "src/app/models/channel.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-smart-face",
  templateUrl: "./smart-face.component.html",
  styleUrls: ["./smart-face.component.css"],
})
export class SmartFaceComponent implements OnInit {
  path = environment.service_uri;
  freeRepository: number = 0;
  onlineChannel: number = 0;
  totalChannel: number = 0;
  faceNumberAll: number = 0;
  repositoriesNumber: number = 0;
  ageData: any[];
  skinData: any[];
  typeData: any[];
  hairData: any[];
  itemData: any[];
  dataFace: DataFace[];
  faceReportData: any[];
  shirtColor: any[];
  setFace: setFace;
  startDateV: any;
  endDateV: any;
  currentType = "";
  ageFromS = "";
  valuesAge = "";
  currentAge: any;
  currentSkin: any;
  currentGen: any;
  currentHair: any;
  currentItem: any;
  currentShirt = "";
  currentBottom = "";
  currentGlass: any;
  currentSunglass: any;
  currentMask: any;
  currentHat: any;
  loadingVisible = false;
  currentColor = "";
  currentButton = "";

  constructor() {}

  ngOnInit() {
    //this.initSmart();
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    this.startDateV = startDate;
    this.endDateV = startDate;

    this.initAge();
    this.initSkin();
    this.initType();
    this.initHairStyle();
    this.initItem();
    this.initFilter();

    //this.initFilter();
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
  }

  initFilter() {
    this.loadingVisible = true;
    //this.currentAge = 2;
    axios
      .get(`${this.path}/api/v1/settings?type=1`)
      .then((res) => {
        let data = res.data.data;
        console.log(data);
        this.startDateV = new Date(+data.startDate);
        this.endDateV = new Date(+data.endDate);
        this.currentAge = data.Age; //== "" ? "" : +data.age;
        this.currentSkin = data.skin == "" ? "" : +data.skin;
        this.currentGen = data.gender.toString();
        this.currentHair = data.hairStyle == "" ? "" : +data.hairStyle;
        this.currentGlass = data.glass.toString();
        this.currentSunglass = data.sunglass.toString();
        this.currentMask = data.mask.toString();
        this.currentHat = data.hat.toString();
        this.currentColor = data.shirtColor.toString();

        this.getFaceImage(
          +this.startDateV,
          +this.endDateV,
          "",
          this.currentAge,
          this.currentSkin,
          this.currentGen,
          this.currentHair,
          this.currentSunglass,
          this.currentGlass,
          this.currentMask,
          this.currentHat,
          this.currentColor
        );
        this.loadingVisible = false;
      })
      .catch((error) => {
        console.log(error.message);
        this.loadingVisible = false;
      });
  }

  getFaceImage(
    startDate,
    endDate,
    type,
    age,
    skin,
    gender,
    hair,
    sunglass,
    glass,
    mask,
    hat,
    shirtColor
  ) {
    this.loadingVisible = true;
    axios
      .get(
        this.path +
          `/api/v1/faceImage?startDate=` +
          startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        let obj: any[] = [];
        let no: number = 1;
        this.dataFace = res.data.data;
        console.log(this.dataFace);
        if (type != "" && type != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.personType.id == type);
        }
        if (age != undefined) {
          if (age.toString() != "") {
            console.log(age);
            this.dataFace = this.dataFace.filter((w) => w.meta.age.id == age);
            //console.log(this.dataFace);
          }
        }
        if (skin != "" && skin != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.skin_color.id == skin
          );
        }
        if (hair != "" && hair != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.hairstyle.id == hair
          );
          //console.log(this.dataFace);
        }
        if (gender != "" && gender != undefined) {
          console.log(gender);
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.gender.id == gender
          );
          //console.log(this.dataFace);
        }
        if (glass != "" && glass != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.meta.glasses == glass);
          //console.log(this.dataFace);
        }
        if (sunglass != "" && sunglass != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.sunglass == sunglass
          );
        }
        if (mask != "" && mask != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.meta.mask == mask);
        }
        if (hat != "" && hat != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.meta.hat == hat);
        }

        if (shirtColor != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.upper_body_color == shirtColor
          );
        }

        console.log(this.dataFace);
        for (const result of this.dataFace) {
          obj.push({
            no: no++,
            createdDate: result.createdDate,
            faceImageUri: result.faceImageUri,
            screenImageUri: result.screenImageUri,
            meta: {
              upperbody_color: result.meta.upper_body_color,
              gender: result.meta.gender,
              age: result.meta.age.name,
              skin_color: result.meta.skin_color,
              hairstyle: result.meta.hairstyle,
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
            personType: result.personType.name,
            channel: result.channel,
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

  save(e) {
    this.loadingVisible = true;
    let body = {
      startDate: +e.startDate,
      endDate: +e.endDate,
      Age: e.Age,
      gender: e.Gender,
      skin: e.Skin,
      hairStyle: e.Hair,
      glass: e.Glass,
      sunglass: e.Sunglass,
      mask: e.Mask,
      hat: e.Hat,
      type: e.Type,
      shirtColor: e.Shirt,
      //totalResult : 0,
    };
    let startDate: number = +e.startDate;
    let endDate: number = +e.endDate;
    //console.log(startDate);

    axios
      .get(
        this.path +
          `/api/v1/faceImage?startDate=` +
          startDate +
          `&endDate=` +
          endDate
      )
      .then((res: any) => {
        let obj: any[] = [];
        let no: number = 1;
        this.dataFace = res.data.data;
        console.log(this.dataFace);

        // if (e.ageFrom != "" && e.ageTo != ""  && e.ageFrom != undefined && e.ageTo != undefined) {
        //   let ageFrom: number = +e.ageFrom;
        //   let ageTo: number = +e.ageTo;

        //   // this.dataFace = this.dataFace.filter(
        //   //   (w) => w.meta.age >= ageFrom && w.meta.age <= ageTo
        //   // );
        //   //console.log(this.dataFace);
        // }
        if (e.Age != undefined) {
          if (e.Age.toString() != "") {
            console.log(e.Age);
            this.dataFace = this.dataFace.filter((w) => w.meta.age.id == e.Age);
          }
        }
        if (e.Skin != "" && e.Skin != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.skin_color.id == e.Skin
          );
        }
        if (e.Hair != "" && e.Skin != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.hairstyle.id == e.Hair
          );
        }
        if (e.Gender != "" && e.Gender != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.gender.id == e.Gender
          );
        }
        if (e.Glass != "" && e.Glass != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.glasses == e.Glass
          );
        }
        if (e.Sunglass != "" && e.Sunglass != undefined) {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.sunglass == e.Sunglass
          );
        }
        if (e.Mask != "" && e.Mask != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.meta.mask == e.Mask);
        }
        if (e.Hat != "" && e.Hat != undefined) {
          this.dataFace = this.dataFace.filter((w) => w.meta.hat == e.Hat);
        }

        if (e.Shirt != "") {
          this.dataFace = this.dataFace.filter(
            (w) => w.meta.upper_body_color == e.Shirt
          );
        }

        for (const result of this.dataFace) {
          obj.push({
            no: no++,
            createdDate: result.createdDate,
            faceImageUri: result.faceImageUri,
            screenImageUri: result.screenImageUri,
            meta: {
              gender: result.meta.gender,
              age: result.meta.age.name,
              skin_color: result.meta.skin_color,
              hairstyle: result.meta.hairstyle,
              upperbody_color: result.meta.upper_body_color,
              glasses: result.meta.glasses == 1 ? "yes" : "-",
              sunglass: result.meta.sunglass == 1 ? "yes" : "-",
              mask: result.meta.mask == 1 ? "yes" : "-",
              hat: result.meta.hat == 1 ? "yes" : "-",
            },
            personType: result.personType.name,
            channel: result.channel,
          });
        }
        this.faceReportData = obj;
        let total = this.faceReportData.length;
        //body.totalResult = total;
        //console.log(body);

        axios
          .post(this.path + `/api/v1/settings?type=1`, { ...body })
          .then((res: any) => {
            console.log(body);
            console.log("Save success");
            axios
              .post(this.path + `/api/v1/notification?type=1`, {
                count: obj.length,
              })
              .then((res: any) => {
                console.log("Save success");
                this.loadingVisible = false;
              })
              .catch((err) => {
                console.log(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
        this.loadingVisible = false;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initSmart() {
    axios
      .get(`${this.path}/api/v1/settings?type=1`)
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
            personType: result.personType.id
              ? {
                  id: result.personType.id,
                  name: result.personType.name,
                }
              : "-",
            meta: {
              gender: result.meta.gender,
              age: result.meta.age.name,
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
              upperbody_color: result.meta.upper_body_color,
            },
          });
        }

        this.faceReportData = itemObj;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  initAge() {
    //skin
    axios
      .get(this.path + `/api/v1/master/age`)
      .then((res: any) => {
        this.ageData = res.data.data;
        console.log(this.ageData);
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
        console.log(this.skinData);
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

  onClickClear() {
    this.ageFromS = "";
    this.valuesAge = "";
    this.currentType = "";
    this.currentSkin = "";
    this.currentGen = "";
    this.currentHair = "";
    this.currentItem = "";
    this.endDateV = "";
    this.startDateV = "";
  }
}
