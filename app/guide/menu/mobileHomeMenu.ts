import { GUIDE_ROUTE_PATH } from '../routers/routePath';

export const MenuList =
  [
    {
      Depth01: "A100",
      MenuName: "<em>[00]</em> 공통컴포넌트",
      flag: "Design",
      Depth02: [
        {
          sub02Code: "A110",
          flag: "Design",
          SubMenuName: "<em>[]</em> sweetalert2 Alert",
          LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_ALERT,
          Depth03: []
        },
        {
          sub02Code: "A120",
          flag: "Design",
          SubMenuName: "<em>[]</em> hw-component",
          LinkUrl: "//hanway2-dev.hanjingroup.co.kr/hw-component",
          Depth03: []
        }
      ]
    }
  ]
