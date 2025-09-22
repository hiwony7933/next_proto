// Next.js 파일시스템 라우팅에 맞춘 경로 상수 어댑터
// 기존 SPA에서 사용하던 GUIDE_ROUTE_PATH를 대체합니다.

export const GUIDE_ROUTE_PATH = {
  HOME: "/guide",
  STANDARD_GUIDE: "/guide/samples/standard-guide",
  // form
  SAMPLE_FORM_ADDRESS: "/guide/samples/form-address",
  SAMPLE_FORM_CHECKBOX: "/guide/samples/form-checkbox",
  SAMPLE_FORM_DATE_PICKER: "/guide/samples/form-date-picker",
  SAMPLE_FORM_DATE_RANGE_PICKER: "/guide/samples/form-date-range-picker",
  SAMPLE_FORM_FILEUPLOAD: "/guide/samples/form-file-upload",
  SAMPLE_FORM_INPUT_BOX: "/guide/samples/form-input-box",
  SAMPLE_FORM_PHONENUMBER: "/guide/samples/form-phone-number",
  SAMPLE_FORM_SELECTBOX: "/guide/samples/form-select-box",
  SAMPLE_FORM_TEXTAREA: "/guide/samples/form-text-area",
  SAMPLE_FORM_EDITOR: "/guide/samples/form-editor",
  SAMPLE_FORM_IMAGETYPE: "/guide/samples/form-image-type",
  // ui
  SAMPLE_UI_ALERT: "/guide/samples/ui-alert",
  SAMPLE_UI_BUTTON: "/guide/samples/ui-button",
  SAMPLE_UI_FAQ: "/guide/samples/ui-faq",
  SAMPLE_UI_MODAL: "/guide/samples/ui-modal",
  SAMPLE_UI_TABS: "/guide/samples/ui-tabs",
  SAMPLE_UI_TOOLTIP: "/guide/samples/ui-tooltip",
  SAMPLE_UI_TREE: "/guide/samples/ui-tree",
  SAMPLE_UI_TREE_NEW: "/guide/samples/ui-tree-new",
  // admin
  SAMPLE_ADMIN_DEFAULT_LAYOUT: "/guide/samples/admin-default-layout",
  SAMPLE_ADMIN_TITLE: "/guide/samples/admin-title",
  SAMPLE_ADMIN_SEARCH: "/guide/samples/admin-search",
  SAMPLE_ADMIN_LIST: "/guide/samples/admin-list",
  SAMPLE_ADMIN_LAYOUT: "/guide/samples/admin-layout",
  SAMPLE_ADMIN_TUI_GRID: "/guide/samples/admin-tui-grid",
  SAMPLE_ADMIN_LAYOUT_HTML01: "/guide/samples/admin-layout-html01",
  SAMPLE_ADMIN_LAYOUT_HTML02: "/guide/samples/admin-layout-html02",
  SAMPLE_ADMIN_LAYOUT_HTML03: "/guide/samples/admin-layout-html03",
  // list
  SAMPLE_LIST: "/guide/samples/list",

  SAMPLE_CORNER_BANNER001: "/guide/samples/corner-banner001",
  SAMPLE_CORNER_BANNER002: "/guide/samples/corner-banner002",
  SAMPLE_CORNER_BLOCK001: "/guide/samples/corner-block001",
  SAMPLE_CORNER_BLOCK002: "/guide/samples/corner-block002",
  SAMPLE_CORNER_CHECK001: "/guide/samples/corner-check001",
  SAMPLE_CORNER_BANNER003: "/guide/samples/corner-banner003",
  SAMPLE_CORNER_VIDEO001: "/guide/samples/corner-video001",
  SAMPLE_CORNER_FAQ001: "/guide/samples/corner-faq001",
  SAMPLE_CORNER_FAQ002: "/guide/samples/corner-faq002",
  SAMPLE_CORNER_CATEGORY001: "/guide/samples/corner-category001",
} as const;

export default GUIDE_ROUTE_PATH;
