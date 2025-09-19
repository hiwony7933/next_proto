import { notFound } from 'next/navigation';
import ClientSample from './ClientSample';

export default async function SamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allowed = new Set([
    'ui-button',
    'ui-alert',
    'form-date-picker',
    'form-date-range-picker',
    'form-file-upload',
    'form-checkbox',
    'form-phone-number',
    'form-address',
    'form-input-box',
    'form-image-type',
    'form-select-box',
    'form-text-area',
    'form-editor',
    'ui-tree-new',
    'ui-tree',
    'ui-tooltip',
    'ui-faq',
    'ui-modal',
    'ui-tabs',
    'corner-banner001',
    'corner-banner002',
    'corner-block001',
    'corner-block002',
    'corner-check001',
    'corner-banner003',
    'corner-video001',
    'corner-faq001',
    'corner-category001',
    'corner-blog001',
  ]);
  if (!allowed.has(slug)) return notFound();
  return <ClientSample slug={slug} />;
}
