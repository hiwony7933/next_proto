import React from "react";
import MzTabs from "../../common/components/ui/mzTabs";
import "../assets/sample.scss";

const tabData = [
  { label: "탭1", content: <div>탭1 내용</div> },
  { label: "탭2", content: <div>탭2 내용</div> },
  { label: "탭3", content: <div>탭3 내용</div> },
  { label: "탭4", content: <div>탭4 내용</div> },
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
              <td>{"{ label: string; content: ReactNode; }[]"}</td>
              <td>탭 목록</td>
            </tr>
            <tr>
              <td>tabSize</td>
              <td>boolean</td>
              <td>true: 전체폭(기본), false: 버튼 내용만큼</td>
            </tr>
            <tr>
              <td>solid</td>
              <td>boolean</td>
              <td>true: 솔리드(배경/활성 강조), false: 보더(기본)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>샘플: 기본(전체폭)</h3>
        <MzTabs tabs={tabData} />
      </div>
      <div className="sampleInfo">
        <h3>샘플: 콘텐츠폭(tabSize=false)</h3>
        <MzTabs tabs={tabData} tabSize={false} />
      </div>
      <div className="sampleInfo">
        <h3>샘플: 솔리드 스타일(solid=true)</h3>
        <MzTabs tabs={tabData} solid />
      </div>
      <div className="sampleInfo">
        <h3>샘플: 솔리드 + 콘텐츠폭</h3>
        <MzTabs tabs={tabData} tabSize={false} solid />
      </div>
    </div>
  );
}
