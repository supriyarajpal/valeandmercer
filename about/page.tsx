import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{background:'#28231C',minHeight:'70vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',padding:'120px 20px 80px'}}>
          <div style={{position:'absolute',inset:0}}>
            <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80" alt="London" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.25}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(40,35,28,0.98) 40%,rgba(40,35,28,0.6) 100%)'}} />
          </div>
          <div style={{position:'relative',zIndex:10,maxWidth:'1280px',margin:'0 auto',width:'100%'}}>
            <div style={{maxWidth:'560px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
                <div style={{width:'32px',height:'1px',background:'#A0845C'}} />
                <span style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C'}}>Our Story</span>
              </div>
              <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(38px,7vw,68px)',fontWeight:300,color:'#EFECE6',lineHeight:0.95,marginBottom:'24px'}}>
                Home is not just<br/>a place.<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>It is a feeling.</span>
              </h1>
              <p style={{fontSize:'15px',lineHeight:2.1,color:'rgba(239,236,230,0.55)',maxWidth:'400px'}}>
                The search should feel as considered as the decision itself.
              </p>
            </div>
          </div>
        </section>

        <section style={{background:'#EFECE6',padding:'72px 20px'}}>
          <div style={{maxWidth:'760px',margin:'0 auto'}}>
            <p style={{fontSize:'15px',lineHeight:2.1,color:'#6B6258',marginBottom:'20px'}}>
              Vale &amp; Mercer exists for clients who care not only about the outcome, but about the way the process is handled. We are a team, working closely, keeping clients informed with clarity and discretion, and managing the detail properly in the background.
            </p>
            <p style={{fontSize:'15px',lineHeight:2.1,color:'#6B6258',marginBottom:'20px'}}>
              Whether you are a landlord, a tenant, a first-time buyer or someone who has done this before and wants it done properly this time — the standard should be the same. Attentive, straight, and personal from first call to final key.
            </p>
          </div>
        </section>

        <section style={{background:'#DDD7CC',padding:'72px 20px'}}>
          <div style={{maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'2px',background:'#C8C0B4'}}>
              {[
                {icon:'01',title:'We listen first',body:'Before we show you anything, we want to understand what you are actually looking for. Not just the number of bedrooms. What does your day-to-day look like? What matters most? We work from there.'},
                {icon:'02',title:'We tell you the truth',body:'If something is not right for you, we say so. We would rather lose a deal than watch you make a decision you will regret.'},
                {icon:'03',title:'We see it through',body:'From your first enquiry to the day you get your keys, you deal with the same person. No handoffs, no being passed around.'},
              ].map((item)=>(
                <div key={item.icon} style={{background:'#EFECE6',padding:'36px 28px'}}>
                  <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'40px',fontWeight:300,color:'rgba(160,132,92,0.2)',lineHeight:1,marginBottom:'16px'}}>{item.icon}</div>
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#4A4036',marginBottom:'12px'}}>{item.title}</h3>
                  <p style={{fontSize:'13px',lineHeight:1.9,color:'#6B6258'}}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{background:'#EFECE6',padding:'80px 20px'}}>
          <div style={{maxWidth:'880px',margin:'0 auto',position:'relative'}}>
            <div aria-hidden style={{position:'absolute',inset:'-40px',background:'radial-gradient(closest-side, rgba(160,132,92,0.9) 0%, rgba(122,96,62,0.6) 35%, rgba(74,55,32,0.3) 65%, rgba(40,35,28,0) 100%)',filter:'blur(70px)',zIndex:0,pointerEvents:'none'}} />
            <div style={{position:'relative',zIndex:1,textAlign:'center',background:'rgba(40,35,28,0.82)',backdropFilter:'blur(14px) saturate(140%)',WebkitBackdropFilter:'blur(14px) saturate(140%)',padding:'64px 32px',boxShadow:'0 30px 80px -10px rgba(122,96,62,0.55), 0 0 0 1px rgba(160,132,92,0.18) inset',overflow:'hidden'}}>
              <div aria-hidden style={{position:'absolute',inset:0,background:'radial-gradient(120% 80% at 50% 0%, rgba(160,132,92,0.35) 0%, rgba(40,35,28,0) 60%)',filter:'blur(40px)',pointerEvents:'none'}} />
              <div style={{position:'relative'}}>
                <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,42px)',fontWeight:400,color:'#FFFFFF',lineHeight:1.1,marginBottom:'14px',textShadow:'0 2px 24px rgba(40,35,28,0.6)'}}>Ready to have a conversation?</h2>
                <p style={{fontSize:'14px',lineHeight:1.9,color:'rgba(255,251,240,0.9)',marginBottom:'28px',maxWidth:'380px',margin:'0 auto 28px',textShadow:'0 1px 12px rgba(40,35,28,0.5)'}}>No pitch. No pressure. Just a straightforward chat about what you need.</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:'12px',justifyContent:'center'}}>
                  <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#C9A876',color:'#1A1612',padding:'13px 24px',textDecoration:'none',display:'inline-block',fontWeight:600}}>Book a Valuation</Link>
                  <Link href="/register" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',border:'1px solid rgba(255,251,240,0.55)',color:'#FFFBF0',padding:'13px 24px',textDecoration:'none',display:'inline-block',fontWeight:500}}>Get Notified of New Listings</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}



