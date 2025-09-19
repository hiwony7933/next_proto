import React from 'react';
import MzTabs from '../../common/components/ui/mzTabs';
import '../assets/sample.scss';

const tabData = [
  { label: '탭1', content: <div>탭1 내용</div> },
  { label: '탭2', content: <div>탭2 내용</div> },
];

export default function SampleMzTabs() {
  return (
    <div className="sample">
      <h2>Sample MzTabs (탭) Page</h2>
      <div className="sampleInfo">
        <h3>MzTabs props 설명</h3>
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
              <td>tabs</td>
              <td>{'{ label: string; content: ReactNode; }[]'}</td>
              <td>탭 목록</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>샘플</h3>
        <MzTabs tabs={tabData} />
      </div>
    </div>
  );
}
