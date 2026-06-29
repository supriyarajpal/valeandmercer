'use client'
import { useState } from 'react'

export default function AdminClient() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [form, setForm] = useState({
    slug:'',status:'For Sale',price:'',address:'',area:'',
    postcode:'',beds:'',baths:'',sqft:'',epc:'B',tag:'',image:'',featured:true
  })

  const generate = () => {
    const entry = [
      '  {',
      '    id: "' + Date.now() + '",',
      '    slug: "' + form.slug + '",',
      '    status: "' + form.status + '" as const,',
      '    price: "' + form.price + '",',
      '    address: "' + form.address + '",',
      '    area: "' + form.area + '",',
      '    postcode: "' + form.postcode + '",',
      '    beds: ' + form.beds + ',',
      '    baths: ' + form.baths + ',',
      '    sqft: ' + form.sqft + ',',
      '    epc: "' + form.epc + '",',
      '    image: "' + form.image + '",',
      '    tag: ' + (form.tag ? '"' + form.tag + '"' : 'null') + ',',
      '    featured: ' + form.featured + ',',
      '  },',
    ].join('\n')
    setCode(entry)
  }

  const s = {background:'transparent',border:'none',borderBottom:'1px solid #DDD7CC',color:'#4A4036',fontSize:'14px',padding:'10px 0',outline:'none',width:'100%'}
  const l = {fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase' as const,color:'#9A9188',display:'block',marginBottom:'4px'}

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#EFECE6',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:'48px',minWidth:'320px',border:'0.5px solid #DDD7CC'}}>
        <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'24px',fontWeight:300,color:'#4A4036',marginBottom:'8px'}}>
          Vale <span style={{color:'#A0845C'}}>&</span> Mercer
        </div>
        <div style={{fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#9A9188',marginBottom:'32px'}}>Admin Panel</div>
        <label style={l}>Password</label>
        <input type="password" style={{...s,marginBottom:'24px'}} value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={()=>password==='valemercer2025'?setAuthed(true):alert('Wrong password')} style={{background:'#28231C',color:'#EFECE6',fontSize:'11px',letterSpacing:'0.18em',textTransform:'uppercase',padding:'14px 28px',border:'none',cursor:'pointer',width:'100%'}}>
          Enter
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#EFECE6',padding:'40px 1.5rem'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'48px',paddingBottom:'24px',borderBottom:'0.5px solid #DDD7CC'}}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'32px',fontWeight:300,color:'#4A4036'}}>Add New Property</div>
            <div style={{fontSize:'11px',color:'#9A9188',marginTop:'4px'}}>Fill in the details and generate the code to paste into properties.ts</div>
          </div>
          <a href="/" style={{fontSize:'11px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none'}}>Back to site</a>
        </div>

        <div style={{marginBottom:'40px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'#A0845C',marginBottom:'20px'}}>Basic Info</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'24px'}}>
            <div><label style={l}>URL Slug</label><input style={s} placeholder="carlyle-square-chelsea" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} /></div>
            <div><label style={l}>Status</label>
              <select style={{...s,appearance:'none'}} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>For Sale</option>
                <option>To Let</option>
              </select>
            </div>
            <div><label style={l}>Price</label><input style={s} placeholder="3,200,000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
            <div><label style={l}>Tag (optional)</label><input style={s} placeholder="Featured, New" value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})} /></div>
          </div>
        </div>

        <div style={{marginBottom:'40px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'#A0845C',marginBottom:'20px'}}>Location</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'24px'}}>
            <div><label style={l}>Address</label><input style={s} placeholder="14 Carlyle Square" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
            <div><label style={l}>Area</label><input style={s} placeholder="Chelsea" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} /></div>
            <div><label style={l}>Postcode</label><input style={s} placeholder="SW3" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})} /></div>
          </div>
        </div>

        <div style={{marginBottom:'40px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'#A0845C',marginBottom:'20px'}}>Property Details</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'24px'}}>
            <div><label style={l}>Bedrooms</label><input style={s} type="number" placeholder="4" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})} /></div>
            <div><label style={l}>Bathrooms</label><input style={s} type="number" placeholder="3" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})} /></div>
            <div><label style={l}>Sq Ft</label><input style={s} type="number" placeholder="2840" value={form.sqft} onChange={e=>setForm({...form,sqft:e.target.value})} /></div>
            <div><label style={l}>EPC Rating</label>
              <select style={{...s,appearance:'none'}} value={form.epc} onChange={e=>setForm({...form,epc:e.target.value})}>
                <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{marginBottom:'40px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'#A0845C',marginBottom:'20px'}}>Image</div>
          <div><label style={l}>Image URL (from Unsplash or your own)</label><input style={s} placeholder="https://images.unsplash.com/photo-..." value={form.image} onChange={e=>setForm({...form,image:e.target.value})} /></div>
          {form.image && <img src={form.image} alt="preview" style={{marginTop:'16px',height:'160px',width:'100%',objectFit:'cover'}} />}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'32px'}}>
          <input type="checkbox" id="feat" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} />
          <label htmlFor="feat" style={{fontSize:'13px',color:'#6B6258'}}>Show on homepage as featured property</label>
        </div>

        <button onClick={generate} style={{background:'#28231C',color:'#EFECE6',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',padding:'16px 48px',border:'none',cursor:'pointer',marginBottom:'32px',display:'block'}}>
          Generate Property Code
        </button>

        {code && (
          <div>
            <div style={{background:'#28231C',padding:'28px',marginBottom:'24px'}}>
              <div style={{fontSize:'9px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#A0845C',marginBottom:'16px'}}>
                Copy this code
              </div>
              <pre style={{color:'#EFECE6',fontSize:'12px',lineHeight:1.9,overflow:'auto',whiteSpace:'pre-wrap',margin:0}}>{code}</pre>
            </div>
            <div style={{background:'#DDD7CC',padding:'24px'}}>
              <div style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6258',marginBottom:'12px'}}>Next steps</div>
              <div style={{fontSize:'12px',color:'#6B6258',lineHeight:2}}>
                1. Copy the code above<br/>
                2. Open lib/properties.ts in VS Code<br/>
                3. Paste inside the properties array before the closing bracket<br/>
                4. Save the file<br/>
                5. Run: vercel --prod
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
