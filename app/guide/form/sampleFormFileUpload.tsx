import React from 'react';
import MzFileUpload from '../../common/components/form/mzFileUpload';
import '../assets/sample.scss';

export default function SampleFileUpload() {
  return (
    <div className="sample">
      <h2>Sample MzFileUpload (파일 업로드) Page</h2>
      <div className="sample">
        <h3>MzFileUpload props 설명</h3>
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
              <td>-</td>
              <td>-</td>
              <td>기본 파일 업로드 input, 미리보기 제공</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>샘플</h3>
        <MzFileUpload />
      </div>
    </div>
  );
}
