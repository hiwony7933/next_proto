// SampleMzAddress.tsx
import React, { useState } from 'react';
import MzAddress from '../../common/components/form/mzAddress';
import '../assets/sample.scss';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const addressUsageCode = `import React, { useState } from 'react';
import MzAddress from '../../components/common/form/mzAddress';

export default function Example() {
  const [address, setAddress] = useState('');

  return (
    <div>
      <MzAddress value={address} onChange={setAddress} />
      <div>입력된 주소: {address}</div>
    </div>
  );
}`;

export default function SampleMzAddress() {
  const [address, setAddress] = useState('');

  return (
    <div className="sample">
      <h2>🏠 MzAddress (주소 입력 컴포넌트) 가이드</h2>

      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Daum 우편번호 검색 API 연동 (react-daum-postcode)</strong>: 모달을 통해 검색 후
            자동 입력
          </li>
          <li>
            <strong>컴포넌트 내부 상태 관리</strong>: 우편번호, 기본주소, 상세주소 별도 관리
          </li>
          <li>
            <strong>벨리데이션 책임 분리:</strong>
            MzAddress는 UI와 내부 상태(우편번호, 기본주소, 상세주소)만을 관리하며,
            <strong>
              유효성 검사(Validation)는 Formik, React Hook Form 등의 상위 폼 흐름 또는 비즈니스
              로직에서 처리
            </strong>
            하는 것이 자연스러운 설계입니다.
          </li>
          <li>
            <strong>전체 주소 문자열 반환</strong>: <code>onChange</code>로 통합된 주소 전달
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
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>value</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>✅</td>
              <td>현재 전체 주소 값 (우편번호 + 주소 + 상세주소)</td>
            </tr>
            <tr>
              <td>
                <code>onChange</code>
              </td>
              <td>
                <code>(value: string) =&gt; void</code>
              </td>
              <td>✅</td>
              <td>주소 정보 변경 시 호출되는 콜백</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>🎮 샘플</h3>
        <MzAddress value={address} onChange={setAddress} />
        <div style={{ marginTop: 10 }}>
          <strong>입력된 주소:</strong> <span>{address || '-'}</span>
        </div>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">💡 기본 사용 예</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {addressUsageCode}
        </SyntaxHighlighter>
      </div>

      <div className="sampleInfo">
        <h3>🔍 Daum 우편번호 검색 모달</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Postcode 컴포넌트</strong>: <code>react-daum-postcode</code> 라이브러리 사용
          </li>
          <li>
            <strong>모달 제어</strong>: <code>MzModal</code>을 활용한 바텀 시트 형태
          </li>
          <li>
            <strong>사용자 선택 완료</strong> 시 <code>zonecode</code>와 <code>address</code>를 자동
            입력
          </li>
        </ul>
        <p style={{ fontSize: 12, color: '#666' }}>
          💡 상세 주소는 사용자가 수기로 입력하며, 모든 값은 onChange를 통해 통합된 문자열로
          전달됩니다.
        </p>
      </div>
    </div>
  );
}
