import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function BlogPost3() {
  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'720px',margin:'0 auto',padding:'0 20px'}}>
          <Link href="/blog" style={{fontSize:'11px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none',display:'inline-block',marginBottom:'32px'}}> Back to Journal</Link>
          <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Student Living</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,6vw,52px)',fontWeight:300,color:'#4A4036',lineHeight:1.05,marginBottom:'16px'}}>Renting in London as a student</h1>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'32px'}}>March 2025  5 min read</p>
          <div style={{height:'360px',overflow:'hidden',marginBottom:'40px'}}>
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85" alt="London" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          {[
            {h:'Start earlier than you think',p:'London\'s rental market moves fast. If you are starting university in September, you should be looking seriously by March or April at the latest. The best properties at the right price go quickly, and leaving it until July means taking what is left.'},
            {h:'Understand what you are signing',p:'An Assured Shorthold Tenancy is a legally binding contract. Read it before you sign. Check the break clause, the notice period, what happens if one flatmate wants to leave, and what deductions can be made from your deposit. If anything is unclear, ask.'},
            {h:'Your deposit is protected by law',p:'Any landlord or agent taking a deposit in England is legally required to protect it in a government-approved scheme within 30 days. They must also give you the prescribed information about where it is held. If they do not, you are entitled to compensation.'},
            {h:'What to check before you move in',p:'Do a proper check-in inventory with your agent or landlord present. Photograph everything — walls, floors, appliances, any existing damage. This is your protection when you move out. Do not skip it.'},
            {h:'A word on guarantors',p:'Most London landlords will require a UK-based guarantor for student tenants. This is someone who agrees to cover your rent if you cannot. If you do not have a UK guarantor, ask the agent early — some landlords will accept rent in advance or a specialist guarantor service instead.'},
          ].map((section)=>(
            <div key={section.h} style={{marginBottom:'28px'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'24px',fontWeight:300,color:'#4A4036',marginBottom:'10px'}}>{section.h}</h2>
              <p style={{fontSize:'15px',lineHeight:1.9,color:'#6B6258'}}>{section.p}</p>
            </div>
          ))}
          <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'24px',marginTop:'40px'}}>
            <p style={{fontSize:'13px',color:'#9A9188'}}>Written by the Vale and Mercer team  March 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
