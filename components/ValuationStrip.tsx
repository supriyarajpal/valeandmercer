import Link from 'next/link'

export default function ValuationStrip() {
  const css = '@media(min-width:768px){.val-grid{grid-template-columns:1fr 1fr!important}}'
  return (
    <section style={{background:'#28231C',padding:'80px 20px'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div className='val-grid' style={{display:'grid',gridTemplateColumns:'1fr',gap:'48px',alignItems:'center'}}>
          <div>
            <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Free Valuation</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(28px,5vw,46px)',fontWeight:300,color:'#EFECE6',lineHeight:1.05,marginBottom:'14px'}}>
              What is your home<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>really worth?</span>
            </h2>
            <p style={{fontSize:'13px',lineHeight:2.1,color:'rgba(239,236,230,0.55)',marginBottom:'28px'}}>
              In London&rsquo;s most active neighbourhoods, values move quickly and quietly. We&rsquo;ll come to you, assess properly, and give you a straight, well-reasoned figure, because a number that flatters you helps no one.
            </p>
            <Link href='/valuations' style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'13px 24px',textDecoration:'none',display:'inline-block'}}>Get My Free Valuation</Link>
          </div>
          <div style={{position:'relative',height:'420px',overflow:'hidden'}}>
            <img src='https://images.unsplash.com/photo-1573424334948-83945a5b2fa0?w=900&q=85' alt='London residential street' style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(40,35,28,0.5) 0%,transparent 60%)'}} />
          </div>
        </div>
      </div>
    </section>
  )
}


