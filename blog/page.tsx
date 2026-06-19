import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const posts = [
  {slug:'london-property-market-2025',category:'Market Insight',title:'The London property market in 2025',excerpt:'Supply is up, rates have settled a little, and buyers are moving again. Here is what we are seeing.',date:'May 2025',image:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'},
  {slug:'guide-to-buying-in-chelsea',category:'Buying Guide',title:'Your complete guide to buying in Chelsea SW3',excerpt:'What to expect, where to look, and what the streets actually feel like. A practical guide to buying in SW3.',date:'April 2025',image:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'},
  {slug:'student-lettings-london-guide',category:'Student Living',title:'Renting in London as a student',excerpt:'No jargon, no hidden fees. Everything you need to find a good home near your university and avoid the common pitfalls.',date:'March 2025',image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'},
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{background:'#EFECE6',paddingTop:'120px',paddingBottom:'80px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 1.5rem'}}>
          <div style={{marginBottom:'56px'}}>
            <p style={{fontSize:'10px',letterSpacing:'0.28em',textTransform:'uppercase',color:'#A0845C',marginBottom:'16px'}}>Journal</p>
            <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(40px,6vw,64px)',fontWeight:300,color:'#4A4036',lineHeight:1.0}}>Insight and advice</h1>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'2px',background:'#C8C0B4'}}>
            {posts.map((post)=>(
              <Link key={post.slug} href={'/blog/'+post.slug} style={{textDecoration:'none',display:'block',background:'#EFECE6',overflow:'hidden'}}>
                <div style={{height:'240px',overflow:'hidden',position:'relative'}}>
                  <img src={post.image} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div style={{padding:'28px'}}>
                  <span style={{fontSize:'9px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#A0845C',display:'block',marginBottom:'12px'}}>{post.category}</span>
                  <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'22px',fontWeight:300,color:'#4A4036',lineHeight:1.4,marginBottom:'12px'}}>{post.title}</h2>
                  <p style={{fontSize:'12px',lineHeight:1.8,color:'#6B6258',marginBottom:'20px'}}>{post.excerpt}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'14px',borderTop:'0.5px solid #DDD7CC'}}>
                    <span style={{fontSize:'9px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#9A9188'}}>{post.date}</span>
                    <span style={{fontSize:'11px',color:'#A0845C'}}>Read more</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

