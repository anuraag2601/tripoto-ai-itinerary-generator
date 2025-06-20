/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_MAPS: string
  readonly VITE_ENABLE_PDF_DOWNLOAD: string
  readonly VITE_ENABLE_SHARING: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_ALLOWED_EMBED_DOMAINS: string
  readonly VITE_CACHE_DURATION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 