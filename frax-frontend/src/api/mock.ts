import type {IPaginatedFactors} from "../types/index.ts";



export const FACTORS_MOCK: IPaginatedFactors = {
  total: 3,
  items: [
    {
      id: 101,
      title: "Курение",
      text: "Курение является одним из главных факторов риска.",
      image: "/RIP_Frontend_Web_Service/mock_images/default.png",
      argument: 1.0,
      status: false,
    },
    {
      id: 102,
      title: "Алкоголизм",
      text: "Алкоголизм увеличивает риск переломов.",
      image:"/RIP_Frontend_Web_Service/mock_images/default.png",
      argument: 0.8,
      status: false,
    },
    {
      id: 103,
      title: "Предыдущие переломы",
      text: "Предыдущие переломы - это основополагающая причина будущих переломов.",
      image:"/RIP_Frontend_Web_Service/mock_images/default.png",
      argument: 4.0,
      status: false,
    },
  ],
};