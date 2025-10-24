import type {IPaginatedFactors} from "../types/index.ts";

export const FACTORS_MOCK: IPaginatedFactors = {
  total: 3,
  items: [
    {
      id: 101,
      title: "Курение",
      text: "Курение является одним из главных факторов риска.",
      image: "http://localhost:9000/factors/Images/smoking.png",
      argument: 1.0,
      status: false,
    },
    {
      id: 102,
      title: "Алкоголизм",
      text: "Алкоголизм увеличивает риск переломов.",
      image:"http://localhost:9000/factors/Images/alcoholism.png",
      argument: 0.8,
      status: false,
    },
    {
      id: 103,
      title: "Предыдущие переломы",
      text: "Предыдущие переломы - это основополагающая причина будущих переломов.",
      image:"http://localhost:9000/factors/Images/previous fractures.png",
      argument: 4.0,
      status: false,
    },
  ],
};