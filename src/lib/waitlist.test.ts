import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitWaitlistEntry } from './waitlist';

describe('submitWaitlistEntry', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_WAITLIST_SHEET_URL', '');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends nothing when no endpoint is configured', async () => {
    await submitWaitlistEntry({ email: 'a@b.co', role: 'Interior Designer', tier: 'Pro' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to Web3Forms with email, discipline, tier and timestamp', async () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-key');

    await submitWaitlistEntry({ email: 'a@b.co', role: 'Interior Designer', tier: 'Pro' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.access_key).toBe('test-key');
    expect(body.email).toBe('a@b.co');
    expect(body.discipline).toBe('Interior Designer');
    expect(body.tier).toBe('Pro');
    expect(typeof body.timestamp).toBe('string');
    expect(body.subject).toContain('Pro');
  });

  it('also fires the Google Sheets webhook when configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-key');
    vi.stubEnv('NEXT_PUBLIC_WAITLIST_SHEET_URL', 'https://script.google.com/macros/s/x/exec');

    await submitWaitlistEntry({ email: 'a@b.co', role: 'Maker', tier: 'Studio' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const urls = fetchMock.mock.calls.map((call) => call[0]);
    expect(urls).toContain('https://api.web3forms.com/submit');
    expect(urls).toContain('https://script.google.com/macros/s/x/exec');
  });

  it('never throws when a sink rejects', async () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-key');
    vi.stubEnv('NEXT_PUBLIC_WAITLIST_SHEET_URL', 'https://script.google.com/macros/s/x/exec');
    fetchMock.mockRejectedValue(new Error('network down'));

    await expect(
      submitWaitlistEntry({ email: 'a@b.co', role: 'Maker', tier: 'Studio' })
    ).resolves.toBeUndefined();
  });

  it('skips sending under automation (navigator.webdriver)', async () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-key');
    vi.stubGlobal('navigator', { webdriver: true });

    await submitWaitlistEntry({ email: 'a@b.co', role: 'Maker', tier: 'Studio' });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
