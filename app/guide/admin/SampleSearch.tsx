import React, { useState } from "react";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import AdminSearchLayout from "@/admin/components/common/adminSearchLayout";
import '../assets/sample.scss';
import '../../admin/assets/adminStyle.scss';
import MzButton from '@/components/ui/mzButton';
import MzAlert from '@/components/ui/mzAlert';
import MzSelectBox from '@/components/form/mzSelectBox';
import { MzDateRangePicker } from '@/components/form/mzDateRangePicker';
import MzInputText from '@/components/form/mzInputText';

/**
 * AdminSearchLayout Props 설명
 *
 * title: string;                // 검색 영역의 타이틀
 * onSearch: (query: string) => void; // 검색 실행 시 호출되는 콜백
 * placeholder?: string;         // 검색 input의 placeholder
 * defaultValue?: string;        // 검색 input의 기본값
 * buttonLabel?: string;         // 검색 버튼 라벨
 * disabled?: boolean;           // 검색 input/버튼 비활성화 여부
 */

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const sampleCode = `import AdminSearchLayout from '../../admin/components/common/adminSearchLayout';//import AdminSearchLayout
  {/* 샘플 AdminSearchLayout 사용 예시 */}
  <AdminSearchLayout
    title="어드민 검색 샘플"
    onSearch={handleSearch}
  />



{/** 페이지 내에 직접 입력할 경우 html 태그 사용 */}
import React, { useState } from 'react';
import MzButton from '@/components/common/mzButton';//import MzButton
import MzAlert from '@/components/common/mzAlert';//import MzAlert
import AdminTitle from './adminTitle';//import AdminTitle
import MzSelectBox from '@/components/common/mzSelectBox';//import MzSelectBox
import { MzDateRangePicker } from '@/components/common/MzDateRangePicker';//import MzDateRangePicker
import MzInputText from '@/components/common/mzInputText';//import MzInputText
const AdminSearchLayout = () => {
  // 각 입력값을 useState로 관리
  const [date, setDate] = useState<[any, any]>([null, null]);
  const [select, setSelect] = useState("전체");
  const [text, setText] = useState("");

  // 초기화 버튼 클릭 핸들러
  const handleReset = () => {
    setDate([null, null]);
    setSelect("전체");
    setText("");
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    // 입력값을 모아서 alert로 출력
    MzAlert.alert(
      
    );
    // 필요하다면 onSearch 콜백도 호출
    if (onSearch) onSearch(text);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (type: 'from' | 'to', newValue: [string, string]) => {
    const masked = type === "from" ? newValue[0] : newValue[1];
    if (masked.length === 10) {
      const [y, m, d] = masked.split(".").map(Number);
      const dt = new Date(y, m - 1, d);
      if (
        dt.getFullYear() === y &&
        dt.getMonth() === m - 1 &&
        dt.getDate() === d
      ) {
        const updatedValue: [string, string] =
          type === "from"
            ? [masked, newValue[1]]
            : [newValue[0], masked];
        setDate(updatedValue);
      }
    } else {
      const updatedValue: [string, string] =
        type === "from"
          ? ["", newValue[1]]
          : [newValue[0], ""];
      setDate(updatedValue);
    }
  };

  return (
    <div className={"layoutSearch"}>
      <AdminTitle title={title} showHide={showHide} />
      <div className="searchForm">
        <table>
          <colgroup>
            <col width="100px" />
            <col width="300px" />
            <col width="100px" />
            <col width="*" />
          </colgroup>
          <tbody>
            <tr>
              <th><span className="required">전시 기간</span></th>
              <td colSpan={3}>
                <MzDateRangePicker
                  value={date}
                  onChange={(newValue) => handleDateChange('from', newValue)}
                  showQuickButtons={true}
                />
              </td>
            </tr>
            <tr>
              <th>전시 대상</th>
              <td>
                <MzSelectBox size="2" type="dropdown" className="dropdown" options={["전체", "전시", "미전시"]} selected={select}
                  onSelect={setSelect} />
              </td>
              <th>전시 코너명</th>
              <td>
                <MzInputText
                  size="2"
                  placeholder={"검색어를 입력해주세요."}
                  value={text}
                  onChange={e => setText(e.target.value)}
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
  );
};

`;

export default function SampleSearch() {
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  // 샘플 검색 실행 함수
  const handleSearch = (query: string) => {
    setResult(`검색어: ${query}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sample AdminSearchLayout Page</h2>
      <div className="sampleInfo">
        <h3>AdminSearchLayout props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>props</th>
              <th>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>title</td><td>string</td><td>검색 영역의 타이틀</td></tr>
            <tr><td>onSearch</td><td>(query: string) =&gt; void</td><td>검색 실행 시 호출되는 콜백</td></tr>
            <tr><td>placeholder</td><td>string</td><td>검색 input의 placeholder</td></tr>
            <tr><td>defaultValue</td><td>string</td><td>검색 input의 기본값</td></tr>
            <tr><td>buttonLabel</td><td>string</td><td>검색 버튼 라벨</td></tr>
            <tr><td>disabled</td><td>boolean</td><td>검색 input/버튼 비활성화 여부</td></tr>
          </tbody>
        </table>
      </div>

      {/* 샘플 AdminSearchLayout 사용 예시 */}
      <AdminSearchLayout
        title="어드민 검색 샘플"
        onSearch={handleSearch}
      />


      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopy(sampleCode, setCopied)}
          type='button'
          className='copyButton'
        >
          {copied ? "복사됨!" : "코드 복사"}
        </button>
      </div>
    </div>
  );
} 