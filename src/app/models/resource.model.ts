export class CpuModel {
  public idle!: number;
  public total!: number;
  public usage_rate!: number;
}

export class DiskModel {
  public free!: number;
  public total!: number;
  public usage_rate!: number;
}

export class RamModel {
  public free!: number;
  public total!: number;
  public usage_rate!: number;
}

export class TimeModel {
  public begin!: number;
  public duration!: number;
  public now!: number;
}

export class ResourceModel {
  public cpu!: CpuModel;
  public disk!: DiskModel;
  public ram!: RamModel;
  public time!: TimeModel;
}
