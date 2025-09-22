"use client";
import React, { useState, useEffect, useRef } from "react";
import GridBuilder from "../../components/sample/exGridBuilder";
import AdminTitle from "../../components/common/adminTitle";
import "../../styles/adminStyle.scss";
import "../../components/sample/exGridBuilder.scss";
import MzButton from "../../../common/components/ui/mzButton";
import MzInputText from "../../../common/components/form/mzInputText";
import { MzCheckBox } from "../../../common/components/form/mzCheckBox";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzAlert from "../../../common/components/ui/mzAlert";
import MzTreeNew from "../../../common/components/ui/mzTreeNew";
import MzEditor from "../../../common/components/form/mzEditor";
import axios from "axios";
import styles from "../mgmt.module.scss";

//const _baseUrl = "http://local.megazone.com:8090";

// 샘플 트리 데이터 (API 대체)
const sampleTreeData: any[] = [];

// 샘플 상세 데이터 (API 대체)
const sampleDetail: any = {};

// 샘플 하위 메뉴 데이터 (API 대체)
const sampleSubMenuList: any[] = [];

// 하위 메뉴 그리드 컬럼 정의 수정
const subMenuColumns: any[] = [
  {
    name: "rtTgtSeq",
    header: "메뉴번호",
    width: 100,
    align: "center",
    editable: false,
  },
  {
    name: "mrkNm",
    header: "메뉴명",
    width: 150,
    align: "left",
    editable: true,
    required: true,
    editor: { type: "text" },
  },
  {
    name: "rtTgtSctCd",
    header: "권한구분",
    width: 100,
    align: "center",
    editable: false,
    defaultVal: "10",
  },
  {
    name: "rtTgtTpCd",
    header: "메뉴유형",
    width: 100,
    align: "center",
    formatter: "listItemText",
    editor: {
      type: "select",
      options: {
        listItems: [
          { text: "메뉴", value: "10" },
          { text: "화면", value: "20" },
          { text: "REQUEST", value: "30" },
          { text: "버튼", value: "40" },
        ],
      },
    },
    defaultVal: "10",
    editable: true,
  },
  {
    name: "caloUrl",
    header: "호출URL",
    width: 200,
    align: "left",
    editable: true,
    editor: { type: "text" },
  },
  {
    name: "menuId",
    header: "버튼ID",
    width: 120,
    align: "left",
    editable: true,
    editor: { type: "text" },
  },
  {
    name: "uprRtTgtSeq",
    header: "상위메뉴번호",
    width: 120,
    align: "center",
    editable: false,
  },
  {
    name: "prsnInfoYn",
    header: "개인정보여부",
    width: 120,
    align: "center",
    formatter: "listItemText",
    editor: {
      type: "select",
      options: {
        listItems: [
          { text: "사용", value: "Y" },
          { text: "사용안함", value: "N" },
        ],
      },
    },
    defaultVal: "N",
    editable: true,
  },
  {
    name: "useYn",
    header: "사용여부",
    width: 100,
    align: "center",
    formatter: "listItemText",
    editor: {
      type: "select",
      options: {
        listItems: [
          { text: "사용", value: "Y" },
          { text: "사용안함", value: "N" },
        ],
      },
    },
    defaultVal: "Y",
    editable: true,
  },
  {
    name: "sortSeq",
    header: "정렬순서",
    width: 100,
    align: "center",
    editable: true,
    editor: { type: "text" },
    defaultVal: "999",
  },
  {
    name: "pppYn",
    header: "팝업여부",
    width: 100,
    align: "center",
    formatter: "listItemText",
    editor: {
      type: "select",
      options: {
        listItems: [
          { text: "사용", value: "Y" },
          { text: "사용안함", value: "N" },
        ],
      },
    },
    defaultVal: "N",
    editable: true,
  },
  { name: "subMenuCnt", header: "", hidden: true },
  { name: "rtTgtNm", header: "", hidden: true, defaultVal: "N" },
  { name: "langCd", header: "", hidden: true },
  { name: "rtTgtSeq", header: "", hidden: true },
];

// 플랫한 배열을 트리 구조로 변환하는 함수
const convertToTreeStructure = (flatData: any[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  // 1. 모든 노드를 맵에 저장하고 children 배열 초기화
  flatData.forEach((item) => {
    map.set(item.rtTgtSeq, {
      ...item,
      text: item.mrkNm || item.rtTgtNm, // text 속성 추가
      children: [],
    });
  });

  // 2. 부모-자식 관계 설정
  flatData.forEach((item) => {
    const node = map.get(item.rtTgtSeq);
    if (item.uprRtTgtSeq === 0) {
      // 최상위 노드 (부모가 0인 경우)
      roots.push(node);
    } else {
      // 자식 노드인 경우
      const parent = map.get(item.uprRtTgtSeq);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};

const loadMenuTree = (
  srch: string,
  srchYn: boolean,
  setTreeData: (data: any[]) => void
) => {
  const pin = {
    caller: "receiveList",
  };
  axios
    .post(`/system/menuMgmt.getJsonMenuList.do`, pin, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: false,
    })
    .then((res) => {
      // 서버 데이터를 트리 구조로 변환
      const menus = res.data.data;
      //console.log(menus);
      const treeData = convertToTreeStructure(menus);
      setTreeData(treeData);
    })
    .catch(() => {
      setTreeData(sampleTreeData); // 에러 시 샘플 데이터
    });
};

export default function MenuMgt() {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [subMenuList, setSubMenuList] = useState<any[]>(sampleSubMenuList);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFormShowHide, setIsFormShowHide] = useState<boolean>(false);
  const [isGridReady, setIsGridReady] = useState<boolean>(false);
  const [subMenuTotalCount, setSubMenuTotalCount] = useState<number>(0);
  const editorRef = useRef<any>(null);
  const gridRef = useRef<any>(null);

  // 트리 데이터 로딩 (API)
  useEffect(() => {
    // console.log('메뉴 api 호출');
    loadMenuTree("", false, setTreeData);
  }, []);

  // 컴포넌트 언마운트 시 그리드 준비 상태 리셋
  useEffect(() => {
    return () => {
      setIsGridReady(false);
    };
  }, []);

  const nodeEvent = async (node: any) => {
    setSelectedNode(node);
    setLoading(true);
    setError("");
    // console.log(node);

    if (node && node.text) {
      // console.log(`선택한 메뉴: ${node.rtTgtSeq}`);
    }

    // 상세정보
    const pin = {
      rtTgtSeq: node.rtTgtSeq,
      mrkNm: node.mrkNm,
      lvl: node.lvl,
      uprRtTgtSeq: node.uprRtTgtSeq,
      uprMrkNm: node.uprMrkNm,
      menuTlwtYn: node.menuTlwtYn,
      prsnInfoYn: node.prsnInfoYn,
      useYn: node.useYn,
      sortSeq: node.sortSeq,
    };

    try {
      const detailRes = await axios.get(`/system/menuMgmt.getMenuDtlInfo.do`, {
        params: pin,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false,
      });
      setDetail(detailRes.data.data[0] || {});
    } catch (error) {
      console.error("상세정보 조회 실패:", error);
      setDetail({});
    }

    // 하위메뉴리스트
    const param = {
      rtTgtSeq: node.rtTgtSeq,
      lvl: node.lvl,
      useYn: node.useYn,
    };

    try {
      // 폼에 검색 조건 설정 (adminLogMgt.tsx 방식 참조)
      const form = document.querySelector(
        "#subMenuSearchForm"
      ) as HTMLFormElement;
      if (form) {
        // 폼 데이터를 직접 설정
        const rtTgtSeqInput = form.querySelector(
          'input[name="rtTgtSeq"]'
        ) as HTMLInputElement;
        const lvlInput = form.querySelector(
          'input[name="lvl"]'
        ) as HTMLInputElement;
        const useYnInput = form.querySelector(
          'input[name="useYn"]'
        ) as HTMLInputElement;

        if (rtTgtSeqInput) rtTgtSeqInput.value = param.rtTgtSeq;
        if (lvlInput) lvlInput.value = param.lvl;
        if (useYnInput) useYnInput.value = param.useYn;

        // console.log('🔍 하위메뉴 검색 조건 설정:', param);
      }

      // console.log('Grid ready status:', isGridReady);
      // console.log('Grid ref:', gridRef.current);

      if (gridRef.current) {
        (gridRef.current as { doSearch: (args?: unknown) => void }).doSearch();
      } else {
        console.error("관리자 로그 그리드가 초기화되지 않았습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 트리 노드 선택 시 상세/하위메뉴 데이터 로딩 (API)
  const handleNodeSelect = (node: any) => {
    nodeEvent(node);
  };

  // 3뎁스 클릭 이벤트
  const handle3DepthClick = (node: any) => {
    nodeEvent(node);
  };

  // 4뎁스 클릭 이벤트
  const handle4DepthClick = (node: any) => {
    nodeEvent(node);
  };

  // 대메뉴 추가
  const handleAddMainMenu = () => {
    setDetail({
      rtTgtSeq: "0",
      mrkNm: "",
      uprRtTgtSeq: "0",
      uprMrkNm: "",
      menuTlwtYn: "N",
      prsnInfoYn: "N",
      useYn: "Y",
      sortSeq: "",
      rtTgtNm: "",
      rtTgtTpCd: "10",
      caloUrl: "",
      menuId: "",
      helpDesc: "",
    });
    setSubMenuList([]);

    // GridBuilder 데이터 초기화
    if (gridRef.current?.getGrid()) {
      gridRef.current.getGrid().resetData([]);
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = async () => {
    if (!selectedNode) return;

    setLoading(true);
    try {
      // console.log(selectedNode.rtTgtSeq);
      await axios.post(`/system/menuMgmt.putDeleteMenuInfo.do`, detail, {
        headers: {
          "Content-Type": "multipart/form-data;charset=UTF-8",
        },
        withCredentials: false,
      });
      setDetail({});
      setSubMenuList([]);

      // GridBuilder 데이터 초기화
      if (gridRef.current?.getGrid()) {
        gridRef.current.getGrid().resetData([]);
      }

      MzAlert.alert("삭제되었습니다.");
      loadMenuTree("", false, setTreeData);
    } catch (error) {
      console.error("삭제 실패:", error);
      MzAlert.alert("삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 저장
  const handleSaveMenu = async () => {
    setLoading(true);

    try {
      const saveData = {
        ...detail,
        useYn: detail?.useYn,
        rtTgtTpCd:
          detail?.rtTgtTpCd === "MENU"
            ? "10"
            : detail?.rtTgtTpCd === "화면"
              ? "20"
              : detail?.rtTgtTpCd === "REQUEST"
                ? "30"
                : detail?.rtTgtTpCd === "버튼"
                  ? "40"
                  : detail?.rtTgtTpCd,
      };

      await axios.post(`/system/menuMgmt.putMenuDtlInfo.do`, saveData, {
        headers: {
          "Content-Type": "multipart/form-data;charset=UTF-8",
        },
        withCredentials: false,
      });
      MzAlert.alert("저장되었습니다.");
      loadMenuTree("", false, setTreeData);
    } catch (error) {
      console.error("저장 실패:", error);
      MzAlert.alert("저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-mgt-wrap">
      {/* 상단 제목 영역 */}
      <AdminTitle title="메뉴 관리" />

      {/* 본문 2단 영역 */}
      <div
        className={`${styles["menu-mgt-main"]} ${styles["mgmt-main-layout"]}`}
      >
        {/* 트리 메뉴 영역 */}
        <div
          className={`${styles["mgmt-left-section"]} ${styles["mgmt-tree-fixed"]}`}
          style={{
            border: "0",
            borderRadius: "4px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            height: "calc(132vh)",
            overflow: "auto",
          }}
        >
          <div className="layoutTitle">
            <AdminTitle title="트리 메뉴" />
          </div>

          <div className={styles["mgmt-tree-container"]}>
            <MzTreeNew
              data={treeData}
              onNodeSelect={handleNodeSelect}
              onNode3DepthClick={handle3DepthClick}
              onNode4DepthClick={handle4DepthClick}
              style={{ height: "100%" }}
            />
          </div>
        </div>

        {/* 메뉴 상세정보 영역 */}
        <div
          className={`${styles["mgmt-right-section"]} ${styles["mgmt-content-flex"]}`}
          style={{
            padding: "10px",
          }}
        >
          <div className="layoutTitle">
            <AdminTitle title="메뉴 상세정보" />
          </div>

          {/* 버튼 영역 */}
          <div
            className="entryButton"
            style={{ justifyContent: "flex-start", marginBottom: 10 }}
          >
            <MzButton size="2" onClick={handleAddMainMenu}>
              대메뉴
            </MzButton>
            <MzButton
              size="2"
              onClick={handleDeleteMenu}
              disabled={(!selectedNode && !detail?.rtTgtSeq) || loading}
            >
              {loading ? "삭제중..." : "삭제"}
            </MzButton>
            <MzButton
              size="2"
              fill="black"
              onClick={handleSaveMenu}
              disabled={loading}
            >
              {loading ? "저장중..." : "저장"}
            </MzButton>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{ marginBottom: 10, color: "red", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {/* 상세정보 폼 */}
          <div className="entryForm">
            <table className={styles["mgmt-fixed-table"]}>
              <colgroup className={styles["mgmt-table-colgroup"]}>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th className={`required ${styles["mgmt-table-header"]}`}>
                    메뉴명
                  </th>
                  <td>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <MzInputText
                        name="rtTgtSeq"
                        placeholder="메뉴ID"
                        value={detail?.rtTgtSeq || ""}
                        readOnly
                        style={{ width: 120 }}
                      />
                      <MzInputText
                        name="mrkNm"
                        placeholder="메뉴명"
                        value={detail?.mrkNm || ""}
                        style={{ flex: 1 }}
                        onChange={(e) =>
                          setDetail((prev: any) => ({
                            ...prev,
                            mrkNm: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </td>
                  <th className={styles["mgmt-table-header"]}>상위 메뉴명</th>
                  <td>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <MzInputText
                        name="uprRtTgtSeq"
                        placeholder="상위메뉴ID"
                        value={detail?.uprRtTgtSeq || ""}
                        readOnly
                        style={{ width: 120 }}
                      />
                      <MzInputText
                        name="uprMrkNm"
                        placeholder="상위메뉴명"
                        value={detail?.uprMrkNm || ""}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className={styles["mgmt-table-header"]}>최하위여부</th>
                  <td>
                    <MzCheckBox
                      name="menuTlwtYn"
                      id="menuTlwtYn"
                      type="checkbox"
                      checked={detail?.menuTlwtYn === "Y"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          menuTlwtYn: e.target.checked ? "Y" : "N",
                        }))
                      }
                    >
                      최하위여부
                    </MzCheckBox>
                  </td>
                  <th className={styles["mgmt-table-header"]}>개인정보여부</th>
                  <td>
                    <MzCheckBox
                      name="prsnInfoYn"
                      id="prsnInfoYn"
                      type="checkbox"
                      checked={detail?.prsnInfoYn === "Y"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          prsnInfoYn: e.target.checked ? "Y" : "N",
                        }))
                      }
                    >
                      개인정보여부
                    </MzCheckBox>
                  </td>
                </tr>
                <tr>
                  <th className={styles["mgmt-table-header"]}>사용여부</th>
                  <td>
                    <MzSelectBox
                      options={["사용", "사용안함"]}
                      selected={detail?.useYn === "Y" ? "사용" : "사용안함"}
                      onSelect={(value) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          useYn: value === "사용" ? "Y" : "N",
                        }))
                      }
                    />
                  </td>
                  <th className={styles["mgmt-table-header"]}>정렬순서</th>
                  <td>
                    <MzInputText
                      name="sortSeq"
                      placeholder="정렬순서"
                      value={detail?.sortSeq || ""}
                      style={{ flex: 1 }}
                      onChange={(e) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          sortSeq: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className={`required ${styles["mgmt-table-header"]}`}>
                    권한대상명
                  </th>
                  <td>
                    <MzInputText
                      name="rtTgtNm"
                      placeholder="권한대상명"
                      value={detail?.rtTgtNm || ""}
                      style={{ flex: 1 }}
                      onChange={(e) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          rtTgtNm: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <th className={styles["mgmt-table-header"]}>메뉴유형</th>
                  <td>
                    <MzSelectBox
                      options={["MENU", "화면", "REQUEST", "버튼"]}
                      selected={
                        detail?.rtTgtTpCd === "10"
                          ? "MENU"
                          : detail?.rtTgtTpCd === "20"
                            ? "화면"
                            : detail?.rtTgtTpCd === "30"
                              ? "REQUEST"
                              : detail?.rtTgtTpCd === "40"
                                ? "버튼"
                                : "MENU"
                      }
                      onSelect={(value) => {
                        const typeValue =
                          value === "MENU"
                            ? "10"
                            : value === "화면"
                              ? "20"
                              : value === "REQUEST"
                                ? "30"
                                : value === "버튼"
                                  ? "40"
                                  : "10";
                        setDetail((prev: any) => ({
                          ...prev,
                          rtTgtTpCd: typeValue,
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={styles["mgmt-table-header"]}>호출URL</th>
                  <td colSpan={3}>
                    <MzInputText
                      name="caloUrl"
                      placeholder="호출URL"
                      value={detail?.caloUrl || ""}
                      style={{ flex: 1 }}
                      onChange={(e) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          caloUrl: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className={styles["mgmt-table-header"]}>버튼 ID</th>
                  <td colSpan={3}>
                    <MzInputText
                      name="menuId"
                      placeholder="버튼ID"
                      value={detail?.menuId || ""}
                      style={{ flex: 1 }}
                      onChange={(e) =>
                        setDetail((prev: any) => ({
                          ...prev,
                          menuId: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th rowSpan={6} className={styles["mgmt-table-header"]}>
                    사용자 도움말
                  </th>
                  <td colSpan={3} style={{ verticalAlign: "top" }}>
                    <table border={0}>
                      <tbody>
                        <tr>
                          <th>등록자</th>
                          <td>
                            <MzInputText
                              name="sysRegrId"
                              placeholder="등록자"
                              value={detail?.sysRegrId || ""}
                              readOnly
                            />
                          </td>
                          <th>등록일시</th>
                          <td>
                            <MzInputText
                              name="sysRegDtime"
                              placeholder="등록일시"
                              value={detail?.sysRegDtime || ""}
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>수정자</th>
                          <td>
                            <MzInputText
                              name="sysModrId"
                              placeholder="수정자"
                              value={detail?.sysModrId || ""}
                              readOnly
                            />
                          </td>
                          <th>수정일시</th>
                          <td>
                            <MzInputText
                              name="sysModDtime"
                              placeholder="수정일시"
                              value={detail?.sysModDtime || ""}
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} style={{ verticalAlign: "top" }}>
                            <MzEditor
                              content={detail?.helpDesc || ""}
                              editorRef={editorRef}
                              mode="edit"
                              onChange={(val) =>
                                setDetail((prev: any) => ({
                                  ...prev,
                                  helpDesc: val,
                                }))
                              }
                              height="200px"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 하위 메뉴리스트 그리드 */}
          <div className="mzGridLayout01">
            <AdminTitle
              title="하위 메뉴 리스트"
              subTitle={
                subMenuTotalCount > 0
                  ? `(총 ${subMenuTotalCount}건)`
                  : undefined
              }
            />

            {/* 검색 폼 추가 */}
            <form id="subMenuSearchForm" style={{ display: "none" }}>
              <input
                type="hidden"
                name="rtTgtSeq"
                value={selectedNode?.rtTgtSeq || ""}
              />
              <input type="hidden" name="lvl" value={selectedNode?.lvl || ""} />
              <input
                type="hidden"
                name="useYn"
                value={selectedNode?.useYn || ""}
              />
            </form>

            <div
              style={{
                height: "calc(100vh - 600px)",
                minHeight: "300px",
                maxHeight: "600px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <GridBuilder
                ref={gridRef}
                gridId="subMenuGrid"
                config={{
                  id: "subMenuGrid",
                  columns: subMenuColumns,
                  data: subMenuList,
                  rowHeaders: [{ type: "checkbox" }],
                  bodyHeight: 300,
                  scrollX: true,
                  scrollY: true,
                  editingEvent: "click",
                  keywordSearch: false,
                  pagingable: true,
                  rows: [10, 20, 50],
                  rowsPerPage: 10,
                  action: `/system/menuMgmt.getSubMenuList.do`,
                  saveAction: `/system/menuMgmt.putSubMenuList.do`,
                  excelAction: `/system/menuMgmt.getSubMenuList.do`,
                  form: "subMenuSearchForm",
                  actionAfterCallback: true, // 검색 후 콜백 활성화
                  requiredColumns: [
                    { name: "mrkNm", header: "메뉴명" },
                    { name: "rtTgtNm", header: "권한대상명" },
                  ],
                  rowBtnType: {
                    rowAdd: true,
                    rowDel: true,
                    rowUpdate: true,
                    rowExcelAll: false,
                    excelFileName: "하위메뉴_목록.xlsx",
                  },
                  header: {
                    height: 40,
                    complexColumns: [],
                  },
                  summary: {
                    height: 40,
                    position: "bottom",
                    columnContent: {},
                  },
                  saveAfterSearch: true,
                  saveAfterCallback: true,
                  deleteBeforeCallback: true,
                  resizable: false,
                  resizeOptions: {
                    showButton: true,
                    minHeight: 200,
                    maxHeight: 500,
                    step: 50,
                  },
                }}
                resizable={true}
                onInit={(grid) => {
                  // console.log('SubMenu Grid initialized:', grid);
                  // 그리드 준비 상태 설정
                  setIsGridReady(true);

                  // gridRef.current 설정 (추가 보장)
                  if (gridRef.current === null) {
                    // console.log('Setting gridRef.current manually');
                  }

                  // 그리드 초기화 후 데이터 설정
                  if (subMenuList.length > 0) {
                    grid.resetData(subMenuList);
                  }

                  // 그리드에 행 추가 이벤트 리스너 등록
                  grid.on("afterChange", (ev: any) => {
                    // console.log('afterChange event:', ev);
                    if (ev.changes && ev.changes.length > 0) {
                      // 새로 추가된 행인지 확인
                      const isNewRow = ev.changes.some(
                        (change: any) =>
                          change.rowKey >= 0 && !change.oldValue && change.value
                      );
                      // console.log('isNewRow:', isNewRow);
                      if (isNewRow) {
                        // console.log('New row added, setting uprRtTgtSeq');
                        const data = grid.getData();
                        if (data.length > 0) {
                          const lastRow = data[data.length - 1];
                          const rowKey = lastRow.rowKey;

                          // rtTgtSeq 필드에서 값을 읽어옴
                          const rtTgtSeqField = document.querySelector(
                            'input[name="rtTgtSeq"]'
                          ) as HTMLInputElement;
                          const rtTgtSeqValue = rtTgtSeqField
                            ? rtTgtSeqField.value
                            : "";

                          //console.log('rtTgtSeqValue:', rtTgtSeqValue);

                          // 상위메뉴번호 설정
                          setTimeout(() => {
                            try {
                              // 그리드 데이터 직접 업데이트
                              const currentData = grid.getData();
                              const updatedData = currentData.map(
                                (row: any) => {
                                  if (row.uprRtTgtSeq === null) {
                                    return {
                                      ...row,
                                      uprRtTgtSeq: rtTgtSeqValue,
                                    };
                                  }
                                  return row;
                                }
                              );

                              // console.log('updatedData:', updatedData);
                              // 그리드 데이터 리셋
                              grid.resetData(updatedData);

                              // 특정 셀 값 설정 (추가 보장)
                              grid.setValue(
                                rowKey as any,
                                "uprRtTgtSeq",
                                rtTgtSeqValue
                              );

                              // 레이아웃 새로고침
                              grid.refreshLayout();

                              // 변경사항 확인
                              const updatedRow = grid.getRow(rowKey as any);
                              // console.log('Updated grid data for rowKey:', rowKey, 'with uprRtTgtSeq:', rtTgtSeqValue);
                              // console.log('Updated row data:', updatedRow);
                            } catch (error) {
                              console.error(
                                "Error updating grid value:",
                                error
                              );
                            }
                          }, 100);
                        }
                      }
                    }
                  });
                }}
                onSearchCallback={(response) => {
                  // console.log('Search completed:', response);
                  if (response && typeof response === "object") {
                    const responseObj = response as {
                      data?: any[];
                      total?: number;
                    };

                    if (responseObj.data) {
                      setSubMenuList(responseObj.data);
                      // 총 건수 업데이트
                      const totalCount =
                        responseObj.total || responseObj.data.length;
                      setSubMenuTotalCount(totalCount);
                    } else {
                      setSubMenuList([]);
                      setSubMenuTotalCount(0);
                    }
                  }
                }}
                onSaveCallback={(response) => {
                  // console.log('Save completed:', response);
                  if (response.succeeded) {
                    // 삭제인지 저장인지 구분하여 메시지 표시
                    if (response.deleteList && response.deleteList.length > 0) {
                      alert("선택한 항목이 삭제되었습니다.");
                    } else {
                      alert("하위메뉴가 저장되었습니다.");
                    }

                    // 저장/삭제 후 하위메뉴 리스트 다시 조회
                    if (selectedNode) {
                      nodeEvent(selectedNode);
                    }
                  } else {
                    // 삭제인지 저장인지 구분하여 에러 메시지 표시
                    if (response.deleteList && response.deleteList.length > 0) {
                      MzAlert.alert("삭제에 실패했습니다.");
                    } else {
                      MzAlert.alert("저장에 실패했습니다.");
                    }
                  }
                }}
                onSaveBeforeCallback={() => {
                  // 저장 전 검증 로직 및 선택된 행 데이터 처리
                  const gridInstance = gridRef.current?.getGrid();
                  if (gridInstance) {
                    const checkedRows = gridInstance.getCheckedRows();

                    // 선택된 행들의 데이터를 검색 폼에 추가 파라미터로 설정
                    if (checkedRows && checkedRows.length > 0) {
                      const formElement = document.querySelector(
                        "#subMenuSearchForm"
                      ) as HTMLFormElement;
                      if (formElement) {
                        // 기존 hidden input들 제거
                        const existingParams = formElement.querySelectorAll(
                          'input[name^="selectedRow_"]'
                        );
                        existingParams.forEach((param) => param.remove());

                        // 선택된 행들의 데이터를 hidden input으로 추가
                        checkedRows.forEach((row: any, index: number) => {
                          Object.keys(row).forEach((key) => {
                            if (key !== "rowKey" && key !== "sortKey") {
                              const input = document.createElement("input");
                              input.type = "hidden";
                              input.name = `selectedRow_${index}_${key}`;
                              input.value = row[key] || "";
                              formElement.appendChild(input);
                            }
                          });
                        });

                        // 선택된 행 개수도 추가
                        const countInput = document.createElement("input");
                        countInput.type = "hidden";
                        countInput.name = "selectedRowCount";
                        countInput.value = checkedRows.length.toString();
                        formElement.appendChild(countInput);
                      }
                    }

                    const data = gridInstance.getData();
                    // GridCUDRequest 형식에 맞게 데이터 구조화
                    const saveData = {
                      [gridInstance.id || "subMenuGrid"]: data.map(
                        (item: any) => ({
                          status: "u", // update 상태 (기본값)
                          data: {
                            rtTgtSeq: item.rtTgtSeq || "",
                            mrkNm: item.mrkNm || "",
                            rtTgtSctCd:
                              item.rtTgtSctCd === "BO"
                                ? "10"
                                : item.rtTgtSctCd || "",
                            rtTgtTpCd:
                              item.rtTgtTpCd === "메뉴"
                                ? "10"
                                : item.rtTgtTpCd === "화면"
                                  ? "20"
                                  : item.rtTgtTpCd === "REQUEST"
                                    ? "30"
                                    : item.rtTgtTpCd === "버튼"
                                      ? "40"
                                      : item.rtTgtTpCd || "",
                            caloUrl: item.caloUrl || "",
                            menuId: item.menuId || "",
                            uprRtTgtSeq: item.uprRtTgtSeq || "",
                            prsnInfoYn: item.prsnInfoYn || "N",
                            useYn: item.useYn || "Y",
                            sortSeq: item.sortSeq || "",
                            pppYn: item.pppYn || "N",
                            rtTgtNm: item.rtTgtNm || "",
                            langCd: item.langCd || "",
                          },
                        })
                      ),
                    };

                    // console.log('📤 저장 요청 데이터:', saveData);

                    // axios를 사용하여 직접 API 호출
                    axios
                      .put(
                        "/system/menuMgmt.putSubMenuList.do",
                        JSON.stringify(saveData),
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                          withCredentials: false,
                        }
                      )
                      .then((response) => {
                        // console.log('📥 저장 응답:', response.data);
                        if (response.data.succeeded) {
                          MzAlert.alert("하위메뉴가 저장되었습니다.");
                          // 저장 후 하위메뉴 리스트 다시 조회
                          if (selectedNode) {
                            nodeEvent(selectedNode);
                          }
                        } else {
                          alert("저장에 실패했습니다.");
                        }
                      })
                      .catch((error) => {
                        console.error("❌ 저장 에러:", error);
                        MzAlert.alert("저장 중 오류가 발생했습니다.");
                      });
                  }

                  // GridBuilder가 저장 요청을 처리하지 않도록 false 반환
                  return false;
                }}
                onDeleteBeforeCallback={() => {
                  // console.log('onDeleteBeforeCallback===============');

                  const checkedRows = gridRef.current
                    ?.getGrid()
                    ?.getCheckedRows();
                  if (!checkedRows || checkedRows.length === 0) {
                    MzAlert.alert("삭제할 항목을 선택해주세요.");
                    return false;
                  }

                  // console.log('삭제할 행들:', checkedRows);

                  // 사용자 확인
                  const confirmMessage = `선택한 ${checkedRows.length}개 항목을 삭제하시겠습니까?`;
                  const userConfirmed = MzAlert.confirm(confirmMessage);
                  if (!userConfirmed) {
                    // console.log('❌ 사용자가 삭제를 취소함');
                    return false;
                  }

                  // GridCUDRequest 형식에 맞게 데이터 구조화
                  const deleteData = {
                    [gridRef.current?.getGrid()?.id || "subMenuGrid"]:
                      checkedRows.map((row: any) => ({
                        status: "d", // delete 상태
                        data: {
                          rtTgtSeq: row.rtTgtSeq || "",
                          mrkNm: row.mrkNm || "",
                          rtTgtSctCd:
                            row.rtTgtSctCd === "BO"
                              ? "10"
                              : row.rtTgtSctCd || "",
                          rtTgtTpCd:
                            row.rtTgtTpCd === "메뉴"
                              ? "10"
                              : row.rtTgtTpCd === "화면"
                                ? "20"
                                : row.rtTgtTpCd === "REQUEST"
                                  ? "30"
                                  : row.rtTgtTpCd === "버튼"
                                    ? "40"
                                    : row.rtTgtTpCd || "",
                          caloUrl: row.caloUrl || "",
                          menuId: row.menuId || "",
                          uprRtTgtSeq: row.uprRtTgtSeq || "",
                          prsnInfoYn: row.prsnInfoYn || "N",
                          useYn: row.useYn || "Y",
                          sortSeq: row.sortSeq || "",
                          pppYn: row.pppYn || "N",
                          rtTgtNm: row.rtTgtNm || "",
                          langCd: row.langCd || "",
                        },
                      })),
                  };

                  // console.log('📤 삭제 요청 데이터:', deleteData);

                  // axios를 사용하여 직접 API 호출
                  axios
                    .put(
                      "/system/menuMgmt.putSubMenuList.do",
                      JSON.stringify(deleteData),
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        withCredentials: false,
                      }
                    )
                    .then((response) => {
                      // console.log('📥 삭제 응답:', response.data);
                      if (response.data.succeeded) {
                        alert("선택한 항목이 삭제되었습니다.");
                        // 삭제 후 그리드 재조회
                        if (gridRef.current) {
                          gridRef.current.doSearch();
                        }
                        // 삭제 후 하위메뉴 리스트 다시 조회
                        if (selectedNode) {
                          nodeEvent(selectedNode);
                        }
                      } else {
                        alert("삭제에 실패했습니다.");
                      }
                    })
                    .catch((error) => {
                      console.error("❌ 삭제 에러:", error);
                      alert("삭제 중 오류가 발생했습니다.");
                    });

                  // GridBuilder가 삭제 요청을 처리하지 않도록 false 반환
                  return false;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
