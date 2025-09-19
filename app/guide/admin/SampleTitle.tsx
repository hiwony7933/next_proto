import React, { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import AdminTitle from '../../admin/components/common/adminTitle';
import MzButton from '@/components/ui/mzButton';
import '../assets/sample.scss';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const sampleCode = `import AdminTitle from '../../admin/components/common/adminTitle';//import AdminTitle
// 열기/닫기 버튼 표시 여부
const [isFormShowHide, setIsFormShowHide] = useState(false);
const isFormeClasse = isFormShowHide ? ' mzFormShowHide' : '';


{/** 타이틀 기본 */}
<AdminTitle title="타이틀" />

{/** 열기/닫기 있을 때 - 상태값 선언 필요 */}
<AdminTitle title="숨김 예시" showHide={true} setIsFormShowHide={setIsFormShowHide} isFormShowHide={isFormShowHide} />

{/** 페이지 내에 직접 입력할 경우 html 태그 사용 */}
// 열기/닫기 버튼 클릭 핸들러
const handleUnderlineClick = () => {
  if (setIsFormShowHide) setIsFormShowHide(prev => !prev); // 토글
};
<div className="layoutTitle">
  <h2 className="title">{title}</h2>
  {/** 열기/닫기 */}
  <div className="showHide">
    <MzButton
        className="mzUnderline"
        size="5"
        onClick={handleUnderlineClick}
      >
        {isFormShowHide ? '열기' : '닫기'}
      </MzButton>
  </div>

  {/** 우측에 버튼 등 추가 가능 */}
  <div className="right">
    {right}
  </div>
  {/** //우측에 버튼 등 추가 가능 */}
</div>
`;

export default function SampleTitle() {
  const [copied, setCopied] = useState(false);
  const [isFormShowHide, setIsFormShowHide] = useState(false);// 열기/닫기 버튼 표시 여부
  const isFormeClasse = isFormShowHide ? ' mzFormShowHide' : '';
  const ActionButtons = (
    <>
      <MzButton size="2" fill="black" onClick={() => alert('추가')}>신규회원등록</MzButton>
    </>
  );

  return (
    <div className="sample">
      <h2>Sample AdminTitle Page</h2>
      <div className="sampleInfo">
        <h3>AdminTitle props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>props</th>
              <th>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>title</td><td>string</td><td>타이틀 텍스트</td></tr>
            <tr><td>right</td><td>ReactNode</td><td>우측에 표시할 요소(버튼, 여러 컴포넌트 등). <br />부모에서 만든 버튼/액션 컴포넌트를 그대로 전달할 수 있습니다.</td></tr>
            <tr><td>className</td><td>string</td><td>추가 클래스</td></tr>
            <tr><td>showHide</td><td>boolean</td><td>true일 때만 타이틀 오른쪽에 '열기/닫기' 버튼 표시</td></tr>
          </tbody>
        </table>
      </div>


      <div className="sampleInfo">
        <table>
          <thead>
            <tr className="center">
              <th style={{ width: '20%' }}>기능</th>
              <th style={{ width: '80%' }}>샘플</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>타이틀</th>
              <td>
                <AdminTitle title="회원 관리" />
              </td>
            </tr>
            <tr >
              <th>타이틀 + 우측 버튼</th>
              <td><AdminTitle title="게시판 관리" right={ActionButtons} /></td>
            </tr>
            <tr >
              <th>타이틀 숨김(showHide=true)</th>
              <td><AdminTitle title="숨김 예시" showHide={true} setIsFormShowHide={setIsFormShowHide} isFormShowHide={isFormShowHide} /></td>
            </tr>
          </tbody>

        </table>
      </div>

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