import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function LetPage() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{background:'#28231C',padding:'120px 20px 80px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0}}>
            <img src="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1400&q=80" alt="London letting" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.2}} />
            <div style={{position:'absolute',inset:0,background:'rgba(40,35,28,0.85)'}} />
          </div>
          <div style={{position:'relative',zIndex:10,maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{maxWidth:'560px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                <div style={{width:'28px',height:'1px',background:'#A0845C'}} />
                <span style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C'}}>Lettings</span>
              </div>
              <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(38px,7vw,68px)',fontWeight:300,color:'#EFECE6',lineHeight:0.95,marginBottom:'20px'}}>
                Let your property<br/>to tenants who<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>treat it like home.</span>
              </h1>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'rgba(239,236,230,0.55)',maxWidth:'420px',marginBottom:'28px'}}>We take the time to find the right tenant, not just the first available one.</p>
              <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.18em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'14px 28px',textDecoration:'none',display:'inline-block'}}>Speak to Us About Letting</Link>
            </div>
          </div>
        </section>

        <section style={{background:'#EFECE6',padding:'72px 20px'}}>
          <div style={{maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'2px',background:'#C8C0B4',marginBottom:'56px'}}>
              {[
                {title:'Tenant sourcing',body:'We advertise your property to qualified tenants and conduct thorough referencing. You only meet people who have already been vetted.'},
                {title:'Honest rental pricing',body:'We set a realistic price that attracts good tenants quickly.'},
                {title:'Tenancy management',body:'We handle the paperwork and keep everything on track.'},
                {title:'Student lets',body:'Straightforward support for landlords letting to students. No jargon, no surprises.'},
              ].map((s)=>(
                <div key={s.title} style={{background:'#EFECE6',padding:'32px 24px'}}>
                  <div style={{width:'18px',height:'1px',background:'#A0845C',marginBottom:'14px'}} />
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'20px',fontWeight:300,color:'#28231C',marginBottom:'8px'}}>{s.title}</h3>
                  <p style={{fontSize:'14px',lineHeight:2.0,color:'#6B6258'}}>{s.body}</p>
                </div>
              ))}
            </div>
            <div style={{maxWidth:'640px'}}>
              <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>For Landlords</p>
              <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,42px)',fontWeight:300,color:'#28231C',marginBottom:'16px'}}>Why referencing matters</h2>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'14px'}}>A bad tenant costs more than a short void period. We reference properly and only proceed when we are satisfied.</p>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'28px'}}>Whether you have one property or several, the level of care is the same.</p>
              <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#28231C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Discuss Your Property</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}






