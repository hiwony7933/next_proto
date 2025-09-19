import React, { useState } from 'react';
import CornerBanner001 from '../../common/components/corner/cornerBanner001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MzModal } from '../../common/components/ui/mzModal';
import '../assets/sample.scss';
import MzSelectBox from '../../common/components/form/mzSelectBox';
import MzInputText from '../../common/components/form/mzInputText';
import MzButton from '../../common/components/ui/mzButton';
import MzImageType from '../../common/components/form/mzImageType';

const sampleCode = `import CornerBanner001 from '@/components/corner/cornerBanner001';

<CornerBanner001
  type="image"
  title="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/67e5ef8d89721e133fa3c7aa_ADT_white_ko-p-500.png"
  subTitle="소중한 내 비즈니스 공간을 지키는 \nAI CCTV, 뷰가드 AI"
  image="https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/66220810abf0d4f83fd7fba2_MainTop%20%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%90%E1%85%A9%E1%84%90%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B8.webp"
/>
`;

export default function SampleCornerBanner001() {
  const [copied, setCopied] = useState(false);
  const [bannerProps, setBannerProps] = useState({
    type: 'image',
    title:
      'https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/67e5ef8d89721e133fa3c7aa_ADT_white_ko-p-500.png',
    subTitle: '소중한 내 비즈니스 공간을 지키는 \nAI CCTV, 뷰가드 AI',
    image:
      'https://cdn.prod.website-files.com/65f40252d97e8a476f9d7ad2/66220810abf0d4f83fd7fba2_MainTop%20%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%90%E1%85%A9%E1%84%90%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%B8.webp',
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
      <h2>Sample CornerBanner001 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={() => setModalOpen(true)}>
            수정
          </MzButton>
        </div>
        <CornerBanner001
          type={displayBannerProps.type as 'image' | 'text'}
          title={displayBannerProps.title}
          subTitle={displayBannerProps.subTitle}
          image={displayBannerProps.image}
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
        <h3>CornerBanner001 props 설명</h3>
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
              <td>type</td>
              <td>'image' | 'text'</td>
              <td>타이틀 타입 (이미지 또는 텍스트)</td>
            </tr>
            <tr>
              <td>title</td>
              <td>string</td>
              <td>타이틀(텍스트 또는 이미지 URL)</td>
            </tr>
            <tr>
              <td>subTitle</td>
              <td>string</td>
              <td>서브타이틀(HTML 허용)</td>
            </tr>
            <tr>
              <td>image</td>
              <td>string</td>
              <td>배경 이미지 URL</td>
            </tr>
          </tbody>
        </table>
      </div>

      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="배너 수정">
        <div className="modalContent">
          <div className="modalForm">
            <dl className="formGroup">
              <dt>
                <label htmlFor="type">타이틀 타입</label>
              </dt>
              <dd>
                <MzSelectBox
                  id="type"
                  type="default"
                  options={['image', 'text']}
                  selected={bannerProps.type}
                  onSelect={(v) => setBannerProps({ ...bannerProps, type: v as 'image' | 'text' })}
                  size="2"
                />
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="title">타이틀</label>
              </dt>
              <dd>
                {bannerProps.type === 'image' ? (
                  <MzImageType
                    value={bannerProps.title}
                    type="URL"
                    onChange={(value) => setBannerProps({ ...bannerProps, title: value })}
                  />
                ) : (
                  <MzInputText
                    id="title"
                    mzSize="2"
                    value={bannerProps.title}
                    onChange={(e) => setBannerProps({ ...bannerProps, title: e.target.value })}
                    placeholder="타이틀(텍스트 또는 이미지 URL)"
                  />
                )}
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="subTitle">서브타이틀</label>
              </dt>
              <dd>
                <textarea
                  id="subTitle"
                  value={bannerProps.subTitle}
                  onChange={(e) => setBannerProps({ ...bannerProps, subTitle: e.target.value })}
                />
              </dd>
            </dl>
            <dl className="formGroup">
              <dt>
                <label htmlFor="image">배경 이미지</label>
              </dt>
              <dd>
                <MzImageType
                  value={bannerProps.image}
                  type="URL"
                  onChange={(value) => setBannerProps({ ...bannerProps, image: value })}
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
