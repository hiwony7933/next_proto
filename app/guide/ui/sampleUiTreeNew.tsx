import React, { useState } from 'react';
import MzTreeNew from '../../common/components/ui/mzTreeNew';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const basicUsageCode = `import MzTreeNew from '../../components/common/ui/mzTreeNew';

const treeData = [
  {
    text: '1 - 첫번째 노드',
    children: [
      { 
        text: '2 - 서브 노드',
        children: [
          {
            text: '3 - 3뎁스 노드',
            children: [
              { text: '4 - 4뎁스 노드' }
            ]
          }
        ]
      }
    ]
  }
];

<MzTreeNew
  data={treeData}
  onNodeSelect={node => console.log('노드 선택:', node)}
  onNode3DepthClick={node => console.log('3뎁스 클릭:', node)}
  onNode4DepthClick={node => console.log('4뎁스 클릭:', node)}
  className="custom-tree"
  style={{ width: 300, minHeight: 400 }}
/>`;

const serverDataCode = `// 서버에서 받은 플랫 데이터를 트리 구조로 변환
const convertToTreeStructure = (flatData: any[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  // 1. 모든 노드를 맵에 저장하고 children 배열 초기화
  flatData.forEach(item => {
    map.set(item.rtTgtSeq, {
      ...item,
      text: item.mrkNm || item.rtTgtNm, // text 속성 추가
      children: []
    });
  });

  // 2. 부모-자식 관계 설정
  flatData.forEach(item => {
    const node = map.get(item.rtTgtSeq);
    if (item.uprRtTgtSeq === 0) {
      roots.push(node);
    } else {
      const parent = map.get(item.uprRtTgtSeq);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};

// 사용법
const treeData = convertToTreeStructure(serverData);`;

const advancedUsageCode = `// 고급 사용 예제
const [selectedNode, setSelectedNode] = useState(null);
const [clickedNode, setClickedNode] = useState(null);

const handleNodeSelect = (node) => {
  setSelectedNode(node);
  console.log('선택된 노드:', node);
};

const handle3DepthClick = (node) => {
  setClickedNode({ ...node, depth: 3 });
  console.log('3뎁스 클릭:', node);
  // 3뎁스 전용 로직 처리
};

const handle4DepthClick = (node) => {
  setClickedNode({ ...node, depth: 4 });
  console.log('4뎁스 클릭:', node);
  // 4뎁스 전용 로직 처리 (최종 액션)
};

<MzTreeNew
  data={complexTreeData}
  onNodeSelect={handleNodeSelect}
  onNode3DepthClick={handle3DepthClick}
  onNode4DepthClick={handle4DepthClick}
  className="advanced-tree"
  style={{ 
    width: '100%', 
    maxHeight: 500, 
    overflow: 'auto' 
  }}
/>`;

// 플랫한 배열을 트리 구조로 변환하는 함수
const convertToTreeStructure = (flatData: any[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  // 1. 모든 노드를 맵에 저장하고 children 배열 초기화
  flatData.forEach((item) => {
    map.set(item.rtTgtSeq, {
      ...item,
      text: item.mrkNm || item.rtTgtNm, // text 속성 추가
      children: [],
    });
  });

  // 2. 부모-자식 관계 설정
  flatData.forEach((item) => {
    const node = map.get(item.rtTgtSeq);
    if (item.uprRtTgtSeq === 0) {
      // 최상위 노드 (부모가 0인 경우)
      roots.push(node);
    } else {
      // 자식 노드인 경우
      const parent = map.get(item.uprRtTgtSeq);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};

// 4뎁스까지 있는 샘플 데이터
const rawTreeData4Depth = [
  {
    code: '0000',
    message: '',
    data: [
      {
        rtTgtSeq: 57156073,
        rtTgtNm: '첫번째 노드 (rtTgtNm)',
        mrkNm: '1 - 첫번째 노드 (mrkNm)',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 0,
        menuTlwtYn: 'N',
        lvl: '1',
      },
      {
        rtTgtSeq: 57156074,
        rtTgtNm: 'N',
        mrkNm: '2 - 서브 노드',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 57156073,
        menuTlwtYn: 'N',
        lvl: '2',
      },
      {
        rtTgtSeq: 57156075,
        rtTgtNm: 'N',
        mrkNm: '3 - 3뎁스 노드',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 57156074,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 57156076,
        rtTgtNm: 'N',
        mrkNm: '4 - 4뎁스 노드 (최종)',
        rtTgtTpCd: '30',
        uprRtTgtSeq: 57156075,
        menuTlwtYn: 'N',
        lvl: '4',
      },
      {
        rtTgtSeq: 106,
        rtTgtNm: '회원관리',
        mrkNm: '1 - 회원',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 0,
        menuTlwtYn: 'N',
        lvl: '1',
      },
      {
        rtTgtSeq: 57155951,
        rtTgtNm: 'N',
        mrkNm: '2 - 회원기본관리',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 106,
        menuTlwtYn: 'N',
        lvl: '2',
      },
      {
        rtTgtSeq: 57155952,
        rtTgtNm: 'N',
        mrkNm: '3 - 회원기본관리',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 57155951,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 57155953,
        rtTgtNm: 'N',
        mrkNm: '4 - REQUEST.기본정보.회원정보등록',
        rtTgtTpCd: '30',
        uprRtTgtSeq: 57155952,
        menuTlwtYn: 'N',
        lvl: '4',
      },
      {
        rtTgtSeq: 57155954,
        rtTgtNm: 'N',
        mrkNm: '4 - REQUEST.기본정보.회원정보삭제',
        rtTgtTpCd: '30',
        uprRtTgtSeq: 57155952,
        menuTlwtYn: 'N',
        lvl: '4',
      },
      {
        rtTgtSeq: 57155955,
        rtTgtNm: 'N',
        mrkNm: '4 - REQUEST.기본정보.회원정보변경',
        rtTgtTpCd: '30',
        uprRtTgtSeq: 57155952,
        menuTlwtYn: 'N',
        lvl: '4',
      },
    ],
    succeeded: true,
    total: 0,
    isJackson: true,
  },
];

// 3뎁스까지만 있는 샘플 데이터
const rawTreeData3Depth = [
  {
    code: '0000',
    message: '',
    data: [
      {
        rtTgtSeq: 200001,
        rtTgtNm: '상품관리',
        mrkNm: '1 - 상품관리',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 0,
        menuTlwtYn: 'N',
        lvl: '1',
      },
      {
        rtTgtSeq: 200002,
        rtTgtNm: 'N',
        mrkNm: '2 - 카테고리관리',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 200001,
        menuTlwtYn: 'N',
        lvl: '2',
      },
      {
        rtTgtSeq: 200003,
        rtTgtNm: 'N',
        mrkNm: '3 - 대분류 관리 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 200002,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 200004,
        rtTgtNm: 'N',
        mrkNm: '3 - 중분류 관리 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 200002,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 200005,
        rtTgtNm: 'N',
        mrkNm: '3 - 소분류 관리 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 200002,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 200006,
        rtTgtNm: 'N',
        mrkNm: '2 - 브랜드관리',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 200001,
        menuTlwtYn: 'N',
        lvl: '2',
      },
      {
        rtTgtSeq: 200007,
        rtTgtNm: 'N',
        mrkNm: '3 - 브랜드 등록 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 200006,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 200008,
        rtTgtNm: 'N',
        mrkNm: '3 - 브랜드 수정 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 200006,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 300001,
        rtTgtNm: '주문관리',
        mrkNm: '1 - 주문관리',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 0,
        menuTlwtYn: 'N',
        lvl: '1',
      },
      {
        rtTgtSeq: 300002,
        rtTgtNm: 'N',
        mrkNm: '2 - 주문내역',
        rtTgtTpCd: '10',
        uprRtTgtSeq: 300001,
        menuTlwtYn: 'N',
        lvl: '2',
      },
      {
        rtTgtSeq: 300003,
        rtTgtNm: 'N',
        mrkNm: '3 - 주문 조회 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 300002,
        menuTlwtYn: 'N',
        lvl: '3',
      },
      {
        rtTgtSeq: 300004,
        rtTgtNm: 'N',
        mrkNm: '3 - 주문 취소 (최종뎁스)',
        rtTgtTpCd: '20',
        uprRtTgtSeq: 300002,
        menuTlwtYn: 'N',
        lvl: '3',
      },
    ],
    succeeded: true,
    total: 0,
    isJackson: true,
  },
];

export default function SampleMzTreeNew() {
  const [selected, setSelected] = useState<string | null>(null);
  const [depth3Clicked, setDepth3Clicked] = useState<string | null>(null);
  const [depth4Clicked, setDepth4Clicked] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [selectedTreeType, setSelectedTreeType] = useState<'3depth' | '4depth'>('4depth');

  // 선택된 트리 타입에 따라 데이터 결정
  const currentRawData = selectedTreeType === '3depth' ? rawTreeData3Depth : rawTreeData4Depth;

  // 플랫한 데이터를 트리 구조로 변환
  const treeData = convertToTreeStructure(currentRawData[0].data);

  const handleNodeSelect = (node: any) => {
    setSelected(node.text);
    addToLog(`📝 노드 선택: ${node.text}`);
  };

  const handle3DepthClick = (node: any) => {
    setDepth3Clicked(node.text);
    addToLog(`🎯 3뎁스 클릭: ${node.text}`);
  };

  const handle4DepthClick = (node: any) => {
    setDepth4Clicked(node.text);
    addToLog(`🎯 4뎁스 클릭: ${node.text} (최종 액션)`);
  };

  const addToLog = (message: string) => {
    setActionLog((prev) => [message, ...prev.slice(0, 9)]); // 최근 10개만 유지
  };

  const clearLog = () => {
    setActionLog([]);
  };

  const handleTreeTypeChange = (type: '3depth' | '4depth') => {
    setSelectedTreeType(type);
    // 트리 타입 변경 시 모든 상태 초기화
    setSelected(null);
    setDepth3Clicked(null);
    setDepth4Clicked(null);
    setActionLog([`🔄 트리 타입 변경: ${type === '3depth' ? '3뎁스' : '4뎁스'} 샘플로 변경`]);
  };

  return (
    <div className="sample">
      <h2>🌳 MzTreeNew 컴포넌트 가이드</h2>

      <div className="sampleInfo">
        <h3>✨ 주요 특징</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>유연한 뎁스 지원</strong>: 3단계 또는 4단계까지 트리 구조 지원
          </li>
          <li>
            <strong>성능 최적화</strong>: useCallback, useMemo 적용으로 렌더링 성능 향상
          </li>
          <li>
            <strong>개별 뎁스 제어</strong>: 3뎁스, 4뎁스 각각 다른 클릭 이벤트 처리
          </li>
          <li>
            <strong>조건부 렌더링</strong>: 메모리 효율적인 DOM 관리
          </li>
          <li>
            <strong>서버 데이터 지원</strong>: 플랫 배열을 트리 구조로 자동 변환
          </li>
          <li>
            <strong>다양한 샘플</strong>: 3뎁스 샘플 (상품/주문관리), 4뎁스 샘플 (회원관리) 제공
          </li>
        </ul>
      </div>

      <div className="sampleInfo">
        <h3>📋 Props 설명</h3>
        <table>
          <thead>
            <tr>
              <th>Props</th>
              <th>타입</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>data</code>
              </td>
              <td>
                <code>any[]</code>
              </td>
              <td>✅</td>
              <td>트리 데이터 (계층 구조)</td>
            </tr>
            <tr>
              <td>
                <code>onNodeSelect</code>
              </td>
              <td>
                <code>(node: any) =&gt; void</code>
              </td>
              <td>❌</td>
              <td>모든 뎁스 노드 선택 이벤트</td>
            </tr>
            <tr>
              <td>
                <code>onNode3DepthClick</code>
              </td>
              <td>
                <code>(node: any) =&gt; void</code>
              </td>
              <td>❌</td>
              <td>3뎁스 전용 클릭 이벤트</td>
            </tr>
            <tr>
              <td>
                <code>onNode4DepthClick</code>
              </td>
              <td>
                <code>(node: any) =&gt; void</code>
              </td>
              <td>❌</td>
              <td>4뎁스 전용 클릭 이벤트 (최종 액션)</td>
            </tr>
            <tr>
              <td>
                <code>className</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>❌</td>
              <td>추가 CSS 클래스</td>
            </tr>
            <tr>
              <td>
                <code>style</code>
              </td>
              <td>
                <code>React.CSSProperties</code>
              </td>
              <td>❌</td>
              <td>인라인 스타일</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sampleInfo">
        <h3>🎮 라이브 데모</h3>
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: '0 0 8px 0' }}>📊 샘플 타입 선택</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleTreeTypeChange('4depth')}
              style={{
                padding: '8px 16px',
                border: selectedTreeType === '4depth' ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: selectedTreeType === '4depth' ? '#e7f3ff' : '#fff',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              🌳 4뎁스 샘플 (회원관리)
            </button>
            <button
              onClick={() => handleTreeTypeChange('3depth')}
              style={{
                padding: '8px 16px',
                border: selectedTreeType === '3depth' ? '2px solid #28a745' : '1px solid #ddd',
                backgroundColor: selectedTreeType === '3depth' ? '#e8f5e8' : '#fff',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              🛒 3뎁스 샘플 (상품/주문관리)
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#666', margin: '8px 0 0 0' }}>
            {selectedTreeType === '4depth'
              ? '💡 4뎁스까지 있는 트리로, 4뎁스 클릭 이벤트를 테스트할 수 있습니다.'
              : '💡 3뎁스까지만 있는 트리로, 3뎁스가 최종 노드입니다. (onNode4DepthClick 이벤트는 발생하지 않음)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <MzTreeNew
              key={selectedTreeType} // 트리 타입 변경 시 컴포넌트 재마운트
              data={treeData}
              style={{ width: '100%', minHeight: 400, border: '1px solid #ddd', padding: 10 }}
              onNodeSelect={handleNodeSelect}
              onNode3DepthClick={handle3DepthClick}
              onNode4DepthClick={handle4DepthClick}
              className="demo-tree"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ padding: 16, border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <h4>📊 이벤트 모니터</h4>
              <div
                style={{
                  marginBottom: 10,
                  padding: 8,
                  backgroundColor: selectedTreeType === '4depth' ? '#e7f3ff' : '#e8f5e8',
                  borderRadius: 4,
                }}
              >
                <strong>현재 트리:</strong>{' '}
                <span style={{ color: selectedTreeType === '4depth' ? '#007bff' : '#28a745' }}>
                  {selectedTreeType === '4depth' ? '🌳 4뎁스 샘플' : '🛒 3뎁스 샘플'}
                </span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>선택된 노드:</strong>{' '}
                <span style={{ color: '#007bff' }}>{selected || '없음'}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>3뎁스 클릭:</strong>{' '}
                <span style={{ color: '#28a745' }}>{depth3Clicked || '없음'}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>4뎁스 클릭:</strong>{' '}
                <span style={{ color: '#dc3545' }}>{depth4Clicked || '없음'}</span>
                {selectedTreeType === '3depth' && (
                  <small style={{ color: '#666', display: 'block', fontSize: 11 }}>
                    (3뎁스 샘플에서는 4뎁스 클릭 이벤트가 발생하지 않습니다)
                  </small>
                )}
              </div>
              <hr />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <h5>📝 액션 로그</h5>
                <button onClick={clearLog} style={{ fontSize: 12, padding: '4px 8px' }}>
                  Clear
                </button>
              </div>
              <div style={{ maxHeight: 200, overflow: 'auto', fontSize: 12 }}>
                {actionLog.length === 0 ? (
                  <p style={{ color: '#666', margin: 0 }}>트리를 클릭해보세요!</p>
                ) : (
                  actionLog.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '2px 0',
                        borderBottom: index < actionLog.length - 1 ? '1px solid #eee' : 'none',
                      }}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">💡 기본 사용법</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {basicUsageCode}
        </SyntaxHighlighter>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">🔄 서버 데이터 변환</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {serverDataCode}
        </SyntaxHighlighter>
      </div>

      <div className="codeBlock">
        <h6 className="codeTitle">🚀 고급 사용 예제</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {advancedUsageCode}
        </SyntaxHighlighter>
      </div>

      <div className="sampleInfo">
        <h3>⚡ 성능 최적화</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>useCallback</strong>: 클릭 핸들러 함수들이 메모이제이션되어 불필요한 리렌더링
            방지
          </li>
          <li>
            <strong>useMemo</strong>: 노드 키 계산 결과를 캐시하여 성능 향상
          </li>
          <li>
            <strong>조건부 렌더링</strong>: 닫힌 노드는 DOM에서 완전 제거하여 메모리 효율성 증대
          </li>
          <li>
            <strong>Set 기반 상태 관리</strong>: O(1) 시간 복잡도로 노드 상태 확인
          </li>
        </ul>
      </div>

      <div className="sampleInfo">
        <h3>📊 데이터 구조 차이점</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div
            style={{
              padding: 16,
              border: '2px solid #007bff',
              borderRadius: 8,
              backgroundColor: '#f8f9fa',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', color: '#007bff' }}>🌳 4뎁스 샘플</h4>
            <ul style={{ fontSize: 14, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>1뎁스</strong>: 대메뉴 (회원관리)
              </li>
              <li>
                <strong>2뎁스</strong>: 중메뉴 (회원기본관리)
              </li>
              <li>
                <strong>3뎁스</strong>: 소메뉴 (상세 관리) + 확장/축소 가능
              </li>
              <li>
                <strong>4뎁스</strong>: 최종 액션 (API 호출, 팝업 등)
              </li>
            </ul>
            <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
              💡 복잡한 권한 체계나 상세 기능 분류에 적합
            </div>
          </div>
          <div
            style={{
              padding: 16,
              border: '2px solid #28a745',
              borderRadius: 8,
              backgroundColor: '#f8f9fa',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', color: '#28a745' }}>🛒 3뎁스 샘플</h4>
            <ul style={{ fontSize: 14, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>1뎁스</strong>: 대메뉴 (상품관리, 주문관리)
              </li>
              <li>
                <strong>2뎁스</strong>: 중메뉴 (카테고리관리, 브랜드관리)
              </li>
              <li>
                <strong>3뎁스</strong>: 최종 액션 (등록, 수정, 조회 등)
              </li>
              <li style={{ color: '#999' }}>
                <strong>4뎁스</strong>: 없음
              </li>
            </ul>
            <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
              💡 단순한 구조나 일반적인 관리 메뉴에 적합
            </div>
          </div>
        </div>
      </div>

      <div className="sampleInfo">
        <h3>🎯 사용 시나리오</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>메뉴 네비게이션</strong>: 관리자 페이지의 계층형 메뉴
          </li>
          <li>
            <strong>권한 관리</strong>: 사용자별 메뉴 접근 권한 설정
          </li>
          <li>
            <strong>카테고리 관리</strong>: 상품/컨텐츠 카테고리 트리
          </li>
          <li>
            <strong>조직도</strong>: 회사 조직 구조 표시
          </li>
          <li>
            <strong>파일 탐색기</strong>: 폴더 구조 네비게이션
          </li>
        </ul>
      </div>
    </div>
  );
}
