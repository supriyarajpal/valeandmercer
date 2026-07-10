import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SITE_URL = 'https://valeandmercer.co.uk'

export const metadata: Metadata = {
  title: 'Lettings and Sales Fees',
  description: 'Transparent Vale and Mercer fees for London lettings and residential sales. Tenant Find, Rent Collection and Full Management options with no hidden charges.',
  alternates: { canonical: '/fees' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Lettings and Sales Fees', item: SITE_URL + '/fees' },
  ],
}

export default function FeesPage() {
  const tableStyle:React.CSSProperties = {width:'100%',borderCollapse:'collapse',fontSize:'13px',marginBottom:'20px'}
  const thStyle:React.CSSProperties = {padding:'10px 12px',textAlign:'left',background:'var(--border)',color:'var(--text)',fontWeight:500,borderBottom:'1px solid var(--border-strong)',fontSize:'12px'}
  const tdStyle:React.CSSProperties = {padding:'10px 12px',color:'var(--text-muted)',borderBottom:'0.5px solid var(--border)',verticalAlign:'top',lineHeight:1.7,fontSize:'13px'}
  const h2Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'var(--text)',marginBottom:'12px',marginTop:'0'}
  const h3Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'18px',fontWeight:300,color:'var(--text)',marginBottom:'8px',marginTop:'20px'}
  const pStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'var(--text-muted)',marginBottom:'12px'}
  const liStyle:React.CSSProperties = {fontSize:'13px',lineHeight:1.9,color:'var(--text-muted)',marginBottom:'4px'}
  const sectionStyle:React.CSSProperties = {marginBottom:'40px',paddingBottom:'40px',borderBottom:'0.5px solid var(--border)'}

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main style={{background:'var(--surface)',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Transparency</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'var(--text)',marginBottom:'8px'}}>Services and Fees</h1>
          <p style={{fontSize:'12px',color:'var(--text-faint)',marginBottom:'8px'}}>Vale and Mercer Ltd. Straightforward, transparent pricing. No hidden charges, no surprises.</p>
          <p style={{fontSize:'12px',color:'var(--text-faint)',marginBottom:'32px',fontStyle:'italic'}}>All fees stated on this page are not subject to VAT. Vale and Mercer Ltd is not currently VAT registered. This page will be updated promptly if our VAT status changes.</p>

          <div style={sectionStyle}>
            <h2 style={h2Style}>Landlord Services</h2>
            <p style={pStyle}>We offer three levels of lettings service, designed around how involved you want to be in managing your property.</p>
            <div style={{overflowX:'auto',marginBottom:'20px'}}>
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Service</th><th style={thStyle}>Tenant Find Fee</th><th style={thStyle}>Ongoing Monthly Fee</th></tr></thead>
                <tbody>
                  {[
                    ['Tenant Find Only','8% of first year\'s rent','None'],
                    ['Tenant Find Only (multi-agency)','12% of first year\'s rent','None'],
                    ['Rent Collection','8% of first year\'s rent','7% of monthly rent collected'],
                    ['Full Management','8% of first year\'s rent','10% of monthly rent collected'],
                  ].map(([s,t,o],i)=>(
                    <tr key={i} style={{background:i%2===0?'var(--surface)':'var(--surface-3)'}}>
                      <td style={{...tdStyle,fontWeight:500,color:'var(--text)'}}>{s}</td>
                      <td style={{...tdStyle,color:'#A0845C'}}>{t}</td>
                      <td style={tdStyle}>{o}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={h3Style}>Tenant Find Only</h3>
            <p style={pStyle}>For landlords who are confident managing their own tenancy once a quality tenant is in place.</p>
            <ul style={{paddingLeft:'20px',marginBottom:'16px'}}>
              {['Professional property photography and written listing','Advertising on major UK property portals and the Vale and Mercer website','Full tenant marketing and enquiry handling','Accompanied viewings','Full tenant referencing: credit checks, income verification, employment and previous landlord references','Right to Rent compliance checks','Anti-money laundering (AML) and sanctions screening','Tenancy agreement preparation','Collection and registration of the tenancy deposit with an approved deposit protection scheme','Service of all legally required pre-tenancy documents','Key handover'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>Rent Collection</h3>
            <p style={pStyle}>Everything in Tenant Find Only, plus monthly rent collection and reconciliation, rent arrears chasing and prompt landlord notification, monthly rent statements, and annual rental income summary.</p>
            <p style={{...pStyle,fontStyle:'italic',fontSize:'12px',color:'var(--text-faint)'}}>Also available as a standalone service for landlords who have already placed a tenant and wish to transfer rent collection to Vale and Mercer. Please contact us to discuss.</p>

            <h3 style={h3Style}>Full Management</h3>
            <p style={pStyle}>Everything in Rent Collection, plus a dedicated property manager as your single point of contact, periodic property inspections, maintenance coordination, 24/7 emergency out-of-hours contact, preparation and service of legal notices where required, proactive rent review and compliance reminders, and check-out inspection and tenancy deposit return management.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>Residential Sales</h2>
            <div style={{background:'#34302B',padding:'20px 24px',marginBottom:'16px',display:'inline-block'}}>
              <p style={{fontSize:'13px',color:'rgba(242,239,233,0.6)',marginBottom:'4px'}}>Fee</p>
              <p style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'28px',fontWeight:300,color:'#F2EFE9'}}>1.5% of the agreed sale price (indicative; please contact us to discuss)</p>
              <p style={{fontSize:'11px',color:'rgba(242,239,233,0.4)',marginTop:'4px'}}>Not subject to VAT</p>
            </div>
            <p style={pStyle}>Vale and Mercer Ltd accepts residential sales instructions on a selective basis. Please contact us to discuss your requirements.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>Fees to Tenants</h2>
            <p style={pStyle}>Under the Tenant Fees Act 2019, most charges to tenants are prohibited by law. Vale and Mercer Ltd only collects the following permitted payments.</p>

            <h3 style={h3Style}>Holding Deposit</h3>
            <p style={pStyle}>A maximum of one week's rent, payable to reserve a property whilst referencing is completed. Once the tenancy begins, this is applied to your first month's rent or tenancy deposit. The holding deposit will be refunded in full within 7 days in all circumstances other than where you withdraw your application, fail a Right to Rent check, or provide false or misleading information.</p>

            <h3 style={h3Style}>Tenancy Deposit</h3>
            <div style={{overflowX:'auto',marginBottom:'12px'}}>
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Annual Rent</th><th style={thStyle}>Maximum Deposit</th></tr></thead>
                <tbody>
                  <tr style={{background:'var(--surface)'}}><td style={tdStyle}>£50,000 or below</td><td style={{...tdStyle,color:'#A0845C',fontWeight:500}}>5 weeks' rent</td></tr>
                  <tr style={{background:'var(--surface-3)'}}><td style={tdStyle}>Over £50,000</td><td style={{...tdStyle,color:'#A0845C',fontWeight:500}}>6 weeks' rent</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={h3Style}>Permitted Charges</h3>
            <div style={{overflowX:'auto',marginBottom:'12px'}}>
              <table style={{...tableStyle,minWidth:'500px'}}>
                <thead><tr><th style={thStyle}>Charge</th><th style={thStyle}>When It Applies</th><th style={thStyle}>Amount</th></tr></thead>
                <tbody>
                  {[
                    ['Late rent','Rent 14+ days overdue','3% above Bank of England base rate'],
                    ['Lost keys / security device','If you lose keys or a fob','Actual cost of replacement'],
                    ['Tenancy variation','If you request a change, e.g. adding a new flatmate','£50'],
                    ['Early termination','If you wish to leave before your tenancy ends','Landlord\'s reasonable re-letting costs and rent until a replacement tenant moves in'],
                  ].map(([c,w,a],i)=>(
                    <tr key={i} style={{background:i%2===0?'var(--surface)':'var(--surface-3)'}}>
                      <td style={{...tdStyle,fontWeight:500}}>{c}</td>
                      <td style={tdStyle}>{w}</td>
                      <td style={{...tdStyle,color:'#A0845C'}}>{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{...pStyle,fontStyle:'italic',fontSize:'12px',color:'var(--text-faint)'}}>All other fees including referencing, credit checks, administration, check-out, and renewal fees are prohibited under the Tenant Fees Act 2019. Vale and Mercer Ltd does not charge tenants for any of these.</p>
          </div>

          <div style={{marginBottom:'40px'}}>
            <h2 style={h2Style}>Regulatory and Compliance</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'2px',background:'var(--border-strong)'}}>
              {[
                {title:'Redress Scheme',body:'Vale and Mercer Ltd is a member of the Property Redress Scheme (PRS). Membership No: PRS058796. If we are unable to resolve your complaint internally, you may refer it to the PRS free of charge.'},
                {title:'Client Money Protection',body:'Vale and Mercer Ltd holds client money in a dedicated client account separate from business funds. We are a member of an approved Client Money Protection scheme under the Client Money Protection Schemes for Property Agents Regulations 2018.'},
                {title:'Anti-Money Laundering',body:'Vale and Mercer Ltd is registered with HMRC for anti-money laundering supervision under the Money Laundering Regulations 2017. We conduct identity, ownership and sanctions checks as required by law on all landlords and tenants.'},
              ].map(item=>(
                <div key={item.title} style={{background:'var(--surface)',padding:'24px'}}>
                  <h3 style={{...h3Style,marginTop:0,fontSize:'16px'}}>{item.title}</h3>
                  <p style={{...pStyle,marginBottom:0,fontSize:'13px'}}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{borderTop:'0.5px solid var(--border)',paddingTop:'24px',fontSize:'11px',color:'var(--text-faint)',lineHeight:1.8}}>
            <p>Vale and Mercer Ltd. Company No: 17212434. Registered in England and Wales.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
