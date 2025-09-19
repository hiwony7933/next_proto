import React, { useState } from 'react';
import CornerBlock002 from '../../common/components/corner/cornerBlock002';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzInputText from '../../common/components/form/mzInputText';
import MzTextArea from '../../common/components/form/mzTextArea';

const blockDataRaw = {
  title: '단일 블록 컴포넌트',
  desc: '하나의 아이템만 표시하는 블록',
  imageList: [
    {
      title: 'ADT캡스 AI CCTV만의 특별함을 경험해보세요',
      desc: '더 쉽고 정확하고 안전하게 보안 전문가가 제공하는 AI CCTV',
      mainYn: 'N',
      dispSeq: '1',
      imgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612083045308_aURKA6.webp',
      imgSbstTxt: '메인이미지',
      subImgTitle: '서브 이미지',
      subImgUrl:
        'https://mz-bo.duckdns.org/contents/display/image/10002/20250612083045312_7L8Btw_2.webp',
      subImgSbstTxt: '서브 이미지',
    },
  ],
};

const sampleCode = `import CornerBlock002 from '@/components/corner/cornerBlock002';

const data = {
  title: '단일 블록 컴포넌트',
  desc: '하나의 아이템만 표시하는 블록',
  imageList: [
    {
      title: '반응형 이미지 블록',
      desc: '모바일과 데스크톱에서 다른 이미지를 표시합니다',
      imgUrl: 'https://via.placeholder.com/800x400',
      subImgUrl: 'https://via.placeholder.com/400x300'
    }
  ]
};

<CornerBlock002 data={data} />
`;

export default function SampleCornerBlock002() {
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
      <h2>Sample CornerBlock002 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerBlock002 data={blockData} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerBlock002 from '@/components/corner/cornerBlock002';

const data = {
  title: '단일 블록 컴포넌트',
  desc: '하나의 아이템만 표시하는 블록',
  imageList: [
    {
      title: '반응형 이미지 블록',
      desc: '모바일과 데스크톱에서 다른 이미지를 표시합니다',
      imgUrl: 'https://via.placeholder.com/800x400',
      subImgUrl: 'https://via.placeholder.com/400x300'
    }
  ]
};

<CornerBlock002 data={data} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerBlock002 props 설명</h3>
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
              <td>블록 섹션 제목 (사용하지 않음)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.desc</td>
              <td>string</td>
              <td>블록 섹션 설명 (사용하지 않음)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0]</td>
              <td>{`{ title: string; desc: string; imgUrl: string; subImgUrl: string; }`}</td>
              <td>표시할 블록 아이템 (첫 번째만 사용)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].title</td>
              <td>string</td>
              <td>블록 제목</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].desc</td>
              <td>string</td>
              <td>블록 설명</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].imgUrl</td>
              <td>string</td>
              <td>데스크톱용 이미지 URL</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.imageList[0].subImgUrl</td>
              <td>string</td>
              <td>모바일용 이미지 URL (767px 이하)</td>
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
                value={editBlockData.imageList[0]?.title || ''}
                onChange={(e) =>
                  setEditBlockData((prev) => ({
                    ...prev,
                    imageList: [{ ...prev.imageList[0], title: e.target.value }],
                  }))
                }
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
                value={editBlockData.imageList[0]?.desc || ''}
                onChange={(e) =>
                  setEditBlockData((prev) => ({
                    ...prev,
                    imageList: [
                      { ...prev.imageList[0], desc: typeof e === 'string' ? e : e.target.value },
                    ],
                  }))
                }
                placeholder="블록 설명을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="imgUrl">데스크톱 이미지 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="imgUrl"
                value={editBlockData.imageList[0]?.imgUrl || ''}
                onChange={(e) =>
                  setEditBlockData((prev) => ({
                    ...prev,
                    imageList: [{ ...prev.imageList[0], imgUrl: e.target.value }],
                  }))
                }
                placeholder="데스크톱용 이미지 URL을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="subImgUrl">모바일 이미지 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="subImgUrl"
                value={editBlockData.imageList[0]?.subImgUrl || ''}
                onChange={(e) =>
                  setEditBlockData((prev) => ({
                    ...prev,
                    imageList: [{ ...prev.imageList[0], subImgUrl: e.target.value }],
                  }))
                }
                placeholder="모바일용 이미지 URL을 입력하세요"
              />
            </dd>
          </dl>
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
