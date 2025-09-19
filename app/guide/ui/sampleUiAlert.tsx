import MzAlert from '../../common/components/ui/mzAlert';
import { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

// 파일 상단에 선언
export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

export default function SampleMzAlert() {
  const [show, setShow] = useState(false);

  return (
    <div className="sample">
      <h2>Sample MzAlert Page</h2>
      <div className="sampleInfo">
        <h3>일반 시스템 alert과 MzAlert의 차이점과 공통점</h3>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>window.alert()</th>
              <th>MzAlert의 (MzAlert.alert())</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>사용방식</td>
              <td>window.alert("message")</td>
              <td>MzAlert.alert("message")</td>
            </tr>
            <tr>
              <td>스타일 커스터마이징</td>
              <td>X(브라우저 기본 스타일)</td>
              <td>O(MzAlert 공통 스타일 적용)</td>
            </tr>
            <tr>
              <td>메시지 타입</td>
              <td>X(문자열만 표시 가능)</td>
              <td>O(문자열, HTML, 컴포넌트 표시 가능)</td>
            </tr>
            <tr>
              <td>버튼 텍스트 변경</td>
              <td>X(버튼 텍스트 변경 불가)</td>
              <td>O(버튼 텍스트 변경 가능)</td>
            </tr>
            <tr>
              <td>비동기 처리</td>
              <td>X(사용자 입력 후 진행)</td>
              <td>
                O(<em className="red">.then()으로 결과 처리 가능</em>)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => alert('Alert 띄우기')}>Alert 띄우기</button>
        <button onClick={() => MzAlert.alert('Alert 띄우기')}>MzAlert 띄우기</button>
      </div>
      <CopyCodeMzAlertBasic title="1. MzAlert 기본 사용 예제" />
      <CopyableCodeBlock title="2. 함수 내에서 alert 호출 예제" />
    </div>
  );
}

const CopyableCodeBlock = ({ title }: { title?: string }) => {
  const [copied, setCopied] = useState(false);
  const codeView = `
  import MzAlert from '../../components/ui/mzAlert'; //imoprt 공통얼럿 컴포넌트

  const handleClick = () => {
  const [from, to] = range;
  const errorMsg = validateDateRange(from, to);
  if (errorMsg) {
    HwAlert.alert(errorMsg);
    return;
  }
  if (onSearch) {
    onSearch(
      \`from: \${range[0] ? range[0].toISOString().slice(0, 10) : ""}, to: \${range[1] ? range[1].toISOString().slice(0, 10) : ""}\`
    );
  }
};
  `;

  return (
    <div className="codeBlock">
      <h6 className="codeTitle">{title}</h6>
      <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
        {codeView}
      </SyntaxHighlighter>
      <button onClick={() => handleCopy(codeView, setCopied)} type="button" className="copyButton">
        {copied ? '복사됨!' : '코드 복사'}
      </button>
    </div>
  );
};

const CopyCodeMzAlertBasic = ({ title }: { title?: string }) => {
  const [copied, setCopied] = useState(false);
  const codeView = `
  import MzAlert from '../../components/ui/mzAlert'; //imoprt 공통얼럿 컴포넌트

  <button onClick={() => alert("Alert 띄우기")}>Alert 띄우기</button>
  <button onClick={() => MzAlert.alert("Alert 띄우기")}>MzAlert 띄우기</button>
  `;
  return (
    <div className="codeBlock">
      <h6 className="codeTitle">{title}</h6>
      <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
        {codeView}
      </SyntaxHighlighter>
      <button onClick={() => handleCopy(codeView, setCopied)} type="button" className="copyButton">
        {copied ? '복사됨!' : '코드 복사'}
      </button>
    </div>
  );
};
