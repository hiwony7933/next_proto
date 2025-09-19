import React, { useRef, useState } from 'react';
import MzEditor from '../../common/components/form/mzEditor';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../assets/sample.scss';

const sampleCode = `import MzEditor from '../../components/common/form/mzEditor';
import React, { useRef, useState } from 'react';

const [content, setContent] = useState('');
const editorRef = useRef<any>(null);

<MzEditor
  content={content}
  editorRef={editorRef}
  mode="edit"
  onChange={setContent}
/>
<MzEditor
  content={content}
  mode="preview"
/>
`;

export default function SampleMzEditor() {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');
  const editorRef = useRef<any>(null);
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const samplePreview = `
| 폴더위치       | 컴포넌트 네이밍       | 파일명                    | 라우터 Path             | URL                            |
|----------------|------------------------|---------------------------|--------------------------|---------------------------------|
| src/guide/uiux | SampleUiuxTooltip      | sampleUiuxTooltip.tsx     | SAMPLE_UIUX_TOOLTIP      | /guide/uiux/sampleTooltip       |
| src/guide/uiux | SampleFileUpload   | SampleFileUpload.tsx  | SAMPLE_UIUX_FILEUPLOAD   | /guide/uiux/sampleFileUpload    |
| src/guide/uiux | SamplePhoneNumber  | SamplePhoneNumber.tsx | SAMPLE_UIUX_PHONENUMBER  | /guide/uiux/samplePhoneNumber   |
| src/guide/uiux | SampleAddress      | SampleAddress.tsx     | SAMPLE_UIUX_ADDRESS      | /guide/uiux/sampleAddress       |
| src/guide/uiux | SampleUiuxTabs         | sampleUiuxTabs.tsx        | SAMPLE_UIUX_TABS         | /guide/uiux/sampleTabs          |
| src/guide/uiux | SampleUiuxFaq          | sampleUiuxFaq.tsx         | SAMPLE_UIUX_FAQ          | /guide/uiux/sampleFaq           |
`;
  console.log('samplePreview', samplePreview);
  return (
    <div className="sample">
      <h2>Sample MzEditor Page</h2>
      <div className="sampleInfo">
        <h3>MzEditor props 설명</h3>
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
              <td>content</td>
              <td>string</td>
              <td>에디터 내용(마크다운)</td>
            </tr>
            <tr>
              <td>editorRef</td>
              <td>RefObject&lt;any&gt;</td>
              <td>에디터 ref (edit 모드에서만 필요)</td>
            </tr>
            <tr>
              <td>mode</td>
              <td>'edit' | 'preview'</td>
              <td>에디터/미리보기 모드 (기본값: 'edit')</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>(value: string) =&gt; void</td>
              <td>내용 변경 시 콜백</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sampleInfo">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: '100%' }}>
            <h3>Edit Mode</h3>
            <MzEditor content={content} editorRef={editorRef} mode="edit" onChange={setContent} />
          </div>
          <div style={{ width: '100%' }}>
            <h3>Preview Mode</h3>
            <MzEditor content={samplePreview} mode="preview" />
          </div>
        </div>
      </div>
      <div className="codeBlock">
        <h6 className="codeTitle">샘플 코드</h6>
        <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines>
          {sampleCode}
        </SyntaxHighlighter>
        <button onClick={() => handleCopy(sampleCode)} type="button" className="copyButton">
          {copied ? '복사됨!' : '코드 복사'}
        </button>
      </div>
    </div>
  );
}
