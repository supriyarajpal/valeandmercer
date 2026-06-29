import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Complaints Policy',
  description: 'How to raise a complaint with Vale and Mercer, our internal process, and your right to refer to the Property Redress Scheme.',
  alternates: { canonical: '/complaints' },
}

export default function ComplaintsPage() {
  const tableStyle:React.CSSProperties = {width:'100%',borderCollapse:'collapse',fontSize:'13px',marginBottom:'16px'}
  const thStyle:React.CSSProperties = {padding:'10px 12px',textAlign:'left',background:'#DDD7CC',color:'#4A4036',fontWeight:500,borderBottom:'1px solid #C8C0B4'}
  const tdStyle:React.CSSProperties = {padding:'10px 12px',color:'#6B6258',borderBottom:'0.5px solid #DDD7CC',verticalAlign:'top',lineHeight:1.7}
  const h2Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#4A4036',marginBottom:'12px',marginTop:'0',paddingTop:'32px'}
  const pStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'12px'}
  const liStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'4px'}

  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 20px'}}>

          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Legal</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'#4A4036',marginBottom:'8px'}}>Complaints Policy</h1>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'8px'}}>Vale and Mercer Ltd, Residential Lettings Agency</p>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'32px'}}>Last Updated: June 2026 | Company No: 17212434</p>

          <div style={{background:'#28231C',padding:'24px 28px',marginBottom:'40px',display:'flex',alignItems:'center',gap:'20px',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#A0845C',marginBottom:'6px'}}>Redress Membership</p>
              <p style={{fontSize:'14px',color:'#EFECE6',lineHeight:1.6}}>Vale and Mercer Ltd is a member of the <strong style={{color:'#EFECE6'}}>Property Redress Scheme</strong>, a government-approved, independent redress scheme.</p>
              <p style={{fontSize:'12px',color:'rgba(239,236,230,0.5)',marginTop:'6px'}}>Membership No: PRS058796</p>
            </div>
          </div>

          <div style={{marginBottom:'32px',paddingBottom:'32px',borderBottom:'0.5px solid #DDD7CC'}}>
            <h2 style={{...h2Style,paddingTop:'0'}}>Our Commitment</h2>
            <p style={pStyle}>At Vale and Mercer Ltd, we are committed to providing a professional, responsive, and transparent service to all our clients, whether you are a landlord or a tenant. If at any point we fall short of that standard, we want to hear from you so we can put it right.</p>
          </div>

          <div style={{marginBottom:'32px',paddingBottom:'32px',borderBottom:'0.5px solid #DDD7CC'}}>
            <h2 style={{...h2Style,paddingTop:'0'}}>How to Make a Complaint</h2>
            <p style={pStyle}>You can submit a complaint by any of the following methods:</p>
            <div style={{overflowX:'auto',marginBottom:'16px'}}>
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Method</th><th style={thStyle}>Details</th></tr></thead>
                <tbody>
                  <tr><td style={{...tdStyle,fontWeight:500}}>Email</td><td style={tdStyle}><a href="mailto:info@valeandmercer.co.uk" style={{color:'#A0845C'}}>info@valeandmercer.co.uk</a></td></tr>
                  <tr style={{background:'#F5F2EE'}}><td style={{...tdStyle,fontWeight:500}}>Post</td><td style={tdStyle}>Vale and Mercer Ltd, 124 City Road, London EC1V 2NX</td></tr>
                  <tr><td style={{...tdStyle,fontWeight:500}}>In Person / Phone</td><td style={tdStyle}>By arrangement with a senior member of staff</td></tr>
                </tbody>
              </table>
            </div>
            <p style={pStyle}>When contacting us, please include:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'0'}}>
              {['A clear description of your concern','The outcome you are seeking','The names of any staff members involved','Relevant dates, documents, or supporting evidence'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{marginBottom:'32px',paddingBottom:'32px',borderBottom:'0.5px solid #DDD7CC'}}>
            <h2 style={{...h2Style,paddingTop:'0'}}>What This Policy Covers</h2>
            <p style={pStyle}>This complaints procedure covers all services provided directly by Vale and Mercer Ltd. We are unable to investigate complaints regarding matters outside our direct control, including the conduct of third-party contractors, utility providers, or local authorities. Complaints relating to matters that occurred prior to Vale and Mercer Ltd's instruction will also fall outside the scope of this procedure.</p>
          </div>

          <div style={{marginBottom:'32px',paddingBottom:'32px',borderBottom:'0.5px solid #DDD7CC'}}>
            <h2 style={{...h2Style,paddingTop:'0'}}>What Happens Next</h2>
            {[
              {step:'Step 1: Acknowledgement',desc:'We will acknowledge your complaint in writing within 3 working days of receiving it. You will be given a unique complaint reference number to use in all future correspondence.'},
              {step:'Step 2: Investigation',desc:'A Director-level member of staff will be assigned to investigate your complaint. We will review all relevant correspondence, records, and documents, and speak to any team members involved where appropriate.'},
            ].map((s)=>(
              <div key={s.step} style={{marginBottom:'16px',padding:'18px 20px',background:'#DDD7CC',borderLeft:'3px solid #A0845C'}}>
                <p style={{fontSize:'13px',fontWeight:500,color:'#4A4036',marginBottom:'6px'}}>{s.step}</p>
                <p style={{fontSize:'13px',color:'#6B6258',lineHeight:1.8,margin:0}}>{s.desc}</p>
              </div>
            ))}
            <div style={{marginBottom:'16px',padding:'18px 20px',background:'#DDD7CC',borderLeft:'3px solid #A0845C'}}>
              <p style={{fontSize:'13px',fontWeight:500,color:'#4A4036',marginBottom:'8px'}}>Step 3: Full Written Response</p>
              <p style={{fontSize:'13px',color:'#6B6258',lineHeight:1.8,marginBottom:'8px'}}>We will provide you with our full written response within <strong>15 working days</strong> of our acknowledgement. Our response will:</p>
              <ul style={{paddingLeft:'18px',margin:0}}>
                {['Address each point you have raised individually','Set out our findings clearly and transparently','State whether your complaint is upheld, partially upheld, or not upheld, with full reasoning','Offer a resolution or explanation where applicable'].map(item=>(
                  <li key={item} style={{fontSize:'13px',color:'#6B6258',lineHeight:1.8,marginBottom:'2px'}}>{item}</li>
                ))}
              </ul>
              <p style={{fontSize:'13px',color:'#6B6258',lineHeight:1.8,marginTop:'8px',marginBottom:0}}>If we are unable to respond within 15 working days, we will write to you in advance to explain why and provide a revised response date.</p>
            </div>
          </div>

          <div style={{marginBottom:'32px',paddingBottom:'32px',borderBottom:'0.5px solid #DDD7CC'}}>
            <h2 style={{...h2Style,paddingTop:'0'}}>If You Remain Dissatisfied</h2>
            <p style={pStyle}>If you are not satisfied with our final response, or if 8 weeks have passed since you made your complaint without receiving a final response, you have the right to refer your complaint to the <strong>Property Redress Scheme (PRS)</strong>, a government-approved, independent redress scheme. This service is <strong>free of charge</strong> to consumers.</p>
            <p style={pStyle}><strong>Please note:</strong> Referrals to the PRS must be made within <strong>12 months</strong> of your last communication with us regarding the complaint.</p>
            <div style={{overflowX:'auto',marginBottom:'16px'}}>
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Method</th><th style={thStyle}>Details</th></tr></thead>
                <tbody>
                  <tr><td style={{...tdStyle,fontWeight:500}}>Website</td><td style={tdStyle}><a href="https://www.propertyredress.co.uk/Consumer" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>www.propertyredress.co.uk/Consumer</a></td></tr>
                  <tr style={{background:'#F5F2EE'}}><td style={{...tdStyle,fontWeight:500}}>Email</td><td style={tdStyle}><a href="mailto:complaints@theprs.co.uk" style={{color:'#A0845C'}}>complaints@theprs.co.uk</a></td></tr>
                  <tr><td style={{...tdStyle,fontWeight:500}}>Post</td><td style={tdStyle}>Property Redress Scheme, Limelight, 1st Floor Studio 3, Elstree Way, Borehamwood, Hertfordshire, WD6 1JH</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'24px',fontSize:'11px',color:'#9A9188',lineHeight:1.8}}>
            <p>Vale and Mercer Ltd is a member of the Property Redress Scheme. Membership No: PRS058796</p>
            <p>Company Registration No: 17212434 | Last reviewed: June 2026</p>
            <p>Vale and Mercer Ltd will comply with all additional redress obligations as required under the Renters Rights Act 2025 and any applicable regulatory updates.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

