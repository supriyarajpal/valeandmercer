import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function BlogPost2() {
  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'720px',margin:'0 auto',padding:'0 20px'}}>
          <Link href="/blog" style={{fontSize:'11px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none',display:'inline-block',marginBottom:'32px'}}> Back to Journal</Link>
          <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Buying Guide</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,6vw,52px)',fontWeight:300,color:'#28231C',lineHeight:1.05,marginBottom:'16px'}}>Your complete guide to buying in Chelsea SW3</h1>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'32px'}}>April 2025  6 min read</p>
          <div style={{height:'360px',overflow:'hidden',marginBottom:'40px'}}>
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=85" alt="Chelsea London" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          {[
            {h:'Why Chelsea?',p:'Chelsea is one of those London postcodes that genuinely delivers on its reputation. The streets around the King\'s Road, the garden squares of SW3, the quiet of Cheyne Walk — it is a neighbourhood that rewards the effort of finding the right property there.'},
            {h:'What you need to know about pricing',p:'Chelsea pricing is wide. A garden flat on a residential street and a lateral apartment on Sloane Square can both carry the Chelsea postcode and be separated by millions of pounds. The key is understanding which pockets offer the best long-term value and which ones are trading on name alone.'},
            {h:'The streets worth knowing',p:'Carlyle Square, Paultons Square, and Cheyne Walk consistently perform well. The area south of the King\'s Road towards the Embankment tends to hold value better than the north, which borders on the more variable Worlds End.'},
            {h:'What to watch out for',p:'Leasehold properties dominate Chelsea. Always check the remaining lease length before you fall in love with a property. Anything under 80 years will affect your mortgage options and resale value significantly.'},
            {h:'Our advice',p:'Chelsea rewards patience. The best properties here rarely sit for long, but rushing into the wrong one because you felt pressure to move is a mistake that takes years to correct. Come and speak to us before you start viewing — it will save you time.'},
          ].map((section)=>(
            <div key={section.h} style={{marginBottom:'28px'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'24px',fontWeight:300,color:'#28231C',marginBottom:'10px'}}>{section.h}</h2>
              <p style={{fontSize:'15px',lineHeight:1.9,color:'#6B6258'}}>{section.p}</p>
            </div>
          ))}
          <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'24px',marginTop:'40px'}}>
            <p style={{fontSize:'13px',color:'#9A9188'}}>Written by the Vale and Mercer team  April 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


