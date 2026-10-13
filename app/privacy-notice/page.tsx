import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How Vale and Mercer Ltd collects, uses, and protects your personal data under UK GDPR and the Data Protection Act 2018.',
  alternates: { canonical: '/privacy-notice' },
}

export default function PrivacyNoticePage() {
  const tableStyle:React.CSSProperties = {width:'100%',borderCollapse:'collapse',fontSize:'13px',marginBottom:'16px'}
  const thStyle:React.CSSProperties = {padding:'10px 12px',textAlign:'left',background:'var(--border)',color:'var(--text)',fontWeight:500,borderBottom:'1px solid var(--border-strong)'}
  const tdStyle:React.CSSProperties = {padding:'10px 12px',color:'var(--text-muted)',borderBottom:'0.5px solid var(--border)',verticalAlign:'top',lineHeight:1.7}
  const h2Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'var(--text)',marginBottom:'14px',marginTop:'0'}
  const h3Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'18px',fontWeight:300,color:'var(--text)',marginBottom:'10px',marginTop:'20px'}
  const pStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'var(--text-muted)',marginBottom:'12px'}
  const liStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'var(--text-muted)',marginBottom:'4px'}
  const sectionStyle:React.CSSProperties = {marginBottom:'40px',paddingBottom:'40px',borderBottom:'0.5px solid var(--border)'}

  return (
    <>
      <Navbar />
      <main style={{background:'var(--surface)',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Legal</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'var(--text)',marginBottom:'8px'}}>Privacy Notice</h1>
          <p style={{fontSize:'12px',color:'var(--text-faint)',marginBottom:'32px'}}>VM-PN-001 | Version 2.1 | October 2026 | Company Registration No: 17212434</p>

          <div style={{background:'var(--border)',padding:'14px 20px',marginBottom:'40px',fontSize:'12px',color:'var(--text-muted)',lineHeight:1.8}}>
            <p style={{fontWeight:500,color:'var(--text)',marginBottom:'6px',fontSize:'12px'}}>Jump to section:</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {[['1','Who We Are'],['2','What This Notice Covers'],['3','Data We Collect'],['4','Legitimate Interests'],['5','Who We Share Data With'],['6','International Transfers'],['7','How Long We Keep Data'],['8','Your Rights'],['9','Cookies'],['10','Direct Marketing'],['11','Data Security'],['12','Changes'],['13','How to Complain']].map(([id,label])=>(
                <a key={id} href={'#pn-'+id} style={{fontSize:'11px',color:'#A0845C',textDecoration:'none',borderBottom:'1px solid #A0845C',paddingBottom:'1px'}}>{label}</a>
              ))}
            </div>
          </div>

          <div id="pn-1" style={sectionStyle}>
            <h2 style={h2Style}>1. Who We Are</h2>
            <p style={pStyle}><strong>Vale and Mercer Ltd</strong> is a property estate agency providing property sales, lettings, related property management services, and property deal sourcing for investors, in England.</p>
            <div style={{overflowX:'auto'}}>
              <table style={tableStyle}>
                <tbody>
                  {[['Company Name','Vale and Mercer Ltd'],['Company Registration No','17212434 (registered in England and Wales)'],['Data Enquiries Contact','privacy@valeandmercer.co.uk'],['ICO Registration Number','ZC155397']].map(([k,v])=>(
                    <tr key={k}><th style={{...thStyle,width:'40%'}}>{k}</th><td style={tdStyle}>{k==='Data Enquiries Contact'?<a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>{v}</a>:v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={pStyle}>Vale and Mercer Ltd is registered with the Information Commissioner's Office (ICO) as a <strong>data controller</strong> under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            <p style={pStyle}>We do not have a formally appointed Data Protection Officer (DPO), as we are not legally required to designate one as a small private estate agency that does not carry out large-scale systematic processing or processing of special category data. All data protection enquiries should be directed to the contact above, which is monitored by the company director.</p>
          </div>

          <div id="pn-2" style={sectionStyle}>
            <h2 style={h2Style}>2. What This Notice Covers and Who It Applies To</h2>
            <p style={pStyle}>This Privacy Notice explains what personal data we collect, why we collect it, the legal basis on which we process it, how we protect it, who we share it with, how long we keep it, and what your rights are. It applies to all the following individuals:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              {['Vendors and sellers instructing us to market their property for sale','Buyers and applicants registering with us to find a property to purchase','Landlords instructing us to let or manage their property','Tenants, residents, and guarantors applying for or occupying properties we manage','Visitors to our website','Anyone who contacts us by email, telephone, or contact form'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>A separate internal privacy notice applies to our staff and contractors.</p>
          </div>

          <div id="pn-3" style={sectionStyle}>
            <h2 style={h2Style}>3. The Data We Collect and Why</h2>
            {[
              {sub:'3.1 Vendors and Sellers',desc:'We collect this data to carry out your instruction to sell your property and to comply with our legal obligations as an estate agency.',rows:[['Full name, home address, contact telephone and email','Property instruction management and communication','Contract: Art. 6(1)(b)'],['Property address and property particulars','Marketing and advertising your property for sale','Contract: Art. 6(1)(b)'],['Government-issued photo ID (passport or driving licence) and proof of address','Anti-money laundering (AML) identity verification: required by law before we can act','Legal Obligation: Art. 6(1)(c), Money Laundering Regulations 2017'],['Source of funds documentation','AML verification: required before completion','Legal Obligation: Art. 6(1)(c), Money Laundering Regulations 2017'],['Solicitor name and contact details','To facilitate legal completion of the sale','Contract: Art. 6(1)(b)']]},
              {sub:'3.2 Buyers and Purchasing Applicants',desc:'We collect this data to register you and match you to suitable properties on the market.',rows:[['Full name, address, contact telephone and email','Applicant registration and property matching','Legitimate Interests: Art. 6(1)(f)'],['Property search preferences (budget, area, bedrooms, type)','Identifying suitable properties and arranging viewings','Legitimate Interests: Art. 6(1)(f)'],['Financial pre-qualification information (e.g. mortgage agreement in principle)','To assess suitability to proceed with a purchase','Contract: Art. 6(1)(b)'],['Government-issued photo ID and proof of address','AML identity verification required before exchange of contracts','Legal Obligation: Art. 6(1)(c), Money Laundering Regulations 2017'],['Source of funds documentation','AML verification at point of sale','Legal Obligation: Art. 6(1)(c), Money Laundering Regulations 2017']]},
              {sub:'3.3 Landlords',desc:'We collect this data to manage your lettings instruction and comply with our legal obligations.',rows:[['Full name, home address, contact telephone and email','Lettings instruction management and communication','Contract: Art. 6(1)(b)'],['Bank account details (for rental income remittance)','To pay rental income to you','Contract: Art. 6(1)(b)'],['Property address and related certificates (Gas Safety Certificate, Electrical Installation Condition Report, Energy Performance Certificate)','Property management and legal compliance as a letting agent','Contract: Art. 6(1)(b) + Legal Obligation: Art. 6(1)(c)'],['National Insurance number or Tax reference (Non-Resident Landlord scheme where applicable)','HMRC Non-Resident Landlord tax reporting','Legal Obligation: Art. 6(1)(c), Finance Act / HMRC NRL Scheme'],['Government-issued photo ID and proof of address','AML identity verification: required before we can act','Legal Obligation: Art. 6(1)(c), Money Laundering Regulations 2017']]},
              {sub:'3.4 Tenants, Residents, and Guarantors',desc:'We collect this data to process your tenancy application and to manage and administer your tenancy.',rows:[['Full name, date of birth, current and all previous addresses (3 years)','Tenancy application processing and tenancy agreement','Contract: Art. 6(1)(b)'],['Contact telephone number and email address','Communication throughout the application and tenancy','Contract: Art. 6(1)(b)'],['National Insurance number, employer name and address, pay slips, and bank statements','Referencing: affordability and suitability assessment','Contract: Art. 6(1)(b)'],['Credit check results (obtained via referencing platform)','Assessing financial suitability as a tenant','Contract: Art. 6(1)(b)'],['Employer reference and previous landlord reference','Verifying employment and previous tenancy history','Contract: Art. 6(1)(b)'],['Government-issued photo ID (passport, driving licence, biometric residence permit) and proof of right to rent','Right to Rent check: required by law before tenancy begins','Legal Obligation: Art. 6(1)(c), Immigration Act 2014'],['Emergency contact name and telephone number','To contact in an emergency situation during the tenancy','Legitimate Interests: Art. 6(1)(f): protecting the health and safety of our clients and their property'],['Tenancy deposit amount and deposit protection scheme reference','To register your deposit with a government-approved protection scheme','Legal Obligation: Art. 6(1)(c), Housing Act 2004'],['Details of any maintenance requests, complaints, or inspections','Property management and record-keeping during the tenancy','Contract: Art. 6(1)(b)']]},
              {sub:'3.5 Website Visitors',desc:'',rows:[['Contact form submissions (name, email, telephone, message)','Responding to your enquiry','Legitimate Interests: Art. 6(1)(f)'],['IP address and cookie/browsing data (analytics via Google Analytics 4)','Understanding how visitors use our website to improve it','Consent: Art. 6(1)(a), PECR 2003 (via our cookie consent banner)'],['IP address, cookie data and page activity (advertising measurement and remarketing via the Meta Pixel, and via Google Ads if activated)','Measuring the results of our advertising and showing relevant advertisements to previous website visitors','Consent: Art. 6(1)(a), PECR 2003 (via our cookie consent banner)'],['Email address (if you subscribe to property updates)','Sending you property market updates and listings you have requested','Consent: Art. 6(1)(a), PECR 2003']]},
            ].map(({sub,desc,rows})=>(
              <div key={sub} style={{marginBottom:'20px'}}>
                <h3 style={h3Style}>{sub}</h3>
                {desc&&<p style={pStyle}>{desc}</p>}
                <div style={{overflowX:'auto'}}>
                  <table style={{...tableStyle,minWidth:'500px'}}>
                    <thead><tr><th style={{...thStyle,width:'35%'}}>Data Collected</th><th style={thStyle}>Purpose</th><th style={{...thStyle,width:'25%'}}>Lawful Basis</th></tr></thead>
                    <tbody>{rows.map(([d,p,b],i)=><tr key={i} style={{background:i%2===0?'var(--surface)':'var(--surface-3)'}}><td style={tdStyle}>{d}</td><td style={tdStyle}>{p}</td><td style={{...tdStyle,color:'#A0845C',fontSize:'12px'}}>{b}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            ))}
            <p style={pStyle}><strong>Our legitimate interest:</strong> We process buyer contact and preference data to match individuals to suitable properties and arrange viewings. We have assessed this against a three-part Legitimate Interests Assessment (LIA), concluding that the processing is necessary, proportionate, and does not override individual rights. You may object to this processing at any time.</p>

            <h3 style={h3Style}>3.6 Prospective Landlords and Data We Obtain From Other Sources</h3>
            <p style={pStyle}>We identify some prospective landlords through a lead generation service, Agent Extra. The data we receive is limited to lead information and your contact details. We did not collect this data from you directly.</p>
            <p style={pStyle}>We use it only to contact you about our lettings services. Our lawful basis is legitimate interests, Art. 6(1)(f), supported by a documented Legitimate Interests Assessment. We tell you where we obtained your data when we first contact you. We do not send marketing emails or text messages to an individual without their consent, in line with PECR 2003. If you ask us to stop, we stop and remove your details from our contact lists. We keep only a minimal suppression record so that we do not contact you again.</p>
            <p style={pStyle}>When you enquire about a property on Zoopla or OnTheMarket, the portal passes your enquiry details (name, contact details and message) to us. The portal is the controller of that data under its own privacy notice. We use what we receive only to reply to you and to arrange viewings.</p>

            <h3 style={h3Style}>3.7 Investor Clients</h3>
            <p style={pStyle}>We source investment properties for investors and, where a developer pays us an agent referral fee, introduce investors to developer schemes. We collect your name and contact details, your investment criteria (budget, areas and property type), photo ID and proof of address, and source of funds documentation. Our lawful bases are contract, for sourcing and introductions, and legal obligation under the Money Laundering Regulations 2017, for ID and source of funds checks. We share your details with a developer only to make an introduction you have asked for, and we tell you before we do.</p>
          </div>

          <div id="pn-4" style={sectionStyle}>
            <h2 style={h2Style}>4. How We Use Your Data: Further Detail on Legitimate Interests</h2>
            <p style={pStyle}>Where we rely on <strong>legitimate interests</strong> as our lawful basis, we have carried out and documented a Legitimate Interests Assessment (LIA) for each activity to confirm that our interests are proportionate and do not override your rights. The activities where we rely on legitimate interests are:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              <li style={liStyle}><strong>Buyer and applicant property matching:</strong> We process your contact details and preferences to identify and share suitable properties. This is a core service function that you would reasonably expect us to carry out when you register with us.</li>
              <li style={liStyle}><strong>Website enquiry responses:</strong> We process contact form data solely to respond to your specific enquiry.</li>
              <li style={liStyle}><strong>Emergency contact use:</strong> We retain your nominated emergency contact solely for genuine emergency situations during your tenancy. This data is not used for any other purpose.</li>
            </ul>
            <p style={pStyle}>You have the right to object to processing based on legitimate interests at any time. Where you object and we cannot demonstrate compelling legitimate grounds that override your interests, we will stop that processing.</p>
          </div>

          <div id="pn-5" style={sectionStyle}>
            <h2 style={h2Style}>5. Who We Share Your Personal Data With</h2>
            <p style={pStyle}>We only share your personal data where necessary and with appropriate safeguards in place. We <strong>do not sell personal data</strong> to any third party.</p>
            <div style={{overflowX:'auto'}}>
              <table style={{...tableStyle,minWidth:'500px'}}>
                <thead><tr><th style={thStyle}>Recipient</th><th style={thStyle}>Purpose</th><th style={thStyle}>Basis for Sharing</th></tr></thead>
                <tbody>
                  {[['OnTheMarket','To list and advertise your property on OnTheMarket','Contract: listing instruction. OnTheMarket is an independent controller of the data it holds and publishes, under its own privacy notice'],['Zoopla Ltd','To list and advertise your property on Zoopla','Contract: listing instruction. Zoopla is an independent controller of the data it holds and publishes, under its own privacy notice'],['The Lettings Hub','To conduct independent tenant referencing and credit checks, and electronic ID, AML, PEP and sanctions checks','Contract: tenancy application; Legal Obligation: Money Laundering Regulations 2017. Data shared only with your knowledge as stated in this notice'],['Rex Software (Rex Labs Limited)','Customer relationship management: storing contact records, property records, enquiries, tasks and correspondence. Hosted on Google Cloud Platform','Contract / Legitimate Interests. Rex acts as our data processor'],['Tenancy Deposit Scheme (TDS), a government-approved scheme','To register and protect tenant deposits as required by law','Legal Obligation: Housing Act 2004'],['Solicitors and conveyancers','To facilitate the legal completion of sales transactions','Contract'],['HMRC','Anti-money laundering reporting, PAYE, Non-Resident Landlord scheme reporting','Legal Obligation: Money Laundering Regulations 2017; Finance Act; HMRC'],['Home Office','Right to Rent verification (if required by Home Office checks)','Legal Obligation: Immigration Act 2014'],['Property maintenance contractors','To arrange and carry out repairs and inspections (name and address only, no financial data)','Contract: property management'],['Microsoft Corporation (Microsoft 365 / Outlook)','Cloud email platform used for client correspondence','Contract. Microsoft acts as our data processor under a Data Processing Agreement'],['Google LLC (Google Analytics 4; Google Ads if activated)','Website analytics and digital advertising measurement','Consent (cookie banner). Google acts as our data processor for analytics'],['Meta Platforms Ireland Limited (Meta Pixel)','Advertising measurement and remarketing through the Meta Pixel on our website. Active only if you accept marketing cookies','Consent: Art. 6(1)(a), PECR 2003. Meta is a joint controller with us for pixel data'],['Dropbox, Inc. (Dropbox Sign, formerly HelloSign)','Electronic signature processing for tenancy agreements and contracts','Contract. Dropbox acts as our data processor'],['Accountants and financial advisers','Bookkeeping, financial compliance, and tax filing','Legal Obligation / Contract'],['Property Redress Scheme','To handle any complaint you refer to the scheme','Legitimate Interests: Art. 6(1)(f), and our redress scheme membership'],['Developers and their sales teams (investor introductions)','To introduce you as a prospective purchaser, only where you have asked us to','Contract; shared only with your agreement'],['Banks and payment providers (including the bank holding our client account)','To receive and pay rent, deposits and fees','Contract; Legal Obligation'],['ICO','Regulatory compliance: registration and any mandatory breach reporting','Legal Obligation: DPA 2018']].map(([r,p,b],i)=>(
                    <tr key={i} style={{background:i%2===0?'var(--surface)':'var(--surface-3)'}}><td style={{...tdStyle,fontWeight:500}}>{r}</td><td style={tdStyle}>{p}</td><td style={{...tdStyle,color:'#A0845C',fontSize:'12px'}}>{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="pn-6" style={sectionStyle}>
            <h2 style={h2Style}>6. International Data Transfers</h2>
            <p style={pStyle}>Some of our suppliers operate outside the UK, including Vercel (website hosting), Google (analytics), Meta (advertising pixel) and Dropbox (Dropbox Sign). Rex Software, our CRM, hosts our data on Google Cloud Platform and uses sub-processors that may process some data in Australia and the United States. Transfers are made under Standard Contractual Clauses with the UK Addendum approved by the ICO, under the UK-US data bridge where the recipient is certified, or under other safeguards in UK GDPR Chapter V. Details are available on request.</p>
            <p style={pStyle}><strong>Vercel Inc</strong> (website infrastructure): Vale and Mercer Ltd's website is built and hosted on Vercel's platform. Vercel may process technical data (including connection data and security tokens) in the United States as part of delivering the website. This transfer is made under Standard Contractual Clauses with the UK Addendum approved by the ICO. Vercel acts solely as our data processor and does not use this data for its own purposes.</p>
            <p style={pStyle}>Our other processors and recipients are based in the United Kingdom or process our data under the safeguards described above.</p>
          </div>

          <div id="pn-7" style={sectionStyle}>
            <h2 style={h2Style}>7. How Long We Keep Your Data</h2>
            <p style={pStyle}>We apply the principle of <strong>storage limitation</strong> under UK GDPR Article 5(1)(e): we do not keep your data for longer than is necessary for the purpose it was collected, or as required by law.</p>
            <div style={{overflowX:'auto'}}>
              <table style={{...tableStyle,minWidth:'500px'}}>
                <thead><tr><th style={thStyle}>Data Category</th><th style={thStyle}>Retention Period</th><th style={thStyle}>When Clock Starts</th><th style={thStyle}>Legal Basis for Retention</th></tr></thead>
                <tbody>
                  {[['Completed sale files (vendor and buyer)','6 years','Date of sale completion or instruction withdrawal','Limitation Act 1980: contractual claims'],['AML identity verification documents (mandatory, cannot be deleted early)','5 years minimum','Date business relationship ends','Money Laundering Regulations 2017, Reg. 40 (mandatory)'],['Tenancy files (landlord and tenant data)','6 years','Date tenancy ends','Limitation Act 1980: possible disputes'],['Right to Rent check documents','1 year','Date tenancy ends','Immigration Act 2014'],['Tenancy deposit protection records','6 years','Date tenancy ends','Housing Act 2004'],['Buyer/applicant records (no transaction formed)','12 months','Date of last contact','Legitimate interests: proportionate'],['Website contact form enquiries (no relationship formed)','12 months','Date of submission','Legitimate interests: proportionate'],['Complaint records','6 years','Date the complaint is closed','Redress scheme rules; Limitation Act 1980'],['Prospective landlord leads (no instruction given)','12 months','Date of last contact','Legitimate interests: proportionate'],['Email marketing consent records','Duration of consent + 1 year','Date of unsubscription or withdrawal','PECR 2003: evidence of valid consent'],['Financial records (invoices, bank statements)','6 years','End of financial year to which records relate','Companies Act 2006; HMRC requirements']].map(([d,r,w,l],i)=>(
                    <tr key={i} style={{background:i%2===0?'var(--surface)':'var(--surface-3)'}}><td style={tdStyle}>{d}</td><td style={{...tdStyle,color:'#A0845C',fontWeight:500}}>{r}</td><td style={tdStyle}>{w}</td><td style={{...tdStyle,fontSize:'12px'}}>{l}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background:'var(--border)',padding:'16px 20px',borderLeft:'3px solid #A0845C',marginTop:'12px'}}>
              <p style={{...pStyle,marginBottom:0}}><strong>Important regarding AML documents:</strong> We are required by the Money Laundering Regulations 2017 to retain your identity verification documents for a minimum of five years following the end of our business relationship with you. A request for erasure of these documents cannot be fulfilled during this mandatory retention period. We will inform you of this if you make such a request.</p>
            </div>
          </div>

          <div id="pn-8" style={sectionStyle}>
            <h2 style={h2Style}>8. Your Rights Under UK GDPR</h2>
            <p style={pStyle}>You have the following rights in relation to your personal data held by Vale and Mercer Ltd. We will respond to all requests within <strong>one calendar month</strong>, free of charge.</p>
            <ol style={{paddingLeft:'20px',marginBottom:'16px'}}>
              {[['Right of Access (Subject Access Request)','You may request a copy of all personal data we hold about you. We will provide this in a clear format within one calendar month. We may ask you to verify your identity before responding.'],['Right to Rectification','If any data we hold about you is inaccurate or incomplete, you may ask us to correct it. We will update our records and notify any relevant third parties where applicable.'],['Right to Erasure ("Right to be Forgotten")','You may request that we delete your personal data. We will comply unless we are required to retain it by law, for example, AML identity records, contract documents, or financial records, which we are legally obliged to keep.'],['Right to Restrict Processing','You may ask us to pause our use of your personal data while a concern or dispute is being resolved. We will flag the record accordingly and suspend active processing.'],['Right to Data Portability','Where our lawful basis is consent or contract, you may request your data in a structured, commonly used, machine-readable format (e.g. CSV or PDF).'],['Right to Object','You have an absolute right to object to your data being used for direct marketing: we will stop immediately on receipt of your objection. You may also object to processing based on legitimate interests, and we will assess your objection and respond within one calendar month.'],['Rights Related to Automated Decision-Making','We do not currently make any automated decisions that produce legal or similarly significant effects on you. We will update this notice if this changes.']].map(([title,desc])=>(
                <li key={title} style={{...liStyle,marginBottom:'10px'}}><strong>{title}</strong><br/>{desc}</li>
              ))}
            </ol>
            <p style={pStyle}><strong>To exercise any of these rights</strong>, please contact: <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a></p>
            <p style={pStyle}>If you are unsatisfied with our response, you may escalate your complaint to the ICO (see Section 13 below).</p>
          </div>

          <div id="pn-9" style={sectionStyle}>
            <h2 style={h2Style}>9. Cookies</h2>
            <p style={pStyle}>Our website uses cookies. A <strong>cookie</strong> is a small text file placed on your device when you visit a website. We use the following categories of cookies:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              <li style={liStyle}><strong>Strictly necessary cookies:</strong> Required for core website functions (e.g. security, login sessions). These do not require your consent and cannot be disabled.</li>
              <li style={liStyle}><strong>Analytics cookies</strong> (Google Analytics 4): These help us understand how visitors use our website so we can improve it. They require your <strong>prior consent</strong>, which you can give or withdraw via our cookie consent banner at any time.</li>
              <li style={liStyle}><strong>Marketing and remarketing cookies</strong> (Meta Pixel and, if activated, Google Ads): These allow us to measure our advertising and to display relevant advertisements to you when you use other websites and social media. They require your <strong>prior consent</strong> via our cookie consent banner.</li>
            </ul>
            <p style={pStyle}>You can manage and withdraw your cookie consent at any time using the cookie settings link in our website footer. Withdrawing consent will not affect the lawfulness of any processing that took place before you withdrew it.</p>
            <p style={pStyle}>For full details of every cookie used on this website, including names, durations, and how to withdraw consent, see our <Link href="/cookie-policy" style={{color:'#A0845C',textDecoration:'underline'}}>Cookie Policy</Link>.</p>
          </div>

          <div id="pn-10" style={sectionStyle}>
            <h2 style={h2Style}>10. Direct Marketing and Electronic Communications</h2>
            <p style={pStyle}>We will only send you marketing emails, text messages, or other electronic marketing communications if you have <strong>explicitly opted in</strong> to receive them from us. This is a requirement of the Privacy and Electronic Communications Regulations 2003 (PECR).</p>
            <p style={pStyle}>Every marketing communication we send will include a prominent and easy <strong>unsubscribe</strong> mechanism. You may withdraw your consent to receive marketing at any time by:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              <li style={liStyle}>Clicking the unsubscribe link in any marketing email, or</li>
              <li style={liStyle}>Contacting us at <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a></li>
            </ul>
            <p style={pStyle}>Withdrawal of consent for marketing does not affect any other processing we carry out on a different lawful basis (e.g. managing your tenancy under contract).</p>
          </div>

          <div id="pn-11" style={sectionStyle}>
            <h2 style={h2Style}>11. How We Keep Your Data Secure</h2>
            <p style={pStyle}>We implement appropriate technical and organisational security measures as required by UK GDPR Article 32, including encryption, access controls, two-factor authentication, and secure cloud processing under Data Processing Agreements with our providers. We maintain a documented breach response procedure and will notify the ICO within 72 hours of any notifiable breach.</p>
          </div>

          <div id="pn-12" style={sectionStyle}>
            <h2 style={h2Style}>12. Changes to This Privacy Notice</h2>
            <p style={pStyle}>We review this notice at least annually and whenever the law changes or our processing activities change materially. The version number and date at the top of this notice show when it was last updated. Where changes are significant, we will notify you directly by email or by a prominent notice on our website.</p>
          </div>

          <div id="pn-13" style={sectionStyle}>
            <h2 style={h2Style}>13. How to Complain</h2>
            <p style={pStyle}>If you have any concerns about how Vale and Mercer Ltd handle your personal data, please contact us in the first instance:</p>
            <p style={pStyle}><strong>Email:</strong> <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a><br/><strong>Post:</strong> Vale and Mercer Ltd, 124 City Road, London EC1V 2NX</p>
            <p style={pStyle}>We will acknowledge your complaint within <strong>3 working days</strong> and aim to give you a full written response within <strong>15 working days</strong>.</p>
            <p style={pStyle}>You can raise a data protection complaint with us in any way that suits you, including by email, post, telephone or through our website. We will keep you informed of progress and tell you the outcome.</p>
            <p style={pStyle}>If you are not satisfied with our response, you have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong>, the UK's supervisory authority for data protection:</p>
            <div style={{background:'var(--border)',padding:'16px 20px',fontSize:'13px',color:'var(--text-muted)',lineHeight:1.9}}>
              <p>Website: <a href="https://ico.org.uk/make-a-complaint" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>ico.org.uk/make-a-complaint</a></p>
              <p>Telephone: 0303 123 1113 (Monday to Friday, 9am to 5pm)</p>
              <p>Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
            </div>
            <p style={{...pStyle,marginTop:'12px'}}>You also have the right to seek judicial remedy through the courts.</p>
          </div>

          <div style={{borderTop:'0.5px solid var(--border)',paddingTop:'24px',fontSize:'11px',color:'var(--text-faint)',lineHeight:1.8}}>
            <p>Vale and Mercer Ltd, Registered in England and Wales</p>
            <p>Company Registration No: 17212434 | ICO Registration No: ZC155397</p>
            <p>Document Reference: VM-PN-001 | Version 2.1 | October 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
