export interface Travel {
  time: string;
  city: string;
  url: string;
}
import record1 from "../assets/images/record-1.png";
import record2 from "../assets/images/record-2.jpeg";

export const record: Travel[] = [
  {
    time: "20251009",
    city: "马尔代夫",
    url: record1,
  },
  {
    time: "20251105",
    city: "浙江",
    url: record2,
  },
];
