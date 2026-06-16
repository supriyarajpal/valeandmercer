'use client'
import { useState } from 'react'

export default function GetInTouch() {
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',interest:'Lettings enquiry',message:''})
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      if(res.ok) setStatus('sent')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp:React.CSSProperties = {background:'transparent',border:'none',borderBottom:'1px solid #C8C0B4',color:'#28231C',fontSize:'15px',padding:'10px 0',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif'}
  const lab:React.CSSProperties = {fontSize:'9px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#9A9188',display:'block',marginBottom:'4px'}
  const css = '@media(min-width:768px){.touch-grid{grid-template-columns:1fr 1fr!important}}'

  return (
    <section style={{background:'#EFECE6',padding:'64px 20px',borderTop:'0.5px solid #DDD7CC'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div className="touch-grid" style={{display:'grid',gridTemplateColumns:'1fr',gap:'40px'}}>
          <div>
            <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Get in Touch</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(28px,5vw,46px)',fontWeight:300,color:'#28231C',lineHeight:1.05,marginBottom:'14px'}}>Let us find your next chapter</h2>
            <p style={{fontSize:'14px',lineHeight:2.1,color:'#6B6258',marginBottom:'24px'}}>Drop us a message and we will get back to you. No pitch, no pressure.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div><span style={lab}>Email</span><a href="mailto:info@valeandmercer.co.uk" style={{fontSize:'14px',color:'#6B6258',textDecoration:'none'}}>info@valeandmercer.co.uk</a></div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {status==='sent'?(
              <div style={{padding:'36px 24px',background:'#DDD7CC',textAlign:'center'}}>
                <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'26px',fontWeight:300,color:'#28231C',marginBottom:'10px'}}>Thank you</div>
                <p style={{fontSize:'13px',color:'#6B6258',lineHeight:1.8}}>We have received your message and will be in touch within 24 hours.</p>
              </div>
            ):(
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                  <div><label style={lab}>First name</label><input type="text" placeholder="James" style={inp} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></div>
                  <div><label style={lab}>Last name</label><input type="text" placeholder="Sutton" style={inp} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></div>
                </div>
                <div><label style={lab}>Email</label><input type="email" placeholder="your@email.com" style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                <div><label style={lab}>I am interested in</label><select style={{...inp,appearance:'none'}} value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}><option>Renting a property</option><option>Selling my property</option><option>A valuation</option><option>Student lettings</option></select></div>
                <div><label style={lab}>Message</label><textarea rows={4} placeholder="Tell us what you are looking for..." style={{...inp,resize:'none'}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div>
                {status==='error'&&<p style={{fontSize:'13px',color:'#c0392b'}}>Something went wrong. Please try again.</p>}
                <p style={{fontSize:'11px',color:'#9A9188',lineHeight:1.8,marginBottom:'8px'}}>We will use your details to respond to your enquiry and, if you agree, to send you property updates. See our <a href='/privacy' style={{color:'#A0845C'}}>Privacy Notice</a> for full details.</p><button onClick={handleSubmit} disabled={status==='sending'} style={{background:'#28231C',color:'#EFECE6',fontSize:'11px',letterSpacing:'0.18em',textTransform:'uppercase',padding:'16px',border:'none',cursor:'pointer',width:'100%',opacity:status==='sending'?0.6:1}}>
                  {status==='sending'?'Sending...':'Send Message'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}






