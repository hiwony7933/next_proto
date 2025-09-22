import React, { useState } from 'react';
import AdminTitle from '../common/adminTitle';//타이틀 컴포넌트
import MzButton from '@/components/ui/mzButton';//[공통]버튼 컴포넌트
import MzAlert from '@/components/ui/mzAlert';//[공통]알림 컴포넌트
import MzInputText from '@/components/form/mzInputText';//[공통]입력 컴포넌트
import MzSelectBox from '@/components/form/mzSelectBox';//[공통]셀렉트 컴포넌트
import { MzDateRangePicker } from '@/components/form/mzDateRangePicker';//[공통]날짜 범위 선택 컴포넌트

//검색영역 (레이아웃 버전) 컴포넌트
export const LayoutSearch = () => {
  const [isFormShowHide, setIsFormShowHide] = useState(false);//검색영역 토글 상태 변수
  const [select, setSelect] = useState('전체');//검색 구분(셀렉트)
  const [date, setDate] = useState<[any, any]>([null, null]);//검색 기간
  // 날짜 유효성 검사 핸들러
  const handleDateValidationError = (error: string) => {
    // 필요시 에러 처리 (알림, 로그 등)
    console.warn('날짜 유효성 검사 에러:', error);
    // MzAlert.alert(error); // 필요하다면 알림으로 표시
  };
  // Search form handlers from AdminSearchLayout
  const handleReset = () => {
    MzAlert.alert('초기화 처리');
    return;
  };
  // 샘플 onSearch 함수
  const handleSearch = (query: string) => {
    // 실제 검색 로직은 여기에 구현
    console.log('검색어:', query);
  };

  return (
    <>
      {/* [01] 검색영역 */}
      <div className={`layoutSearch${isFormShowHide ? ' mzFormShowHide' : ''}`}>
        <AdminTitle
          title={"검색 폼 예제"}
          showHide={true}
          setIsFormShowHide={setIsFormShowHide}
          isFormShowHide={isFormShowHide}
        />
        <div className="searchForm">
          <table>
            <colgroup>
              <col width="100px" />
              <col width="300px" />
              <col width="100px" />
              <col width="300px" />
            </colgroup>
            <tbody>
              <tr>
                <th><span className="required">전시 기간</span></th>
                <td colSpan={3}>
                  <MzDateRangePicker
                    value={date}
                    onChange={setDate}
                    showQuickButtons={true}
                    noticeText=""
                    onValidationError={handleDateValidationError}
                    autoValidate={true}
                  />
                </td>
              </tr>
              <tr>
                <th>구분</th>
                <td>
                  <MzSelectBox size="2" type="dropdown" className="dropdown" options={["전체", "전시", "미전시"]} selected={select}
                    style={{ width: '160px' }}
                    onSelect={v => setSelect(typeof v === 'string' ? v : v[0])} />
                </td>
                <th>이름</th>
                <td>
                  <MzInputText
                    mzSize="2"
                    placeholder={"검색어를 입력해주세요."}
                    maxLength={100}
                    minLength={1}
                    required={true}
                    style={{ width: '250px' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="searchActionButton">
          <MzButton stroke="black" onClick={handleReset}>초기화</MzButton>
          <MzButton fill="black" onClick={handleSearch}>검색</MzButton>
        </div>
      </div>
    </>
  );
}
