'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{background:'#28231C',color:'#EFECE6'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 20px 20px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'28px'}}>
        <div>
          <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'17px',fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'10px',display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{color:'rgba(239,236,230,0.85)'}}>VALE</span>
            <span style={{color:'#A0845C'}}> &amp; </span>
            <span style={{color:'rgba(239,236,230,0.95)'}}>MERCER</span>
          </div>
          <p style={{fontSize:'11px',lineHeight:1.7,color:'rgba(239,236,230,0.4)',marginBottom:'12px',maxWidth:'260px'}}>Lettings, new homes and student lets across London.</p>
          <p style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'13px',fontStyle:'italic',color:'rgba(239,236,230,0.2)',marginBottom:'14px'}}>London, handled with care.</p>
          <div style={{borderTop:'0.5px solid rgba(239,236,230,0.08)',paddingTop:'12px'}}>
            <a href='https://www.propertyredress.co.uk' target='_blank' rel='noreferrer' style={{display:'inline-block',marginBottom:'8px'}}>
              <div style={{background:'#fff',padding:'6px 10px',display:'inline-flex',alignItems:'center'}}>
                <svg width='64' height='22' viewBox='0 0 120 42' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <rect x='0' y='8' width='6' height='26' fill='#333'/>
                  <rect x='9' y='14' width='6' height='20' fill='#9B59B6'/>
                  <rect x='18' y='19' width='6' height='15' fill='#C39BD3'/>
                  <text x='28' y='22' fontFamily='Arial,sans-serif' fontSize='11' fontWeight='bold' fill='#333'>Property</text>
                  <text x='28' y='36' fontFamily='Arial,sans-serif' fontSize='11' fontWeight='bold' fill='#333'>Redress</text>
                </svg>
              </div>
            </a>
            <p style={{fontSize:'9px',color:'rgba(239,236,230,0.25)',lineHeight:1.6}}>Member of Property Redress Scheme<br/><span style={{color:'#A0845C'}}>Membership No: PRS058796</span></p>
          </div>
        </div>
        <div>
          <p style={{fontSize:'9px',letterSpacing:'0.22em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Navigate</p>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {[{label:'Lettings',href:'/let'},{label:'New Homes',href:'/buy'},{label:'About',href:'/about'},{label:'Blog',href:'/blog'},{label:'Fees',href:'/fees'},{label:'Book Valuation',href:'/valuations'}].map((item)=>(
              <Link key={item.label} href={item.href} style={{fontSize:'10px',color:'rgba(239,236,230,0.35)',textDecoration:'none'}}>{item.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p style={{fontSize:'9px',letterSpacing:'0.22em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Contact</p>
          <div><div style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.2)',marginBottom:'3px'}}>Email</div><a href='mailto:info@valeandmercer.co.uk' style={{fontSize:'10px',color:'rgba(239,236,230,0.4)',textDecoration:'none'}}>info@valeandmercer.co.uk</a></div>
          <div style={{marginTop:'10px'}}><div style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.2)',marginBottom:'3px'}}>Registered Office</div><p style={{fontSize:'10px',color:'rgba(239,236,230,0.35)',lineHeight:1.6}}>124 City Road, London EC1V 2NX</p></div>
        </div>
      </div>
      <div style={{borderTop:'0.5px solid rgba(239,236,230,0.06)',padding:'12px 20px',maxWidth:'1280px',margin:'0 auto'}}>
        <p style={{fontSize:'8px',color:'rgba(239,236,230,0.18)',marginBottom:'6px',lineHeight:1.7}}>2026 Vale and Mercer Ltd. Company No: 17212434. Registered in England and Wales. ICO No: ZC155397. AML Supervised by HMRC. Client Money Protection: Vale and Mercer Ltd is a member of an approved Client Money Protection scheme.</p>
        <div style={{display:'flex',gap:'14px',flexWrap:'wrap',alignItems:'center'}}>
          <Link href='/privacy' style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.25)',textDecoration:'none'}}>Privacy Notice</Link>
          <Link href='/cookies' style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.25)',textDecoration:'none'}}>Cookie Policy</Link>
          <Link href='/complaints' style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.25)',textDecoration:'none'}}>Complaints Policy</Link>
          <Link href='/terms' style={{fontSize:'9px',textTransform:'uppercase',color:'rgba(239,236,230,0.25)',textDecoration:'none'}}>Terms of Use</Link>
        </div>
      </div>
    </footer>
  )
}
