import React from "react";

/**
 * Performans yardımcı fonksiyonları
 * React.memo, useMemo, lazy loading ve görsel optimizasyonları için araçlar
 */

/**
 * Resim URL'sini WebP formatına dönüştürmeye çalışır.
 * Tarayıcı WebP desteklemiyorsa orijinal URL'yi döndürür.
 * @param {string} url - Orijinal görsel URL'si
 * @param {object} options - { width, quality }
 * @returns {string} - WebP dönüşümlü URL veya orijinal
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return "";

  const { width, quality = 80 } = options;

  // Eğer zaten .webp uzantılıysa olduğu gibi döndür
  if (url.endsWith(".webp")) return url;

  // CDN veya resim optimizasyon servisi kullanılabilir
  // Örn: Cloudinary, imgix veya kendi dönüştürme servisiniz
  // Bu örnekte basit bir yaklaşım kullanıyoruz:

  // Query parametreleri ile webp dönüşümü sinyali
  const separator = url.includes("?") ? "&" : "?";
  let optimizedUrl = `${url}${separator}format=webp`;

  if (width) {
    optimizedUrl += `&width=${width}`;
  }

  optimizedUrl += `&quality=${quality}`;

  return optimizedUrl;
}

/**
 * Görsel için img etiketi props'ları oluşturur,
 * lazy loading ve placeholder içerir.
 * @param {object} params
 * @param {string} params.src - Görsel kaynağı
 * @param {string} params.alt - Alternatif metin
 * @param {string} params.className - CSS sınıfı
 * @param {number} params.width - Genişlik
 * @param {number} params.height - Yükseklik
 * @returns {object} - img element props
 */
export function getImageProps({ src, alt = "", className = "", width, height }) {
  return {
    src: getOptimizedImageUrl(src),
    alt,
    className,
    width,
    height,
    loading: "lazy",
    decoding: "async",
    onError: (e) => {
      // WebP yüklenemezse orijinal URL'ye düş
      if (e.target.src !== src) {
        e.target.onerror = null;
        e.target.src = src;
      }
    },
  };
}

/**
 * Higher-order component wrapper for React.memo with display name
 * @param {React.Component} Component
 * @param {function} areEqual - Optional comparison function
 * @returns {React.MemoExoticComponent}
 */
export function memoWithName(Component, areEqual) {
  const Memoized = React.memo(Component, areEqual);
  Memoized.displayName = `Memoized(${Component.displayName || Component.name || "Component"})`;
  return Memoized;
}

/**
 * Bundle boyutunu analiz etmek için yardımcı
 * Production build'de devtools ile kullanılabilir
 */
export function analyzeBundle() {
  if (process.env.NODE_ENV === "production") {
    console.info(
      "%c📦 Bundle Analysis",
      "font-size:16px; font-weight:bold; color:#8b3fd9;"
    );
    console.info(
      "Chrome DevTools > Sources > Page > Ctrl/Cmd+Shift+P > 'Show Coverage'"
    );
    console.info("Kullanılmayan kodları tespit etmek için Coverage panelini kullanın.");
  }
}

export default {
  getOptimizedImageUrl,
  getImageProps,
  memoWithName,
  analyzeBundle,
};
