import React, { useState } from 'react';
import MzButton from '../../common/components/ui/mzButton';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

export async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
}

const buttonSampleCode = `import MzButton from '../../components/common/ui/mzButton';//import 공통버튼 컴포넌트

<MzButton>기본 버튼</MzButton>
<MzButton type="submit" size="5">Submit</MzButton>
<MzButton type="submit" size="5" fill="red" disabled>Red 버튼</MzButton>
<MzButton type="button" size="1">작은 버튼</MzButton>
<MzButton type="button" size="1" fill="black">Black 버튼</MzButton>
<MzButton type="button" size="4" stroke="black">Danger 테두리</MzButton>
<MzButton type="button" size="4" stroke="red">조합 버튼</MzButton>
// 페이지 이동하는 링크
<MzButton to="/home">Link 버튼</MzButton>
`;

export default function SampleMzButton() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="sample">
      <h2>Sample MzButton Page</h2>
      <div className="sampleInfo">
        <h3>MzButton props 설명</h3>
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
              <td>to</td>
              <td>string</td>
              <td>링크 주소 (있으면 Link, 없으면 button)</td>
            </tr>
            <tr>
              <td>type</td>
              <td>"submit" | "reset" | "button"</td>
              <td>버튼 타입</td>
            </tr>
            <tr>
              <td>size</td>
              <td>string</td>
              <td>버튼 크기 (ex: "1", "2", "3")</td>
            </tr>
            <tr>
              <td>fill</td>
              <td>string</td>
              <td>배경색 (ex: "black", "red")</td>
            </tr>
            <tr>
              <td>stroke</td>
              <td>string</td>
              <td>테두리 스타일 (ex: "black", "red")</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>추가 클래스</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <table>
          <thead>
            <tr className="center">
              <th>버튼 크기</th>
              <th>버튼 기본(테두리)</th>
              <th>버튼 색상</th>
              <th>링크 기본(테두리) </th>
              <th>링크 색상</th>
            </tr>
          </thead>
          <tbody>
            <tr className="center">
              <th>1</th>
              <td>
                <MzButton size="1">기본 버튼</MzButton>{' '}
                <MzButton size="1" stroke="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="1" fill="black">
                  기본 버튼
                </MzButton>{' '}
                <MzButton size="1" fill="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="1" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="1" to="/home">
                  Link 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="1" fill="black" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="1" fill="red" to="/home">
                  Link 버튼
                </MzButton>
              </td>
            </tr>
            <tr className="center">
              <th>2</th>
              <td>
                <MzButton size="2">기본 버튼</MzButton>{' '}
                <MzButton size="2" stroke="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="2" fill="black">
                  기본 버튼
                </MzButton>{' '}
                <MzButton size="2" fill="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="2" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="2" to="/home">
                  Link 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="2" fill="black" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="2" fill="red" to="/home">
                  Link 버튼
                </MzButton>
              </td>
            </tr>
            <tr className="center">
              <th>기본 크기 버튼 size="3</th>
              <td>
                <MzButton>기본 버튼</MzButton> <MzButton stroke="red">기본 버튼</MzButton>
              </td>
              <td>
                <MzButton fill="black">기본 버튼</MzButton>{' '}
                <MzButton fill="red">기본 버튼</MzButton>
              </td>
              <td>
                <MzButton to="/home">Link 버튼</MzButton> <MzButton to="/home">Link 버튼</MzButton>
              </td>
              <td>
                <MzButton fill="black" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton fill="red" to="/home">
                  Link 버튼
                </MzButton>
              </td>
            </tr>
            <tr className="center">
              <th>4</th>
              <td>
                <MzButton size="4">기본 버튼</MzButton>{' '}
                <MzButton size="4" stroke="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="4" fill="black">
                  기본 버튼
                </MzButton>{' '}
                <MzButton size="4" fill="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="4" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="4" to="/home">
                  Link 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="4" fill="black" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="4" fill="red" to="/home">
                  Link 버튼
                </MzButton>
              </td>
            </tr>
            <tr className="center">
              <th>5</th>
              <td>
                <MzButton size="5">기본 버튼</MzButton>{' '}
                <MzButton size="5" stroke="red">
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="5" fill="black" disabled>
                  기본 버튼
                </MzButton>{' '}
                <MzButton size="5" fill="red" disabled>
                  기본 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="5" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="5" to="/home">
                  Link 버튼
                </MzButton>
              </td>
              <td>
                <MzButton size="5" fill="black" to="/home">
                  Link 버튼
                </MzButton>{' '}
                <MzButton size="5" fill="red" to="/home">
                  Link 버튼
                </MzButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {buttonSampleCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
