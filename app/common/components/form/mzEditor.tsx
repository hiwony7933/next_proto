'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// 기존 TUI 에디터는 React 17 피어 의존성 경고가 있어 SSR/React 19 환경에서 불안정할 수 있습니다.
// 임시로 dynamic import(ssr:false) 처리합니다. 장기적으로는 app/components/Editor.tsx(TipTap) 대체 권장.
const TuiEditor = dynamic(() => import('@toast-ui/react-editor').then((m) => m.Editor), {
  ssr: false,
});
const TuiViewer = dynamic(() => import('@toast-ui/react-editor').then((m) => m.Viewer), {
  ssr: false,
});

interface Props {
  content: string;
  editorRef?: React.RefObject<any>;
  mode?: 'edit' | 'preview';
  height?: string;
  onChange?: (value: string) => void;
}

const MzEditor = ({
  content = '',
  editorRef,
  mode = 'edit',
  height = '500px',
  onChange,
}: Props) => {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [editorContent, setEditorContent] = useState(content);

  if (mode === 'preview') {
    return <TuiViewer initialValue={content.trim() || ''} usageStatistics={false} plugins={[]} />;
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      {editorRef && (
        <TuiEditor
          key={`editor-${editorKey}`}
          ref={editorRef as any}
          initialValue={editorContent || ''}
          mode="wysiwyg"
          initialEditType="wysiwyg"
          previewStyle="tab"
          hideModeSwitch={false}
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr'],
            ['ul', 'ol', 'task'],
            ['table', 'link'],
            ['image'],
            ['code'],
            ['scrollSync'],
          ]}
          height={height}
          usageStatistics={false}
          theme="dark"
          onChange={() => {
            if (editorRef && typeof onChange === 'function') {
              const value = (editorRef as any).current?.getInstance().getMarkdown();
              onChange(value);
            }
          }}
        />
      )}
    </div>
  );
};
export default MzEditor;
