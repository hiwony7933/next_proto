"use client";
import React, { useState, useEffect, useRef } from "react";
import GridBuilder, { DateUtil } from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import MzButton from "../../../common/components/ui/mzButton";
import MzInputText from "../../../common/components/form/mzInputText";
import MzDatePicker from "../../../common/components/form/mzDatePicker";
import { MzCheckBox } from "../../../common/components/form/mzCheckBox";
import MzAlert from "../../../common/components/ui/mzAlert";
import JobGroupSearchModal from "../jobGroupSearchModal/page";
import MenuSearchModal from "../menuSearchModal/page";
import "../../styles/adminStyle.scss";
import "../../components/sample/exGridBuilder.scss";
import Image from "next/image";
import iconSearch from "@public/images/admin/iconSearch.png";
import {
  getUserDetail,
  saveUser,
  deleteUser,
  initPassword,
  getUserMenuList,
} from "../../api/userMgt";
import styles from "../mgmt.module.scss";

// 업무그룹 선택 타입 정의
interface JobGroupData {
  jobGrpCd: string;
  jobGrpNm: string;
  jobSctCd: string;
  jobSctNm: string;
  useYn: string;
}

// 타입 정의
type User = {
  usrId?: string;
  usrNm?: string;
  jobGrpCd?: string;
  jobGrpNm?: string;
  useYn?: string;
  sysRegDtime?: string;
  emailAddr?: string;
  loginFailCnt?: number;
  passwd?: string;
  cellSctNo?: string;
  cellRgnNo?: string;
  cellEndNo?: string;
  usrSctCd?: string;
  lecrErpCd?: string;
  tm2sCertMdtyYn?: string;
  useStrtDt?: string;
  useEndDt?: string;
  coNo?: number;
  endpNo?: number;
  orgJobGrpCd?: string;
  id?: string;
  name?: string;
  group?: string;
  active?: boolean;
  createdAt?: string;
  loginFailCount?: number;
  password?: string;
  phone?: string;
  period?: string;
  twoFactor?: boolean;
};

type Menu = {
  id: number;
  name: string;
  path: string;
  use: boolean;
  rtTgtSeq?: string;
  mrkNm?: string;
  rtTgtSctCd?: string;
  useYn?: string;
  // 저장을 위한 추가 필드들
  usrId?: string;
  rtTgtNm?: string;
  status?: "i" | "u" | "d"; // insert, update, delete
};

type DetailCell = {
  label: string;
  value: string | number;
  name: string;
  type: "text" | "password" | "radio" | "dateRange";
  required: boolean;
  readOnly?: boolean;
};

type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

// 상수
const initialQuery = { usrId: "", usrNm: "", jobGrpCd: "", jobGrpNm: "" };

// 휴대폰번호 포맷팅 함수
const formatPhoneNumber = (
  sctNo?: string,
  rgnNo?: string,
  endNo?: string
): string => {
  if (!sctNo && !rgnNo && !endNo) return "";

  const parts = [sctNo, rgnNo, endNo].filter(
    (part) => part && part.trim() !== ""
  );
  return parts.length > 0 ? parts.join("-") : "";
};

const defaultMenus: Menu[] = [
  {
    id: 1,
    name: "대시보드",
    path: "/dashboard",
    use: true,
    rtTgtSeq: "DASHBOARD",
    mrkNm: "대시보드",
    useYn: "Y",
  },
  {
    id: 2,
    name: "사용자관리",
    path: "/user",
    use: true,
    rtTgtSeq: "USER_MGMT",
    mrkNm: "사용자관리",
    useYn: "Y",
  },
];

// 사용자 리스트 그리드 설정
const userListGridConfig = {
  id: "userListGrid",
  rowHeaders: [],
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "로그인ID",
      name: "usrId",
      width: 120,
      editable: false,
    },
    {
      header: "사용자명",
      name: "usrNm",
      width: 120,
      editable: false,
    },
    {
      header: "업무그룹명",
      name: "jobGrpNm",
      width: 150,
      editable: false,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 80,
      formatter: ({ value }: { value: string }) =>
        value === "Y" ? "사용" : "미사용",
      editable: false,
    },
    {
      header: "생성일자",
      name: "sysRegDtime",
      width: 120,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd"),
      ellipsis: true,
      editable: false,
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: false,
    rowExcelAll: false,
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "userSearchForm",
  saveAfterSearch: false,
  action: "/system/userMgmt.getUserList.do",
  actionAfterCallback: true,
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

// 메뉴 그리드 설정
const menuGridConfig = {
  id: "userMenuGrid",
  rowHeaders: [
    {
      type: "checkbox",
    },
  ],
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "메뉴ID",
      name: "id",
      width: 120,
      editable: false,
    },
    {
      header: "화면ID",
      name: "rtTgtSeq",
      width: 120,
      editable: false,
    },
    {
      header: "메뉴명",
      name: "name",
      width: 150,
      editable: false,
    },
    {
      header: "화면명",
      name: "mrkNm",
      width: 150,
      editable: false,
    },
    {
      header: "경로",
      name: "path",
      width: 200,
      editable: false,
    },
    {
      header: "메뉴구분",
      name: "rtTgtSctCd",
      width: 100,
      editable: false,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 80,
      formatter: ({ value }: { value: string }) =>
        value === "Y" ? "사용" : "미사용",
      editable: true, // 사용여부는 편집 가능하도록 변경
      editor: {
        type: "select",
        options: {
          listItems: [
            { text: "사용", value: "Y" },
            { text: "미사용", value: "N" },
          ],
        },
      },
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: false, // 메뉴 추가는 등록 팝업으로 처리
    rowDel: true,
    rowUpdate: true, // 저장 버튼 활성화
    rowExcelAll: false, // 엑셀 다운로드 버튼 비활성화
    excelFileName: "userMenuData",
    rowRegPop: {
      action: "/admin/mgmt/menuSearchModal",
      winname: "menuSearchModal",
      width: 1000,
      height: 800,
    },
  },
  toolbar: {
    items: [],
  },
  pagingable: false, // 클라이언트 사이드 페이징 사용
  form: "userMenuForm",
  action: "/system/userMgmt.getStUsrRtInfoList.do",
  saveAction: "/system/userMgmt.putStUsrRtInfoList.do",
  excelAction: "/system/userMgmt.getStUsrRtInfoListExcel.do",
  resizeOptions: {
    showButton: true,
    minHeight: 200,
    maxHeight: 600,
    step: 50,
  },
  // 버튼 표시를 위한 추가 설정
  keywordSearch: false, // 키워드 검색 비활성화 (Rows 표시 제거)
  // 저장 관련 설정 추가
  saveAfterSearch: false, // 저장 후 자동 재조회 비활성화
  saveAfterCallback: true, // 저장 후 콜백 활성화
  // 삭제 전 콜백 활성화
  deleteBeforeCallback: true,
  // 필수 컬럼 설정 (저장 시 검증용)
  requiredColumns: [
    { header: "화면ID", name: "rtTgtSeq" },
    { header: "메뉴명", name: "name" },
  ],
  // rowKey 설정 추가
  rowKey: "id",
};

// API 함수들

const fetchUserDetail = async (params: { usrId: string }): Promise<User[]> => {
  try {
    const response = await getUserDetail(params);
    return response.data.data || [];
  } catch {
    return [];
  }
};

const saveUserData = async (
  userData: User
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await saveUser(userData);
    return { success: response.data.succeeded, message: response.data.message };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      success: false,
      message: err.response?.data?.message || "저장 중 오류가 발생했습니다.",
    };
  }
};

const deleteUserData = async (
  userData: User
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await deleteUser(userData);
    return { success: response.data.succeeded, message: response.data.message };
  } catch {
    return {
      success: false,
      message: "삭제 중 오류가 발생했습니다.",
    };
  }
};

const initUserPassword = async (
  usrId: string
): Promise<{ success: boolean; tempPassword?: string; message?: string }> => {
  try {
    const response = await initPassword(usrId);
    return {
      success: response.data.succeeded,
      tempPassword: response.data.data,
      message: response.data.message,
    };
  } catch {
    return {
      success: false,
      message: "비밀번호 초기화 중 오류가 발생했습니다.",
    };
  }
};

const fetchUserMenuList = async (params: {
  menuUsrId: string;
}): Promise<Menu[]> => {
  try {
    const response = await getUserMenuList(params);
    const menus = response.data.data || [];
    // id 필드 추가 (고유한 ID 생성)
    return menus.map((menu: Menu, index: number) => ({
      ...menu,
      id: menu.id || Date.now() + index, // 고유한 ID 생성
      rowKey: menu.id || Date.now() + index, // rowKey도 명시적으로 설정
    }));
  } catch {
    return defaultMenus.map((menu: Menu, index: number) => ({
      ...menu,
      id: menu.id || Date.now() + index, // 고유한 ID 생성
      rowKey: menu.id || Date.now() + index, // rowKey도 명시적으로 설정
    }));
  }
};

const UserManagement: React.FC = () => {
  // 상태 관리
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  // 추가 모드 상태 관리
  const [isAddMode, setIsAddMode] = useState(false);
  const [tempUserRow, setTempUserRow] = useState<User | null>(null);
  // 사용자 리스트 총 건수 상태 추가
  const [userListTotalCount, setUserListTotalCount] = useState<number>(0);

  // 업무그룹 검색 모달 상태
  const [isJobGroupModalOpen, setIsJobGroupModalOpen] = useState(false);
  const [jobGroupTarget, setJobGroupTarget] = useState<"search" | "detail">(
    "search"
  );

  // 메뉴 검색 모달 상태
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // API 호출 캐싱을 위한 상태
  const [userDetailCache, setUserDetailCache] = useState<Map<string, User>>(
    new Map()
  );
  const [menuCache, setMenuCache] = useState<Map<string, Menu[]>>(new Map());

  // GridBuilder refs
  const userListGridRef = useRef<unknown>(null);
  const menuGridRef = useRef<any>(null);

  // 사용자 리스트 그리드 초기화
  const handleUserListGridInit = (grid: unknown) => {
    userListGridRef.current = grid;

    // 행 클릭 시 사용자 선택
    try {
      (
        grid as {
          on: (event: string, cb: (ev: unknown) => void) => void;
          getValue: (rowKey: number, col: string) => string;
        }
      ).on("click", (ev: unknown) => {
        try {
          // 추가 모드일 때는 행 클릭 이벤트 무시
          if (isAddMode) {
            return;
          }

          const { rowKey } = ev as { rowKey: number };
          if (rowKey !== undefined && rowKey !== null) {
            const usrId = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "usrId");
            const usrNm = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "usrNm");
            const jobGrpNm = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "jobGrpNm");
            const useYn = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "useYn");
            const sysRegDtime = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "sysRegDtime");

            if (usrId) {
              const selectedUser: User = {
                usrId,
                usrNm,
                jobGrpNm,
                useYn,
                sysRegDtime,
              };
              handleSelectUser(selectedUser);
            }
          }
        } catch (error) {
          console.error("행 클릭 이벤트 처리 중 오류:", error);
        }
      });
    } catch (error) {
      console.error("그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 사용자 리스트 검색 콜백
  const handleUserListSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: User[]; total?: number };

      if (responseObj.data) {
        // 추가 모드일 때는 검색 결과를 덮어쓰지 않음
        if (isAddMode) {
          return;
        }

        setUsers(responseObj.data);

        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setUserListTotalCount(totalCount);
      } else {
        setUsers([]);
        setUserListTotalCount(0);
      }
    }

    // 검색 완료 후 로딩 상태 해제
    setLoading(false);
  };

  // 메뉴 그리드 초기화
  const handleMenuGridInit = (grid: unknown) => {
    menuGridRef.current = grid;

    // 초기 데이터를 gridDataRef에 저장 (GridBuilder 내부에서 사용)
    if (
      grid &&
      typeof (grid as { getData?: () => Menu[] }).getData === "function"
    ) {
      const initialData = (grid as { getData: () => Menu[] }).getData();
      if (initialData && initialData.length > 0) {
        // GridBuilder의 gridDataRef에 초기 데이터 저장
        const gridInstance = grid as any;
        if (gridInstance._gridDataRef) {
          gridInstance._gridDataRef.current = {};
          initialData.forEach((item: Menu) => {
            const rowKey = item.id;
            if (rowKey !== undefined) {
              gridInstance._gridDataRef.current[rowKey] = item;
            }
          });
        }
      }
    }

    // 메뉴 데이터가 변경될 때마다 gridDataRef 업데이트 및 총 건수 표시 업데이트
    const updateMenuGridData = () => {
      setTimeout(() => {
        if (menuGridRef.current && menuGridRef.current.getGrid) {
          const gridInstance = menuGridRef.current.getGrid();
          if (
            gridInstance &&
            typeof (gridInstance as { getData: () => Menu[] }).getData ===
              "function"
          ) {
            const gridData = (
              gridInstance as { getData: () => Menu[] }
            ).getData();
            if (gridData && gridData.length > 0) {
              const gridInstanceAny = gridInstance as {
                _gridDataRef?: { current: Record<string | number, Menu> };
              };
              if (
                gridInstanceAny._gridDataRef &&
                gridInstanceAny._gridDataRef.current
              ) {
                gridInstanceAny._gridDataRef.current = {};
                gridData.forEach((item: Menu) => {
                  const rowKey = item.id;
                  if (rowKey !== undefined) {
                    gridInstanceAny._gridDataRef!.current[rowKey] = item;
                  }
                });
              }
            }

            // 메뉴 그리드의 총 건수 표시 업데이트
            const totalCountElement = document.querySelector(
              "#userMenuGrid-totalcount"
            );
            if (totalCountElement) {
              totalCountElement.innerHTML = ` (Rows: <strong>${gridData.length}</strong>)`;
            }
          }
        }
      }, 100);
    };

    updateMenuGridData();

    // 체크박스 변경 이벤트 리스너 추가
    try {
      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "check",
        () => {
          // 체크박스 변경 시 menus 상태 업데이트 및 총 건수 표시 업데이트
          setTimeout(() => {
            if (menuGridRef.current && menuGridRef.current.getGrid) {
              const gridInstance = menuGridRef.current.getGrid();
              if (
                gridInstance &&
                typeof (gridInstance as { getData: () => Menu[] }).getData ===
                  "function"
              ) {
                const gridData = (
                  gridInstance as { getData: () => Menu[] }
                ).getData();
                setMenus(gridData || []);

                // 메뉴 그리드의 총 건수 표시 업데이트
                const totalCountElement = document.querySelector(
                  "#userMenuGrid-totalcount"
                );
                if (totalCountElement) {
                  totalCountElement.innerHTML = ` (Rows: <strong>${gridData.length}</strong>)`;
                }
              }
            }
          }, 100);
        }
      );

      (grid as { on: (event: string, cb: (ev: unknown) => void) => void }).on(
        "uncheck",
        () => {
          // 체크박스 해제 시 menus 상태 업데이트 및 총 건수 표시 업데이트
          setTimeout(() => {
            if (menuGridRef.current && menuGridRef.current.getGrid) {
              const gridInstance = menuGridRef.current.getGrid();
              if (
                gridInstance &&
                typeof (gridInstance as { getData: () => Menu[] }).getData ===
                  "function"
              ) {
                const gridData = (
                  gridInstance as { getData: () => Menu[] }
                ).getData();
                setMenus(gridData || []);

                // 메뉴 그리드의 총 건수 표시 업데이트
                const totalCountElement = document.querySelector(
                  "#userMenuGrid-totalcount"
                );
                if (totalCountElement) {
                  totalCountElement.innerHTML = ` (Rows: <strong>${gridData.length}</strong>)`;
                }
              }
            }
          }, 100);
        }
      );
    } catch (error) {
      console.error("메뉴 그리드 이벤트 바인딩 중 오류:", error);
    }
  };

  // 메뉴 그리드 검색 콜백
  const handleMenuSearch = () => {
    // 검색 결과 처리
  };

  // 메뉴 그리드 저장 전 콜백
  const handleMenuSaveBefore = (): boolean => {
    // 사용자가 선택되지 않은 경우
    if (!selectedUser?.usrId) {
      MzAlert.alert("사용자를 선택해주세요.");
      return false;
    }

    // 그리드에서 체크된 행 확인
    if (menuGridRef.current && menuGridRef.current.getGrid) {
      const grid = menuGridRef.current.getGrid();
      if (
        grid &&
        typeof (grid as { getCheckedRows?: () => Menu[] }).getCheckedRows ===
          "function"
      ) {
        const checkedRows = (
          grid as { getCheckedRows: () => Menu[] }
        ).getCheckedRows();
        if (!checkedRows || checkedRows.length === 0) {
          MzAlert.alert("저장할 메뉴를 선택해주세요.");
          return false;
        }
        return true;
      }
    }

    // 그리드 참조가 없는 경우 menus 상태로 확인
    if (!menus || menus.length === 0) {
      MzAlert.alert("저장할 메뉴 데이터가 없습니다.");
      return false;
    }

    return true;
  };

  // 메뉴 그리드 삭제 전 콜백
  const handleMenuDeleteBefore = (): boolean => {
    // 사용자가 선택되지 않은 경우
    if (!selectedUser?.usrId) {
      MzAlert.alert("사용자를 선택해주세요.");
      return false;
    }

    // GridBuilder에서 자체적으로 체크된 행 확인과 confirm을 처리하므로
    // 여기서는 사용자 선택 여부만 확인
    return true;
  };

  // 메뉴 그리드 저장 콜백
  const handleMenuSave = (response: unknown) => {
    const responseObj = response as { succeeded?: boolean; message?: string };

    if (responseObj && responseObj.succeeded) {
      // GridBuilder에서 이미 성공 메시지를 출력하므로 여기서는 출력하지 않음

      // 저장 성공 시 메뉴 목록 다시 조회
      if (selectedUser?.usrId) {
        fetchUserMenuList({ menuUsrId: selectedUser.usrId }).then(
          (menuList) => {
            setMenus(menuList);
            // 캐시 업데이트
            setMenuCache((prev) =>
              new Map(prev).set(selectedUser.usrId!, menuList)
            );
          }
        );
      }
    } else {
      // 실패 시에만 메시지 출력 (GridBuilder에서 실패 메시지를 출력하지 않는 경우)
      if (!responseObj?.message) {
        MzAlert.alert("메뉴 저장에 실패했습니다.");
      }
    }
  };

  // 메뉴 검색 모달 열기
  const handleMenuRegPop = () => {
    setIsMenuModalOpen(true);
  };

  // 메뉴 선택 처리
  const handleMenuSelect = (
    selectedMenus: {
      rtTgtSeq: string;
      mrkNm: string;
      rtTgtNm: string;
      useYn: string;
    }[]
  ) => {
    // 선택된 메뉴들을 Menu 타입에 맞게 매핑
    const newRows: Menu[] = selectedMenus.map((selectedMenu, index) => ({
      id: Date.now() + Math.random() + index, // 고유한 ID 생성
      name: selectedMenu.rtTgtNm || selectedMenu.mrkNm || "메뉴명 없음", // 권한대상명 또는 화면명 사용
      path: `/menu/${selectedMenu.rtTgtSeq}`, // 화면ID를 기반으로 경로 생성
      use: selectedMenu.useYn === "Y", // boolean으로 변환
      rtTgtSeq: selectedMenu.rtTgtSeq, // 화면ID
      mrkNm: selectedMenu.mrkNm, // 화면명
      rtTgtSctCd: "MENU", // 기본값 설정
      useYn: selectedMenu.useYn || "Y", // 사용여부
      usrId: selectedUser?.usrId, // 사용자 ID 추가
      rtTgtNm: selectedMenu.rtTgtNm, // 권한대상명 추가
      status: "i", // 신규 추가 상태
    }));

    // rowKey를 명시적으로 설정 (TUI Grid에서 사용)
    newRows.forEach((row) => {
      (row as any).rowKey = row.id;
    });

    setMenus((prev) => {
      const newMenus = [...prev, ...newRows];

      // 새로 추가된 메뉴들을 그리드에서 자동으로 체크
      setTimeout(() => {
        if (menuGridRef.current && menuGridRef.current.getGrid) {
          const grid = menuGridRef.current.getGrid();
          if (
            grid &&
            typeof (grid as { check?: (id: number) => void }).check ===
              "function"
          ) {
            newRows.forEach((row) => {
              (grid as { check: (id: number) => void }).check(row.id);
            });
          }

          // 메뉴 그리드의 총 건수 표시 업데이트
          const totalCountElement = document.querySelector(
            "#userMenuGrid-totalcount"
          );
          if (totalCountElement) {
            totalCountElement.innerHTML = ` (Rows: <strong>${newMenus.length}</strong>)`;
          }
        }
      }, 100);

      return newMenus;
    });
  };

  // 메뉴 모달 닫기
  const handleMenuModalClose = () => {
    setIsMenuModalOpen(false);
  };

  // 메뉴 그리드 설정을 동적으로 생성하는 함수
  const getMenuGridConfig = () => {
    const config = {
      ...menuGridConfig,
      data:
        menus.length > 0 ? menus : selectedUser?.usrId && !isAddMode ? [] : [],
      form: "userMenuForm",
      // 사용자가 선택되었을 때만 버튼들 활성화
      rowBtnType: {
        rowAdd: false, // 메뉴 추가는 등록 팝업으로 처리
        rowDel: !!selectedUser && !isAddMode,
        rowUpdate: !!selectedUser && !isAddMode,
        rowExcelAll: false,
        excelFileName: "userMenuData",
        rowRegPop:
          selectedUser && !isAddMode
            ? {
                action: "/admin/mgmt/menuSearchModal",
                winname: "menuSearchModal",
                width: 1000,
                height: 800,
              }
            : undefined,
      },
      // 저장 관련 설정 추가
      saveAfterSearch: false,
      saveAfterCallback: true,
      // 삭제 전 콜백 활성화
      deleteBeforeCallback: !!selectedUser && !isAddMode,
      // 필수 컬럼 설정 (저장 시 검증용)
      requiredColumns: [
        { header: "화면ID", name: "rtTgtSeq" },
        { header: "메뉴명", name: "name" },
      ],
      // 저장 전 콜백 추가 (저장 가능 여부 확인)
      saveBeforeCallback: true,
      // rowKey 설정 추가
      rowKey: "id",
    };

    return config;
  };

  // 검색
  const handleSearch = async (customQuery?: Partial<User>) => {
    // 검색 조건 검증
    const searchQuery = customQuery || query;
    if (!searchQuery.usrId && !searchQuery.usrNm && !searchQuery.jobGrpNm) {
      MzAlert.alert("검색 조건을 하나 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    // 폼에 검색 조건 설정
    const form = document.querySelector("#userSearchForm") as HTMLFormElement;
    if (form) {
      const usrIdInput = form.querySelector(
        'input[name="usrId"]'
      ) as HTMLInputElement;
      const usrNmInput = form.querySelector(
        'input[name="usrNm"]'
      ) as HTMLInputElement;
      const jobGrpNmInput = form.querySelector(
        'input[name="jobGrpNm"]'
      ) as HTMLInputElement;

      if (usrIdInput) usrIdInput.value = searchQuery.usrId || "";
      if (usrNmInput) usrNmInput.value = searchQuery.usrNm || "";
      if (jobGrpNmInput) jobGrpNmInput.value = searchQuery.jobGrpNm || "";
    }

    // 사용자 선택 초기화
    setSelectedUser(null);
    setEditUser(null);
    setMenus([]);
    setIsAddMode(false);
    setTempUserRow(null);

    // 메뉴 그리드 초기화 - 강제로 빈 배열로 설정
    if (menuGridRef.current && menuGridRef.current.getGrid) {
      try {
        const gridInstance = menuGridRef.current.getGrid();
        if (
          gridInstance &&
          typeof (gridInstance as { resetData: (data: unknown[]) => void })
            .resetData === "function"
        ) {
          (gridInstance as { resetData: (data: unknown[]) => void }).resetData(
            []
          );
        }
      } catch (error) {
        console.error("메뉴 그리드 초기화 중 오류:", error);
      }
    }

    // GridBuilder로 검색 실행
    if (userListGridRef.current) {
      try {
        (
          userListGridRef.current as { doSearch: (args?: unknown) => void }
        ).doSearch();
      } catch (error) {
        console.error("GridBuilder doSearch 호출 중 오류:", error);
        setLoading(false);
      }
    } else {
      console.error("사용자 리스트 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }

    // setLoading(false)는 검색 콜백에서 처리하도록 제거
  };

  // 초기화
  const handleReset = () => {
    setQuery(initialQuery);
    setUsers([]);
    setSelectedUser(null);
    setEditUser(null);
    setMenus([]);
    setError("");
    setIsAddMode(false);
    setTempUserRow(null);
    setUserListTotalCount(0);

    // 사용자 리스트 그리드 초기화
    if (userListGridRef.current) {
      try {
        (
          userListGridRef.current as { resetData: (data: unknown[]) => void }
        ).resetData([]);
      } catch (error) {
        console.error("사용자 리스트 그리드 초기화 중 오류:", error);
      }
    }

    // 메뉴 그리드 초기화 - 강제로 빈 배열로 설정
    setMenus([]);
    if (menuGridRef.current && menuGridRef.current.getGrid) {
      try {
        const gridInstance = menuGridRef.current.getGrid();
        if (
          gridInstance &&
          typeof (gridInstance as { resetData: (data: unknown[]) => void })
            .resetData === "function"
        ) {
          (gridInstance as { resetData: (data: unknown[]) => void }).resetData(
            []
          );
        }

        // 메뉴 그리드의 총 건수 표시 업데이트
        setTimeout(() => {
          const totalCountElement = document.querySelector(
            "#userMenuGrid-totalcount"
          );
          if (totalCountElement) {
            totalCountElement.innerHTML = ` (Rows: <strong>0</strong>)`;
          }
        }, 100);
      } catch (error) {
        console.error("메뉴 그리드 초기화 중 오류:", error);
      }
    }
  };

  // 추가 버튼 클릭 핸들러
  const handleAddUser = () => {
    // 기존 임시 행이 있다면 제거
    if (tempUserRow) {
      setUsers((prev) => prev.filter((u) => u.usrId !== tempUserRow.usrId));
    }

    // 추가 모드로 전환
    setIsAddMode(true);

    // 빈 사용자 객체 생성
    const newUser: User = {
      usrId: "",
      usrNm: "",
      jobGrpCd: "",
      jobGrpNm: "",
      useYn: "Y",
      emailAddr: "",
      passwd: "",
      cellSctNo: "",
      cellRgnNo: "",
      cellEndNo: "",
      loginFailCnt: 0,
      tm2sCertMdtyYn: "N",
      useStrtDt: "",
      useEndDt: "",
      coNo: 1,
      endpNo: 100,
      usrSctCd: "10",
      orgJobGrpCd: "",
    };

    // 임시 사용자 행 생성 (리스트에 추가할 용도) - 신규 사용자 표시
    const tempRow: User = {
      id: "temp_user", // 임시 사용자 ID
      usrId: "[신규 사용자]", // 신규 사용자 표시
      usrNm: "[사용자명 입력 필요]", // 사용자명 입력 필요 표시
      jobGrpNm: "[업무그룹 선택 필요]", // 업무그룹 선택 필요 표시
      useYn: "Y",
      sysRegDtime: new Date().toISOString().split("T")[0],
    };

    setTempUserRow(tempRow);
    setSelectedUser(newUser);
    setEditUser(newUser);
    setMenus([]); // 메뉴 데이터 초기화
    setError("");

    // 메뉴 그리드 초기화 - 강제로 빈 배열로 설정
    if (menuGridRef.current && menuGridRef.current.getGrid) {
      try {
        const gridInstance = menuGridRef.current.getGrid();
        if (
          gridInstance &&
          typeof (gridInstance as { resetData: (data: unknown[]) => void })
            .resetData === "function"
        ) {
          (gridInstance as { resetData: (data: unknown[]) => void }).resetData(
            []
          );
        }
      } catch (error) {
        console.error("메뉴 그리드 초기화 중 오류:", error);
      }
    }

    // 사용자 리스트 초기화 후 임시 행 추가
    setUsers([tempRow]);
  };

  // 사용자 선택
  const handleSelectUser = async (user: User) => {
    // 추가 모드에서는 사용자 선택 불가
    if (isAddMode) {
      return;
    }

    // 이미 선택된 사용자와 같은 경우 중복 호출 방지
    if (selectedUser?.usrId === user.usrId) {
      return;
    }

    setSelectedUser(user);
    setEditUser({ ...user });
    setMenus([]); // 메뉴 정보 초기화
    setError("");

    // 사용자 상세 정보 및 메뉴 정보 조회 (캐시 활용)
    if (user.usrId) {
      try {
        // 캐시된 데이터가 있는지 확인
        const cachedUserDetail = userDetailCache.get(user.usrId);
        const cachedMenuList = menuCache.get(user.usrId);

        // 캐시된 데이터가 있으면 사용
        if (cachedUserDetail) {
          setEditUser({ ...user, ...cachedUserDetail });
        }

        if (cachedMenuList) {
          setMenus(cachedMenuList);
        }

        // 캐시된 데이터가 없거나 강제 새로고침이 필요한 경우에만 API 호출
        if (!cachedUserDetail || !cachedMenuList) {
          const [userDetail, menuList] = await Promise.all([
            fetchUserDetail({ usrId: user.usrId }),
            fetchUserMenuList({ menuUsrId: user.usrId }),
          ]);

          if (userDetail.length > 0) {
            const detailUser = { ...user, ...userDetail[0] };

            // 날짜 필드 유효성 검사 및 정리
            if (
              detailUser.useStrtDt &&
              (detailUser.useStrtDt === "null" ||
                detailUser.useStrtDt === "undefined")
            ) {
              detailUser.useStrtDt = "";
            }
            if (
              detailUser.useEndDt &&
              (detailUser.useEndDt === "null" ||
                detailUser.useEndDt === "undefined")
            ) {
              detailUser.useEndDt = "";
            }

            setEditUser(detailUser);
            // 캐시에 저장
            setUserDetailCache((prev) =>
              new Map(prev).set(user.usrId!, detailUser)
            );
          }

          if (menuList.length > 0) {
            setMenus(menuList);
            // 캐시에 저장
            setMenuCache((prev) => new Map(prev).set(user.usrId!, menuList));

            // 메뉴 그리드의 총 건수 표시 업데이트
            setTimeout(() => {
              const totalCountElement = document.querySelector(
                "#userMenuGrid-totalcount"
              );
              if (totalCountElement) {
                totalCountElement.innerHTML = ` (Rows: <strong>${menuList.length}</strong>)`;
              }
            }, 100);
          } else {
            // 빈 배열이어도 상태 설정 (신규 사용자 등)
            setMenus([]);
            setMenuCache((prev) => new Map(prev).set(user.usrId!, []));

            // 메뉴 그리드의 총 건수 표시 업데이트
            setTimeout(() => {
              const totalCountElement = document.querySelector(
                "#userMenuGrid-totalcount"
              );
              if (totalCountElement) {
                totalCountElement.innerHTML = ` (Rows: <strong>0</strong>)`;
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error("사용자 상세 정보 조회 실패:", error);
      }
    }
  };

  // 입력 변경
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editUser) return;
    const { name, value, type } = e.target;

    // 휴대폰번호 특별 처리
    if (name === "phone") {
      const phoneParts = value
        .replace(/[^0-9]/g, "")
        .match(/(\d{0,3})(\d{0,4})(\d{0,4})/);
      if (phoneParts) {
        setEditUser({
          ...editUser,
          cellSctNo: phoneParts[1] || "",
          cellRgnNo: phoneParts[2] || "",
          cellEndNo: phoneParts[3] || "",
        });
      }
      return;
    }

    setEditUser({
      ...editUser,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // 삭제
  const handleDeleteUser = async () => {
    if (isAddMode) {
      setIsAddMode(false);
      setTempUserRow(null);
      setSelectedUser(null);
      setEditUser(null);
      setMenus([]);
      setError("");
      setUsers((prev) => prev.filter((u) => u.usrId !== tempUserRow?.usrId));

      // 메뉴 그리드 초기화
      if (menuGridRef.current && menuGridRef.current.getGrid) {
        try {
          const gridInstance = menuGridRef.current.getGrid();
          if (
            gridInstance &&
            typeof (gridInstance as { resetData: (data: unknown[]) => void })
              .resetData === "function"
          ) {
            (
              gridInstance as { resetData: (data: unknown[]) => void }
            ).resetData([]);
          }
        } catch (error) {
          console.error("메뉴 그리드 초기화 중 오류:", error);
        }
      }
      return;
    }
    if (!selectedUser) return;

    const confirmResult = await MzAlert.confirm("정말 삭제하시겠습니까?");
    if (!confirmResult.isConfirmed) return;
    setLoading(true);
    try {
      const userToDelete = { ...selectedUser, useYn: "N" };
      const result = await deleteUserData(userToDelete);
      if (result.success) {
        setSelectedUser(null);
        setEditUser(null);
        setMenus([]);
        MzAlert.alert(result.message || "삭제되었습니다.");
        handleSearch();
      } else {
        setError(result.message || "삭제에 실패했습니다.");
      }
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 저장
  const handleSaveUser = async () => {
    if (!editUser) return;
    if (!editUser.usrNm || !editUser.passwd) {
      setError("사용자명과 비밀번호는 필수입니다.");
      return;
    }
    if (!editUser.jobGrpCd && !editUser.jobGrpNm) {
      setError("업무그룹을 선택해주세요.");
      return;
    }
    if (!editUser.orgJobGrpCd && editUser.jobGrpCd) {
      editUser.orgJobGrpCd = editUser.jobGrpCd;
    }
    setLoading(true);
    try {
      const result = await saveUserData(editUser);
      if (result.success) {
        if (isAddMode) {
          setIsAddMode(false);
          setTempUserRow(null);
          // 신규 사용자 추가 시, 검색조건에 로그인ID, 사용자명, 업무그룹명 set
          setQuery((prev) => {
            const newQuery = {
              ...prev,
              usrId: editUser.usrId || "",
              usrNm: editUser.usrNm || "",
              jobGrpNm: editUser.jobGrpNm || "",
            };
            handleSearch(newQuery);
            return newQuery;
          });
        } else {
          handleSearch();
        }
        setSelectedUser(editUser);
        if (editUser.usrId) {
          setUserDetailCache((prev) =>
            new Map(prev).set(editUser.usrId!, editUser)
          );
        }
        setError("");
        MzAlert.alert(result.message || "저장되었습니다.");
      } else {
        setError(result.message || "저장에 실패했습니다.");
      }
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기화 함수들
  const handleResetPassword = async () => {
    if (!editUser?.usrId) return;

    setLoading(true);
    try {
      const result = await initUserPassword(editUser.usrId);
      if (result.success) {
        setEditUser({ ...editUser, passwd: "" });
        setError("");
        MzAlert.alert(
          `비밀번호가 초기화되었습니다. 임시 비밀번호: ${result.tempPassword}`
        );
      } else {
        setError(result.message || "비밀번호 초기화에 실패했습니다.");
      }
    } catch {
      setError("비밀번호 초기화 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetLoginFailCount = () => {
    if (!editUser) return;
    setEditUser({ ...editUser, loginFailCnt: 0 });
    setError("");
  };

  // 상세정보 테이블용 데이터 구조
  const getDetailRows = (): DetailCell[][] => [
    [
      {
        label: "로그인ID",
        value: editUser?.usrId || "",
        name: "usrId",
        readOnly: !isAddMode,
        type: "text",
        required: true,
      },
      {
        label: "비밀번호",
        value: editUser?.passwd || "",
        name: "passwd",
        type: "password",
        required: true,
      },
    ],
    [
      {
        label: "사용자명",
        value: editUser?.usrNm || "",
        name: "usrNm",
        type: "text",
        required: true,
      },
      {
        label: "업무그룹명",
        value: editUser?.jobGrpNm || "",
        name: "jobGrpNm",
        type: "text",
        required: true,
        readOnly: true,
      },
    ],
    [
      {
        label: "사용여부",
        value: editUser?.useYn === "Y" ? "true" : "false",
        name: "useYn",
        type: "radio",
        required: true,
      },
      {
        label: "2차인증 사용여부",
        value: editUser?.tm2sCertMdtyYn === "Y" ? "true" : "false",
        name: "tm2sCertMdtyYn",
        type: "radio",
        required: true,
      },
    ],
    [
      {
        label: "이메일",
        value: editUser?.emailAddr || "",
        name: "emailAddr",
        type: "text",
        required: false,
      },
      {
        label: "휴대폰 번호",
        value: formatPhoneNumber(
          editUser?.cellSctNo,
          editUser?.cellRgnNo,
          editUser?.cellEndNo
        ),
        name: "phone",
        type: "text",
        required: false,
      },
    ],
    [
      {
        label: "로그인실패횟수",
        value: editUser?.loginFailCnt ?? "",
        name: "loginFailCnt",
        type: "text",
        readOnly: true,
        required: false,
      },
      {
        label: "사용기간",
        value: "",
        name: "usePeriod",
        type: "dateRange",
        required: false,
      },
    ],
  ];

  // 쿼리 변경 핸들러
  const handleQueryChange = (field: keyof typeof query, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  // Enter 키 이벤트 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 업무그룹 검색 모달 열기
  const handleJobGroupSearch = (target: "search" | "detail") => {
    setJobGroupTarget(target);
    setIsJobGroupModalOpen(true);
  };

  // 업무그룹 선택 처리
  const handleJobGroupSelect = (jobGroup: JobGroupData) => {
    if (jobGroupTarget === "search") {
      setQuery((prev) => ({
        ...prev,
        jobGrpCd: jobGroup.jobGrpCd,
        jobGrpNm: jobGroup.jobGrpNm,
      }));
    } else if (jobGroupTarget === "detail" && editUser) {
      setEditUser((prev) => ({
        ...prev!,
        jobGrpCd: jobGroup.jobGrpCd,
        jobGrpNm: jobGroup.jobGrpNm,
        orgJobGrpCd: jobGroup.jobGrpCd,
      }));
    }
  };

  // 업무그룹 모달 닫기
  const handleJobGroupModalClose = () => {
    setIsJobGroupModalOpen(false);
    setJobGroupTarget("search");
  };

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (name: string, value: boolean) => {
    if (!editUser) return;
    setEditUser({ ...editUser, [name]: value ? "Y" : "N" });
  };

  // 임시 사용자 행 스타일 적용
  useEffect(() => {
    if (tempUserRow && isAddMode) {
      // DOM이 업데이트된 후 임시 행에 스타일 적용
      setTimeout(() => {
        const gridRows = document.querySelectorAll(".user-list-grid tbody tr");
        gridRows.forEach((row, index) => {
          if (index === 0) {
            // 첫 번째 행이 임시 행
            row.classList.add("temp-user-row");
          }
        });
      }, 100);
    }
  }, [tempUserRow, isAddMode]);

  // 사용자 선택 시 메뉴 그리드 초기화 확인
  useEffect(() => {
    // 사용자 선택 상태 변경 처리
  }, [selectedUser]);

  // 메뉴 데이터 변경 시 gridDataRef 업데이트
  useEffect(() => {
    if (
      menuGridRef.current &&
      menuGridRef.current.getGrid &&
      menus.length > 0
    ) {
      const gridInstance = menuGridRef.current.getGrid();
      if (
        gridInstance &&
        typeof (gridInstance as { getData: () => Menu[] }).getData ===
          "function"
      ) {
        const gridInstanceAny = gridInstance as {
          _gridDataRef?: { current: Record<string | number, Menu> };
        };
        if (
          gridInstanceAny._gridDataRef &&
          gridInstanceAny._gridDataRef.current
        ) {
          gridInstanceAny._gridDataRef.current = {};
          menus.forEach((item: Menu) => {
            const rowKey = item.id;
            if (rowKey !== undefined) {
              gridInstanceAny._gridDataRef!.current[rowKey] = item;
            }
          });
        }
      }
    }
  }, [menus]);

  // 초기 데이터 로드
  useEffect(() => {
    // 초기 로드 시에는 검색하지 않음 (사용자가 검색 조건을 입력하도록 유도)
  }, []);

  const detailRows = getDetailRows();

  return (
    <div className="user-mgt-wrap">
      {/* 상단 검색 영역 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="사용자 관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        <div className="searchForm">
          <table>
            <colgroup>
              <col width="120px" />
              <col width="200px" />
              <col width="120px" />
              <col width="200px" />
              <col width="120px" />
              <col width="200px" />
            </colgroup>
            <tbody>
              <tr>
                <th>로그인ID</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    id="search-usrId"
                    name="usrId"
                    value={query.usrId}
                    onChange={(e) => handleQueryChange("usrId", e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="로그인ID"
                  />
                </td>
                <th>사용자명</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    id="search-usrNm"
                    name="usrNm"
                    value={query.usrNm}
                    onChange={(e) => handleQueryChange("usrNm", e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="사용자명"
                  />
                </td>
                <th>업무그룹명</th>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <MzInputText
                      mzSize="2"
                      id="search-jobGrpNm"
                      name="jobGrpNm"
                      value={query.jobGrpNm}
                      onChange={(e) =>
                        handleQueryChange("jobGrpNm", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="업무그룹명"
                    />
                    <Image
                      src={iconSearch}
                      alt="검색"
                      width={20}
                      height={20}
                      style={{ cursor: "pointer", opacity: 0.7 }}
                      onClick={() => handleJobGroupSearch("search")}
                    />
                    <span
                      style={{
                        fontSize: 20,
                        marginLeft: 2,
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                      onClick={() => handleQueryChange("jobGrpNm", "")}
                      title="지우기"
                    >
                      ×
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>
            초기화
          </MzButton>
          <MzButton
            fill="black"
            onClick={() => handleSearch()}
            disabled={loading || isAddMode}
          >
            {loading ? "검색중..." : isAddMode ? "추가 모드" : "검색"}
          </MzButton>
        </div>
        {error && (
          <div style={{ marginTop: 10, color: "red", fontSize: "14px" }}>
            {error}
          </div>
        )}
      </div>

      {/* 본문 2단 영역 */}
      <div
        className={`${styles["user-mgt-main"]} ${styles["mgmt-main-layout"]}`}
      >
        {/* 사용자 리스트 */}
        <div className={styles["mgmt-left-section"]}>
          <AdminTitle
            title={
              isAddMode
                ? "사용자 리스트 (신규 사용자 추가 중)"
                : "사용자 리스트"
            }
            subTitle={
              userListTotalCount > 0
                ? `(총 ${userListTotalCount}건)`
                : undefined
            }
          />

          {/* 사용자 검색 폼 */}
          <form id="userSearchForm" style={{ display: "none" }}>
            <input type="hidden" name="usrId" value={query.usrId} />
            <input type="hidden" name="usrNm" value={query.usrNm} />
            <input type="hidden" name="jobGrpNm" value={query.jobGrpNm} />
            <input type="hidden" name="action" value="" />
          </form>

          <div className={isAddMode ? "add-mode" : ""}>
            <GridBuilder
              gridId="userListGrid"
              config={userListGridConfig}
              resizable={true}
              onInit={handleUserListGridInit}
              onSearchCallback={handleUserListSearch}
            />
          </div>
        </div>
        {/* 상세정보 + 메뉴정보 */}
        <div className={styles["mgmt-right-section"]} style={{ flex: 2 }}>
          <AdminTitle title="사용자 상세정보" />
          <style>{`
            #user-mgt-entry-btn {
              justify-content: flex-start !important;
            }
            
            /* 임시 사용자 행 스타일 */
            .user-list-grid .temp-user-row {
              background-color: #fff3cd !important;
              border-left: 3px solid #ffc107 !important;
            }
            
            .user-list-grid .temp-user-row:hover {
              background-color: #ffeaa7 !important;
            }
            
            /* 추가 모드일 때 그리드 스타일 */
            .add-mode {
              opacity: 0.6;
              pointer-events: none;
            }
            
            .add-mode .user-list-grid tbody tr {
              cursor: not-allowed;
            }
            
            /* 날짜 선택기 입력 필드 너비 설정 */
            .pickerInput {
              width: 100% !important;
            }
          `}</style>
          <div className="entryButton" id="user-mgt-entry-btn">
            <MzButton size="2" onClick={handleAddUser}>
              추가
            </MzButton>
            <MzButton
              size="2"
              onClick={handleDeleteUser}
              disabled={(!selectedUser && !isAddMode) || loading}
            >
              {loading ? "삭제중..." : isAddMode ? "취소" : "삭제"}
            </MzButton>
            <MzButton
              size="2"
              fill="black"
              onClick={handleSaveUser}
              disabled={loading}
            >
              {loading ? "저장중..." : "저장"}
            </MzButton>
          </div>
          <div className="entryForm">
            <table className={styles["mgmt-fixed-table"]}>
              <colgroup className={styles["mgmt-table-colgroup"]}>
                <col width="18%" />
                <col width="32%" />
                <col width="18%" />
                <col width="32%" />
              </colgroup>
              <tbody>
                {detailRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => {
                      if (cell.name === "passwd") {
                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  className="input"
                                  name={cell.name}
                                  value={cell.value}
                                  onChange={handleEditChange}
                                  readOnly={cell.readOnly}
                                  placeholder={cell.label}
                                  title={cell.label}
                                  type={cell.type}
                                  style={{
                                    width: "65%",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                  }}
                                />
                                <MzButton
                                  size="2"
                                  style={{
                                    marginLeft: 8,
                                    verticalAlign: "middle",
                                  }}
                                  onClick={handleResetPassword}
                                  disabled={loading}
                                >
                                  {loading ? "초기화중..." : "초기화"}
                                </MzButton>
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      }
                      if (cell.name === "loginFailCnt") {
                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  className="input"
                                  name={cell.name}
                                  value={cell.value}
                                  onChange={handleEditChange}
                                  readOnly={cell.readOnly}
                                  placeholder={cell.label}
                                  title={cell.label}
                                  type={cell.type}
                                  disabled={!editUser}
                                  style={{ width: "65%" }}
                                />
                                <MzButton
                                  size="2"
                                  style={{
                                    marginLeft: 8,
                                    verticalAlign: "middle",
                                  }}
                                  onClick={handleResetLoginFailCount}
                                >
                                  초기화
                                </MzButton>
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      }
                      if (cell.name === "phone") {
                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <input
                                className="input"
                                name={cell.name}
                                value={cell.value}
                                onChange={handleEditChange}
                                readOnly={cell.readOnly}
                                placeholder="010-1234-5678"
                                title={cell.label}
                                type={cell.type}
                                disabled={!editUser}
                                maxLength={13}
                                style={{ width: "100%" }}
                              />
                            </td>
                          </React.Fragment>
                        );
                      }
                      if (cell.name === "emailAddr") {
                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <input
                                className="input"
                                name={cell.name}
                                value={cell.value}
                                onChange={handleEditChange}
                                readOnly={cell.readOnly}
                                placeholder="example@company.com"
                                title={cell.label}
                                type="email"
                                disabled={!editUser}
                                style={{ width: "100%" }}
                              />
                            </td>
                          </React.Fragment>
                        );
                      }
                      if (cell.name === "jobGrpNm") {
                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <input
                                  className="input"
                                  name={cell.name}
                                  value={cell.value}
                                  onChange={handleEditChange}
                                  readOnly={true}
                                  placeholder="업무그룹명"
                                  title={cell.label}
                                  type={cell.type}
                                  disabled={!editUser}
                                  style={{ width: "100%" }}
                                />
                                {editUser && (
                                  <Image
                                    src={iconSearch}
                                    alt="검색"
                                    width={20}
                                    height={20}
                                    style={{ cursor: "pointer", opacity: 0.7 }}
                                    onClick={() =>
                                      handleJobGroupSearch("detail")
                                    }
                                  />
                                )}
                                <span
                                  style={{
                                    fontSize: 20,
                                    marginLeft: 2,
                                    cursor: "pointer",
                                    opacity: 0.7,
                                  }}
                                  onClick={() =>
                                    editUser &&
                                    setEditUser({
                                      ...editUser,
                                      jobGrpNm: "",
                                      jobGrpCd: "",
                                    })
                                  }
                                  title="지우기"
                                >
                                  ×
                                </span>
                                {/* 숨겨진 업무그룹코드 필드 */}
                                <input
                                  type="hidden"
                                  name="jobGrpCd"
                                  value={editUser?.jobGrpCd || ""}
                                />
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      }
                      if (cell.name === "usePeriod") {
                        // 날짜 값 유효성 검사 및 기본값 처리
                        const validateDate = (dateStr?: string): string => {
                          if (
                            !dateStr ||
                            dateStr === "" ||
                            dateStr === "null" ||
                            dateStr === "undefined" ||
                            dateStr === null ||
                            dateStr === undefined
                          ) {
                            return "";
                          }

                          // YYYY-MM-DD 형식인지 확인
                          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                          if (dateRegex.test(dateStr)) {
                            return dateStr;
                          }

                          // YYYYMMDD 형식인지 확인 (Java 백엔드에서 오는 형식)
                          const dateRegex2 = /^\d{8}$/;
                          if (dateRegex2.test(dateStr)) {
                            const year = dateStr.substring(0, 4);
                            const month = dateStr.substring(4, 6);
                            const day = dateStr.substring(6, 8);
                            return `${year}-${month}-${day}`;
                          }

                          // 다른 형식의 날짜 문자열을 YYYY-MM-DD로 변환 시도
                          try {
                            const date = new Date(dateStr);
                            if (isNaN(date.getTime())) {
                              return "";
                            }
                            const y = date.getFullYear();
                            const m = (date.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const d = date
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            return `${y}-${m}-${d}`;
                          } catch {
                            return "";
                          }
                        };

                        const startDate = validateDate(editUser?.useStrtDt);
                        const endDate = validateDate(editUser?.useEndDt);

                        return (
                          <React.Fragment key={j}>
                            <th
                              className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                            >
                              {cell.label}
                            </th>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <MzDatePicker
                                  value={startDate}
                                  onChange={(date) => {
                                    if (editUser) {
                                      setEditUser({
                                        ...editUser,
                                        useStrtDt: date,
                                      });
                                    }
                                  }}
                                />
                                <span>~</span>
                                <MzDatePicker
                                  value={endDate}
                                  onChange={(date) => {
                                    if (editUser) {
                                      setEditUser({
                                        ...editUser,
                                        useEndDt: date,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      }
                      return (
                        <React.Fragment key={j}>
                          <th
                            className={`${cell.required ? "required" : ""} ${styles["mgmt-table-header"]}`}
                          >
                            {cell.label}
                          </th>
                          <td>
                            {cell.type === "radio" ? (
                              <div style={{ display: "flex", gap: "10px" }}>
                                <MzCheckBox
                                  type="radio"
                                  id={`${cell.name}-yes`}
                                  name={cell.name}
                                  checked={
                                    editUser
                                      ? cell.name === "useYn"
                                        ? editUser.useYn === "Y"
                                        : editUser.tm2sCertMdtyYn === "Y"
                                      : false
                                  }
                                  value="Y"
                                  onChange={() =>
                                    handleRadioChange(cell.name, true)
                                  }
                                  disabled={!editUser}
                                >
                                  예
                                </MzCheckBox>
                                <MzCheckBox
                                  type="radio"
                                  id={`${cell.name}-no`}
                                  name={cell.name}
                                  checked={
                                    editUser
                                      ? cell.name === "useYn"
                                        ? editUser.useYn === "N"
                                        : editUser.tm2sCertMdtyYn === "N"
                                      : false
                                  }
                                  value="N"
                                  onChange={() =>
                                    handleRadioChange(cell.name, false)
                                  }
                                  disabled={!editUser}
                                >
                                  아니오
                                </MzCheckBox>
                              </div>
                            ) : (
                              <input
                                className="input"
                                name={cell.name}
                                value={cell.value}
                                onChange={handleEditChange}
                                readOnly={cell.readOnly}
                                placeholder={cell.label}
                                title={cell.label}
                                type={cell.type}
                                disabled={!editUser}
                                style={{ width: "100%" }}
                              />
                            )}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 메뉴 정보 그리드 */}
          <AdminTitle
            title="메뉴 정보"
            subTitle={menus.length > 0 ? `(총 ${menus.length}건)` : undefined}
          />

          {/* 메뉴 정보 폼 */}
          <form id="userMenuForm" style={{ display: "none" }}>
            <input
              type="hidden"
              name="menuUsrId"
              value={selectedUser?.usrId || ""}
            />
            <input
              type="hidden"
              name="usrId"
              value={selectedUser?.usrId || ""}
            />
            <input type="hidden" name="action" value="save" />
            <input type="hidden" name="gridId" value="userMenuGrid" />
          </form>

          <GridBuilder
            key={`menu-grid-${selectedUser?.usrId || "no-user"}`}
            ref={menuGridRef}
            gridId="userMenuGrid"
            config={getMenuGridConfig()}
            resizable={true}
            onInit={handleMenuGridInit}
            onSearchCallback={handleMenuSearch}
            onSaveCallback={handleMenuSave}
            onRegPopCallback={handleMenuRegPop}
            onSaveBeforeCallback={handleMenuSaveBefore}
            onDeleteBeforeCallback={handleMenuDeleteBefore}
          />
        </div>
      </div>

      {/* 업무그룹 검색 모달 */}
      <JobGroupSearchModal
        isOpen={isJobGroupModalOpen}
        onClose={handleJobGroupModalClose}
        onSelect={handleJobGroupSelect}
      />

      {/* 메뉴 검색 모달 */}
      <MenuSearchModal
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
        onSelect={handleMenuSelect}
      />
    </div>
  );
};

export default UserManagement;
