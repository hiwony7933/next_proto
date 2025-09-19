import React from 'react';
import MzTooltip from '../../common/components/ui/mzTooltip';
import '../assets/sample.scss';

export default function SampleMzTooltip() {
  return (
    <div className="sample">
      <h2>Sample MzTooltip (툴팁) Page</h2>
      <div className="sampleInfo">
        <h3>MzTooltip props 설명</h3>
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
              <td>text</td>
              <td>string</td>
              <td>툴팁에 표시할 텍스트</td>
            </tr>
            <tr>
              <td>children</td>
              <td>ReactNode</td>
              <td>툴팁을 감쌀 요소</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>샘플</h3>
        <MzTooltip text="툴팁 내용입니다.">
          <button type="button">툴팁 버튼</button>
        </MzTooltip>
      </div>
    </div>
  );
}
