import React from 'react';
import MzFaq from '../../common/components/ui/mzFaq';
import '../assets/sample.scss';

const faqItems = [
  { question: 'Q. 첫 번째 질문?', answer: 'A. 첫 번째 답변입니다.' },
  { question: 'Q. 두 번째 질문?', answer: 'A. 두 번째 답변입니다.' },
];

export default function SampleMzFaq() {
  return (
    <div className="sample">
      <h2>Sample MzFaq (FAQ) Page</h2>
      <div className="sampleInfo">
        <h3>MzFaq props 설명</h3>
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
              <td>items</td>
              <td>{'{ question: string; answer: string; }[]'}</td>
              <td>FAQ 목록</td>
            </tr>
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
        <MzFaq items={faqItems} />
      </div>
    </div>
  );
}
