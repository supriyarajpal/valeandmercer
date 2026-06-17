import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const sections = [
  { h: 'Why Chelsea?', p: 'Chelsea is one of those London postcodes that genuinely delivers on its reputation. The streets around the King\'s Road, the garden squares of SW3, the quiet of Cheyne Walk — it is a neighbourhood that rewards the effort of finding the right property there.' },
  { h: 'What you need to know about pricing', p: 'Chelsea pricing is wide. A garden flat on a residential street and a lateral apartment on Sloane Square can both carry the Chelsea postcode and be separated by millions of pounds. The key is understanding which pockets offer the best long-term value and which ones are trading on name alone.' },
  { h: 'The streets worth knowing', p: 'Carlyle Square, Paultons Square, and Cheyne Walk consistently perform well. The area south of the King\'s Road towards the Embankment tends to hold value better than the north, which borders on the more variable Worlds End.' },
  { h: 'What to watch out for', p: 'Leasehold properties dominate Chelsea. Always check the remaining lease length before you fall in love with a property. Anything under 80 years will affect your mortgage options and resale value significantly.' },
  { h: 'Our advice', p: 'Chelsea rewards patience. The best properties here rarely sit for long, but rushing into the wrong one because you felt pressure to move is a mistake that takes years to correct. Come and speak to us before you start viewing — it will save you time.' },
]

export default function BlogPost2() {
  return (
    <>
      <Navbar />
      <ArticleLayout
        category="Buying Guide"
        title="Your complete guide to buying in Chelsea SW3"
        meta="April 2025  ·  6 min read"
        image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85"
        imageAlt="Chelsea London"
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  April 2025"
      />
      <Footer />
    </>
  )
}
