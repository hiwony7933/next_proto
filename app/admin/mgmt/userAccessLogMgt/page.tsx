"use client";
import React, { useRef, useState, useEffect } from "react";
import MzInputText from "../../../common/components/form/mzInputText";
import MzSelectBox from "../../../common/components/form/mzSelectBox";
import MzButton from "../../../common/components/ui/mzButton";
import GridBuilder, {
  DateUtil,
} from "../../../admin/components/sample/exGridBuilder";
import AdminTitle from "../../../admin/components/common/adminTitle";
import "../../styles/adminStyle.scss";
import styles from "../mgmt.module.scss";

// 명명규칙 기반 변수명
const initialQuery = {
  usrId: "", // 사용자ID (백엔드 필드명에 맞춤)
  usrNm: "", // 사용자명 (백엔드 필드명에 맞춤)
  loginAttrCd: "", // 구분 (로그인결과) (백엔드 필드명에 맞춤)
};

const loginResultOptions = ["전체", "로그인성공", "로그인실패"];

// 로그인 결과 값 매핑
const getLoginAttrCdValue = (displayValue: string): string => {
  switch (displayValue) {
    case "로그인성공":
      return "10";
    case "로그인실패":
      return "20";
    default:
      return "";
  }
};

// 사용자별 최종로그인정보 그리드 설정
const lastLoginGridConfig = {
  id: "lastLoginGrid",
  rowHeaders: [],
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "사용자ID",
      name: "usrId",
      width: 120,
      editable: false,
      required: true,
    },
    {
      header: "사용자명",
      name: "usrNm",
      width: 120,
      editable: false,
      required: true,
    },
    {
      header: "최종로그인일시",
      name: "loginDtime",
      width: 160,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
    },
    {
      header: "최종로그아웃일시",
      name: "logoutDtime",
      width: 160,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
    },
    {
      header: "잠김",
      name: "locked",
      width: 80,
      editable: false,
    },
    {
      header: "로그인수",
      name: "cnt",
      width: 100,
      editable: false,
      sortable: true,
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: false,
    rowExcelAll: false,
    excelFileName: "userLastLoginData",
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "userAccessLogForm",
  saveAfterSearch: true,
  actionAfterCallback: true, // 검색 후 콜백 활성화
  action: "/system/monitoringMgmt.getLastLoginInfoList.do",
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

// 상세로그인 이력 그리드 설정
const loginDetailGridConfig = {
  id: "loginDetailGrid",
  rowHeaders: [],
  header: {
    height: 40,
    complexColumns: [],
  },
  columns: [
    {
      header: "로그인일시",
      name: "loginDtime",
      width: 160,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
    },
    {
      header: "로그아웃일시",
      name: "logoutDtime",
      width: 160,
      formatter: ({ value }: { value: string | Date }) =>
        DateUtil.getDateObject(value).format("yyyy-MM-dd HH:mm:ss"),
      ellipsis: true,
    },
    {
      header: "로그인IP",
      name: "usrIpAddr",
      width: 120,
      editable: false,
    },
    {
      header: "로그인결과",
      name: "loginTpNm",
      width: 100,
      editable: false,
    },
    {
      header: "세션ID",
      name: "sessId",
      width: 200,
      editable: false,
    },
  ],
  height: 300,
  rowBtnType: {
    rowAdd: false,
    rowDel: false,
    rowUpdate: false,
    rowExcelAll: false,
    excelFileName: "userLoginDetailData",
  },
  pagingable: true,
  rowsPerPage: 10,
  rows: [10, 20, 50, 100],
  form: "detailLoginForm", // 별도 폼 사용
  saveAfterSearch: true,
  actionAfterCallback: true, // 검색 후 콜백 활성화
  action: "/system/monitoringMgmt.getDetailLoginHistoryList.do",
  resizeOptions: {
    showButton: true,
    minHeight: 300,
    maxHeight: 800,
    step: 50,
  },
};

const UserLoginHistoryMgt = () => {
  const [query, setQuery] = useState(initialQuery);
  const [isFormShowHide, setIsFormShowHide] = useState(false);
  const [lastLoginTotalCount, setLastLoginTotalCount] = useState<number>(0);
  const [loginDetailTotalCount, setLoginDetailTotalCount] = useState<number>(0);
  const lastLoginGridRef = useRef<unknown>(null);
  const loginDetailGridRef = useRef<unknown>(null);

  // 검색 조건 변경
  const handleQueryChange = (field: keyof typeof query, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  // 검색 조건이 변경될 때마다 히든 필드 업데이트
  useEffect(() => {
    const loginAttrCdInput = document.querySelector(
      'input[name="loginAttrCd"]'
    ) as HTMLInputElement;
    if (loginAttrCdInput) {
      loginAttrCdInput.value = query.loginAttrCd;
    }
  }, [query.loginAttrCd]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    // console.log('=== 검색 실행 ===');
    // console.log('검색 조건:', query);

    // 검색 시 상세로그인이력 그리드 즉시 초기화
    if (loginDetailGridRef.current) {
      (
        loginDetailGridRef.current as { resetData: (data: unknown[]) => void }
      ).resetData([]);
    }

    // 폼에 검색 조건 설정
    const form = document.querySelector(
      "#userAccessLogForm"
    ) as HTMLFormElement;
    if (form) {
      // 폼 데이터를 직접 설정
      // console.log('🔍 검색 시작:', query.prsnInfoYn);
      const formData = new FormData(form);
      formData.set("usrId", query.usrId);
      formData.set("usrNm", query.usrNm);
      formData.set("loginAttrCd", query.loginAttrCd);

      // console.log('🔍 검색 시작:', formData);

      // 폼 요소들의 value도 직접 설정
      const usrIdInput = form.querySelector("#usrId") as HTMLInputElement;
      const usrNmInput = form.querySelector("#usrNm") as HTMLInputElement;
      const loginAttrCdInput = form.querySelector(
        'input[name="loginAttrCd"]'
      ) as HTMLInputElement;

      if (usrIdInput) usrIdInput.value = query.usrId;
      if (usrNmInput) usrNmInput.value = query.usrNm;
      if (loginAttrCdInput) loginAttrCdInput.value = query.loginAttrCd;

      // 파라미터 전달 확인
      // console.log('전송될 파라미터:', {
      //   usrId: usrIdInput?.value || query.usrId,
      //   usrNm: usrNmInput?.value || query.usrNm,
      //   loginAttrCd: loginAttrCdInput?.value || query.loginAttrCd
      // });
    }

    if (lastLoginGridRef.current) {
      (
        lastLoginGridRef.current as { doSearch: (args?: unknown) => void }
      ).doSearch();
    } else {
      console.error("그리드가 초기화되지 않았습니다.");
    }
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    setQuery(initialQuery);
    const form = document.querySelector(
      "#userAccessLogForm"
    ) as HTMLFormElement;
    if (form) {
      form.reset();
      // 히든 필드도 초기화
      const loginAttrCdInput = form.querySelector(
        'input[name="loginAttrCd"]'
      ) as HTMLInputElement;
      if (loginAttrCdInput) {
        loginAttrCdInput.value = "";
      }
    }

    // 그리드 데이터 초기화
    if (lastLoginGridRef.current) {
      (
        lastLoginGridRef.current as { resetData: (data: unknown[]) => void }
      ).resetData([]);
    }

    if (loginDetailGridRef.current) {
      (
        loginDetailGridRef.current as { resetData: (data: unknown[]) => void }
      ).resetData([]);
    }

    // console.log('=== 초기화 완료 ===');
  };

  // 최종로그인정보 그리드 초기화
  const handleLastLoginGridInit = (grid: unknown) => {
    lastLoginGridRef.current = grid;

    // 행 클릭 시 상세로그인 이력 조회 - 안전한 방식으로 처리
    try {
      (
        grid as {
          on: (event: string, cb: (ev: unknown) => void) => void;
          getValue: (rowKey: number, col: string) => string;
        }
      ).on("click", (ev: unknown) => {
        try {
          const { rowKey } = ev as { rowKey: number };
          if (rowKey !== undefined && rowKey !== null) {
            const userId = (
              grid as { getValue: (rowKey: number, col: string) => string }
            ).getValue(rowKey, "usrId");
            if (userId && loginDetailGridRef.current) {
              const searchUsrIdInput = document.querySelector(
                "#searchUsrId"
              ) as HTMLInputElement;
              if (searchUsrIdInput) {
                searchUsrIdInput.value = userId;
              }

              // 상세로그인이력 조회를 위한 별도 폼에 값 설정
              const detailForm = document.querySelector(
                "#detailLoginForm"
              ) as HTMLFormElement;
              if (detailForm) {
                // 기존 필드들 제거
                detailForm.innerHTML = "";

                // 상세조회용 usrId 필드 생성
                const detailUsrIdInput = document.createElement("input");
                detailUsrIdInput.type = "hidden";
                detailUsrIdInput.name = "usrId";
                detailUsrIdInput.value = userId;
                detailForm.appendChild(detailUsrIdInput);
              }

              (
                loginDetailGridRef.current as {
                  doSearch: (args?: unknown) => void;
                }
              ).doSearch();
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

  // 상세로그인 이력 그리드 초기화
  const handleLoginDetailGridInit = (grid: unknown) => {
    loginDetailGridRef.current = grid;
  };

  // 최종로그인정보 검색 콜백
  const handleLastLoginSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: unknown[]; total?: number };
      // console.log('최종로그인정보 조회 결과:', {
      //   데이터개수: responseObj.data?.length || 0,
      //   전체개수: responseObj.total || 0
      // });

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setLastLoginTotalCount(totalCount);
      } else {
        setLastLoginTotalCount(0);
      }
    }
  };

  // 상세로그인 이력 검색 콜백
  const handleLoginDetailSearch = (response: unknown) => {
    if (response && typeof response === "object") {
      const responseObj = response as { data?: unknown[]; total?: number };
      // console.log('상세로그인이력 조회 결과:', {
      //   데이터개수: responseObj.data?.length || 0,
      //   전체개수: responseObj.total || 0
      // });

      if (responseObj.data) {
        // 총 건수 업데이트
        const totalCount = responseObj.total || responseObj.data.length;
        setLoginDetailTotalCount(totalCount);
      } else {
        setLoginDetailTotalCount(0);
      }
    }
  };

  // 최종로그인정보 저장 콜백
  const handleLastLoginSave = () => {
    // console.log('최종로그인정보 저장 완료');
  };

  // 상세로그인 이력 저장 콜백
  const handleLoginDetailSave = () => {
    // console.log('상세로그인이력 저장 완료');
  };

  // 엔터키 검색 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // 검색 버튼 이벤트 (원본 eventListener 기반)
  useEffect(() => {
    const handleSearchClick = () => {
      handleSearch();
    };

    const handleInitClick = () => {
      handleReset();
    };

    // 버튼 이벤트 바인딩
    const searchBtn = document.querySelector("#btn_search");
    const initBtn = document.querySelector("#btn_init");

    if (searchBtn) {
      searchBtn.addEventListener("click", handleSearchClick);
    }
    if (initBtn) {
      initBtn.addEventListener("click", handleInitClick);
    }

    // 클린업
    return () => {
      if (searchBtn) {
        searchBtn.removeEventListener("click", handleSearchClick);
      }
      if (initBtn) {
        initBtn.removeEventListener("click", handleInitClick);
      }
    };
  }, []);

  // 페이지 로드 시 초기화
  useEffect(() => {
    // 상세로그인이력 조회용 별도 폼 생성
    let detailForm = document.querySelector(
      "#detailLoginForm"
    ) as HTMLFormElement;
    if (!detailForm) {
      detailForm = document.createElement("form");
      detailForm.id = "detailLoginForm";
      detailForm.style.display = "none";
      document.body.appendChild(detailForm);
    }

    // console.log('사용자접속 이력관리 페이지 로드');
  }, []);

  return (
    <div className="user-login-history-mgt-wrap">
      {/* 상단 검색 조건 */}
      <div className={`layoutSearch${isFormShowHide ? " mzFormShowHide" : ""}`}>
        <AdminTitle
          title="사용자접속이력관리"
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />

        {/* 검색 폼 */}
        <div className="searchForm">
          <form id="userAccessLogForm">
            <input type="hidden" name="action" value="" />
            <table>
              <colgroup>
                <col width="120px" />
                <col width="240px" />
                <col width="120px" />
                <col width="240px" />
                <col width="120px" />
                <col width="240px" />
              </colgroup>
              <tbody>
                <tr>
                  <th>사용자ID</th>
                  <td>
                    <MzInputText
                      id="usrId"
                      name="usrId"
                      value={query.usrId}
                      onChange={(e) =>
                        handleQueryChange("usrId", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="사용자ID 입력"
                      mzSize="2"
                    />
                  </td>
                  <th>사용자명</th>
                  <td>
                    <MzInputText
                      id="usrNm"
                      name="usrNm"
                      value={query.usrNm}
                      onChange={(e) =>
                        handleQueryChange("usrNm", e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="사용자명 입력"
                      mzSize="2"
                    />
                  </td>
                  <th>구분</th>
                  <td>
                    <MzSelectBox
                      id="loginAttrCd"
                      options={loginResultOptions}
                      selected={query.loginAttrCd}
                      onSelect={(val) =>
                        handleQueryChange(
                          "loginAttrCd",
                          getLoginAttrCdValue(val as string)
                        )
                      }
                      size="2"
                    />
                    <input
                      type="hidden"
                      name="loginAttrCd"
                      value={query.loginAttrCd}
                      onChange={() => {}}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          {/* 상세로그인이력 조회를 위한 사용자ID (히든 필드) */}
          <input type="hidden" id="searchUsrId" name="searchUsrId" />
        </div>

        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>
            초기화
          </MzButton>
          <MzButton fill="black" onClick={handleSearch}>
            검색
          </MzButton>
        </div>
      </div>

      {/* [02] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        {/* 사용자별 최종로그인정보 */}
        <AdminTitle
          title="사용자별 최종로그인정보"
          subTitle={
            lastLoginTotalCount > 0
              ? `(총 ${lastLoginTotalCount}건)`
              : undefined
          }
        />
        <GridBuilder
          gridId="lastLoginGrid"
          config={lastLoginGridConfig}
          resizable={true}
          onInit={handleLastLoginGridInit}
          onSearchCallback={handleLastLoginSearch}
          onSaveCallback={handleLastLoginSave}
        />
      </div>

      {/* [03] 레이아웃-01 : 그리드영역 */}
      <div className="mzGridLayout01">
        {/* 상세로그인 이력 */}
        <AdminTitle
          title="상세로그인이력"
          subTitle={
            loginDetailTotalCount > 0
              ? `(총 ${loginDetailTotalCount}건)`
              : undefined
          }
        />
        <GridBuilder
          gridId="loginDetailGrid"
          config={loginDetailGridConfig}
          resizable={true}
          onInit={handleLoginDetailGridInit}
          onSearchCallback={handleLoginDetailSearch}
          onSaveCallback={handleLoginDetailSave}
        />
      </div>
    </div>
  );
};

export default UserLoginHistoryMgt;
