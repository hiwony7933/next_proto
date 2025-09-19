import React, { useState } from 'react';
import CornerFaq001 from '../../common/components/corner/cornerFaq001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import { faqData } from '@/sample/data/faq';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzSelectBox from '../../common/components/form/mzSelectBox';
import { MzCheckBox } from '../../common/components/form/mzCheckBox';
import MzAdminGrid, { AdminGridColumn } from '../../common/components/ui/mzAdminGrid';

const faqItemsRaw = faqData.map((item, index) => ({
  id: index + 1,
  title: item.question,
  html: item.answer,
}));

const sampleCode = `import CornerFaq001 from '@/components/corner/cornerFaq001';
import { faqData } from '@/sample/data/faq';

const faqItems = faqData.map(item => ({
  title: item.question,
  html: item.answer.replace(/\\n/g, '<br/>'),
}));

<CornerFaq001 items={faqItems} multiOpen={false} />
`;

const columns = [
  {
    name: 'title',
    header: '질문',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
  {
    name: 'html',
    header: '답변',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
];

export default function SampleCornerFaq001() {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [faqItems, setFaqItems] = useState(faqItemsRaw);
  const [editFaqItems, setEditFaqItems] = useState(faqItemsRaw);
  const [wrapClassName, setWrapClassName] = useState<'faqType01' | 'faqType02'>('faqType01');
  const [multiOpen, setMultiOpen] = useState(false);
  const [editWrapClassName, setEditWrapClassName] = useState(wrapClassName);
  const [editMultiOpen, setEditMultiOpen] = useState(multiOpen);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openEditModal = () => {
    setEditFaqItems(faqItems);
    setEditWrapClassName(wrapClassName);
    setEditMultiOpen(multiOpen);
    setModalOpen(true);
  };

  return (
    <div className="sample">
      <h2>Sample CornerFaq001 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerFaq001 items={faqItems} wrapClassName={wrapClassName} multiOpen={multiOpen} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerFaq001 from '@/components/corner/cornerFaq001';
import { faqData } from '@/sample/data/faq';

const faqItems = faqData.map(item => ({
  title: item.question,
  html: item.answer.replace(/\\n/g, '<br/>'),
}));

<CornerFaq001 items={faqItems} multiOpen={false} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerFaq001 props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>props</th>
              <th>타입</th>
              <th>설명</th>
              <th>기본값</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>items</td>
              <td>{`{ title: string; html: string; }[]`}</td>
              <td>FAQ 항목 배열</td>
              <td>-</td>
            </tr>
            <tr>
              <td>wrapClassName</td>
              <td>string</td>
              <td>FAQ 래퍼 클래스명</td>
              <td>'faqType01'</td>
            </tr>
            <tr>
              <td>itemClassName</td>
              <td>string</td>
              <td>FAQ 아이템 클래스명</td>
              <td>styles.faqItem</td>
            </tr>
            <tr>
              <td>questionClassName</td>
              <td>string</td>
              <td>질문 영역 클래스명</td>
              <td>styles.question</td>
            </tr>
            <tr>
              <td>answerClassName</td>
              <td>string</td>
              <td>답변 영역 클래스명</td>
              <td>styles.answer</td>
            </tr>
            <tr>
              <td>multiOpen</td>
              <td>boolean</td>
              <td>여러개 동시 열기 허용 (true: 여러개, false: 하나만)</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 수정 모달 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="FAQ 수정">
        <div className="modalContent">
          <dl className="formGroup">
            <dt>
              <label htmlFor="wrapClassName">디자인 타입</label>
            </dt>
            <dd>
              <MzSelectBox
                type="dropdown"
                className="dropdown"
                options={['faqType01', 'faqType02']}
                selected={editWrapClassName}
                onSelect={(v) => setEditWrapClassName(v as 'faqType01' | 'faqType02')}
                size="2"
                style={{ width: 80 }}
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="multiOpen">다중 열기</label>
            </dt>
            <dd>
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={editMultiOpen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditMultiOpen(e.target.checked)
                }
              >
                다중 열기 (여러 FAQ를 동시에 열 수 있음)
              </MzCheckBox>
            </dd>
          </dl>
          <MzAdminGrid
            columns={columns}
            data={editFaqItems}
            setData={setEditFaqItems}
            perPage={editFaqItems.length}
            gridLeftBtn={['add', 'delete']}
            pageSizeYN={false}
            gridSearchYN={false}
            gridSettingYN={false}
            onCreateRow={() => ({ id: Date.now(), title: '', html: '' })}
            onDeleteRows={(ids: number[]) => {
              setEditFaqItems((prev) => prev.filter((row) => !ids.includes(row.id)));
            }}
          />
          <div className="modalButton">
            <MzButton type="button" onClick={() => setModalOpen(false)}>
              취소
            </MzButton>
            <MzButton
              type="button"
              fill="black"
              onClick={() => {
                setFaqItems(editFaqItems);
                setWrapClassName(editWrapClassName);
                setMultiOpen(editMultiOpen);
                setModalOpen(false);
              }}
            >
              적용
            </MzButton>
          </div>
        </div>
      </MzModal>
    </div>
  );
}
