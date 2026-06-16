import Link from 'next/link'

export default function FeaturedProperties() {
  const css = '@media(min-width:640px){.prop-grid{grid-template-columns:repeat(2,1fr)!important}}'
  return (
    <section style={{background:'#EFECE6',padding:'64px 20px'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'28px'}}>
          <div>
            <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'8px'}}>Our Listings</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,42px)',fontWeight:300,color:'#28231C'}}>Properties <span style={{color:'#A0845C',fontStyle:'italic'}}>coming soon</span></h2>
          </div>
          <Link href="/register" style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none',borderBottom:'1px solid #A0845C',paddingBottom:'2px',whiteSpace:'nowrap',marginLeft:'12px'}}>Get Notified</Link>
        </div>
        <div className="prop-grid" style={{display:'grid',gridTemplateColumns:'1fr',gap:'2px',background:'#C8C0B4'}}>
          {[
            {label:'To Let',area:'Canary Wharf, East London',desc:'Lettings properties coming shortly across Canary Wharf and East London. Register to be the first to know.'},
            {label:'To Let',area:'Notting Hill W11',desc:'Lettings properties coming shortly across Notting Hill and Kensington. Register to be the first to know.'},
          ].map((item,i)=>(
            <Link key={i} href="/register" style={{textDecoration:'none',display:'block',overflow:'hidden',background:'#28231C',position:'relative',minHeight:'300px'}}>
              <div style={{position:'absolute',inset:0,background:'rgba(40,35,28,0.92)'}} />
              <div style={{position:'relative',zIndex:2,padding:'36px 28px',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                <div>
                  <span style={{fontSize:'9px',letterSpacing:'0.18em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'5px 10px',display:'inline-block',marginBottom:'20px'}}>{item.label}</span>
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(22px,4vw,32px)',fontWeight:300,color:'#EFECE6',lineHeight:1.1,marginBottom:'12px'}}>{item.area}</h3>
                  <p style={{fontSize:'13px',lineHeight:1.8,color:'rgba(239,236,230,0.5)',maxWidth:'320px'}}>{item.desc}</p>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',paddingTop:'20px',borderTop:'0.5px solid rgba(239,236,230,0.1)'}}>
                  <span style={{fontSize:'10px',letterSpacing:'0.16em',textTransform:'uppercase',color:'#A0845C'}}>Register Interest</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

