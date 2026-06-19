import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CookiesPage() {
  const tableStyle:React.CSSProperties = {width:'100%',borderCollapse:'collapse',fontSize:'13px',marginBottom:'16px'}
  const thStyle:React.CSSProperties = {padding:'10px 12px',textAlign:'left',background:'#DDD7CC',color:'#4A4036',fontWeight:500,borderBottom:'1px solid #C8C0B4'}
  const tdStyle:React.CSSProperties = {padding:'10px 12px',color:'#6B6258',borderBottom:'0.5px solid #DDD7CC',verticalAlign:'top',lineHeight:1.7}
  const h2Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#4A4036',marginBottom:'14px',marginTop:'0'}
  const h3Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'18px',fontWeight:300,color:'#4A4036',marginBottom:'10px',marginTop:'20px'}
  const pStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'12px'}
  const liStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'4px'}
  const sectionStyle:React.CSSProperties = {marginBottom:'40px',paddingBottom:'40px',borderBottom:'0.5px solid #DDD7CC'}
  const codeStyle:React.CSSProperties = {fontFamily:'monospace',fontSize:'12px',background:'#DDD7CC',padding:'2px 5px',borderRadius:'2px',color:'#4A4036'}

  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Legal</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'#4A4036',marginBottom:'8px'}}>Cookie Policy</h1>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'32px'}}>VM-CP-001 | Version 1.1 | May 2026 | Company Registration No: 17212434</p>

          <div style={{background:'#28231C',padding:'28px 32px',marginBottom:'16px'}}>
            <p style={{fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#A0845C',marginBottom:'14px'}}>At a Glance</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {['We use essential cookies to run the site and keep it secure. No consent needed.','Analytics cookies (Google Analytics) help us improve the site and require your consent. They are off by default.','Marketing cookies for Google Ads are off by default and only switched on if you choose "Accept Marketing."','You can change your choices at any time via "Cookie Settings" in the footer.'].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                  <div style={{width:'4px',height:'4px',borderRadius:'50%',background:'#A0845C',flexShrink:0,marginTop:'8px'}} />
                  <span style={{fontSize:'13px',color:'rgba(239,236,230,0.7)',lineHeight:1.7}}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'#DDD7CC',padding:'14px 20px',marginBottom:'40px',fontSize:'12px',color:'#6B6258',lineHeight:1.8}}>
            <p style={{fontWeight:500,color:'#4A4036',marginBottom:'6px',fontSize:'12px'}}>Jump to section:</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {[['1','What Are Cookies'],['2','Who We Are'],['3','Legal Framework'],['4','Cookies We Use'],['5','Third Party Cookies'],['6','Managing Preferences'],['7','Consent and Withdrawal'],['8','International Transfers'],['9','Changes to This Policy'],['10','Contact and Complaints']].map(([id,label])=>(
                <a key={id} href={'#cp-'+id} style={{fontSize:'11px',color:'#A0845C',textDecoration:'none',borderBottom:'1px solid #A0845C',paddingBottom:'1px'}}>{label}</a>
              ))}
            </div>
          </div>

          <div id="cp-1" style={sectionStyle}>
            <h2 style={h2Style}>1. What Are Cookies?</h2>
            <p style={pStyle}>A cookie is a small text file that is downloaded onto your device (computer, smartphone, or tablet) when you visit a website. Cookies allow the website to recognize your device on subsequent visits and to store certain information about your preferences or past actions on the site.</p>
            <p style={pStyle}>Cookies and similar technologies — including tracking pixels, web storage, and device fingerprinting — are regulated in the United Kingdom by the <strong>Privacy and Electronic Communications Regulations 2003 (PECR)</strong>, as amended by the <strong>Data (Use and Access) Act 2025 (DUAA 2025)</strong>, alongside the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>.</p>
            <p style={pStyle}>Vale and Mercer Ltd is committed to full compliance with these laws and to being transparent about every cookie or similar technology used on this website.</p>
          </div>

          <div id="cp-2" style={sectionStyle}>
            <h2 style={h2Style}>2. Who We Are</h2>
            <div style={{overflowX:'auto'}}>
              <table style={tableStyle}>
                <tbody>
                  {[['Company','Vale and Mercer Ltd'],['Company Registration No','17212434'],['Data Controller','Vale and Mercer Ltd, registered with the ICO under UK GDPR'],['ICO Registration No','ZC155397'],['Cookie enquiries','privacy@valeandmercer.co.uk']].map(([k,v])=>(
                    <tr key={k}><th style={{...thStyle,width:'35%'}}>{k}</th><td style={tdStyle}>{k==='Cookie enquiries'?<a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>{v}</a>:v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="cp-3" style={sectionStyle}>
            <h2 style={h2Style}>3. The Legal Framework — What the Law Requires</h2>
            <p style={pStyle}>Under Regulation 6 of PECR, Vale and Mercer Ltd must:</p>
            <ol style={{paddingLeft:'20px',marginBottom:'12px'}}>
              <li style={liStyle}><strong>Tell you</strong> that cookies are present on this website</li>
              <li style={liStyle}><strong>Explain clearly</strong> what each cookie does and why</li>
              <li style={liStyle}><strong>Obtain your prior consent</strong> before setting any cookie that is not strictly necessary for the website to function</li>
            </ol>
            <p style={pStyle}>The DUAA 2025, which came into force on 5 February 2026, introduced a limited exemption for qualifying first-party analytics cookies. Where it does not apply — in particular for all advertising and marketing cookies — <strong>explicit prior consent is mandatory, and no cookie is set until that consent is given.</strong></p>
            <p style={pStyle}>Consent must be freely given, specific, informed, unambiguous, and as easy to withdraw as to give — via the "Cookie Settings" link in the footer of every page.</p>
            <div style={{background:'#DDD7CC',padding:'16px 20px',borderLeft:'3px solid #A0845C',marginTop:'12px'}}>
              <p style={{...pStyle,marginBottom:'4px'}}><strong>Advertising and Marketing Cookies — Important Notice</strong></p>
              <p style={{...pStyle,marginBottom:0}}>Vale and Mercer Ltd runs Google Ads advertising campaigns. All advertising and remarketing cookies require your <strong>explicit prior consent</strong> under PECR. These cookies are <strong>blocked by default</strong> and only activated if you click "Accept Marketing" on the consent banner.</p>
            </div>
          </div>

          <div id="cp-4" style={sectionStyle}>
            <h2 style={h2Style}>4. Cookies Used on This Website</h2>
            <p style={pStyle}>The cookies on the Vale and Mercer Ltd website fall into four categories. Only strictly necessary cookies are set without prior consent.</p>

            <h3 style={h3Style}>4.1 Strictly Necessary Cookies</h3>
            <p style={pStyle}>These cookies are essential for this website to function. They cannot be disabled. No consent is required. Blocking these cookies will prevent the website from working correctly.</p>
            <div style={{overflowX:'auto',marginBottom:'16px'}}>
              <table style={{...tableStyle,minWidth:'600px'}}>
                <thead><tr><th style={thStyle}>Cookie Name</th><th style={thStyle}>Set By</th><th style={thStyle}>Purpose</th><th style={thStyle}>Data Collected</th><th style={thStyle}>Duration</th></tr></thead>
                <tbody>
                  {[['__vercel_live_token','Vercel Inc','Enables the website to be served correctly and securely','Technical routing data only — no personal data identifiable to you','Session'],['_vercel_jwt','Vercel Inc','Authentication and security token for protected deployments','Encrypted token — no readable personal data','Session'],['cookie_consent','Vale and Mercer Ltd','Stores your cookie consent preferences so you are not asked again on every page visit','Your consent choices: Accept/Decline per category; timestamp of consent','1 year']].map(([name,by,purpose,data,dur],i)=>(
                    <tr key={i} style={{background:i%2===0?'#EFECE6':'#F5F2EE'}}><td style={tdStyle}><code style={codeStyle}>{name}</code></td><td style={tdStyle}>{by}</td><td style={tdStyle}>{purpose}</td><td style={tdStyle}>{data}</td><td style={{...tdStyle,color:'#A0845C'}}>{dur}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={pStyle}><strong>Vercel Note:</strong> Vale and Mercer Ltd's website is built and hosted using Vercel. As the infrastructure provider, Vercel may set technical cookies to deliver the website. Vercel operates as a data processor under a signed Data Processing Agreement. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>vercel.com/legal/privacy-policy</a> for Vercel's own data practices.</p>

            <h3 style={h3Style}>4.2 Analytics Cookies</h3>
            <p style={pStyle}>These cookies help Vale and Mercer Ltd understand how visitors use this website. This information is used solely to improve the website and is never sold or shared with third parties for their own purposes.</p>
            <p style={pStyle}><strong>DUAA 2025 Position:</strong> Vale and Mercer Ltd configure Google Analytics 4 to seek qualification for the DUAA 2025 analytics cookie exemption. However, as the ICO has not yet issued finalised guidance for small businesses on this exemption, Vale and Mercer Ltd continues to obtain consent via the cookie banner as an additional compliance safeguard.</p>
            <div style={{overflowX:'auto',marginBottom:'16px'}}>
              <table style={{...tableStyle,minWidth:'600px'}}>
                <thead><tr><th style={thStyle}>Cookie Name</th><th style={thStyle}>Set By</th><th style={thStyle}>Purpose</th><th style={thStyle}>Duration</th><th style={thStyle}>Consent</th></tr></thead>
                <tbody>
                  {[['_ga','Google Analytics 4 (Google LLC)','Distinguishes unique website visitors using a randomly generated identifier','2 years','Yes — via banner'],['_ga_[ID]','Google Analytics 4','Stores and counts page views for this specific Vale and Mercer GA4 property','2 years','Yes — via banner'],['_gid','Google Analytics 4','Distinguishes users over a 24-hour period','24 hours','Yes — via banner']].map(([name,by,purpose,dur,consent],i)=>(
                    <tr key={i} style={{background:i%2===0?'#EFECE6':'#F5F2EE'}}><td style={tdStyle}><code style={codeStyle}>{name}</code></td><td style={tdStyle}>{by}</td><td style={tdStyle}>{purpose}</td><td style={{...tdStyle,color:'#A0845C'}}>{dur}</td><td style={{...tdStyle,fontWeight:500,color:'#A0845C'}}>{consent}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background:'#DDD7CC',padding:'14px 18px',marginBottom:'16px'}}>
              <p style={{...pStyle,fontWeight:500,marginBottom:'6px'}}>GA4 Privacy Configuration applied by Vale and Mercer Ltd:</p>
              <ul style={{paddingLeft:'18px',margin:0}}>
                {['Google Signals: Disabled — no cross-device tracking','Data sharing with Google products and services: Disabled','Data retention period: 2 months minimum — deleted automatically','IP anonymization: Enabled — your precise IP address is never stored','Demographic and interest reporting: Disabled'].map(item=>(
                  <li key={item} style={{...liStyle,marginBottom:'2px'}}>{item}</li>
                ))}
              </ul>
            </div>

            <h3 style={h3Style}>4.3 Advertising and Marketing Cookies</h3>
            <div style={{background:'#DDD7CC',padding:'14px 18px',marginBottom:'12px',borderLeft:'3px solid #A0845C'}}>
              <p style={{...pStyle,fontWeight:500,marginBottom:'4px'}}>Current Status: Not yet active</p>
              <p style={{...pStyle,marginBottom:0}}>Google Ads cookies described in this section are not currently active on this website and will only be used if and when campaigns are launched. This Cookie Policy will be updated before any such cookies are activated, and where required by law, your consent will be obtained first.</p>
            </div>
            <p style={pStyle}><strong>These cookies are set only if you click "Accept Marketing" on the cookie consent banner. They are blocked by default.</strong> You may withdraw consent at any time via "Cookie Settings" in the footer.</p>
            <div style={{overflowX:'auto',marginBottom:'16px'}}>
              <table style={{...tableStyle,minWidth:'600px'}}>
                <thead><tr><th style={thStyle}>Cookie Name</th><th style={thStyle}>Set By</th><th style={thStyle}>Purpose</th><th style={thStyle}>Duration</th><th style={thStyle}>Consent</th></tr></thead>
                <tbody>
                  {[['_gcl_au','Google Ads (Google LLC)','Conversion tracking — links a click on a Vale and Mercer Ltd Google Ad to a subsequent action taken on this website','3 months','Yes — explicit'],['IDE','Google LLC (DoubleClick)','Remarketing — records that you visited this website so Google can show you Vale and Mercer Ltd advertisements on other websites','13 months','Yes — explicit'],['DSID','Google LLC (DoubleClick)','Used in conjunction with IDE to sync your advertising ID across Google ad platforms','2 weeks','Yes — explicit'],['__gads / __gpi','Google LLC','Stores advertising preferences and prevents the same ad from being shown too many times','13 months','Yes — explicit'],['_gac_[ID]','Google Ads (Google LLC)','Links Google Ads campaign data to conversions recorded in GA4','90 days','Yes — explicit']].map(([name,by,purpose,dur,consent],i)=>(
                    <tr key={i} style={{background:i%2===0?'#EFECE6':'#F5F2EE'}}><td style={tdStyle}><code style={codeStyle}>{name}</code></td><td style={tdStyle}>{by}</td><td style={tdStyle}>{purpose}</td><td style={{...tdStyle,color:'#A0845C'}}>{dur}</td><td style={{...tdStyle,fontWeight:500,color:'#A0845C'}}>{consent}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={pStyle}><strong>What advertising cookies do NOT collect:</strong> They do not collect your name, email address, telephone number, postal address, property search history, or financial information. The identifiers they use are pseudonymous and linked to your browser or device — not to your identity — unless you have separately signed into a Google account.</p>
            <p style={pStyle}><strong>Your right to opt out of Google's advertising personalisation entirely</strong> can be exercised at: <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>myaccount.google.com/data-and-privacy</a>  "Ad settings."</p>

            <h3 style={h3Style}>4.4 Functionality Cookies</h3>
            <p style={pStyle}><strong>Current status:</strong> No functionality cookies beyond the consent preference cookie (Section 4.1) are currently in use. This section will be updated if functionality cookies are introduced. Any future functionality cookies will be listed in an updated version of this policy and, where required by law, will only be set after you have given consent.</p>
          </div>

          <div id="cp-5" style={sectionStyle}>
            <h2 style={h2Style}>5. Cookies Set by Third Parties</h2>
            <p style={pStyle}>Some cookies are set by third-party organisations whose services are integrated into this website. Vale and Mercer Ltd does not control these third parties' broader cookie practices.</p>
            <div style={{overflowX:'auto'}}>
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Third Party</th><th style={thStyle}>Role on This Site</th><th style={thStyle}>Their Privacy and Cookie Policy</th></tr></thead>
                <tbody>
                  {[['Google LLC','Analytics (GA4) and advertising (Google Ads, DoubleClick)','policies.google.com/privacy'],['Vercel Inc','Website infrastructure and hosting','vercel.com/legal/privacy-policy']].map(([party,role,link],i)=>(
                    <tr key={i} style={{background:i%2===0?'#EFECE6':'#F5F2EE'}}><td style={{...tdStyle,fontWeight:500}}>{party}</td><td style={tdStyle}>{role}</td><td style={tdStyle}><a href={'https://'+link} target="_blank" rel="noreferrer" style={{color:'#A0845C',fontSize:'12px'}}>{link}</a></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="cp-6" style={sectionStyle}>
            <h2 style={h2Style}>6. How to Manage Your Cookie Preferences</h2>
            <h3 style={h3Style}>Via the Cookie Consent Banner</h3>
            <p style={pStyle}>When you first visit the Vale and Mercer Ltd website, a cookie consent banner will be displayed. You can accept or decline each category of non-essential cookie separately. You can change your preferences at any time using the <strong>"Cookie Settings"</strong> link in the footer of every page on this website.</p>
            <h3 style={h3Style}>Via Your Browser Settings</h3>
            <p style={pStyle}>You can manage or delete cookies at any time through your browser settings. Deleting cookies will remove your stored consent preferences — the cookie consent banner will reappear on your next visit.</p>
            <h3 style={h3Style}>Opting Out of Google Analytics</h3>
            <p style={pStyle}>Install the <strong>Google Analytics Opt-Out Browser Add-on</strong> (free, provided by Google): <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>tools.google.com/dlpage/gaoptout</a>. This prevents your visits from being included in Google Analytics data across all websites that use GA.</p>
            <h3 style={h3Style}>Opting Out of Google Advertising Personalisation</h3>
            <p style={pStyle}>Visit <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>myaccount.google.com/data-and-privacy</a> and select "Ad settings" to turn off personalised advertising across Google's entire network.</p>
          </div>

          <div id="cp-7" style={sectionStyle}>
            <h2 style={h2Style}>7. Consent Record and Withdrawal</h2>
            <p style={pStyle}>Vale and Mercer Ltd records your cookie consent choice via the <code style={codeStyle}>cookie_consent</code> cookie. This ensures you are not asked again on every visit.</p>
            <p style={pStyle}><strong>To withdraw consent at any time:</strong></p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              <li style={liStyle}>Click <strong>"Cookie Settings"</strong> in the footer and change your preferences — non-essential cookies will be deactivated immediately</li>
              <li style={liStyle}>Clear all cookies in your browser settings</li>
              <li style={liStyle}>Email <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a> and we will arrange removal</li>
            </ul>
            <p style={pStyle}>Withdrawing cookie consent does not affect any prior processing carried out while consent was in place.</p>
          </div>

          <div id="cp-8" style={sectionStyle}>
            <h2 style={h2Style}>8. International Data Transfers</h2>
            <p style={pStyle}>Google Analytics and Google Ads data is processed by Google LLC, which is based in the United States of America. This transfer takes place under <strong>Standard Contractual Clauses (SCCs) with a UK Addendum</strong> approved by the Information Commissioner's Office, in accordance with UK GDPR Article 46(2)(c).</p>
            <p style={pStyle}>Vercel Inc may also process technical website infrastructure data in the United States under equivalent approved transfer safeguards. No other cookie-related personal data is transferred outside the United Kingdom.</p>
          </div>

          <div id="cp-9" style={sectionStyle}>
            <h2 style={h2Style}>9. Changes to This Cookie Policy</h2>
            <p style={pStyle}>Vale and Mercer Ltd will update this Cookie Policy before:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              {['Any new cookie or tracking technology is added to the website','The purpose or duration of an existing cookie changes','A new advertising campaign is launched using a new cookie or pixel','The law changes (including further ICO guidance under the DUAA 2025)'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>The version number and date at the top of this policy show when it was last updated. Where changes are material (e.g. a new category of cookie is added), the cookie consent banner will re-appear on your next visit to request updated consent.</p>
          </div>

          <div id="cp-10" style={sectionStyle}>
            <h2 style={h2Style}>10. Contact and Complaints</h2>
            <p style={pStyle}><strong>Data Protection enquiries and cookie questions:</strong><br/>Email: <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a></p>
            <p style={pStyle}>If you believe Vale and Mercer Ltd has not handled your cookie data correctly, you have the right to lodge a complaint with the Information Commissioner's Office:</p>
            <div style={{background:'#DDD7CC',padding:'16px 20px',fontSize:'13px',color:'#6B6258',lineHeight:1.9}}>
              <p>Website: <a href="https://ico.org.uk/make-a-complaint" target="_blank" rel="noreferrer" style={{color:'#A0845C'}}>ico.org.uk/make-a-complaint</a></p>
              <p>Telephone: 0303 123 1113</p>
              <p>Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
            </div>
          </div>

          <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'24px',fontSize:'11px',color:'#9A9188',lineHeight:1.8}}>
            <p>Vale and Mercer Ltd — Registered in England and Wales</p>
            <p>Company Registration No: 17212434 | ICO Registration No: ZC155397</p>
            <p>Document Reference: VM-CP-001 | Version 1.1 | May 2026</p>
            <p>Legal basis: PECR 2003 (as amended), Data (Use and Access) Act 2025, UK GDPR Art. 6(1)(a), DPA 2018</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
