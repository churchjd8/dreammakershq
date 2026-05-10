// Minimal Dropbox client. Uses a long-lived refresh token to mint short-lived
// access tokens, then uploads via /2/files/upload.

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  if (!refreshToken || !appKey || !appSecret) {
    throw new Error("Dropbox credentials missing (DROPBOX_REFRESH_TOKEN/APP_KEY/APP_SECRET)");
  }

  const basic = Buffer.from(`${appKey}:${appSecret}`).toString("base64");
  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Dropbox token refresh failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

// Dropbox-API-Arg must be 7-bit ASCII. Escape any non-ASCII codepoints in the JSON.
function asciiEscape(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    out += code > 0x7f ? `\\u${code.toString(16).padStart(4, "0")}` : s[i];
  }
  return out;
}

export type DropboxUploadResult = { path: string; size: number };

export async function uploadDocxToDropbox(
  buffer: Buffer,
  destPath: string,
): Promise<DropboxUploadResult> {
  const token = await getAccessToken();

  const apiArg = JSON.stringify({
    path: destPath,
    mode: "add",
    autorename: true,
    mute: true,
    strict_conflict: false,
  });

  const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": asciiEscape(apiArg),
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Dropbox upload failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { path_display: string; size: number };
  return { path: data.path_display, size: data.size };
}
