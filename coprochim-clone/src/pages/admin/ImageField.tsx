/**
 * Reusable image picker for the control panel.
 *
 * Supports two workflows:
 * 1. Uploading a local file through `POST /api/upload` (multipart/form-data)
 * 2. Typing or pasting an existing image URL / path (e.g. `/images/products/xyz.jpg`)
 */
import { useRef, useState } from 'react'
import { CloseIcon, UploadIcon } from '../../components/common/Icons'
import { ApiError, uploadFile } from '../../lib/api'
import { useAdminShell } from './adminShell'

interface ImageFieldProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

/**
 * Mirrors the server's `ALLOWED_EXTENSIONS` so an unsupported file is rejected
 * with a clear message before anything is sent over the network.
 */
const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'jfif',
  'png',
  'webp',
  'gif',
  'svg',
  'avif',
  'bmp',
  'pdf',
]
/** Mirrors the server's multer `limits.fileSize` (16 MB). */
const MAX_FILE_SIZE = 16 * 1024 * 1024

function extensionOf(name: string): string {
  const part = name.split('.').pop()
  return part && part !== name ? part.toLowerCase() : ''
}

export function ImageField({ value, onChange, label }: ImageFieldProps) {
  const { t, notify } = useAdminShell()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  // The URL the browser failed to render (broken path / missing file). Keying on
  // the value itself means a new URL automatically gets a fresh chance to render.
  const [brokenFor, setBrokenFor] = useState<string | null>(null)
  const broken = value !== '' && brokenFor === value

  /** Turns raw API failures into the panel language. */
  const describeError = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 401) return t('products.sessionExpired')
      if (err.status === 413) return t('products.tooLarge')
      if (err.status === 0) return t('login.unreachable')
      if (/unsupported file type/i.test(err.message)) return t('products.badType')
      return err.message || t('products.uploadFailed')
    }
    return t('products.uploadFailed')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset first so picking the same file twice re-triggers the change event.
    e.target.value = ''

    const extension = extensionOf(file.name)
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      notify(t('products.badType'), 'error')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      notify(t('products.tooLarge'), 'error')
      return
    }

    setUploading(true)
    try {
      const uploadedUrl = await uploadFile(file)
      onChange(uploadedUrl)
      notify(t('products.uploaded'), 'ok')
    } catch (err) {
      notify(describeError(err), 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="admin-image">
        {value && !broken ? (
          <img
            src={value}
            alt=""
            className="admin-image__preview"
            onError={() => setBrokenFor(value)}
          />
        ) : value && broken ? (
          <div className="admin-image__empty" style={{ color: 'var(--color-danger)' }}>
            {t('products.previewFailed')}
          </div>
        ) : (
          <div className="admin-image__empty">{t('ui.preview')}</div>
        )}

        <div className="admin-image__controls">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/... ou https://..."
              style={{ flex: 1 }}
            />
            {value && (
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--icon"
                onClick={() => onChange('')}
                title={t('ui.cancel')}
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <UploadIcon size={14} />
              {uploading ? t('products.uploading') : t('products.upload')}
            </button>

            <span className="text-muted" style={{ fontSize: '0.74rem' }}>
              {t('products.imageHint')}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif,.bmp,application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}