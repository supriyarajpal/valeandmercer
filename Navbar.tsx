'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const pathname = usePathname()

  const darkHeroPages = ['/', '/sell', '/let', '/about', '/valuations']
  const isDarkHero = darkHeroPages.includes(pathname)

  useEffect(() => {
    const checkSize = () => setMobile(window.innerWidth < 900)
    const checkScroll = () => setScrolled(window.scrollY > 80)
    checkSize()
    checkScroll()
    window.addEventListener('resize', checkSize)
    window.addEventListener('scroll', checkScroll)
    return () => {
      window.removeEventListener('resize', checkSize)
      window.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const isLight = !scrolled && !isDarkHero
  const logoColor = scrolled ? '#EFECE6' : isDarkHero ? 'rgba(239,236,230,0.92)' : 'rgba(40,35,28,0.75)'
  const linkColor = scrolled ? 'rgba(239,236,230,0.95)' : isDarkHero ? 'rgba(239,236,230,0.8)' : 'rgba(40,35,28,0.7)'
  const btnBorder = isLight ? '1px solid rgba(40,35,28,0.28)' : '1px solid rgba(239,236,230,0.45)'
  const hamburgerColor = isLight ? 'rgba(40,35,28,0.6)' : 'rgba(239,236,230,0.9)'
  const navBg = scrolled ? 'rgba(40,35,28,0.45)' : 'transparent'

  const links = [
    {label:'Lettings',href:'/let'},
    {label:'New Homes',href:'/buy'},
    {label:'About',href:'/about'},
    {label:'Blog',href:'/blog'},
  ]

  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:navBg,backdropFilter:scrolled?'blur(24px) saturate(140%)':'none',WebkitBackdropFilter:scrolled?'blur(24px) saturate(140%)':'none',transition:'background 0.4s ease, backdrop-filter 0.4s ease'}}>
        <div style={{padding:'18px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:'1280px',margin:'0 auto',gap:'24px'}}>
          <Link href='/' style={{display:'inline-flex',alignItems:'center',fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'16px',fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:logoColor,textDecoration:'none',flexShrink:0,lineHeight:1,height:'32px',transition:'color 0.4s ease'}}>
            Vale <span style={{color:'#A0845C',margin:'0 0.15em'}}>&</span> Mercer
          </Link>
          {mobile ? (
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:'transparent',border:'none',cursor:'pointer',padding:'6px',display:'flex',flexDirection:'column',gap:'5px',flexShrink:0}} aria-label='Menu'>
              <span style={{display:'block',width:'24px',height:'1.5px',background:hamburgerColor,transition:'all 0.3s',transform:menuOpen?'rotate(45deg) translate(4px,5px)':'none'}} />
              <span style={{display:'block',width:'24px',height:'1.5px',background:hamburgerColor,transition:'all 0.3s',opacity:menuOpen?0:1}} />
              <span style={{display:'block',width:'24px',height:'1.5px',background:hamburgerColor,transition:'all 0.3s',transform:menuOpen?'rotate(-45deg) translate(4px,-5px)':'none'}} />
            </button>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:'28px',flexShrink:0,flexWrap:'nowrap'}}>
              {links.map((link)=>(
                <Link key={link.href} href={link.href} style={{display:'inline-flex',alignItems:'center',height:'32px',fontSize:'11px',letterSpacing:'0.12em',textTransform:'uppercase',color:linkColor,textDecoration:'none',lineHeight:1,whiteSpace:'nowrap',transition:'color 0.4s ease'}}>{link.label}</Link>
              ))}
              <Link href='/valuations' style={{display:'inline-flex',alignItems:'center',height:'32px',fontSize:'11px',letterSpacing:'0.12em',textTransform:'uppercase',border:btnBorder,color:linkColor,padding:'0 16px',textDecoration:'none',lineHeight:1,whiteSpace:'nowrap',transition:'all 0.4s ease'}}>Book Valuation</Link>
            </div>
          )}
        </div>
      </nav>
      {mobile && menuOpen && (
        <div style={{position:'fixed',inset:0,zIndex:99,background:'rgba(40,35,28,0.97)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'22px',padding:'20px'}}>
          <button onClick={()=>setMenuOpen(false)} style={{position:'absolute',top:'16px',right:'20px',background:'transparent',border:'none',cursor:'pointer',color:'rgba(239,236,230,0.5)',fontSize:'32px',lineHeight:1,fontFamily:'sans-serif'}}>x</button>
          {[...links,{label:'Book Valuation',href:'/valuations'}].map((link)=>(
            <Link key={link.label} href={link.href} onClick={()=>setMenuOpen(false)} style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'30px',fontWeight:300,color:'#EFECE6',textDecoration:'none',letterSpacing:'0.04em',textAlign:'center'}}>{link.label}</Link>
          ))}
        </div>
      )}
    </>
  )
}