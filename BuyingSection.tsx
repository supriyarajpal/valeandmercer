import Link from 'next/link'

export default function BuyingSection() {
  const css = '@media(min-width:768px){.buy-grid{grid-template-columns:1fr 1fr!important}}'
  return (
    <section style={{background:'#EFECE6',padding:'80px 20px',borderTop:'0.5px solid #DDD7CC'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div className="buy-grid" style={{display:'grid',gridTemplateColumns:'1fr',gap:'60px',alignItems:'center'}}>
          <div style={{position:'relative',height:'440px',overflow:'hidden'}}>
            <img src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&q=85" alt="London street" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(40,35,28,0.35) 0%,transparent 60%)'}} />
          </div>
          <div>
            <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Our Services</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(28px,5vw,46px)',fontWeight:300,color:'#4A4036',lineHeight:1.05,marginBottom:'14px'}}>
              For landlords who care<br/>and tenants who deserve<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>better than average.</span>
            </h2>
            <p style={{fontSize:'13px',lineHeight:1.9,color:'#6B6258',marginBottom:'20px'}}>
              The right tenant doesn&rsquo;t happen by accident. It happens because we took the time to understand what you actually need.
            </p>
            <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258',marginBottom:'24px'}}>
              We Sit. We Listen. We Find. Straight and Simple
            </p>
            <div style={{display:'flex',flexDirection:'column',marginBottom:'24px'}}>
              {[
                'Straight talking from day one',
                'Tenants vetted properly. Landlords kept informed.',
                'Properties before they reach the portals',
                'One person with you from first call to keys handed over',
              ].map((item)=>(
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'6px 0',borderBottom:'0.5px solid #DDD7CC'}}>
                  <div style={{width:'4px',height:'4px',borderRadius:'50%',background:'#A0845C',flexShrink:0,marginTop:'7px'}} />
                  <span style={{fontSize:'13px',color:'#6B6258',lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/valuations" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#28231C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Get in Touch</Link>
          </div>
        </div>
      </div>
    </section>
  )
}











