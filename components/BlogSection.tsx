import Link from 'next/link'

const posts = [
  {slug:'london-property-market-2025',category:'Market Insight',title:'The London property market in 2025',excerpt:'Supply is up, rates have settled a little, and buyers are moving again. Here is what we are seeing.',date:'May 2025',readTime:'4 min',image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'},
  {slug:'guide-to-buying-in-chelsea',category:'Buying Guide',title:'Your complete guide to buying in Chelsea SW3',excerpt:'What to expect, where to look, and what the streets actually feel like. A practical guide to buying in SW3.',date:'April 2025',readTime:'6 min',image:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'},
  {slug:'student-lettings-london-guide',category:'Student Living',title:'Renting in London as a student',excerpt:'What nobody tells you before you start. A straight guide to renting in London as a student.',date:'March 2025',readTime:'5 min',image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'},
]

export default function BlogSection() {
  const css = '@media(min-width:768px){.blog-grid{grid-template-columns:repeat(3,1fr)!important}}'
  return (
    <section style={{background:'#EFECE6',padding:'64px 20px',borderTop:'0.5px solid #DDD7CC'}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'32px'}}>
          <div>
            <p style={{fontSize:'10px',letterSpacing:'0.26em',textTransform:'uppercase',color:'#A0845C',marginBottom:'8px'}}>Journal</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'clamp(26px,4vw,38px)',fontWeight:300,color:'#28231C'}}>Insight and advice</h2>
          </div>
          <Link href="/blog" style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C',textDecoration:'none',borderBottom:'1px solid #A0845C',paddingBottom:'2px',whiteSpace:'nowrap',marginLeft:'12px'}}>All articles</Link>
        </div>
        <div className="blog-grid" style={{display:'grid',gridTemplateColumns:'1fr',gap:'2px',background:'#C8C0B4'}}>
          {posts.map((post)=>(
            <Link key={post.slug} href={'/blog/'+post.slug} style={{textDecoration:'none',display:'block',background:'#EFECE6'}}>
              <div style={{height:'200px',overflow:'hidden'}}>
                <img src={post.image} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s ease'}} />
              </div>
              <div style={{padding:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontSize:'9px',letterSpacing:'0.16em',textTransform:'uppercase',color:'#A0845C'}}>{post.category}</span>
                  <span style={{fontSize:'9px',color:'#9A9188'}}>{post.readTime}</span>
                </div>
                <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'20px',fontWeight:300,color:'#28231C',lineHeight:1.2,marginBottom:'8px'}}>{post.title}</h3>
                <p style={{fontSize:'12px',lineHeight:1.8,color:'#6B6258',marginBottom:'14px'}}>{post.excerpt}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'12px',borderTop:'0.5px solid #DDD7CC'}}>
                  <span style={{fontSize:'10px',color:'#9A9188',textTransform:'uppercase',letterSpacing:'0.08em'}}>{post.date}</span>
                  <span style={{fontSize:'10px',letterSpacing:'0.14em',textTransform:'uppercase',color:'#A0845C'}}>Read more</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}




