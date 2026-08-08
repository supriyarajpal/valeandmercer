import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Instant Valuation',
  description: 'Get an instant online estimate of your property value in seconds. Vale and Mercer will follow up with a full, tailored valuation for London lettings and sales.',
  alternates: { canonical: '/instant-valuation' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Instant Valuation', item: SITE_URL + '/instant-valuation' },
  ],
}

export default function InstantValuationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main style={{background:'var(--surface)',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Valuation</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'var(--text)',marginBottom:'12px'}}>Instant valuation</h1>
          <p style={{fontSize:'14px',lineHeight:1.9,color:'var(--text-muted)',marginBottom:'32px',maxWidth:'560px'}}>Enter a few details for an instant online estimate of your property&apos;s value. It&apos;s a starting guide only. A member of the Vale and Mercer team will follow up to arrange a full, tailored valuation.</p>

          <div style={{border:'0.5px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--surface-3)'}}>
            <iframe
              frameBorder="0"
              src="https://valeandmercer.valuations.homeflow.co.uk/"
              title="Instant property valuation"
              style={{display:'block',width:'100%',height:'800px',minHeight:'80vh',border:0}}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
