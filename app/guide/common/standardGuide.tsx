import React from 'react';
import '../assets/sample.scss';

/**
 * # AI 프롬프트 작성법 (신규 파일/컴포넌트 생성)
 *
 * ## 1. 목적/역할 명확히 전달
 * - 무엇을 만들고 싶은지 한 문장으로 설명
 *   - 예: "주소 입력 폼 컴포넌트와 샘플 페이지를 추가해줘."
 *
 * ## 2. 위치/폴더 구조 지정
 * - 생성할 파일의 위치(폴더) 명확히 지정
 *   - 예: "src/components/form/에 컴포넌트, src/guide/form/에 샘플 생성"
 *
 * ## 3. 네이밍 규칙 명시
 * - 파일명, 컴포넌트명, 라우트명 등 규칙을 명확히 전달
 *   - 예: "파일명은 sampleFormAddress.tsx, 컴포넌트명은 SampleFormAddress, routePath는 SAMPLE_FORM_ADDRESS로 해줘"
 *
 * ## 4. 필요한 props/기능/구조 설명
 * - 컴포넌트의 props, 주요 기능, 샘플에 들어갈 내용 등 구체적으로 전달
 *   - 예: "props는 value, onChange, placeholder가 필요하고, 샘플에는 props 표와 사용 예시를 넣어줘"
 *
 * ## 5. 라우트/메뉴 연결 요청
 * - App.tsx, routePath.ts, 메뉴 등 연결 작업도 요청
 *   - 예: "App.tsx에 라우트 추가, routePath.ts에 상수 추가, adminHomeMenu.ts 메뉴도 반영해줘"
 *
 * ## 6. 기타(스타일, 주석, 문서 등)
 * - 스타일 파일 생성, 주석, 문서화 등 추가 요청
 *   - 예: "SCSS 파일도 같이 생성, 주요 부분에 주석 추가"
 *
 * ---
 *
 * ### 예시 프롬프트
 *
 * 1. src/components/form/에 전화번호 입력 컴포넌트(SampleFormPhoneNumber)와 SCSS 파일을 생성해줘.
 * 2. src/guide/form/에 샘플 파일(sampleFormPhoneNumber.tsx)도 만들어줘.
 * 3. 파일명/컴포넌트명/routePath는 네이밍 규칙에 맞춰 작성해줘.
 * 4. props는 value, onChange, placeholder가 필요하고, 샘플에는 props 표와 사용 예시를 넣어줘.
 * 5. App.tsx, routePath.ts, adminHomeMenu.ts에도 라우트/메뉴 연결까지 반영해줘.
 *
 * ---
 *
 * ## 요약
 * - 1. 목적/역할 → 2. 위치/폴더 → 3. 네이밍 규칙 → 4. props/기능 → 5. 라우트/메뉴 연결 → 6. 기타 요청
 * - 이 순서로 구체적으로 지시하면 AI가 원하는 결과를 정확하게 생성할 수 있습니다!
 */

export default function StandardGuide() {
  return (
    <div className="sample">
      <h2>Guide 주요 폴더/파일 구조 및 목적</h2>
      <div className="sampleInfo">
        <h3>주요폴더 설명</h3>
        <table>
          <thead>
            <tr>
              <th>폴더</th>
              <th>파일</th>
              <th>설명(목적)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>src/guide</td>
              <td>App.tsx</td>
              <td>Guide 전체 라우팅(페이지 연결) 담당 메인 라우터 컴포넌트</td>
            </tr>
            <tr>
              <td>src/guide</td>
              <td>GuideMain.tsx</td>
              <td>Guide 샘플/가이드 전체 메뉴 및 레이아웃(iframe) 담당</td>
            </tr>
            <tr>
              <td>src/guide</td>
              <td>main.tsx</td>
              <td>Guide SPA의 React 진입점(Entry Point), guide.html에서 마운트</td>
            </tr>
            <tr>
              <td>src/guide/routers</td>
              <td>routePath.ts</td>
              <td>Guide(샘플) 화면 라우트 경로를 상수화하여 모아 관리하는 파일</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <h3>Guide 네이밍 규칙</h3>
        <ul>
          <li><b>폴더명 규칙:</b> 기능/역할별로 소문자 사용 (예: <code>form</code>, <code>ui</code>, <code>admin</code>)</li>
          <li><b>파일명 규칙:</b> sample + 역할 + 컴포넌트명, 첫 글자 소문자 (예: <code>sampleFormAddress.tsx</code>, <code>sampleUiAlert.tsx</code>)</li>
          <li><b>컴포넌트명 규칙:</b> 파일명과 매칭, 각 단어 첫 글자 대문자 (예: <code>SampleFormAddress</code>, <code>SampleUiAlert</code>)</li>
          <li><b>routePath 명 규칙:</b> <code>SAMPLE_FORM_컴포넌트명</code>, <code>SAMPLE_UI_컴포넌트명</code> 등으로 대문자+언더스코어, 폴더 역할과 일치 (예: <code>SAMPLE_FORM_ADDRESS</code>, <code>SAMPLE_UI_ALERT</code>)</li>
        </ul>
      </div>
      <div className="sampleInfo sampleInfoPrompt">
        <h3>신규파일 생성 시, AI 프롬프트</h3>
        <div>
          <ol>
            <li><b>목적/역할 명확히 전달</b><br />
              <span>무엇을 만들고 싶은지 한 문장으로 설명<br />
                <i>예: "주소 입력 폼 컴포넌트와 샘플 페이지를 추가해줘."</i></span>
            </li>
            <li><b>위치/폴더 구조 지정</b><br />
              <span>생성할 파일의 위치(폴더) 명확히 지정<br />
                <i>예: "src/components/form/에 컴포넌트, src/guide/form/에 샘플 생성"</i></span>
            </li>
            <li><b>네이밍 규칙 명시</b><br />
              <span>파일명, 컴포넌트명, 라우트명 등 규칙을 명확히 전달<br />
                <i>예: "파일명은 sampleFormAddress.tsx, 컴포넌트명은 SampleFormAddress, routePath는 SAMPLE_FORM_ADDRESS로 해줘"</i></span>
            </li>
            <li><b>필요한 props/기능/구조 설명</b><br />
              <span>컴포넌트의 props, 주요 기능, 샘플에 들어갈 내용 등 구체적으로 전달<br />
                <i>예: "props는 value, onChange, placeholder가 필요하고, 샘플에는 props 표와 사용 예시를 넣어줘"</i></span>
            </li>
            <li><b>라우트/메뉴 연결 요청</b><br />
              <span>App.tsx, routePath.ts, 메뉴 등 연결 작업도 요청<br />
                <i>예: "App.tsx에 라우트 추가, routePath.ts에 상수 추가, adminHomeMenu.ts 메뉴도 반영해줘"</i></span>
            </li>
            <li><b>기타(스타일, 주석, 문서 등)</b><br />
              <span>스타일 파일 생성, 주석, 문서화 등 추가 요청<br />
                <i>예: "SCSS 파일도 같이 생성, 주요 부분에 주석 추가"</i></span>
            </li>
          </ol>
          <hr />
          <div className="examplePrompt">
            <h4>예시 프롬프트</h4>
            <ul className="promptList">
              <li>
                <span className="number">1.</span>
                <span>src/components/form/에 <b>전화번호 입력 컴포넌트(SampleFormPhoneNumber)</b>와 SCSS 파일을 생성해줘.</span>
              </li>
              <li>
                <span className="number">2.</span>
                <span>src/guide/form/에 <b>샘플 파일(sampleFormPhoneNumber.tsx)</b>도 만들어줘.</span>
              </li>
              <li>
                <span className="number">3.</span>
                <span>파일명/컴포넌트명/routePath는 <b>네이밍 규칙</b>에 맞춰 작성해줘.</span>
              </li>
              <li>
                <span className="number">4.</span>
                <span><b>props</b>는 value, onChange, placeholder가 필요하고, <b>샘플</b>에는 props 표와 사용 예시를 넣어줘.</span>
              </li>
              <li>
                <span className="number">5.</span>
                <span><b>App.tsx, routePath.ts, adminHomeMenu.ts</b>에도 라우트/메뉴 연결까지 반영해줘.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sampleInfo sampleInfoPrompt">
        <h3>요약</h3>
        <div>
          <span>1. 목적/역할 → 2. 위치/폴더 → 3. 네이밍 규칙 → 4. props/기능 → 5. 라우트/메뉴 연결 → 6. 기타 요청<br />
            이 순서로 구체적으로 지시하면 AI가 원하는 결과를 정확하게 생성할 수 있습니다!</span>
        </div>
      </div>
    </div>
  );
}
