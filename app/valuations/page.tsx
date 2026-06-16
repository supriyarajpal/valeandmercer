'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ValuationsPage() {
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',address:'',postcode:'',propertyType:'Flat',bedrooms:'2',reason:'Looking to sell'})
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inp = {background:'transparent',border:'none',borderBottom:'1px solid #C8C0B4',color:'#28231C',fontSize:'14px',padding:'12px 0',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif'}

  return (
    <>
      <Navbar />
      <main>
        <section style={{background:'#28231C',padding:'140px 1.5rem 80px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0}}>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85" alt="London residence" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.2}} />
          </div>
          <div style={{position:'relative',zIndex:10,maxWidth:'1280px',margin:'0 auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <div style={{width:'32px',height:'1px',background:'#A0845C'}} />
              <span style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C'}}>Free Valuation</span>
            </div>
            <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(48px,7vw,80px)',fontWeight:300,color:'#EFECE6',lineHeight:0.95,marginBottom:'20px'}}>
              Book your free<br/><span style={{color:'#A0845C',fontStyle:'italic'}}>valuation</span>
            </h1>
            <p style={{fontSize:'14px',lineHeight:1.9,color:'rgba(239,236,230,0.55)',maxWidth:'480px'}}>
              No online tool. No algorithm. We visit your property, look at it with fresh eyes, and give you a number you can actually rely on.
            </p>
          </div>
        </section>

        <section style={{background:'#EFECE6',padding:'80px 1.5rem'}}>
          <div style={{maxWidth:'900px',margin:'0 auto'}}>
            {status === 'sent' ? (
              <div style={{textAlign:'center',padding:'80px 40px'}}>
                <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'48px',fontWeight:300,color:'#28231C',marginBottom:'16px'}}>Request received</div>
                <p style={{fontSize:'14px',lineHeight:1.9,color:'#6B6258',maxWidth:'400px',margin:'0 auto'}}>Thank you for booking a valuation with Vale and Mercer. One of our senior agents will be in touch within 24 hours to confirm your appointment.</p>
              </div>
            ) : (
              <>
                <div style={{marginBottom:'48px'}}>
                  <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'10px'}}>Your Details</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'28px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>First name</label>
                      <input type="text" placeholder="James" style={inp} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Last name</label>
                      <input type="text" placeholder="Sutton" style={inp} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Email address</label>
                      <input type="email" placeholder="your@email.com" style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Phone number</label>
                      <input type="tel" placeholder="+44 7700 000000" style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                    </div>
                  </div>
                </div>

                <div style={{marginBottom:'48px'}}>
                  <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'24px'}}>Property Details</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'28px'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px',gridColumn:'span 2'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Property address</label>
                      <input type="text" placeholder="14 Carlyle Square" style={inp} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Postcode</label>
                      <input type="text" placeholder="SW3 4LU" style={inp} value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Property type</label>
                      <select style={{...inp,appearance:'none'}} value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})}>
                        <option>Flat</option>
                        <option>Terraced house</option>
                        <option>Semi-detached house</option>
                        <option>Detached house</option>
                        <option>Maisonette</option>
                        <option>Penthouse</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Bedrooms</label>
                      <select style={{...inp,appearance:'none'}} value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})}>
                        <option>Studio</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5+</option>
                      </select>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <label style={{fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188'}}>Reason for valuation</label>
                      <select style={{...inp,appearance:'none'}} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}>
                        <option>Looking to sell</option>
                        <option>Looking to let</option>
                        <option>Remortgaging</option>
                        <option>Estate planning</option>
                        <option>Just curious</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'32px'}}>
                  {status === 'error' && <p style={{fontSize:'12px',color:'#c0392b',marginBottom:'16px'}}>Something went wrong. Please try again or call us directly.</p>}
                  <button onClick={handleSubmit} disabled={status==='sending'} style={{background:'#28231C',color:'#EFECE6',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',padding:'18px 48px',border:'none',cursor:'pointer',opacity:status==='sending'?0.6:1}}>
                    {status === 'sending' ? 'Submitting...' : 'Book Free Valuation'}
                  </button>
                  <p style={{fontSize:'11px',color:'#9A9188',marginTop:'12px'}}>No obligation. We will contact you within 24 hours to confirm your appointment.</p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}





