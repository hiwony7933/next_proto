import React, { useState } from 'react';
import { MzModal } from '../../common/components/ui/mzModal';
import { useModal } from '../../common/components/ui/mzModalContainer';
import MzButton from '../../common/components/ui/mzButton';
import '../assets/sample.scss';

export default function SampleMzModal() {
  const [open, setOpen] = useState(false);
  const [openBottom, setOpenBottom] = useState(false);
  const { open: openModal } = useModal();
  return (
    <div style={{ padding: 24 }}>
      <h2>Sample MzModal Page</h2>
      <div className="sampleInfo">
        <h3>MzModal props 설명</h3>
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
              <td>id</td>
              <td>string</td>
              <td>모달 id</td>
            </tr>
            <tr>
              <td>isOpen</td>
              <td>boolean</td>
              <td>모달 오픈 여부 (필수)</td>
            </tr>
            <tr>
              <td>onClose</td>
              <td>() =&gt; void</td>
              <td>닫기 이벤트 핸들러</td>
            </tr>
            <tr>
              <td>title</td>
              <td>string</td>
              <td>모달 타이틀(HTML 가능)</td>
            </tr>
            <tr>
              <td>isWrapped</td>
              <td>boolean</td>
              <td>랩 클래스 적용 여부(미적용시 외부 클릭시 닫힘)</td>
            </tr>
            <tr>
              <td>isDimmed</td>
              <td>boolean</td>
              <td>배경 딤 처리 여부</td>
            </tr>
            <tr>
              <td>isBottom</td>
              <td>boolean</td>
              <td>바텀시트 스타일 적용 여부</td>
            </tr>
            <tr>
              <td>type</td>
              <td>string</td>
              <td>모달 타입 (커스텀 스타일 적용용)</td>
            </tr>
            <tr>
              <td>wrapClassName</td>
              <td>string</td>
              <td>모달 랩 클래스명</td>
            </tr>
            <tr>
              <td>overlayClassName</td>
              <td>string</td>
              <td>오버레이 클래스명</td>
            </tr>
            <tr>
              <td>hasFloating</td>
              <td>boolean</td>
              <td>하단 플로팅 버튼 영역 여부</td>
            </tr>
            <tr>
              <td>parentSelector</td>
              <td>string</td>
              <td>부모 셀렉터 (특정 엘리먼트 내부에 모달 렌더링)</td>
            </tr>
            <tr>
              <td>shouldCloseOnOverlayClick</td>
              <td>boolean</td>
              <td>오버레이 클릭시 닫힘 여부</td>
            </tr>
            <tr>
              <td>hasClose</td>
              <td>boolean</td>
              <td>닫기버튼 노출 여부</td>
            </tr>
            <tr>
              <td>showCloseBottom</td>
              <td>boolean</td>
              <td>하단 닫기버튼 노출 여부</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={() => setOpen(true)}>기본 모달 열기</button>
      <button onClick={() => setOpenBottom(true)} style={{ marginLeft: 8 }}>
        바텀시트 모달 열기
      </button>

      <MzButton
        type="button"
        size="5"
        onClick={() =>
          openModal(
            <>
              <h2>동적으로 띄우는 모달</h2>
              <button onClick={close}>닫기</button>
            </>,
          )
        }
      >
        모달창 띄우기
      </MzButton>
      {/* 기본 모달 샘플 */}
      <MzModal
        isOpen={open} // 모달 오픈 여부
        onClose={() => setOpen(false)} // 닫기 이벤트
        title="<b>기본 모달 타이틀</b>" // 타이틀(HTML 가능)
        isDimmed={true} // 배경 딤
        isWrapped={true} // 랩 클래스 적용
        hasClose={true} // 닫기버튼 노출
        showCloseBottom={true} // 하단 닫기버튼 노출
      >
        <div>이곳에 모달 컨텐츠가 들어갑니다.</div>
      </MzModal>

      {/* 바텀시트 모달 샘플 */}
      <MzModal
        isOpen={openBottom}
        onClose={() => setOpenBottom(false)}
        title="바텀시트 모달"
        isBottom={true} // 바텀시트 스타일
        hasFloating={true} // 하단 플로팅 버튼 영역
        showCloseBottom={true}
      >
        <div>바텀시트 스타일의 모달입니다.</div>
      </MzModal>
    </div>
  );
}

// ---
// MzModal Props 정리 (참고용)
//
// isOpen: boolean;                // 모달 오픈 여부
// onClose?: () => void;           // 닫기 이벤트
// title?: string;                 // 타이틀(HTML 가능)
// isWrapped?: boolean;            // 랩 클래스 적용 여부
// isDimmed?: boolean;             // 배경 딤
// isBottom?: boolean;             // 바텀시트 스타일
// type?: string;                  // 모달 타입 (커스텀)
// wrapClassName?: string;         // 모달 클래스
// overlayClassName?: string;      // 오버레이 클래스
// hasFloating?: boolean;          // 하단 플로팅 버튼
// parentSelector?: string;        // 부모 셀렉터
// shouldCloseOnOverlayClick?: boolean; // 오버레이 클릭시 닫힘
// hasClose?: boolean;             // 닫기버튼 노출
// showCloseBottom?: boolean;      // 하단 닫기버튼 노출
// id?: string;                    // 모달 id
//
