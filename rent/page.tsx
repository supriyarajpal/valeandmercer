import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function RentPage() {
  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 20px'}}>
          <div style={{marginBottom:'48px'}}>
            <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'16px'}}>Rentals</p>
            <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(36px,6vw,60px)',fontWeight:300,color:'#28231C',lineHeight:1.0,marginBottom:'16px'}}>Rental properties coming soon</h1>
            <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',maxWidth:'520px',marginBottom:'32px'}}>We are building our lettings portfolio across prime London. Register your interest and we will be in touch as soon as something available matches what you need.</p>
            <Link href="/register" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#28231C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Register Your Interest</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'2px',background:'#C8C0B4'}}>
            {[
              {area:'Canary Wharf, East London',desc:'Lettings coming shortly. Register to hear first.'},
              {area:'Notting Hill W11',desc:'Lettings across Notting Hill and Kensington coming soon.'},
              {area:'Kensington W8',desc:'Premium lettings in Kensington. Register now.'},
            ].map((item)=>(
              <Link key={item.area} href="/register" style={{textDecoration:'none',display:'block',background:'#28231C',padding:'32px 28px',minHeight:'180px',flexDirection:'column',justifyContent:'space-between'}}>
                <div>
                  <span style={{fontSize:'9px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'4px 10px',display:'inline-block',marginBottom:'14px'}}>To Let</span>
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#EFECE6',marginBottom:'8px'}}>{item.area}</h3>
                  <p style={{fontSize:'12px',color:'rgba(239,236,230,0.45)',lineHeight:1.7}}>{item.desc}</p>
                </div>
                <p style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',marginTop:'20px'}}>Register Interest</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

