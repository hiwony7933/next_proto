'use client';

import dynamic from 'next/dynamic';

const registry: Record<string, any> = {
  'ui-button': dynamic(() => import('../../ui/sampleUiButton'), { ssr: false }),
  'ui-alert': dynamic(() => import('../../ui/sampleUiAlert'), { ssr: false }),
  'form-date-range-picker': dynamic(() => import('../../form/sampleFormDateRangePicker'), {
    ssr: false,
  }),
  'form-date-picker': dynamic(() => import('../../form/sampleFormDatePicker'), { ssr: false }),
  'form-file-upload': dynamic(() => import('../../form/sampleFormFileUpload'), { ssr: false }),
  'form-select-box': dynamic(() => import('../../form/sampleFormSelectBox'), { ssr: false }),
  'form-input-box': dynamic(() => import('../../form/sampleFormInputBox'), { ssr: false }),
  'form-text-area': dynamic(() => import('../../form/sampleMzTextArea'), { ssr: false }),
  'form-editor': dynamic(() => import('../../form/sampleMzEditor'), { ssr: false }),
  'form-image-type': dynamic(() => import('../../form/sampleFormImageType'), { ssr: false }),
  'form-checkbox': dynamic(() => import('../../form/sampleFormCheckBox'), { ssr: false }),
  'form-phone-number': dynamic(() => import('../../form/sampleFormPhoneNumber'), { ssr: false }),
  'form-address': dynamic(() => import('../../form/sampleFormAddress'), { ssr: false }),
  'ui-faq': dynamic(() => import('../../ui/sampleUiFaq'), { ssr: false }),
  'ui-modal': dynamic(() => import('../../ui/sampleUiModal'), { ssr: false }),
  'ui-tabs': dynamic(() => import('../../ui/sampleUiTabs'), { ssr: false }),
  'ui-tooltip': dynamic(() => import('../../ui/sampleUiTooltip'), { ssr: false }),
  'ui-tree': dynamic(() => import('../../ui/sampleUiTree'), { ssr: false }),
  'ui-tree-new': dynamic(() => import('../../ui/sampleUiTreeNew'), { ssr: false }),
  'corner-banner001': dynamic(() => import('../../corner/sampleCornerBanner001'), { ssr: false }),
  'corner-banner002': dynamic(() => import('../../corner/sampleCornerBanner002'), { ssr: false }),
  'corner-block001': dynamic(() => import('../../corner/sampleCornerBlock001'), { ssr: false }),
  'corner-block002': dynamic(() => import('../../corner/sampleCornerBlock002'), { ssr: false }),
  'corner-check001': dynamic(() => import('../../corner/sampleCornerCheck001'), { ssr: false }),
  'corner-banner003': dynamic(() => import('../../corner/sampleCornerBanner003'), { ssr: false }),
  'corner-video001': dynamic(() => import('../../corner/sampleCornerVideo001'), { ssr: false }),
  'corner-faq001': dynamic(() => import('../../corner/sampleCornerFaq001'), { ssr: false }),
  'corner-category001': dynamic(() => import('../../corner/sampleCornerCategory001'), {
    ssr: false,
  }),
  'corner-blog001': dynamic(() => import('../../corner/sampleCornerBlog001'), { ssr: false }),
};

export default function ClientSample({ slug }: { slug: string }) {
  const Component = registry[slug];
  if (!Component) return null;
  return <Component />;
}
