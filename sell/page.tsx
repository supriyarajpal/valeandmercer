import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{background:'#28231C',padding:'120px 20px 80px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0}}>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80" alt="London property" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.2}} />
            <div style={{position:'absolute',inset:0,background:'rgba(40,35,28,0.85)'}} />
          </div>
          <div style={{position:'relative',zIndex:10,maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{maxWidth:'560px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                <div style={{width:'28px',height:'1px',background:'#A0845C'}} />
                <span style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C'}}>Selling</span>
              </div>
              <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(38px,7vw,68px)',fontWeight:300,color:'#EFECE6',lineHeight:0.95,marginBottom:'20px'}}>
                Sell your home<br/>for what it is<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>truly worth.</span>
              </h1>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'rgba(239,236,230,0.55)',maxWidth:'420px',marginBottom:'28px'}}>We price honestly and we negotiate hard. That combination tends to get good results.</p>
              <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.18em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'14px 28px',textDecoration:'none',display:'inline-block'}}>Get a Free Valuation</Link>
            </div>
          </div>
        </section>

        <section style={{background:'#EFECE6',padding:'72px 20px'}}>
          <div style={{maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'2px',background:'#C8C0B4',marginBottom:'56px'}}>
              {[
                {step:'01',title:'Free valuation',body:'We visit your property, assess the market, and give you a realistic price based on what the market is doing right now.'},
                {step:'02',title:'Professional presentation',body:'Good photography, a proper floorplan, and a description written by someone who has actually been inside.'},
                {step:'03',title:'Targeted marketing',body:'We focus on finding the right buyer, not just the first one.'},
                {step:'04',title:'Negotiation and completion',body:'We handle the negotiation and stay on top of the process so you are not left chasing anyone.'},
              ].map((s)=>(
                <div key={s.step} style={{background:'#EFECE6',padding:'32px 24px'}}>
                  <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'36px',fontWeight:300,color:'rgba(160,132,92,0.22)',lineHeight:1,marginBottom:'12px'}}>{s.step}</div>
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'20px',fontWeight:300,color:'#28231C',marginBottom:'8px'}}>{s.title}</h3>
                  <p style={{fontSize:'14px',lineHeight:2.0,color:'#6B6258'}}>{s.body}</p>
                </div>
              ))}
            </div>
            <div style={{maxWidth:'640px'}}>
              <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Why Vale and Mercer</p>
              <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,42px)',fontWeight:300,color:'#28231C',marginBottom:'16px'}}>Selling your home the right way</h2>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'14px'}}>The right buyer does not just want to know the square footage. They want to picture their life there. We write listings with that in mind.</p>
              <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'28px'}}>We keep our client numbers small so nothing gets missed.</p>
              <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#28231C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Book Your Free Valuation</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}






