import React, { useState } from 'react';
import MzPhoneNumber, { PhoneNumberValue } from '../../common/components/form/mzPhoneNumber';
import '../assets/sample.scss';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const phoneUsageCode = `import React, { useState } from 'react';
import MzPhoneNumber from '../../components/common/form/mzPhoneNumber';

export default function Example() {
  const [phone, setPhone] = useState({ prefix: '', middle: '', last: '' });

  return (
    <div>
      <MzPhoneNumber
        inputSplit="separated"
        type="Mobile"
        value={phone}
        onChange={setPhone}
      />
      <div>입력된 번호: {phone.prefix}-{phone.middle}-{phone.last}</div>
    </div>
  );
}`;

export default function SampleMzPhoneNumber() {
  const [phone, setPhone] = useState<PhoneNumberValue>({ prefix: '', middle: '', last: '' });
  const [combinedPhone, setCombinedPhone] = useState<PhoneNumberValue>({
    prefix: '',
    middle: '',
    last: '',
  });

  return (
    <div className="sample">
      <h2>📞 MzPhoneNumber (전화번호 입력 컴포넌트) 가이드</h2>

      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>구분 입력</strong> 또는 <strong>단일 입력</strong> 지원: <code>inputSplit</code>{' '}
            props로 제어
          </li>
          <li>
            <strong>전화번호 타입 선택 지원</strong>: <code>type</code> = <code>'Phone'</code> |{' '}
            <code>'Mobile'</code>
          </li>
          <li>
            <strong>벨리데이션은 외부 폼(Formik, RHF 등)에서 처리:</strong> 내부에서는 UI와 상태만
            관리
          </li>
          <li>
            <strong>세 부분(prefix, middle, last)으로 구성된 구조적 상태</strong>로 전달
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
                <code>inputSplit</code>
              </td>
              <td>
                <code>'combined' | 'separated'</code>
              </td>
              <td>✅</td>
              <td>전화번호 입력 형식 (하나의 input 또는 세 개 분리)</td>
            </tr>
            <tr>
              <td>
                <code>type</code>
              </td>
              <td>
                <code>'Phone' | 'Mobile'</code>
              </td>
              <td>✅</td>
              <td>전화번호 종류에 따라 앞 번호(prefix) 옵션 변경</td>
            </tr>
            <tr>
              <td>
                <code>value</code>
              </td>
              <td>
                <code>{'{ prefix: string; middle: string; last: string }'}</code>
              </td>
              <td>✅</td>
              <td>전화번호 값 (세 분할)</td>
            </tr>
            <tr>
              <td>
                <code>onChange</code>
              </td>
              <td>
                <code>(value: PhoneNumberValue) =&gt; void</code>
              </td>
              <td>✅</td>
              <td>입력 변경 시 호출되는 콜백</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>🎮 샘플 (구분 입력)</h3>
        <MzPhoneNumber inputSplit="separated" type="Mobile" value={phone} onChange={setPhone} />
        <div style={{ marginTop: 10 }}>
          <strong>입력된 번호:</strong>{' '}
          <span>
            {phone.prefix}-{phone.middle}-{phone.last}
          </span>
        </div>
      </div>

      <div className="sampleInfo">
        <h3>🎮 샘플 (단일 입력)</h3>
        <MzPhoneNumber
          inputSplit="combined"
          type="Mobile"
          value={combinedPhone}
          onChange={setCombinedPhone}
        />
        <div style={{ marginTop: 10 }}>
          <strong>입력된 번호:</strong>{' '}
          <span>
            {combinedPhone.prefix}-{combinedPhone.middle}-{combinedPhone.last}
          </span>
        </div>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">💡 기본 사용 예</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {phoneUsageCode}
        </SyntaxHighlighter>
      </div>

      <div className="sampleInfo">
        <h3>🔐 벨리데이션 가이드</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>combined 입력:</strong> 정규표현식 <code>{`/^01[016789][0-9]{7,8}$/`}</code>{' '}
            또는 자리 수 10~11자 확인
          </li>
          <li>
            <strong>separated 입력:</strong>
            <ul>
              <li>
                prefix: <code>['010', '011', '016', ...]</code> 포함 여부
              </li>
              <li>middle: 3~4자리</li>
              <li>last: 4자리 고정</li>
            </ul>
          </li>
          <li>
            <strong>유효성 검사는 외부 폼(Formik, RHF 등)에서 처리</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
