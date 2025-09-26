import React, { useState } from "react";
import MzInputText from "../../common/components/form/mzInputText";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../assets/sample.scss";

export async function handleCopy(
  text: string,
  setCopied: (v: boolean) => void
) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const sampleCode = `import MzInputText from '../../components/common/form/mzInputText';

// 일반 텍스트 인풋
<MzInputText mzSize="3" placeholder="일반 텍스트" />

// 숫자 천단위 콤마 인풋
<MzInputText mzSize="3" numberFormat placeholder="숫자만 입력" />

// 검색(Search) 전용 사용: onSearch 제공 시 버튼/엔터로 검색 트리거
<MzInputText
  mzSize="3"
  placeholder="검색어"
  value={searchKeyword}
  onChange={(e) => setSearchKeyword(e.target.value)}
  onSearch={(q) => console.log('search:', q)}
/>

// 에러/벨리데이션 전용(검색과 분리): 제출 시점에만 표시
// showError는 제출 후 true로 전환해 노출 시점을 제어합니다.
<MzInputText
  mzSize="3"
  placeholder="필수 입력"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  errorText={errors.keyword}
  showError={submitted}
/>`;

export default function SampleInputBox() {
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [copied, setCopied] = useState(false);
  // validation sample
  const [keyword, setKeyword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errors = {
    keyword: !keyword.trim() ? "검색어를 입력해주세요." : undefined,
  } as const;
  // search sample
  const [searchKeyword, setSearchKeyword] = useState("");
  const [lastSearched, setLastSearched] = useState<string | null>(null);
  const onSearchOnly = (q: string) => {
    setLastSearched(q);
    console.log("search:", q);
  };

  return (
    <div className="sample">
      <h2>Sample mzInputText (MzInputText) Page</h2>
      <div className="sampleInfo">
        <h3>MzInputText props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>props</th>
              <th>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>mzSize</td>
              <td>string</td>
              <td>인풋 크기 (1~5)</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스</td>
            </tr>
            <tr>
              <td>numberFormat</td>
              <td>boolean</td>
              <td>숫자만 입력, 천단위 콤마 자동 (옵션)</td>
            </tr>
            <tr>
              <td>...rest</td>
              <td>InputHTMLAttributes</td>
              <td>기본 input 속성 모두 지원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>일반 텍스트 인풋</h3>

        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>입력값</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  placeholder="일반 텍스트"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </td>
              <td>{text || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>숫자 천단위 콤마 인풋</h3>

        <table>
          <thead>
            <tr className="center">
              <th>달력</th>
              <th>입력값(콤마제거)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  numberFormat
                  placeholder="숫자만 입력"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </td>
              <td>{number || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>검색(Search) 가이드</h3>
        <p>
          <code>onSearch</code>를 제공하면 검색 버튼과 엔터 키로 검색이
          트리거됩니다.
          <br />
          <code>numberFormat</code> 사용 시에도 <code>onSearch</code>에는 콤마가
          제거된 원시값이 전달됩니다.
          <br />
          <em>검증과 분리</em>: 이 예제는 <code>errorText/showError</code>를
          사용하지 않습니다.
        </p>
        <table>
          <thead>
            <tr className="center">
              <th>입력</th>
              <th>최근 검색어</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  placeholder="검색어"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={onSearchOnly}
                />
              </td>
              <td>{lastSearched ?? "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>에러/벨리데이션 가이드 (검색과 분리)</h3>
        <p>
          제출 시점에만 에러를 노출하려면 <code>errorText</code>와{" "}
          <code>showError</code>를 함께 사용하세요. 이 예제는{" "}
          <em>검색을 포함하지 않습니다</em>. 제출 버튼 클릭 후에만 에러가
          노출됩니다.
        </p>
        <table>
          <thead>
            <tr className="center">
              <th>입력</th>
              <th>제출</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <td>
                <MzInputText
                  mzSize="3"
                  placeholder="필수 입력"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  errorText={errors.keyword}
                  showError={submitted}
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="copyButton"
                >
                  제출(모의)
                </button>
              </td>
              <td>{submitted ? (errors.keyword ? "에러" : "정상") : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter
          language="javascript"
          style={atomOneDark}
          wrapLongLines
        >
          {sampleCode}
        </SyntaxHighlighter>
        <button
          onClick={() => handleCopy(sampleCode, setCopied)}
          type="button"
          className="copyButton"
        >
          {copied ? "복사됨!" : "코드 복사"}
        </button>
      </div>
    </div>
  );
}
