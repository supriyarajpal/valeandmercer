import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',background:'#28231C'}}>
      <div style={{position:'absolute',inset:0}}>
        <img src='https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=90' alt='London' style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%',opacity:0.45}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(40,35,28,0.97) 0%,rgba(40,35,28,0.85) 40%,rgba(40,35,28,0.4) 70%,rgba(40,35,28,0.1) 100%)'}} />
      </div>
      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:'1280px',margin:'0 auto',padding:'100px 40px 60px'}}>
        <div style={{maxWidth:'580px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.8rem'}}>
            <div style={{width:'28px',height:'1px',background:'#A0845C',flexShrink:0}} />
            <span style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'rgba(160,132,92,0.6)'}}>Est. London</span>
          </div>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontWeight:300,lineHeight:1.0,color:'#EFECE6',marginBottom:'1.6rem',fontSize:'clamp(48px,6vw,88px)'}}>
            Where<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>homes</span><br/>find their<br/>people
          </h1>
          <div style={{width:'36px',height:'1px',background:'#A0845C',marginBottom:'1.4rem'}} />
          <p style={{fontSize:'14px',lineHeight:2,color:'rgba(239,236,230,0.55)',marginBottom:'6px',maxWidth:'420px'}}>London's finest neighbourhoods, handled personally.</p>
          <p style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'20px',lineHeight:1.8,color:'#A0845C',marginBottom:'2.4rem',maxWidth:'420px',fontStyle:'italic'}}>Let's get you moving.</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
            <Link href='/valuations' style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',background:'#A0845C',color:'#EFECE6',padding:'14px 22px',textDecoration:'none'}}>Book Valuation</Link>
            <Link href='/register' style={{fontSize:'11px',letterSpacing:'0.16em',textTransform:'uppercase',border:'1px solid rgba(239,236,230,0.3)',color:'rgba(239,236,230,0.85)',padding:'14px 22px',textDecoration:'none'}}>Get Notified</Link>
          </div>
        </div>
      </div>
    </section>
  )
}