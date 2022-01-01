export class MetaDataTrackFace {
  public age!: number;
  public beard!: number;
  public calling!: number;
  public gender!: number;
  public glasses!: number;
  public hairstyle!: number;
  public hat!: number;
  public kucivilk!: number;
  public mask!: number;
  public quality_score!: number;
  public sunglass!: number;
}

export class DataTrackFace {
  public face_id!: string;
  public face_image_uri!: string;
  public face_image_content!: string;
  public scene_image_content!: string;
  public meta!: MetaDataTrackFace;
  public timestamp!: number;
  public scene_image_uri!: string;
  public channel_id!: number;
}

export class DataFace {
  channelName: string;
  name: string;
  similarity: string;
  channel_id!: number;
  faceId!: string;
  faceImageUri: string;
  meta!: Meta;

  personType!: PersonType;
  screenImageUri!: string;
  timestamp!: number;
  createdDate!: Date;
  channel!: string;
  month!: number;
  year!: number;
  _id!: string;
}

export class setFace {
  _id: string;
  startDate: string;
  endDate: string;
  Age: number;
  gender: number;
  skin: number;
  hairStyle: number;
  glass: number;
  sunglass: number;
  mask: number;
  hat: number;
}

export class ageMaster {
  id!: number;
  name!: string;
}

export class UpperbodyColor {
  id!: number;
  name!: string;
}

export class Meta {
  age!: ageMaster;
  beard!: number;
  calling!: number;
  gender!: Gender;
  glasses!: number;
  hairstyle!: Hairstyle;
  hat!: number;
  mask!: number;
  quality_score!: number;
  skin_color!: Skin;
  sunglass!: number;
  upperbody_color!: UpperbodyColor;
  upper_body_color!: string;
}
export class Skin {
  id!: number;
  name!: string;
}

export class Hairstyle {
  id!: number;
  name!: string;
}
export class Gender {
  id!: number;
  name!: string;
}

export class PersonType {
  id!: number;
  name!: string;
}

export class repo {
  expire_time: number;
  expire_timestamp: number;
  repo_capacity: number;
  type: number;
}

export class RootObject {
  create_time: number;
  face_number: number;
  id: number;
  local: boolean;
  meta: repo;
  name: string;
  summary: string;
  sync: number;
  update_time: number;
}

export class Data_lpr {
  _id: string;
  platenumber: string;
  createdDate: string;
  make: string;
  model: string;
  vehicleColor: string;
  vehicleType: string;
  year: number;
  month: number;
  day: number;
  country: string;
}

export class lpr {
  code: number;
  msg: string;
  data: Data_lpr[];
}

export class page {
  total: number;
  page: string;
  pages: number;
}

export class lpr_detail {
  lpr: Data_lpr[];
  _metadata: page;
}
