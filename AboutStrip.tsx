import Link from 'next/link'

export default function AboutStrip() {
  const css = '@media(min-width:600px){.about-services{grid-template-columns:repeat(3,1fr)!important}}'
  return (
    <section style={{background:'#EFECE6',padding:'80px 20px',borderTop:'0.5px solid #DDD7CC'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div style={{marginBottom:'40px',maxWidth:'640px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'10px'}}>Who We Are</p>
          <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,44px)',fontWeight:300,color:'#4A4036',lineHeight:1.1,marginBottom:'14px'}}>
            Every home has a story.<br/>
            <span style={{color:'#A0845C',fontStyle:'italic'}}>We help write the next chapter.</span>
          </h2>
          <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258',marginBottom:'18px'}}>
            We started Vale and Mercer because London deserved an agency that actually listened.
          </p>
          <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258',marginBottom:'24px'}}>
            Small enough that nothing falls through the cracks. Experienced enough that nothing needs to.
          </p>
          <Link href="/about" style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none',borderBottom:'1px solid #A0845C',paddingBottom:'2px'}}>Meet the team</Link>
        </div>
        <div className="about-services" style={{display:'grid',gridTemplateColumns:'1fr',gap:'2px',background:'#C8C0B4'}}>
          {[
            {title:'Lettings',href:'/let',desc:'The right tenant is worth waiting for. We reference properly, vet thoroughly, and only put forward people we would be comfortable with ourselves.'},
            {title:'New Homes',href:'/buy',desc:'The best properties rarely wait. We keep our clients informed before anything reaches the open market.'},
            {title:'Student Lets',href:'/rent',desc:'Your first home in London is a big deal. Clear communication, no hidden costs, and someone who actually picks up the phone.'},
          ].map((s)=>(
            <Link key={s.title} href={s.href} style={{textDecoration:'none',display:'block',background:'#EFECE6',padding:'28px 24px'}}>
              <div style={{width:'18px',height:'1px',background:'#A0845C',marginBottom:'14px'}} />
              <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'20px',fontWeight:300,color:'#4A4036',marginBottom:'8px'}}>{s.title}</h3>
              <p style={{fontSize:'13px',lineHeight:1.8,color:'#6B6258',marginBottom:'12px'}}>{s.desc}</p>
              <span style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',borderBottom:'1px solid #A0845C',paddingBottom:'1px'}}>Find out more</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}



