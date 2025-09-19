import React, { useState } from 'react';
import CornerBlock001 from '../../common/components/corner/cornerBlock001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzInputText from '../../common/components/form/mzInputText';
import MzTextArea from '../../common/components/form/mzTextArea';
import MzAdminGrid, { AdminGridColumn } from '../../common/components/ui/mzAdminGrid';

const blockDataRaw = {
  title: '이럴 때 필요합니다.',

  desc: '다양한 컨텐츠를 확인해보세요',
  imageList: [
    {
      title: '노후된 CCTV를 업그레이드 하고 싶을 때',
      desc: '실시간/녹화 영상 확인은 물론, AI 빠른 검색, 침입/방문 알림, 방문자 분석 등 AI기술이 더해진 CCTV를 편리하게 이용할 수 있습니다.',
      mainYn: 'N',
      dispSeq: '1',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612082159962_JNRM16.webp',
    },
    {
      title: '사건사고 확인을 위한 고화질 영상이 필요할 때',
      desc: '매장 내외 사건사고, 불법주차, 기물파손 등 현장 상황을 500만 화소의 선명한 영상으로 확인할 수 있습니다.',
      mainYn: 'N',
      dispSeq: '2',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612082331870_qjLFJd.webp',
    },
    {
      title: '도난이나 외부인 침입이 걱정될 때',
      desc: '부재 시에도 실시간 매장 확인이 가능하며, 도난 및 외부인 침입에 신속하게 대응할 수 있습니다.',
      mainYn: 'N',
      dispSeq: '3',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612082411750_Y5ghVG.webp',
    },
    {
      title: 'CCTV 자가설치에 어려움을 느낄 때',
      desc: '전문가의 컨설팅은 물론, 사각지대 없는 설치/공사 및 전국 A/S까지, 자가설치형 CCTV와 차별화된 통합 보안 서비스를 제공합니다.',
      mainYn: 'N',
      dispSeq: '4',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612082453759_fza9sc.webp',
    },
    {
      title: '긴급 상황 발생시 도움을 받고 싶을 때',
      desc: '혼자서 감당하기 어려운 각종 긴급 상황에서 24시간 대기 중인 출동대원의 도움을 받을 수 있습니다. (출동경비 서비스 별도 가입 필요)',
      mainYn: 'N',
      dispSeq: '5',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612082555839_rpvXNV.webp',
    },
  ],
};

const sampleCode = `import CornerBlock001 from '@/components/corner/cornerBlock001';

const data = {
  title: '이럴 때 필요합니다.',
  desc: '다양한 컨텐츠를 확인해보세요',
  imageList: [
    { title: '블록1', imgUrl: 'https://via.placeholder.com/350x200', desc: '설명1' },
    { title: '블록2', imgUrl: 'https://via.placeholder.com/350x200/0ff/000', desc: '설명2' },
  ]
};

<CornerBlock001 data={data} />
`;

const columns = [
  {
    name: 'title',
    header: '제목',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
  {
    name: 'imgUrl',
    header: '이미지 URL',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
  {
    name: 'desc',
    header: '설명',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
];

export default function SampleCornerBlock001() {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [blockData, setBlockData] = useState(blockDataRaw);
  const [editBlockData, setEditBlockData] = useState(blockDataRaw);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openEditModal = () => {
    setEditBlockData(blockData);
    setModalOpen(true);
  };

  return (
    <div className="sample">
      <h2>Sample CornerBlock001 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerBlock001 data={blockData} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerBlock001 from '@/components/corner/cornerBlock001';

const data = {
  title: '추천 블록',
  desc: '다양한 컨텐츠를 확인해보세요',
  imageList: [
    { title: '블록1', imgUrl: 'https://via.placeholder.com/350x200', desc: '설명1' },
    { title: '블록2', imgUrl: 'https://via.placeholder.com/350x200/0ff/000', desc: '설명2' },
  ]
};

<CornerBlock001 data={data} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerBlock001 props 설명</h3>
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
              <td>data</td>
              <td>{`{ title: string; desc: string; imageList: BlockItem[]; }`}</td>
              <td>블록 데이터 객체</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.title</td>
              <td>string</td>
              <td>블록 섹션 제목</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.desc</td>
              <td>string</td>
              <td>블록 섹션 설명</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList</td>
              <td>{`{ title: string; imgUrl: string; desc: string; }[]`}</td>
              <td>블록 아이템 배열</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 수정 모달 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="블록 수정">
        <div className="modalContent">
          <dl className="formGroup">
            <dt>
              <label htmlFor="blockTitle">블록 제목</label>
            </dt>
            <dd>
              <MzInputText
                id="blockTitle"
                value={editBlockData.title}
                onChange={(e) => setEditBlockData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="블록 제목을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="blockDesc">블록 설명</label>
            </dt>
            <dd>
              <MzTextArea
                id="blockDesc"
                value={editBlockData.desc}
                onChange={(e) =>
                  setEditBlockData((prev) => ({
                    ...prev,
                    desc: typeof e === 'string' ? e : e.target.value,
                  }))
                }
                placeholder="블록 설명을 입력하세요"
              />
            </dd>
          </dl>
          <h4>블록 아이템</h4>
          <MzAdminGrid
            columns={columns}
            data={editBlockData.imageList}
            setData={(newData: any) =>
              setEditBlockData((prev) => ({ ...prev, imageList: newData as typeof prev.imageList }))
            }
            perPage={editBlockData.imageList.length}
            gridLeftBtn={['add', 'delete']}
            pageSizeYN={false}
            gridSearchYN={false}
            gridSettingYN={false}
            onCreateRow={() => ({ id: Date.now(), title: '', imgUrl: '', desc: '' })}
            onDeleteRows={(ids: number[]) => {
              setEditBlockData((prev) => ({
                ...prev,
                imageList: prev.imageList.filter((row: any) => !ids.includes(row.id)),
              }));
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
                setBlockData(editBlockData);
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
