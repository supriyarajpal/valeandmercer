'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',interest:'Renting',budget:''})
  const [status, setStatus] = useState('idle')

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,subject:'Property Alert Registration'})})
      if(res.ok) setStatus('sent')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp:React.CSSProperties = {background:'transparent',border:'none',borderBottom:'1px solid #C8C0B4',color:'#4A4036',fontSize:'14px',padding:'12px 0',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif'}
  const lab:React.CSSProperties = {fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#9A9188',display:'block',marginBottom:'4px'}

  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'640px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Stay Informed</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'#4A4036',lineHeight:1.05,marginBottom:'12px'}}>Be first to hear about new listings</h1>
          <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258',marginBottom:'40px'}}>Tell us what you need and we will get in touch when something fits. No spam.</p>
          {status==='sent'?(
            <div style={{textAlign:'center',padding:'60px 0'}}>
              <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'36px',fontWeight:300,color:'#4A4036',marginBottom:'12px'}}>Thank you</div>
              <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258'}}>We have your details. We will be in touch as soon as something suitable comes up.</p>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
                <div><label style={lab}>First name</label><input type='text' style={inp} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></div>
                <div><label style={lab}>Last name</label><input type='text' style={inp} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></div>
              </div>
              <div><label style={lab}>Email address</label><input type='email' style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              <div><label style={lab}>Phone number</label><input type='tel' style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label style={lab}>I am looking for</label><select style={{...inp,appearance:'none'}} value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}><option>Renting</option><option>Student Let</option><option>New Home</option><option>Both</option></select></div>
              <div><label style={lab}>Budget</label><input type='text' placeholder='e.g. £2,000 pcm' style={inp} value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} /></div>
              {status==='error'&&<p style={{fontSize:'12px',color:'#c0392b'}}>Something went wrong. Please try again.</p>}
              <button onClick={handleSubmit} disabled={status==='sending'} style={{background:'#28231C',color:'#EFECE6',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',padding:'16px',border:'none',cursor:'pointer',opacity:status==='sending'?0.6:1}}>
                {status==='sending'?'Sending...':'Request Property Alerts'}
              </button>
              <p style={{fontSize:'11px',color:'#9A9188',lineHeight:1.8}}>No spam. Unsubscribe at any time. See our <a href='/privacy' style={{color:'#A0845C'}}>Privacy Notice</a> for details.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}