import PhotosApiConfig from "../config/PhotosApiConfig.js";

// Mesmo formato aceito pela photos-api para os segmentos da chave.
const KEY_SEGMENT_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Cliente da photos-api, que grava as fotos no bucket S3 e as serve em `GET /images/{chave}`.
 */
class PhotosApiService {
  static isValidKeySegment(value) {
    return typeof value === "string" && KEY_SEGMENT_RE.test(value);
  }

  /** Chave do objeto: {manufacturer_code}/{color}/{manufacturer_code}_{color}_{position}.jpg */
  static buildPhotoKey(manufacturerCode, colorCode, position) {
    return `${manufacturerCode}/${colorCode}/${manufacturerCode}_${colorCode}_${position}.jpg`;
  }

  static buildImageUrl(key) {
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    return `${PhotosApiConfig.baseUrl}/images/${encodedKey}`;
  }

  /**
   * Verifica se a URL já aponta para a chave informada, ignorando query string e extensão
   * (há fotos migradas gravadas como .png/.webp).
   */
  static urlMatchesKey(url, key) {
    const withoutExtension = (pathname) => pathname.replace(/\.[^./]+$/, "");
    try {
      return (
        withoutExtension(new URL(url).pathname) ===
        withoutExtension(new URL(PhotosApiService.buildImageUrl(key)).pathname)
      );
    } catch {
      return false;
    }
  }

  /**
   * Envia uma foto JPEG e retorna a URL pública servida pela photos-api.
   * @param {{manufacturerCode: string, colorCode: string, position: number, buffer: Buffer}} args
   * @returns {Promise<string>}
   */
  static async uploadPhoto({ manufacturerCode, colorCode, position, buffer }) {
    if (!PhotosApiConfig.token) {
      throw new Error("PHOTOS_API_TOKEN não configurado no .env.");
    }

    const key = PhotosApiService.buildPhotoKey(manufacturerCode, colorCode, position);
    const form = new FormData();
    form.append("manufacturer_code", manufacturerCode);
    form.append("color", colorCode);
    form.append("position", String(position));
    form.append(
      "photo",
      new Blob([buffer], { type: "image/jpeg" }),
      key.split("/").pop(),
    );

    const response = await fetch(`${PhotosApiConfig.baseUrl}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${PhotosApiConfig.token}` },
      body: form,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        `Falha no upload da foto ${key} (HTTP ${response.status}): ${body.error || response.statusText}`,
      );
    }

    const { data } = await response.json();
    // A chave é reaproveitada quando a foto muda de posição; o `v` invalida o cache (max-age de 1 dia).
    return `${PhotosApiService.buildImageUrl(data?.key || key)}?v=${Date.now()}`;
  }

  /**
   * Baixa o binário de uma foto já gravada. Só aceita URLs da photos-api configurada.
   * @returns {Promise<Buffer>}
   */
  static async fetchPhoto(url) {
    const parsed = new URL(url);
    if (parsed.origin !== new URL(PhotosApiConfig.baseUrl).origin) {
      throw new Error(`URL de foto fora da photos-api: ${url}`);
    }

    const response = await fetch(parsed);
    if (!response.ok) {
      throw new Error(`Falha ao baixar a foto ${url} (HTTP ${response.status}).`);
    }
    return Buffer.from(await response.arrayBuffer());
  }
}

export default PhotosApiService;
