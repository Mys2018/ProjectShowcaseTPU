import type { OAuthExchangeParams } from "@/entities/user";

const STORAGE_KEYS = {
  CODE_VERIFIER: "code_verifier",
  STATE: "oauth_state",
} as const;

const OAUTH_AUTHORIZE_URL = import.meta.env.VITE_OAUTH_AUTHORIZE_URL;

class PkceService {
  prepareAuth = async () => {
    const codeVerifier = this.generateRandomString(64);
    sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

    const challenge = await this.generateChallenge(codeVerifier);
    const state = this.generateRandomString(32);
    sessionStorage.setItem(STORAGE_KEYS.STATE, state);

    return { challenge, state };
  };

  async startAuth() {
    const clientId = import.meta.env.VITE_TPU_OAUTH_CLIENT_ID;

    if (!clientId) {
      throw new Error("Не задан VITE_TPU_OAUTH_CLIENT_ID");
    }

    const { challenge, state } = await this.prepareAuth();
    const redirectUri = window.location.origin; 
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.assign(`${OAUTH_AUTHORIZE_URL}?${params.toString()}`);
  }

  parseCallback(query: string): OAuthExchangeParams | null {
    const params = new URLSearchParams(query);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = sessionStorage.getItem(STORAGE_KEYS.STATE);
    const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

    if (code && state === savedState && codeVerifier) {
      this.clear();
      return { code, codeVerifier };
    }
    return null;
  }

  clear() {
    sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
    sessionStorage.removeItem(STORAGE_KEYS.STATE);
  }

  private generateRandomString(len: number): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const values = new Uint8Array(len);
    crypto.getRandomValues(values);
    return Array.from(values)
      .map((x) => charset[x % charset.length])
      .join("");
  }

  private async generateChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }
}

export const pkceService = new PkceService();
