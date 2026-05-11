import Pricing from '@/components/sections/Pricing'
import { BidMasterLogo } from '@/components/ui/Logo'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div style={{ background: '#fcfdfe', minHeight: '100vh' }}>
       <header className="w-full px-8 py-5" style={{ borderBottom: '1px solid #e7e9ed' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/"><BidMasterLogo height={36} /></Link>
          </div>
       </header>
       <div className="py-20">
          <Pricing />
       </div>
    </div>
  )
}
