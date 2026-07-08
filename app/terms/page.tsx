import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Terms of Use',
  description: 'Terms governing use of the Vale and Mercer website, including acceptance, intellectual property, and limitation of liability.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  const h2Style:React.CSSProperties = {fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#4A4036',marginBottom:'12px',marginTop:'0'}
  const pStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'12px'}
  const liStyle:React.CSSProperties = {fontSize:'14px',lineHeight:1.9,color:'#6B6258',marginBottom:'4px'}
  const sectionStyle:React.CSSProperties = {marginBottom:'36px',paddingBottom:'36px',borderBottom:'0.5px solid #DDD7CC'}

  return (
    <>
      <Navbar />
      <main style={{background:'#F2EFE9',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 20px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'12px'}}>Legal</p>
          <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(32px,5vw,48px)',fontWeight:300,color:'#4A4036',marginBottom:'8px'}}>Website Terms of Use</h1>
          <p style={{fontSize:'12px',color:'#9A9188',marginBottom:'32px'}}>VM-TOU-001 | Version 1.0 | June 2026 | Company Registration No: 17212434</p>

          <div id="s1" style={sectionStyle}>
            <h2 style={h2Style}>1. Who We Are</h2>
            <p style={pStyle}>This website is operated by Vale and Mercer Ltd, a company registered in England and Wales.</p>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <tbody>
                  {[['Company Name','Vale and Mercer Ltd'],['Company Registration No','17212434'],['Registered Office','124 City Road, London EC1V 2NX'],['Email','privacy@valeandmercer.co.uk'],['ICO Registration No','ZC155397']].map(([k,v])=>(
                    <tr key={k} style={{borderBottom:'0.5px solid #DDD7CC'}}>
                      <td style={{padding:'10px 12px 10px 0',color:'#9A9188',width:'40%',fontWeight:500,fontSize:'13px'}}>{k}</td>
                      <td style={{padding:'10px 0',color:'#6B6258',fontSize:'13px'}}>{k==='Email'?<a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>{v}</a>:v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="s2" style={sectionStyle}>
            <h2 style={h2Style}>2. Acceptance of These Terms</h2>
            <p style={pStyle}>By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, you must stop using this website immediately.</p>
            <p style={pStyle}>These Terms apply to all visitors, including those who register an interest via our contact or enquiry forms.</p>
          </div>

          <div id="s3" style={sectionStyle}>
            <h2 style={h2Style}>3. Use of This Website</h2>
            <p style={pStyle}>This website is provided for informational purposes only. You may use it to learn about our services and to register your interest in buying, selling, letting, or renting a property.</p>
            <p style={pStyle}>You must not:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              {['Use this website for any unlawful purpose','Attempt to gain unauthorised access to any part of the website or its underlying systems','Transmit any harmful, offensive, or fraudulent content through our enquiry forms','Reproduce, copy, or redistribute any content from this website without our prior written consent'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
          </div>

          <div id="s4" style={sectionStyle}>
            <h2 style={h2Style}>4. Registering Your Interest</h2>
            <p style={pStyle}>When you submit an enquiry or interest registration form on this website, you are not entering into a contract with Vale and Mercer Ltd. You are simply requesting that we contact you. No legally binding agreement is created until a formal instruction letter or tenancy agreement has been signed by both parties.</p>
            <p style={pStyle}>We will use the information you provide solely to respond to your enquiry and, where you have consented, to send you relevant property updates. For full details of how we handle your data, see our <Link href="/privacy" style={{color:'#A0845C'}}>Privacy Notice</Link>.</p>
          </div>

          <div id="s5" style={sectionStyle}>
            <h2 style={h2Style}>5. Accuracy of Information</h2>
            <p style={pStyle}>We take reasonable care to ensure the information on this website is accurate and up to date. However, property information, availability, and pricing change frequently. Nothing on this website constitutes a formal offer, valuation, or representation regarding any property.</p>
            <p style={pStyle}>You should not rely solely on information published on this website when making any property or financial decision. We recommend you seek independent professional advice where appropriate.</p>
          </div>

          <div id="s6" style={sectionStyle}>
            <h2 style={h2Style}>6. Intellectual Property</h2>
            <p style={pStyle}>All content on this website, including text, photographs, property descriptions, graphics, and the Vale and Mercer Ltd name and branding, is owned by or licensed to Vale and Mercer Ltd and is protected by copyright and other intellectual property laws.</p>
            <p style={pStyle}>You may view and print pages from this website for your own personal, non-commercial use only. You must not copy, reproduce, republish, or distribute any content from this website for commercial purposes without our prior written permission.</p>
          </div>

          <div id="s7" style={sectionStyle}>
            <h2 style={h2Style}>7. Third-Party Links</h2>
            <p style={pStyle}>This website may contain links to third-party websites, including property portals and regulatory bodies. These links are provided for your convenience only. Vale and Mercer Ltd has no control over the content of those websites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>
          </div>

          <div id="s8" style={sectionStyle}>
            <h2 style={h2Style}>8. Marketing Communications</h2>
            <p style={pStyle}>If you register your interest on our website and consent to receiving marketing communications, we may send you property updates, market news, and information about our services by email. You may withdraw this consent at any time by clicking the unsubscribe link in any email we send, or by emailing <a href="mailto:privacy@valeandmercer.co.uk" style={{color:'#A0845C'}}>privacy@valeandmercer.co.uk</a>.</p>
            <p style={pStyle}>We will only send you marketing communications in accordance with our Privacy Notice and the Privacy and Electronic Communications Regulations 2003 (PECR).</p>
          </div>

          <div id="s9" style={sectionStyle}>
            <h2 style={h2Style}>9. Limitation of Liability</h2>
            <p style={pStyle}>To the fullest extent permitted by law, Vale and Mercer Ltd excludes all liability for any loss or damage, whether direct, indirect, or consequential, arising from:</p>
            <ul style={{paddingLeft:'20px',marginBottom:'12px'}}>
              {['Your use of, or inability to use, this website','Any reliance placed on information published on this website','Any interruption, suspension, or termination of the website'].map(item=>(
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>Nothing in these Terms limits our liability for fraud, death, or personal injury caused by our negligence, or any other liability that cannot be excluded or limited by law.</p>
          </div>

          <div id="s10" style={sectionStyle}>
            <h2 style={h2Style}>10. Website Availability</h2>
            <p style={pStyle}>We do not guarantee that this website will be available at all times or free from errors or interruptions. We may suspend, withdraw, or change any part of the website without notice.</p>
          </div>

          <div id="s11" style={sectionStyle}>
            <h2 style={h2Style}>11. Cookies</h2>
            <p style={pStyle}>This website uses cookies. For full details of the cookies we use and how to manage your preferences, see our <Link href="/cookies" style={{color:'#A0845C'}}>Cookie Policy</Link>.</p>
          </div>

          <div id="s12" style={sectionStyle}>
            <h2 style={h2Style}>12. Governing Law</h2>
            <p style={pStyle}>These Terms of Use are governed by the laws of England and Wales. Any dispute arising from your use of this website shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div id="s13" style={{marginBottom:'36px'}}>
            <h2 style={h2Style}>13. Changes to These Terms</h2>
            <p style={pStyle}>We may update these Terms of Use from time to time. The version number and date at the top of this page show when they were last updated. Your continued use of this website after any changes constitutes your acceptance of the updated Terms.</p>
          </div>

          <div style={{borderTop:'0.5px solid #DDD7CC',paddingTop:'24px',fontSize:'11px',color:'#9A9188',lineHeight:1.8}}>
            <p>Vale and Mercer Ltd, Registered in England and Wales</p>
            <p>Company Registration No: 17212434 | ICO Registration No: ZC155397</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
