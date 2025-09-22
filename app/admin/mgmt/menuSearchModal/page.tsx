"use client";
import React, { useState, useRef } from "react";
import GridBuilder from "../../../admin/components/sample/exGridBuilder";
import AdminTitle from "../../../admin/components/common/adminTitle";
import MzInputText from "../../../common/components/form/mzInputText";
import MzButton from "../../../common/components/ui/mzButton";
import MzAlert from "../../../common/components/ui/mzAlert";
import "../../styles/adminStyle.scss";
import styles from "../mgmt.module.scss";
import type Grid from "tui-grid";

// 메뉴정보 데이터 타입 정의
interface MenuRow {
  id: number;
  rtTgtSeq: string; // 화면ID
  mrkNm: string; // 화면명
  rtTgtNm: string; // 권한대상명
  useYn: string; // 사용여부
  rowKey?: number; // TUI Grid에서 사용하는 rowKey
}

// GridBuilderRef 타입 정의
interface GridBuilderRef {
  getGrid: () => Grid | null;
  addRow: () => void;
  deleteSelectedRows: () => void;
  saveGridData: () => void;
  searchGridData: () => void;
  doSearch: () => void;
  setHeight: (height: number) => void;
}

// 모달 Props 인터페이스
interface MenuSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (menus: MenuRow[]) => void;
}

// 메뉴 그리드 설정
const menuGridConfig = {
  id: "menuSearchGrid",
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
      header: "화면ID",
      name: "rtTgtSeq",
      width: 120,
      editable: false,
    },
    {
      header: "화면명",
      name: "mrkNm",
      width: 200,
      editable: false,
    },
    {
      header: "권한대상명",
      name: "rtTgtNm",
      width: 200,
      editable: false,
    },
    {
      header: "사용여부",
      name: "useYn",
      width: 100,
      editable: false,
      formatter: ({ value }: { value: string }) =>
        value === "Y" ? "사용" : "미사용",
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: false,
    rowExcelAll: true,
    excelFileName: "menuSearchData",
  },
  pagingable: false, // 백엔드 페이징 미지원으로 클라이언트 사이드 페이징 사용
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "menuSearchForm",
  saveAfterSearch: false,
  action: "/system/menuMgmt.getJsonMenuList.do",
  actionAfterCallback: true, // 검색 후 콜백 활성화
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

const MenuSearchModal: React.FC<MenuSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [menuId, setMenuId] = useState("");
  const [menuName, setMenuName] = useState("");
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuGridRef = useRef<GridBuilderRef>(null);

  // 검색 버튼 클릭 시 GridBuilder의 검색 기능 사용
  const handleSearch = () => {
    setLoading(true);

    // 폼에 검색 조건 설정
    const form = document.querySelector("#menuSearchForm") as HTMLFormElement;
    if (form) {
      const menuIdInput = form.querySelector("#menuId") as HTMLInputElement;
      const menuNameInput = form.querySelector("#menuName") as HTMLInputElement;

      if (menuIdInput) menuIdInput.value = menuId;
      if (menuNameInput) menuNameInput.value = menuName;
    }

    if (menuGridRef.current && menuGridRef.current.doSearch) {
      menuGridRef.current.doSearch();
    } else {
      console.error("메뉴 그리드가 초기화되지 않았습니다.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMenuId("");
    setMenuName("");

    // 폼 데이터도 초기화
    const form = document.querySelector("#menuSearchForm") as HTMLFormElement;
    if (form) {
      const menuIdInput = form.querySelector("#menuId") as HTMLInputElement;
      const menuNameInput = form.querySelector("#menuName") as HTMLInputElement;

      if (menuIdInput) menuIdInput.value = "";
      if (menuNameInput) menuNameInput.value = "";
    }

    // 그리드 데이터 초기화
    if (menuGridRef.current && menuGridRef.current.getGrid) {
      const grid = menuGridRef.current.getGrid();
      if (grid && typeof grid.resetData === "function") {
        grid.resetData([]);
      }
    }
  };

  // 메뉴 그리드 초기화
  const handleMenuGridInit = (grid: Grid) => {
    if (menuGridRef.current) {
      // GridBuilderRef는 이미 올바른 타입이므로 추가 설정이 필요하지 않음
    }
    setLoading(false);
  };

  // 메뉴 검색 콜백
  const handleMenuSearch = (response: unknown) => {
    setLoading(false);

    // 검색 결과 처리
    if (response && typeof response === "object") {
      const responseObj = response as { data?: MenuRow[]; total?: number };

      if (responseObj.data) {
        console.log("메뉴 검색 결과:", responseObj.data.length, "건");
      } else {
        console.log("메뉴 검색 결과: 0건");
      }
    }
  };

  // 적용 버튼 클릭 시 체크된 행 적용
  const handleApply = () => {
    if (!menuGridRef.current) {
      MzAlert.alert("그리드가 초기화되지 않았습니다.");
      return;
    }

    const grid = menuGridRef.current.getGrid();
    if (!grid) {
      MzAlert.alert("그리드 인스턴스를 가져올 수 없습니다.");
      return;
    }

    // TUI Grid의 getCheckedRows 메서드 사용
    const checkedRows = grid.getCheckedRows();
    if (!checkedRows || checkedRows.length === 0) {
      MzAlert.alert("선택된 메뉴가 없습니다.");
      return;
    }

    // 선택된 모든 메뉴를 부모 컴포넌트로 전달
    onSelect(checkedRows);
    onClose();
  };

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setMenuId("");
    setMenuName("");
    setIsFormShowHide(false);
    setLoading(false); // 로딩 상태도 초기화

    // 폼 데이터도 초기화
    const form = document.querySelector("#menuSearchForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }

    onClose();
  };

  // 엔터키 검색 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles["mgmt-modal-overlay"]}>
      <div className={styles["mgmt-modal-content"]}>
        {/* 모달 헤더 */}
        <div className={styles["mgmt-modal-header"]}>
          <h2 className={styles["mgmt-modal-title"]}>메뉴 정보 검색</h2>
          <button onClick={handleClose} className={styles["mgmt-modal-close"]}>
            ×
          </button>
        </div>

        {/* 메뉴 검색용 폼 (숨김) */}
        <form id="menuSearchForm" style={{ display: "none" }}>
          <input type="hidden" name="action" value="" />
          <input
            type="text"
            id="menuId"
            name="menuId"
            title="메뉴 ID"
            defaultValue=""
          />
          <input
            type="text"
            id="menuName"
            name="menuName"
            title="메뉴명"
            defaultValue=""
          />
        </form>

        {/* 상단 검색 영역 */}
        <div
          className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}
        >
          <AdminTitle
            title="메뉴정보조회"
            showHide={true}
            setIsFormShowHide={setIsFormShowHide}
            isFormShowHide={isFormShowHide}
          />
          <div className="searchForm">
            <table>
              <colgroup>
                <col width="120px" />
                <col width="240px" />
                <col width="120px" />
                <col width="240px" />
              </colgroup>
              <tbody>
                <tr>
                  <th>화면ID</th>
                  <td>
                    <MzInputText
                      mzSize="2"
                      value={menuId}
                      onChange={(e) => setMenuId(e.target.value)}
                      placeholder="화면ID 입력"
                      onKeyDown={handleKeyPress}
                    />
                  </td>
                  <th>화면명</th>
                  <td>
                    <MzInputText
                      mzSize="2"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      placeholder="화면명 입력"
                      onKeyDown={handleKeyPress}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="searchActionButton">
            <MzButton stroke="black" onClick={handleReset}>
              초기화
            </MzButton>
            <MzButton fill="black" onClick={handleSearch} disabled={loading}>
              {loading ? "검색중..." : "검색"}
            </MzButton>
          </div>
        </div>

        {/* 메뉴정보 리스트 */}
        <AdminTitle title="메뉴정보 리스트" />

        <GridBuilder
          ref={menuGridRef}
          gridId="menuSearchGrid"
          config={menuGridConfig}
          resizable={true}
          onInit={handleMenuGridInit}
          onSearchCallback={handleMenuSearch}
        />

        {/* 하단 버튼 영역 */}
        <div className={styles["mgmt-modal-actions"]}>
          <MzButton
            fill="black"
            onClick={handleApply}
            style={{ minWidth: 120 }}
          >
            적용
          </MzButton>
          <MzButton
            stroke="black"
            onClick={handleClose}
            style={{ minWidth: 120 }}
          >
            닫기
          </MzButton>
        </div>
      </div>
    </div>
  );
};

export default MenuSearchModal;
