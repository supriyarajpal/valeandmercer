import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function BuyPage() {
  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 20px'}}>
          <div style={{marginBottom:'48px'}}>
            <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'16px'}}>Properties</p>
            <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(36px,6vw,60px)',fontWeight:300,color:'#4A4036',lineHeight:1.0,marginBottom:'16px'}}>Properties coming soon</h1>
            <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',maxWidth:'520px',marginBottom:'32px'}}>Good properties move quickly and often quietly. Tell us what you&rsquo;re looking for and we&rsquo;ll reach out before anything reaches the open market.<br/>Straight communication. No pressure. Just the right home when it arrives.</p>
            <Link href="/register" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#28231C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Register Your Interest</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'40px',background:'transparent',padding:'40px 0'}}>
            {[
              {area:'Canary Wharf, East London',type:'To Let',desc:'Lettings coming shortly. Register to hear first.'},
              {area:'Notting Hill W11',type:'To Let',desc:'Lettings across Notting Hill and Kensington coming soon.'},
              {area:'Chelsea SW3',type:'To Let',desc:'Premium lettings in Chelsea. Register your interest now.'},
            ].map((item)=>(
              <Link key={item.area} href="/register" style={{textDecoration:'none',display:'block',background:'transparent',position:'relative',minHeight:'200px'}}>
                <div aria-hidden style={{position:'absolute',inset:'-60px',background:'radial-gradient(closest-side, rgba(160,132,92,0.9) 0%, rgba(122,96,62,0.6) 35%, rgba(74,55,32,0.25) 65%, rgba(40,35,28,0) 100%)',filter:'blur(60px)',zIndex:0,pointerEvents:'none'}} />
                <div style={{position:'absolute',inset:0,background:'rgba(40,35,28,0.85)',boxShadow:'0 30px 80px -10px rgba(122,96,62,0.6), 0 0 0 1px rgba(160,132,92,0.2) inset',zIndex:1}} />
                <div style={{position:'relative',zIndex:2,padding:'32px 28px',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                  <div>
                    <span style={{fontSize:'9px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'4px 10px',display:'inline-block',marginBottom:'14px'}}>{item.type}</span>
                    <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#EFECE6',marginBottom:'8px'}}>{item.area}</h3>
                    <p style={{fontSize:'12px',color:'rgba(239,236,230,0.45)',lineHeight:1.7}}>{item.desc}</p>
                  </div>
                  <p style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',marginTop:'20px'}}>Register Interest</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

