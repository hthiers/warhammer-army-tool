import { useEffect } from 'react'
import styles from './ImageModal.module.css'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

export function ImageModal({ src, alt, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        <img className={styles.img} src={src} alt={alt} />
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
    </div>
  )
}
