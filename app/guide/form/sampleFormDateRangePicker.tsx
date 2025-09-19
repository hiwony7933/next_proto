import React, { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import { MzDateRangePicker } from '../../common/components/form/mzDateRangePicker';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const basicUsageCode = `import { MzDateRangePicker } from '../../components/common/form/mzDateRangePicker';

// 간단한 사용법 - 더 이상 복잡한 변환 로직 불필요!
const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);

<MzDateRangePicker
  value={dateRange}
  onChange={setDateRange}
  showQuickButtons={true}
  noticeText="조회기간을 선택하세요"
/>`;

const validationCode = `// 유효성 검사와 에러 처리
const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
const [validationMessage, setValidationMessage] = useState("");

const handleValidationError = (error: string) => {
  setValidationMessage(error);
  // 또는 alert로 즉시 표시
  // alert(error);
};

<MzDateRangePicker
  value={dateRange}
  onChange={setDateRange}
  showQuickButtons={true}
  onValidationError={handleValidationError}
  autoValidate={true}
/>

{validationMessage && (
  <div className="error-message" style={{color: 'red'}}>
    {validationMessage}
  </div>
)}`;

const advancedCode = `// 고급 사용법 - 커스텀 설정
const [dateRange, setDateRange] = useState<[string, string]>(["2024.01.01", "2024.12.31"]);

<MzDateRangePicker
  value={dateRange}
  onChange={(newRange) => {
    setDateRange(newRange);
    console.log('선택된 기간:', newRange);
  }}
  showQuickButtons={false}          // 빠른 버튼 숨기기
  autoValidate={false}              // 자동 유효성 검사 끄기
  noticeText="프로젝트 기간을 설정하세요"
  onValidationError={(error) => {
    // 커스텀 에러 처리
    console.error('날짜 에러:', error);
  }}
/>`;

export default function SampleDateRangePicker() {
  // Case 1: 기본 사용법 (간소화됨)
  const [basicRange, setBasicRange] = useState<[string, string]>(['', '']);

  // Case 2: 유효성 검사 포함
  const [validatedRange, setValidatedRange] = useState<[string, string]>(['', '']);
  const [validationMessage, setValidationMessage] = useState('');

  // Case 3: 빠른 버튼 없는 케이스
  const [simpleRange, setSimpleRange] = useState<[string, string]>(['', '']);

  // Case 4: 초기값이 있는 케이스
  const [presetRange, setPresetRange] = useState<[string, string]>(['2024.01.01', '2024.12.31']);

  const [copiedStates, setCopiedStates] = useState({
    basic: false,
    validation: false,
    advanced: false,
  });

  const handleValidationError = (error: string) => {
    setValidationMessage(error);
    // 3초 후 메시지 자동 제거
    setTimeout(() => setValidationMessage(''), 3000);
  };

  const handleCopyWithKey = (code: string, key: keyof typeof copiedStates) => {
    handleCopy(code, (copied) => {
      setCopiedStates((prev) => ({ ...prev, [key]: copied }));
    });
  };

  return (
    <div className="sample">
      <h2>🗓️ MzDateRangePicker 컴포넌트 가이드</h2>

      <div className="sampleInfo">
        <h3>✨ 주요 개선사항</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>사용법 간소화</strong>: 복잡한 Date 변환 로직 불필요, string 직접 사용
          </li>
          <li>
            <strong>내장 유효성 검사</strong>: 자동으로 날짜 유효성 및 범위 검사
          </li>
          <li>
            <strong>에러 처리</strong>: onValidationError 콜백으로 에러 처리
          </li>
          <li>
            <strong>자동 포맷팅</strong>: 입력시 자동으로 YYYY.MM.DD 형식 적용
          </li>
          <li>
            <strong>범위 검증</strong>: 시작일이 종료일보다 뒤에 오는 경우 자동 검사
          </li>
        </ul>
      </div>

      <div className="sampleInfo">
        <h3>📋 Props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>Props</th>
              <th>타입</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>value</code>
              </td>
              <td>
                <code>[string, string]</code>
              </td>
              <td>-</td>
              <td>선택된 날짜 범위 (from, to) - "YYYY.MM.DD" 형식</td>
            </tr>
            <tr>
              <td>
                <code>onChange</code>
              </td>
              <td>
                <code>(date: [string, string]) =&gt; void</code>
              </td>
              <td>-</td>
              <td>날짜 변경 시 호출되는 콜백</td>
            </tr>
            <tr>
              <td>
                <code>showQuickButtons</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td>빠른 날짜 선택 버튼(1일, 7일, 30일...) 표시 여부</td>
            </tr>
            <tr>
              <td>
                <code>noticeText</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>-</td>
              <td>하단에 표시할 안내 텍스트</td>
            </tr>
            <tr>
              <td>
                <code>onValidationError</code>
              </td>
              <td>
                <code>(error: string) =&gt; void</code>
              </td>
              <td>-</td>
              <td>유효성 검사 실패시 호출되는 에러 콜백</td>
            </tr>
            <tr>
              <td>
                <code>autoValidate</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td>자동 유효성 검사 활성화 여부</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 기본 사용법 */}
      <div className="sampleInfo">
        <h3>🚀 기본 사용법 (간소화됨)</h3>
        <div style={{ marginBottom: 16 }}>
          <MzDateRangePicker
            value={basicRange}
            onChange={setBasicRange}
            showQuickButtons={true}
            noticeText="조회기간을 선택하세요"
          />
        </div>
        <p>
          <strong>선택된 값:</strong> {basicRange[0] || '시작일 없음'} ~{' '}
          {basicRange[1] || '종료일 없음'}
        </p>

        <div className="codeBlock">
          <SyntaxHighlighter language="javascript" style={atomOneDark}>
            {basicUsageCode}
          </SyntaxHighlighter>
          <button
            onClick={() => handleCopyWithKey(basicUsageCode, 'basic')}
            type="button"
            className="copyButton"
          >
            {copiedStates.basic ? '복사됨!' : '코드 복사'}
          </button>
        </div>
      </div>

      {/* 유효성 검사 포함 */}
      <div className="sampleInfo">
        <h3>✅ 유효성 검사 포함</h3>
        <div style={{ marginBottom: 16 }}>
          <MzDateRangePicker
            value={validatedRange}
            onChange={setValidatedRange}
            showQuickButtons={true}
            onValidationError={handleValidationError}
            autoValidate={true}
            noticeText="잘못된 날짜를 입력해보세요 (예: 2024.13.32)"
          />
          {validationMessage && (
            <div
              style={{
                color: '#e74c3c',
                backgroundColor: '#fdf2f2',
                padding: '8px 12px',
                borderRadius: 4,
                marginTop: 8,
                border: '1px solid #f5c6cb',
              }}
            >
              ⚠️ {validationMessage}
            </div>
          )}
        </div>
        <p>
          <strong>선택된 값:</strong> {validatedRange[0] || '시작일 없음'} ~{' '}
          {validatedRange[1] || '종료일 없음'}
        </p>

        <div className="codeBlock">
          <SyntaxHighlighter language="javascript" style={atomOneDark}>
            {validationCode}
          </SyntaxHighlighter>
          <button
            onClick={() => handleCopyWithKey(validationCode, 'validation')}
            type="button"
            className="copyButton"
          >
            {copiedStates.validation ? '복사됨!' : '코드 복사'}
          </button>
        </div>
      </div>

      {/* 빠른 버튼 없는 케이스 */}
      <div className="sampleInfo">
        <h3>📅 빠른 버튼 없는 심플 모드</h3>
        <div style={{ marginBottom: 16 }}>
          <MzDateRangePicker
            value={simpleRange}
            onChange={setSimpleRange}
            showQuickButtons={false}
            noticeText="달력에서만 선택 가능"
          />
        </div>
        <p>
          <strong>선택된 값:</strong> {simpleRange[0] || '시작일 없음'} ~{' '}
          {simpleRange[1] || '종료일 없음'}
        </p>
      </div>

      {/* 초기값이 있는 케이스 */}
      <div className="sampleInfo">
        <h3>🎯 초기값 설정 케이스</h3>
        <div style={{ marginBottom: 16 }}>
          <MzDateRangePicker
            value={presetRange}
            onChange={setPresetRange}
            showQuickButtons={true}
            noticeText="2024년 전체 기간으로 초기 설정됨"
          />
        </div>
        <p>
          <strong>선택된 값:</strong> {presetRange[0]} ~ {presetRange[1]}
        </p>
      </div>

      {/* 고급 사용법 */}
      <div className="codeBlock">
        <h6 className="codeTitle">🔧 고급 사용법</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {advancedCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopyWithKey(advancedCode, 'advanced')}
          type="button"
          className="copyButton"
        >
          {copiedStates.advanced ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      {/* 마이그레이션 가이드 */}
      <div className="sampleInfo">
        <h3>🔄 기존 코드 마이그레이션 가이드</h3>

        <h4>❌ Before (복잡한 방식)</h4>
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {`// 복잡한 Date 변환 로직 필요
const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
const handleDateChange = (type: 'from' | 'to', newValue: [string, string]) => {
  // 20줄의 복잡한 날짜 처리 로직...
};

<MzDateRangePicker
  value={[
    range[0] ? range[0].toISOString().slice(0, 10).replace(/-/g, ".") : "",
    range[1] ? range[1].toISOString().slice(0, 10).replace(/-/g, ".") : ""
  ]}
  onChange={(newValue) => handleDateChange('from', newValue)}
  showQuickButtons={true}
/>`}
        </SyntaxHighlighter>

        <h4>✅ After (간단한 방식)</h4>
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {`// 간단한 string 상태로 충분
const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);

<MzDateRangePicker
  value={dateRange}
  onChange={setDateRange}
  showQuickButtons={true}
  onValidationError={(error) => console.warn(error)}
  autoValidate={true}
/>`}
        </SyntaxHighlighter>
      </div>

      <div className="sampleInfo">
        <h3>💡 사용 팁</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>간단한 상태 관리</strong>: <code>[string, string]</code> 타입으로 간단하게 관리
          </li>
          <li>
            <strong>자동 포맷팅</strong>: 사용자가 입력하면 자동으로 YYYY.MM.DD 형식 적용
          </li>
          <li>
            <strong>유효성 검사</strong>: autoValidate={`{true}`}로 자동 검증, 필요시
            onValidationError로 커스텀 처리
          </li>
          <li>
            <strong>빠른 날짜 선택</strong>: showQuickButtons로 1일, 7일, 30일 등 빠른 선택 지원
          </li>
          <li>
            <strong>API 연동</strong>: string 형태라서 직접 API에 전송 가능
          </li>
          <li>
            <strong>기존 코드 마이그레이션</strong>: handleDateChange 함수 제거하고 직접 onChange
            사용
          </li>
        </ul>
      </div>
    </div>
  );
}
