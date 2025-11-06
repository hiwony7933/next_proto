import { NextResponse, type NextRequest } from "next/server";

// ENV 구성 예시
// TENANT_SK_HOST=skshieldus.example.com
// TENANT_CAPS_HOST=capshome.example.com
// TENANT_ADT_HOST=adtcaps.example.com

const hostToTenant: Record<string, string> = {
  [process.env.TENANT_SK_HOST ?? ""]: "sk",
  [process.env.TENANT_CAPS_HOST ?? ""]: "cap",
  [process.env.TENANT_ADT_HOST ?? ""]: "adt",
};

function resolveTenantByHost(host?: string | null): string | null {
  if (!host) return null;
  // 정규화: 포트 제거
  const normalized = host.split(":")[0].toLowerCase();
  // 1) ENV 매핑 우선
  const byEnv = hostToTenant[normalized] ?? null;
  if (byEnv) return byEnv;
  // 2) 로컬/서브도메인 규칙: sk.localhost, cap.localhost, adt.localhost
  const subMatch = normalized.match(/^(sk|cap|adt)\./);
  if (subMatch) return subMatch[1];
  return null;
}

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const host = req.headers.get("host");
  const tenant = resolveTenantByHost(host);
  const [hostnameOnly, port] = (host ?? "").split(":");
  const isLocalBase =
    hostnameOnly === "localhost" || hostnameOnly === "127.0.0.1";

  // 로컬 개발: ?tenant=sk|cap|adt 로 강제
  const explicitTenant = nextUrl.searchParams.get("tenant");
  const devDefault =
    (process.env.NEXT_PUBLIC_DEV_TENANT as "sk" | "cap" | "adt" | undefined) ??
    undefined;
  const activeTenant =
    (explicitTenant as "sk" | "cap" | "adt" | null) ??
    tenant ??
    devDefault ??
    null;

  // 요청 헤더에 x-tenant 주입(레이아웃 등 서버 컴포넌트에서 활용)
  const requestHeaders = new Headers(req.headers);
  if (activeTenant) {
    requestHeaders.set("x-tenant", activeTenant);
  }

  // localhost 루트는 포털로 유지: / 경로에서는 리라이트하지 않음
  if (!activeTenant || (isLocalBase && nextUrl.pathname === "/")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // localhost에서 /sk|/cap|/adt 진입 시 각 서브도메인으로 리다이렉트하여 경로 노출 제거
  if (isLocalBase) {
    const match = nextUrl.pathname.match(/^\/(sk|cap|adt)(\/.*)?$/);
    if (match) {
      const seg = match[1] as "sk" | "cap" | "adt";
      const rest = match[2] || "/";
      const targetHost = `${seg}.localhost${port ? ":" + port : ""}`;
      const redirectUrl = new URL(`${nextUrl.protocol}//${targetHost}${rest}`);
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  // 서브도메인(예: sk.localhost 또는 실제 도메인)에서 테넌트 접두어가 포함된 경우: 접두어 제거로 정규화
  if (!isLocalBase && activeTenant) {
    const prefixed = nextUrl.pathname.startsWith(`/${activeTenant}`);
    if (prefixed) {
      const rest =
        nextUrl.pathname.replace(new RegExp(`^/${activeTenant}`), "") || "/";
      const redirectUrl = new URL(nextUrl.toString());
      redirectUrl.pathname = rest;
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  // 이미 테넌트 경로면 통과 (단, 로컬 베이스에서만 허용 - 서브도메인은 위에서 정규화 처리됨)
  if (isLocalBase && nextUrl.pathname.startsWith(`/${activeTenant}`)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 정적 파일/Next 내부 경로는 통과
  if (
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/api") ||
    nextUrl.pathname.startsWith("/favicon") ||
    nextUrl.pathname.startsWith("/assets") ||
    nextUrl.pathname.startsWith("/public") ||
    nextUrl.pathname.startsWith("/images") ||
    nextUrl.pathname.startsWith("/icons") ||
    nextUrl.pathname.startsWith("/fonts") ||
    nextUrl.pathname.startsWith("/videos") ||
    nextUrl.pathname.startsWith("/guide")
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 테넌트 폴더로 rewrite
  const rewriteUrl = nextUrl.clone();
  rewriteUrl.pathname = `/${activeTenant}${nextUrl.pathname}`;
  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|assets|public|images|icons|fonts|videos|guide).*)",
  ],
};
