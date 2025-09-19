import { GUIDE_ROUTE_PATH } from '../routers/routePath';
import { ADMIN_ROUTE_PATH, ADMIN_BASE_PATH } from '../../admin/routers/routePath';

export const MenuList = [
  {
    Depth01: 'A100',
    MenuName: '<em>[00]</em> 표준 가이드',
    LinkUrl: GUIDE_ROUTE_PATH.STANDARD_GUIDE,
    flag: 'Design',
    Depth02: [],
  },
  {
    Depth01: 'A100',
    MenuName: '<em>[01]</em> 공통 컴포넌트',
    flag: 'Design',
    Depth02: [
      {
        sub02Code: 'A101',
        flag: 'Confirm',
        SubMenuName: 'Form',
        LinkUrl: '',
        Depth03: [
          {
            sub03Code: 'A10101',
            flag: 'Confirm',
            SubMenuName: 'Address',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_ADDRESS,
          },
          {
            sub03Code: 'A10107',
            flag: 'Confirm',
            SubMenuName: 'PhoneNumber',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_PHONENUMBER,
          },
          {
            sub03Code: 'A10107',
            flag: 'Design',
            SubMenuName: 'File Upload',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_FILEUPLOAD,
          },
          {
            sub03Code: 'A10105',
            flag: 'Confirm',
            SubMenuName: 'CheckBox',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_CHECKBOX,
          },
          {
            sub03Code: 'A10107',
            flag: 'Confirm',
            SubMenuName: 'DatePicker(단일날짜)',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_DATE_PICKER,
          },
          {
            sub03Code: 'A10107',
            flag: 'Confirm',
            SubMenuName: 'DateRangePicker(기간/범위)',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_DATE_RANGE_PICKER,
          },
          {
            sub03Code: 'A10106',
            flag: 'Confirm',
            SubMenuName: 'InputText',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_INPUT_BOX,
          },
          {
            sub03Code: 'A10104',
            flag: 'Confirm',
            SubMenuName: 'SelectBox',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_SELECTBOX,
          },
          {
            sub03Code: 'A10109',
            flag: 'Confirm',
            SubMenuName: 'MzEditor (TUI editor)',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_EDITOR,
          },
          {
            sub03Code: 'A10109',
            flag: 'Design',
            SubMenuName: 'MzCkEditor (CK editor)',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_EDITOR,
          },
          {
            sub03Code: 'A10108',
            flag: 'Confirm',
            SubMenuName: 'MzTextArea',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_TEXTAREA,
          },
          {
            sub03Code: 'A10111',
            flag: 'Design',
            SubMenuName: 'ImageType',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_FORM_IMAGETYPE,
          },
        ],
      },
      {
        sub02Code: 'A102',
        flag: 'Design',
        SubMenuName: 'UI/UX',
        LinkUrl: '',
        Depth03: [
          {
            sub03Code: 'A10102',
            flag: 'Confirm',
            SubMenuName: 'Alert',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_ALERT,
          },
          {
            sub03Code: 'A10103',
            flag: 'Confirm',
            SubMenuName: 'Button',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_BUTTON,
          },
          {
            sub03Code: 'A10107',
            flag: 'Design',
            SubMenuName: 'FAQ',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_FAQ,
          },
          {
            sub03Code: 'A10101',
            flag: 'Design',
            SubMenuName: 'Modal',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_MODAL,
          },
          {
            sub03Code: 'A10107',
            flag: 'Design',
            SubMenuName: 'Tabs',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_TABS,
          },
          {
            sub03Code: 'A10102',
            flag: 'Design',
            SubMenuName: 'Tooltip',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_TOOLTIP,
          },
          {
            sub03Code: 'A10110',
            flag: 'Design',
            SubMenuName: 'Tree TUI',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_TREE,
          },

          {
            sub03Code: 'A10110',
            flag: 'Confirm',
            SubMenuName: 'TreeNew - 메가존 자체 제작 컴포넌트',
            LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_UI_TREE_NEW,
          },
        ],
      },
    ],
  },
  {
    Depth01: 'A100',
    MenuName: '<em>[02]</em> 코너 컴포넌트 (SK 쉴더스)',
    flag: 'Confirm',
    Depth02: [
      {
        sub02Code: 'A201',
        flag: 'Confirm',
        SubMenuName: 'cornerBanner001 (상단 배너)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BANNER001,
      },
      {
        sub02Code: 'A202',
        flag: 'Confirm',
        SubMenuName: 'cornerBanner002 (광고 배너)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BANNER002,
      },
      {
        sub02Code: 'A207',
        flag: 'Confirm',
        SubMenuName: 'cornerBlock001 (스와이프 블록)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BLOCK001,
      },
      {
        sub02Code: 'A207',
        flag: 'Confirm',
        SubMenuName: 'cornerBlock002 (단일 블록)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BLOCK002,
      },
      {
        sub02Code: 'A207',
        flag: 'Confirm',
        SubMenuName: 'cornerCheck001 (체크 블록)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_CHECK001,
      },
      {
        sub02Code: 'A207',
        flag: 'Confirm',
        SubMenuName: 'cornerBanner003 (광고 버튼 배너)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BANNER003,
      },
      {
        sub02Code: 'A207',
        flag: 'Confirm',
        SubMenuName: 'cornerVideo001 (동영상 블록)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_VIDEO001,
      },
      {
        sub02Code: 'A203',
        flag: 'Confirm',
        SubMenuName: 'cornerFaq001 (FAQ 블록 - class 타입 추가됨)',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_FAQ001,
      },
      {
        sub02Code: 'A204',
        flag: 'Confirm',
        SubMenuName: '[CATEGORY01] <em>코너 샘플 컨텐츠 확인 </em>',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_CATEGORY001,
      },
      {
        sub02Code: 'A205',
        flag: 'Confirm',
        SubMenuName: '[CATEGORY02] <em>코너 샘플 컨텐츠 확인 </em>',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_CATEGORY002,
      },
      {
        sub02Code: 'A206',
        flag: 'Confirm',
        SubMenuName: '[BLOG01] <em>코너 샘플 컨텐츠 확인 </em>',
        LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_CORNER_BLOG001,
      },
    ],
  },
  // {
  //   Depth01: "A100",
  //   MenuName: "<em>[02]</em> Admin Layout 컴포넌트",
  //   flag: "Design",
  //   Depth02: [
  //     {
  //       sub02Code: "A103",
  //       flag: "Confirm",
  //       SubMenuName: "기본 레이아웃 (header, sidebar, tab)",
  //       LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_DEFAULT_LAYOUT,

  //     },
  //     {
  //       sub02Code: "A103",
  //       flag: "Confirm",
  //       SubMenuName: "영역 기능별 컴포넌트",
  //       LinkUrl: "",
  //       Depth03: [
  //         {
  //           sub03Code: "A10301",
  //           flag: "Confirm",
  //           SubMenuName: "Title Area",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_TITLE
  //         },
  //         {
  //           sub03Code: "A103",
  //           flag: "Confirm",
  //           SubMenuName: "Search Box",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_SEARCH
  //         },
  //         {
  //           sub03Code: "A107",
  //           flag: "Confirm",
  //           SubMenuName: "AdminGrid",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_TUI_GRID
  //         },

  //         {
  //           sub03Code: "A105",
  //           flag: "Design",
  //           SubMenuName: "Write Box",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LIST
  //         },
  //         {
  //           sub03Code: "A105",
  //           flag: "Design",
  //           SubMenuName: "List Box",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LIST
  //         },
  //       ]
  //     },

  //     {
  //       sub02Code: "A106",
  //       flag: "Design",
  //       SubMenuName: "Layout",
  //       LinkUrl: "",
  //       Depth03: [
  //         {
  //           sub03Code: "A104",
  //           flag: "Confirm",
  //           SubMenuName: "Search + List",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LAYOUT_HTML01
  //         },
  //         {
  //           sub03Code: "A104",
  //           flag: "Confirm",
  //           SubMenuName: "Search + List(좌) + List(우)",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LAYOUT_HTML02
  //         },
  //         {
  //           sub03Code: "A104",
  //           flag: "Confirm",
  //           SubMenuName: "Search + Tree(좌) + Write(상) + List(하)",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LAYOUT_HTML03
  //         },
  //         {
  //           sub03Code: "A104",
  //           flag: "Confirm",
  //           SubMenuName: "Tree + Write(상) + List(하)",
  //           LinkUrl: GUIDE_ROUTE_PATH.SAMPLE_ADMIN_LIST
  //         },

  //       ]
  //     }
  //   ]

  // },
  // {
  //   Depth01: "A100",
  //   MenuName: "<em>[02]</em> 어드민 페이지",
  //   flag: "Design",
  //   Depth02: [
  //     {
  //       sub02Code: "A108",
  //       flag: "Design",
  //       SubMenuName: "메인",
  //       LinkUrl: ADMIN_BASE_PATH,
  //     },
  //     {
  //       sub02Code: "A108",
  //       flag: "Design",
  //       SubMenuName: "샘플 리스트 1",
  //       LinkUrl: `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.SAMPLE_LIST}`,

  //     },
  //     {
  //       sub02Code: "A108",
  //       flag: "Design",
  //       SubMenuName: "AI 페이지 1",
  //       LinkUrl: `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.AI_PAGE}`,
  //     },

  //   ]
  // },
  {
    Depth01: 'A108',
    flag: 'Design',
    MenuName: '<em>[04]</em> 전시 템플릿',
    LinkUrl: '',
    Depth02: [
      {
        sub02Code: 'A202',
        flag: 'Admin',
        SubMenuName: '코너 관리',
        LinkUrl: `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.DISPLAY_CORNER_MGT}`,
      },
      {
        sub02Code: 'A201',
        flag: 'Admin',
        SubMenuName: '템플릿 관리',
        LinkUrl: `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.DISPLAY_TEMPLETE_MGT}`,
      },
      {
        sub02Code: 'A203',
        flag: 'Admin',
        SubMenuName: '카테고리 관리',
        LinkUrl: `${ADMIN_BASE_PATH}/${ADMIN_ROUTE_PATH.DISPLAY_CATEGORY_MGT}`,
      },
    ],
  },
];
