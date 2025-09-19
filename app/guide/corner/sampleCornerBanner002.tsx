import React, { useState } from 'react';
import CornerBanner002 from '../../common/components/corner/cornerBanner002';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MzModal } from '../../common/components/ui/mzModal';
import '../assets/sample.scss';
import MzInputText from '../../common/components/form/mzInputText';
import MzButton from '../../common/components/ui/mzButton';
import MzImageType from '../../common/components/form/mzImageType';

const sampleCode = `import CornerBanner002 from '@/components/corner/CornerBanner002';

<CornerBanner002
  title="소중한 내 비즈니스 공간을 지키는 AI CCTV, 뷰가드 AI"
  pcImage="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/68341abed5c5be852d0aee44_banner-pc.webp"
  mobileImage="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/68341abe437e810619823450_banner-mo.webp"
  link="https://www.adt.co.kr/ko/index.do"
/>
`;

export default function SampleCornerBanner002() {
  const [copied, setCopied] = useState(false);
  const [bannerProps, setBannerProps] = useState({
    title: '소중한 내 비즈니스 공간을 지키는 AI CCTV, 뷰가드 AI',
    pcImage:
      'https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/68341abed5c5be852d0aee44_banner-pc.webp',
    mobileImage:
      'https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/68341abe437e810619823450_banner-mo.webp',
    link: 'https://www.adt.co.kr/ko/index.do',
  });
  const [displayBannerProps, setDisplayBannerProps] = useState(bannerProps);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="sample">
      <h2>Sample CornerBanner002 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={() => setModalOpen(true)}>
            수정
          </MzButton>
        </div>
        <CornerBanner002
          title={displayBannerProps.title}
          pcImage={displayBannerProps.pcImage}
          mobileImage={displayBannerProps.mobileImage}
          link={displayBannerProps.link}
        />
      </div>
      <div className="codeBlock none">
        <h3>샘플 코드</h3>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCode}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerBanner002 props 설명</h3>
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
              <td>title</td>
              <td>string</td>
              <td>타이틀(텍스트)</td>
            </tr>
            <tr>
              <td>pcImage</td>
              <td>string</td>
              <td>PC용 이미지 URL</td>
            </tr>
            <tr>
              <td>mobileImage</td>
              <td>string</td>
              <td>모바일용 이미지 URL</td>
            </tr>
            <tr>
              <td>link</td>
              <td>string</td>
              <td>이동할 링크</td>
            </tr>
          </tbody>
        </table>
      </div>

      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="배너 수정">
        <div className="modalContent">
          <div className="modalForm">
            <dl className="formGroup">
              <dt>
                <label htmlFor="title">타이틀</label>
              </dt>
              <dd>
                <MzInputText
                  id="title"
                  mzSize="2"
                  value={bannerProps.title}
                  onChange={(e) => setBannerProps({ ...bannerProps, title: e.target.value })}
                  placeholder="타이틀(텍스트)"
                />
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="pcImage">PC 이미지</label>
              </dt>
              <dd>
                <MzImageType
                  value={bannerProps.pcImage}
                  type="URL"
                  onChange={(value) => setBannerProps({ ...bannerProps, pcImage: value })}
                />
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="mobileImage">모바일 이미지</label>
              </dt>
              <dd>
                <MzImageType
                  value={bannerProps.mobileImage}
                  type="URL"
                  onChange={(value) => setBannerProps({ ...bannerProps, mobileImage: value })}
                />
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="link">링크</label>
              </dt>
              <dd>
                <MzInputText
                  id="link"
                  mzSize="2"
                  value={bannerProps.link}
                  onChange={(e) => setBannerProps({ ...bannerProps, link: e.target.value })}
                  placeholder="이동할 링크"
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
                  setDisplayBannerProps(bannerProps);
                  setModalOpen(false);
                }}
              >
                적용
              </MzButton>
              <MzButton type="button" fill="black">
                저장
              </MzButton>
            </div>
          </div>
        </div>
      </MzModal>
    </div>
  );
}
