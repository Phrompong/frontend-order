export class MetaData {
  public expire_time!: number;
  public expire_timestamp!: number;
  public repo_capacity!: number;
  public type!: number;
}

export class Repositories {
  public create_time!: number;
  public face_number!: number;
  public id!: number;
  public local!: boolean;
  public meta!: MetaData;
  public name!: string;
  public summary!: string;
  public sync!: number;
  public update_time!: number;
}

export class RepositoryModel {
  public repositories!: Repositories[];
}
