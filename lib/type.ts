export interface GrowthHistoryEntry {
  date: string;
  age: string;
  weight: number;
  height: number;
  bmi: number;
  status: string;
}

export interface GrowthChartPoint {
  age: string;
  weight: number;
  height: number;
}

export interface ParentInfo {
  fullName: string;
  age: string;
  job: string;
  phone: string;
  income: string;
}

export interface GuardianInfo {
  fullName: string;
  age: string;
  job: string;
  phone: string;
  income: string;
  relation: string;
}

export interface PermanentAddress {
  houseNumber: string;
  moo: string;
  road: string;
  alley: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface AddressInfo {
  houseNumber: string;
  moo: string;
  road: string;
  alley: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  permanent?: PermanentAddress;
}

export interface ChildData {
  id: string;
  prefix: string;
  fullName: string;
  birthDate: string;
  personalId: string;
  religion: string;
  bloodType: string;
  address: AddressInfo;
  father: ParentInfo;
  mother: ParentInfo;
  guardian: GuardianInfo;
  growthHistory: GrowthHistoryEntry[];
  growthChart: { age: string; weight: number; height: number }[];
}
