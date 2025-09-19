import React, { useState } from 'react';
import CornerCheck001 from '../../common/components/corner/cornerCheck001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzInputText from '../../common/components/form/mzInputText';
import MzTextArea from '../../common/components/form/mzTextArea';
import MzAdminGrid, { AdminGridColumn } from '../../common/components/ui/mzAdminGrid';

const checkDataRaw = {
  title: '체크리스트 섹션',
  desc: '배경 이미지와 체크리스트를 표시하는 섹션',
  imageList: [
    {
      title: '이미지 ',
      desc: '배경 이미지',
      mainYn: 'Y',
      dispSeq: '1',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250617032827155_KgR2Rm.webp',
      imgSbstTxt: '이미지 ',
      subImgTitle: '이미지 ',
      subImgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250617033244235_GszXlw_2.webp',
      subImgSbstTxt: '이미지 ',
    },
  ],
  htmlList: [
    {
      title: 'AI 영상 모니터링 및 분석',
      dispSeq: '1',
      html: '<p>24시간 주야간, 사업장 내외 상관없이 언제 어디서나 AI CCTV 로 500만 화소의 고화질 영상을 확인할 수 있습니다. 유동인구나 적재물이 많은 곳, 화면 확대가 필요한 넓은 공간에서 식별력이 뛰어난 영상 확보할 수 있습니다. AI기술로 방문자 수, 성별, 이동 동선 등 고객 분석 데이터를 빠르고 정확하게 제공합니다. 데이터 활용 시 수익창출에 도움이 됩니다. (부가서비스)</p>',
    },
    {
      title: 'AI 이상신호 감지',
      dispSeq: '2',
      html: '<p>금고, 카운터, 창고, 직원전용구역 등 고객이 설정한 구역에서 발생하는 무단침입, 추락, 쓰러짐 등 다양한 움직임을 감지합니다. 실시간 App알림으로 범죄나 사고에 빠르게 대응할 수 있습니다. (부가서비스)</p>',
    },
    {
      title: '24시간 긴급출동 및 유관기관 지원요청',
      dispSeq: '3',
      html: '<p>문 열림, 정전 등 이상 신호 발생 시 최단거리 대원이 24시간 신속하게 출동합니다. 화재, 침입, 도난 등 비상 상황 발생 시 유관기관(경찰서, 소방서)과 협력하여 더 큰 사고를 방지합니다.\\n*출동경비 서비스 별도 가입 필요</p>',
    },
    {
      title: 'AI 빠른 검색',
      dispSeq: '4',
      html: '<p>수시로 발생하는 도난, 분실, 쓰레기 무단 투기, 불법주차 등 녹화된 영상을 다시 찾아봐야 할 때 검색을 통해 빠르게 찾을 수 있습니다. 사람의 성별, 옷 색상은 물론 차량 색상까지 원하는 옵션을 설정해 검색이 가능합니다.</p>',
    },
    {
      title: 'A/S 및 보상 서비스',
      dispSeq: '5',
      html: '<p>갑작스런 기기 장애 발생과 정기점검 서비스는 전국 100여개의 ADT캡스 지사를 통해 신속한 A/S를 받을 수 있습니다. 예기치 못한 도난, 화재, 정전 사고는 물론 랜섬웨어 감염 시 발생한 손해에 대해 보상받을 수 있습니다. (부가서비스)</p>',
    },
  ],
};

const sampleCode = `import CornerCheck001 from '@/components/corner/cornerCheck001';

const data = {
  title: '체크리스트 섹션',
  desc: '배경 이미지와 체크리스트를 표시하는 섹션',
  imageList: [
    {
      title: '배경 이미지',
      imgUrl: 'https://via.placeholder.com/1200x600',
      subImgUrl: 'https://via.placeholder.com/400x300',
      desc: '섹션 배경 이미지'
    }
  ],
  htmlList: [
    { title: '첫 번째 체크 항목', html: '이것은 첫 번째 체크 항목의 설명입니다.<br/>HTML 태그를 지원합니다.' },
    { title: '두 번째 체크 항목', html: '이것은 두 번째 체크 항목의 설명입니다.<br/>줄바꿈도 가능합니다.' }
  ]
};

<CornerCheck001 data={data} />
`;

const htmlColumns = [
  {
    name: 'title',
    header: '체크 항목 제목',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
  {
    name: 'html',
    header: 'HTML 내용',
    editor: { type: 'text' },
    align: 'left' as const,
    validation: { required: true },
  },
];

export default function SampleCornerCheck001() {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkData, setCheckData] = useState(checkDataRaw);
  const [editCheckData, setEditCheckData] = useState(checkDataRaw);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openEditModal = () => {
    setEditCheckData(checkData);
    setModalOpen(true);
  };

  return (
    <div className="sample">
      <h2>Sample CornerCheck001 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerCheck001 data={checkData} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerCheck001 from '@/components/corner/cornerCheck001';

const data = {
  title: '체크리스트 섹션',
  desc: '배경 이미지와 체크리스트를 표시하는 섹션',
  imageList: [
    {
      title: '배경 이미지',
      imgUrl: 'https://via.placeholder.com/1200x600',
      subImgUrl: 'https://via.placeholder.com/400x300',
      desc: '섹션 배경 이미지'
    }
  ],
  htmlList: [
    { title: '첫 번째 체크 항목', html: '이것은 첫 번째 체크 항목의 설명입니다.<br/>HTML 태그를 지원합니다.' },
    { title: '두 번째 체크 항목', html: '이것은 두 번째 체크 항목의 설명입니다.<br/>줄바꿈도 가능합니다.' }
  ]
};

<CornerCheck001 data={data} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerCheck001 props 설명</h3>
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
              <td>{`{ title: string; desc: string; imageList: BlockItem[]; htmlList: CornerCheckItem[]; }`}</td>
              <td>체크리스트 데이터 객체</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.title</td>
              <td>string</td>
              <td>섹션 제목 (데이터만 전달, 화면에 미표시)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.desc</td>
              <td>string</td>
              <td>섹션 설명 (데이터만 전달, 화면에 미표시)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0]</td>
              <td>{`{ title: string; imgUrl: string; subImgUrl: string; desc: string; }`}</td>
              <td>배경 이미지 정보 (첫 번째만 사용)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].imgUrl</td>
              <td>string</td>
              <td>배경 이미지 URL (데스크톱)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].subImgUrl</td>
              <td>string</td>
              <td>모바일용 이미지 URL</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.htmlList</td>
              <td>{`{ title: string; html: string; }[]`}</td>
              <td>체크리스트 항목 배열</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.htmlList[].title</td>
              <td>string</td>
              <td>체크 항목 제목</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.htmlList[].html</td>
              <td>string</td>
              <td>체크 항목 HTML 내용 (\\n은 &lt;br/&gt;로 변환)</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 수정 모달 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="체크리스트 수정">
        <div className="modalContent">
          <dl className="formGroup">
            <dt>
              <label htmlFor="sectionTitle">섹션 제목</label>
            </dt>
            <dd>
              <MzInputText
                id="sectionTitle"
                value={editCheckData.title}
                onChange={(e) => setEditCheckData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="섹션 제목을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="sectionDesc">섹션 설명</label>
            </dt>
            <dd>
              <MzTextArea
                id="sectionDesc"
                value={editCheckData.desc}
                onChange={(e) =>
                  setEditCheckData((prev) => ({
                    ...prev,
                    desc: typeof e === 'string' ? e : e.target.value,
                  }))
                }
                placeholder="섹션 설명을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="bgImgUrl">배경 이미지 URL (데스크톱)</label>
            </dt>
            <dd>
              <MzInputText
                id="bgImgUrl"
                value={editCheckData.imageList[0]?.imgUrl || ''}
                onChange={(e) =>
                  setEditCheckData((prev) => ({
                    ...prev,
                    imageList: [{ ...prev.imageList[0], imgUrl: e.target.value }],
                  }))
                }
                placeholder="배경 이미지 URL을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="mobImgUrl">모바일 이미지 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="mobImgUrl"
                value={editCheckData.imageList[0]?.subImgUrl || ''}
                onChange={(e) =>
                  setEditCheckData((prev) => ({
                    ...prev,
                    imageList: [{ ...prev.imageList[0], subImgUrl: e.target.value }],
                  }))
                }
                placeholder="모바일용 이미지 URL을 입력하세요"
              />
            </dd>
          </dl>
          <h4>체크리스트 항목</h4>
          <MzAdminGrid
            columns={htmlColumns}
            data={editCheckData.htmlList}
            setData={(newData: any) =>
              setEditCheckData((prev) => ({ ...prev, htmlList: newData as typeof prev.htmlList }))
            }
            perPage={editCheckData.htmlList.length}
            gridLeftBtn={['add', 'delete']}
            pageSizeYN={false}
            gridSearchYN={false}
            gridSettingYN={false}
            onCreateRow={() => ({ id: Date.now(), title: '', html: '' })}
            onDeleteRows={(ids: number[]) => {
              setEditCheckData((prev) => ({
                ...prev,
                htmlList: prev.htmlList.filter((row: any) => !ids.includes(row.id)),
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
                setCheckData(editCheckData);
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
