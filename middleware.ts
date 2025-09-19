import { NextResponse, type NextRequest } from 'next/server';

// ENV 구성 예시
// TENANT_SK_HOST=skshieldus.example.com
// TENANT_CAPS_HOST=capshome.example.com
// TENANT_ADT_HOST=adtcaps.example.com

const hostToTenant: Record<string, string> = {
  [process.env.TENANT_SK_HOST ?? '']: 'sk',
  [process.env.TENANT_CAPS_HOST ?? '']: 'cap',
  [process.env.TENANT_ADT_HOST ?? '']: 'adt',
};

function resolveTenantByHost(host?: string | null): string | null {
  if (!host) return null;
  // 정규화: 포트 제거
  const normalized = host.split(':')[0].toLowerCase();
  return hostToTenant[normalized] ?? null;
}

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const host = req.headers.get('host');
  const tenant = resolveTenantByHost(host);

  // 로컬 개발: ?tenant=sk|cap|adt 로 강제
  const explicitTenant = nextUrl.searchParams.get('tenant');
  const activeTenant = (explicitTenant as 'sk' | 'cap' | 'adt' | null) ?? tenant;

  if (!activeTenant) {
    return NextResponse.next();
  }

  // 이미 테넌트 경로면 통과
  if (nextUrl.pathname.startsWith(`/${activeTenant}`)) {
    return NextResponse.next();
  }

  // 정적 파일/Next 내부 경로는 통과
  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/api') ||
    nextUrl.pathname.startsWith('/favicon') ||
    nextUrl.pathname.startsWith('/assets') ||
    nextUrl.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // 테넌트 폴더로 rewrite
  const rewriteUrl = nextUrl.clone();
  rewriteUrl.pathname = `/${activeTenant}${nextUrl.pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets|public).*)'],
};
