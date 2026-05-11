/* eslint-disable @next/next/no-img-element */
export function BidMasterLogo({ height = 36, darkBg = false }: { height?: number; darkBg?: boolean }) {
  const src = darkBg ? '/logo-white.svg' : '/logo.svg'
  return (
    <img src={src} alt="BidMaster" style={{ height: `${height}px`, width: 'auto', display: 'block' }} />
  )
}
