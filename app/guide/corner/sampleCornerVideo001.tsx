import React, { useState } from 'react';
import CornerVideo001 from '../../common/components/corner/cornerVideo001';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';
import MzButton from '../../common/components/ui/mzButton';
import { MzModal } from '../../common/components/ui/mzModal';
import MzInputText from '../../common/components/form/mzInputText';
import MzTextArea from '../../common/components/form/mzTextArea';

const videoDataRaw = {
  title: '활용 Tip',
  desc: '스마트하고 간편한 AI CCTV 100% 활용 팁!',
  dispSeq: '1',
  fileConts: {
    videoList: [
      {
        videoTitle: '스마트하고 간편한 AI CCTV 100% 활용 팁!',
        videoUrl:
          'https://mz-bo.duckdns.org/contents/display/video/10002/20250613001550465_rcxruW.webm',
        mainYn: 'N',
        dispSeq: '1',
        subImgTitle: '기본 이미지',
        subImgUrl:
          'https://mz-bo.duckdns.org/contents/display/video/10002/20250613001550451_x4KpUr.webp',
      },
    ],
  },
};

const sampleCode = `import CornerVideo001 from '@/components/corner/cornerVideo001';

const data = {
  title: '비디오 섹션',
  desc: '동영상을 재생할 수 있는 섹션입니다',
  fileConts: {
    videoList: [
      {
        videoTitle: 'AI CCTV 소개 영상',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        subImgUrl: 'https://via.placeholder.com/800x450'
      }
    ]
  }
};

<CornerVideo001 data={data} />
`;

export default function SampleCornerVideo001() {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoData, setVideoData] = useState(videoDataRaw);
  const [editVideoData, setEditVideoData] = useState(videoDataRaw);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openEditModal = () => {
    setEditVideoData(videoData);
    setModalOpen(true);
  };

  return (
    <div className="sample">
      <h2>Sample CornerVideo001 Page</h2>
      <div className="sampleInfo">
        <div className="cornerEditButton">
          <MzButton fill="red" type="button" onClick={openEditModal}>
            수정
          </MzButton>
        </div>
        <CornerVideo001 data={videoData} />
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {`import CornerVideo001 from '@/components/corner/cornerVideo001';

const data = {
  title: '비디오 섹션',
  desc: '동영상을 재생할 수 있는 섹션입니다',
  fileConts: {
    videoList: [
      {
        videoTitle: 'AI CCTV 소개 영상',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        subImgUrl: 'https://via.placeholder.com/800x450'
      }
    ]
  }
};

<CornerVideo001 data={data} />
`}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>

      <div className="sampleInfo none">
        <h3>CornerVideo001 props 설명</h3>
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
              <td>{`{ title: string; desc: string; fileConts: { videoList: VideoData[]; }; }`}</td>
              <td>비디오 데이터 객체</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.title</td>
              <td>string</td>
              <td>비디오 섹션 제목</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.desc</td>
              <td>string</td>
              <td>비디오 섹션 설명 (화면에 미표시)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.fileConts</td>
              <td>{`{ videoList: VideoData[]; }`}</td>
              <td>파일 컨텐츠 객체</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.fileConts.videoList[0]</td>
              <td>{`{ videoTitle: string; videoUrl: string; subImgUrl: string; }`}</td>
              <td>표시할 비디오 데이터 (첫 번째만 사용)</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.fileConts.videoList[0].videoTitle</td>
              <td>string</td>
              <td>비디오 제목</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.fileConts.videoList[0].videoUrl</td>
              <td>string</td>
              <td>비디오 파일 URL</td>
              <td>-</td>
            </tr>
            <tr>
              <td>data.fileConts.videoList[0].subImgUrl</td>
              <td>string</td>
              <td>비디오 썸네일 이미지 URL</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 수정 모달 */}
      <MzModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="비디오 수정">
        <div className="modalContent">
          <dl className="formGroup">
            <dt>
              <label htmlFor="sectionTitle">섹션 제목</label>
            </dt>
            <dd>
              <MzInputText
                id="sectionTitle"
                value={editVideoData.title}
                onChange={(e) => setEditVideoData((prev) => ({ ...prev, title: e.target.value }))}
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
                value={editVideoData.desc}
                onChange={(e) =>
                  setEditVideoData((prev) => ({
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
              <label htmlFor="videoTitle">비디오 제목</label>
            </dt>
            <dd>
              <MzInputText
                id="videoTitle"
                value={editVideoData.fileConts.videoList[0]?.videoTitle || ''}
                onChange={(e) =>
                  setEditVideoData((prev) => ({
                    ...prev,
                    fileConts: {
                      ...prev.fileConts,
                      videoList: [{ ...prev.fileConts.videoList[0], videoTitle: e.target.value }],
                    },
                  }))
                }
                placeholder="비디오 제목을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="videoUrl">비디오 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="videoUrl"
                value={editVideoData.fileConts.videoList[0]?.videoUrl || ''}
                onChange={(e) =>
                  setEditVideoData((prev) => ({
                    ...prev,
                    fileConts: {
                      ...prev.fileConts,
                      videoList: [{ ...prev.fileConts.videoList[0], videoUrl: e.target.value }],
                    },
                  }))
                }
                placeholder="비디오 파일 URL을 입력하세요"
              />
            </dd>
          </dl>
          <dl className="formGroup">
            <dt>
              <label htmlFor="thumbnailUrl">썸네일 이미지 URL</label>
            </dt>
            <dd>
              <MzInputText
                id="thumbnailUrl"
                value={editVideoData.fileConts.videoList[0]?.subImgUrl || ''}
                onChange={(e) =>
                  setEditVideoData((prev) => ({
                    ...prev,
                    fileConts: {
                      ...prev.fileConts,
                      videoList: [{ ...prev.fileConts.videoList[0], subImgUrl: e.target.value }],
                    },
                  }))
                }
                placeholder="썸네일 이미지 URL을 입력하세요"
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
                setVideoData(editVideoData);
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
