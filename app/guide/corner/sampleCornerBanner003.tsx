import React, { useState } from 'react';
import CornerBanner003 from '../../common/components/corner/cornerBanner003';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzInputText from '../../common/components/form/mzInputText';
import MzTextArea from '../../common/components/form/mzTextArea';
import { MzCheckBox } from '../../common/components/form/mzCheckBox';

const bannerDataRaw = {
  cornerTitle: 'CTA 배너',
  designType: 'type01',
  textList: [
    {
      id: 1,
      title: '지금 무료 견적을 받아보세요!',
      desc: '견적 신청하기',
      linkUrl: 'https://example.com/estimate',
      target: true,
    },
  ],
};

const sampleCode = `import CornerBanner003 from '@/components/corner/cornerBanner003';

const data = {
  cornerTitle: 'CTA 배너',
  designType: 'type01',
  textList: [
    {
      title: '지금 무료 견적을 받아보세요!',
      desc: '견적 신청하기',
      linkUrl: 'https://example.com/estimate',
      target: true
    }
  ]
};

<CornerBanner003 data={data} />
`;

export default function SampleCornerBanner003() {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerData, setBannerData] = useState(bannerDataRaw);
  const [editBannerData, setEditBannerData] = useState(bannerDataRaw);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openEditModal = () => {
    setEditBannerData(bannerData);
    setModalOpen(true);
  };

  return (
    <div className="sample">
      <h2>Sample CornerBanner003 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerBanner003 data={bannerData} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerBanner003 from '@/components/corner/cornerBanner003';

const data = {
  cornerTitle: 'CTA 배너',
  designType: 'type01',
  textList: [
    {
      title: '지금 무료 견적을 받아보세요!',
      desc: '견적 신청하기',
      linkUrl: 'https://example.com/estimate',
      target: true
    }
  ]
};

<CornerBanner003 data={data} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerBanner003 props 설명</h3>
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
              <td>{`{ cornerTitle: string; designType: string; textList: BannerData[]; }`}</td>
              <td>배너 데이터 객체</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.cornerTitle</td>
              <td>string</td>
              <td>코너 제목 (화면에 미표시)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.designType</td>
              <td>string</td>
              <td>디자인 타입 (화면에 미표시)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.textList[0]</td>
              <td>{`{ title: string; desc: string; linkUrl: string; target?: boolean; }`}</td>
              <td>표시할 배너 데이터 (첫 번째만 사용)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.textList[0].title</td>
              <td>string</td>
              <td>배너 제목 텍스트</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.textList[0].desc</td>
              <td>string</td>
              <td>CTA 버튼 텍스트</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.textList[0].linkUrl</td>
              <td>string</td>
              <td>이동할 링크 URL</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.textList[0].target</td>
              <td>boolean</td>
              <td>새 창에서 열기 여부</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 수정 모달 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="배너 수정">
        <div className="modalContent">
          <dl className="formGroup">
            <dt>
              <label htmlFor="cornerTitle">코너 제목</label>
            </dt>
            <dd>
              <MzInputText
                id="cornerTitle"
                value={editBannerData.cornerTitle}
                onChange={(e) =>
                  setEditBannerData((prev) => ({ ...prev, cornerTitle: e.target.value }))
                }
                placeholder="코너 제목을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="designType">디자인 타입</label>
            </dt>
            <dd>
              <MzInputText
                id="designType"
                value={editBannerData.designType}
                onChange={(e) =>
                  setEditBannerData((prev) => ({ ...prev, designType: e.target.value }))
                }
                placeholder="디자인 타입을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="bannerTitle">배너 제목</label>
            </dt>
            <dd>
              <MzTextArea
                id="bannerTitle"
                value={editBannerData.textList[0]?.title || ''}
                onChange={(e) =>
                  setEditBannerData((prev) => ({
                    ...prev,
                    textList: [
                      { ...prev.textList[0], title: typeof e === 'string' ? e : e.target.value },
                    ],
                  }))
                }
                placeholder="배너 제목을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="ctaText">CTA 버튼 텍스트</label>
            </dt>
            <dd>
              <MzInputText
                id="ctaText"
                value={editBannerData.textList[0]?.desc || ''}
                onChange={(e) =>
                  setEditBannerData((prev) => ({
                    ...prev,
                    textList: [{ ...prev.textList[0], desc: e.target.value }],
                  }))
                }
                placeholder="버튼 텍스트를 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="linkUrl">링크 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="linkUrl"
                value={editBannerData.textList[0]?.linkUrl || ''}
                onChange={(e) =>
                  setEditBannerData((prev) => ({
                    ...prev,
                    textList: [{ ...prev.textList[0], linkUrl: e.target.value }],
                  }))
                }
                placeholder="이동할 링크 URL을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="targetBlank">새 창에서 열기</label>
            </dt>
            <dd>
              <MzCheckBox
                type="checkbox"
                id="targetBlank"
                shape="round"
                checked={editBannerData.textList[0]?.target || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditBannerData((prev) => ({
                    ...prev,
                    textList: [{ ...prev.textList[0], target: e.target.checked }],
                  }))
                }
              >
                새 창에서 열기
              </MzCheckBox>
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
                setBannerData(editBannerData);
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
