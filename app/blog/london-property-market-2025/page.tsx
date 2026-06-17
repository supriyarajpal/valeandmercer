import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const sections = [
  { h: 'Supply is up. Buyers are back.', p: 'After a difficult couple of years, the London property market is showing signs of real recovery. Interest rates have begun to stabilise, mortgage products are more competitive than they were twelve months ago, and we are seeing more serious buyers coming back to the market.' },
  { h: 'What this means for sellers', p: 'If you have been holding off selling because the market felt uncertain, 2025 may be the year to move. We are seeing well-priced properties in Chelsea, Notting Hill, and Fulham selling quickly when they are presented properly and priced honestly. Overpricing is still the single biggest mistake sellers make.' },
  { h: 'What this means for buyers', p: 'The window of relative affordability may not last. With more buyers returning, competition for well-located properties is increasing. If you have been watching the market and waiting, now is a reasonable time to have a conversation with an agent you trust.' },
  { h: 'Our honest read', p: 'London property has always rewarded long-term thinking. The people who struggle are those who try to time the market perfectly. The people who do well are those who buy the right property, in the right location, at a fair price — and hold it.' },
]

export default function BlogPost1() {
  return (
    <>
      <Navbar />
      <ArticleLayout
        category="Market Insight"
        title="The London property market in 2025"
        meta="May 2025  ·  4 min read"
        image="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1400&q=85"
        imageAlt="London"
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  May 2025"
      />
      <Footer />
    </>
  )
}
