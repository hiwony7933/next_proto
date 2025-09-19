export type TenantKey = 'sk' | 'cap' | 'adt';

export const TENANT_HOST_ENV: Record<TenantKey, string> = {
  sk: 'TENANT_SK_HOST',
  cap: 'TENANT_CAPS_HOST',
  adt: 'TENANT_ADT_HOST',
};

export function getTenantFromHost(host?: string | null): TenantKey | null {
  if (!host) return null;
  const normalized = host.split(':')[0].toLowerCase();
  const entries = (Object.keys(TENANT_HOST_ENV) as TenantKey[]).map((key) => [
    process.env[TENANT_HOST_ENV[key]] ?? '',
    key,
  ]) as Array<[string, TenantKey]>;
  for (const [envHost, tenant] of entries) {
    if (envHost && envHost.toLowerCase() === normalized) return tenant;
  }
  return null;
}

export function isTenantPath(pathname: string): boolean {
  return /^\/(sk|cap|adt)\b/.test(pathname);
}
