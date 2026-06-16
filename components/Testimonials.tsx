export default function Testimonials() {
  const css = '@keyframes tmove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}'
  const testimonials = [
    {quote:'Vale and Mercer found us our Chelsea home in 11 days. We were nervous first-time buyers and they made every step feel simple and safe.',name:'Sarah M.',role:'First-time buyer, Chelsea'},
    {quote:'After three disappointing agents, Vale and Mercer sold our Fulham flat above asking price in under two weeks. Genuinely outstanding.',name:'James & Rachel T.',role:'Sellers, Fulham SW6'},
    {quote:'I was relocating from abroad and they handled everything. Professional, warm, and completely trustworthy.',name:'Priya K.',role:'Buyer, Notting Hill'},
    {quote:'As a landlord with three properties, I have never felt more looked after. They find the right tenants every time.',name:'David L.',role:'Landlord, Kensington'},
    {quote:'They understood exactly what we needed. No pushy sales, just honest advice. We found our forever home.',name:'Mark & Sophie W.',role:'Family buyers, South Kensington'},
  ]
  const doubled = [...testimonials,...testimonials]
  return (
    <section style={{background:'#28231C',padding:'64px 0',overflow:'hidden'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{textAlign:'center',padding:'0 20px',marginBottom:'40px'}}>
        <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'10px'}}>Client Stories</p>
        <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,5vw,42px)',fontWeight:300,color:'#EFECE6',lineHeight:1.1}}>
          What our clients <span style={{color:'#A0845C',fontStyle:'italic'}}>say about us</span>
        </h2>
      </div>
      <div style={{overflow:'hidden',width:'100%'}}>
        <div style={{display:'flex',gap:'20px',animation:'tmove 30s linear infinite',width:'max-content'}}>
          {doubled.map((t,i)=>(
            <div key={i} style={{background:'rgba(239,236,230,0.04)',border:'0.5px solid rgba(239,236,230,0.08)',padding:'28px 28px',minWidth:'320px',maxWidth:'360px',flexShrink:0}}>
              <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'32px',color:'#A0845C',lineHeight:1,marginBottom:'12px',opacity:0.6}}>"</div>
              <p style={{fontSize:'13px',lineHeight:1.9,color:'rgba(239,236,230,0.65)',marginBottom:'20px',fontStyle:'italic'}}>{t.quote}</p>
              <div style={{borderTop:'0.5px solid rgba(239,236,230,0.1)',paddingTop:'14px'}}>
                <div style={{fontSize:'12px',fontWeight:500,color:'#EFECE6',marginBottom:'2px'}}>{t.name}</div>
                <div style={{fontSize:'10px',letterSpacing:'0.1em',textTransform:'uppercase',color:'#A0845C'}}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
