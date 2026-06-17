import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleLayout from '@/components/ArticleLayout'

const sections = [
  { h: 'Start earlier than you think', p: 'London\'s rental market moves fast. If you are starting university in September, you should be looking seriously by March or April at the latest. The best properties at the right price go quickly, and leaving it until July means taking what is left.' },
  { h: 'Understand what you are signing', p: 'An Assured Shorthold Tenancy is a legally binding contract. Read it before you sign. Check the break clause, the notice period, what happens if one flatmate wants to leave, and what deductions can be made from your deposit. If anything is unclear, ask.' },
  { h: 'Your deposit is protected by law', p: 'Any landlord or agent taking a deposit in England is legally required to protect it in a government-approved scheme within 30 days. They must also give you the prescribed information about where it is held. If they do not, you are entitled to compensation.' },
  { h: 'What to check before you move in', p: 'Do a proper check-in inventory with your agent or landlord present. Photograph everything — walls, floors, appliances, any existing damage. This is your protection when you move out. Do not skip it.' },
  { h: 'A word on guarantors', p: 'Most London landlords will require a UK-based guarantor for student tenants. This is someone who agrees to cover your rent if you cannot. If you do not have a UK guarantor, ask the agent early — some landlords will accept rent in advance or a specialist guarantor service instead.' },
]

export default function BlogPost3() {
  return (
    <>
      <Navbar />
      <ArticleLayout
        category="Student Living"
        title="Renting in London as a student"
        meta="March 2025  ·  5 min read"
        image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85"
        imageAlt="London"
        sections={sections}
        signoff="Written by the Vale and Mercer team  ·  March 2025"
      />
      <Footer />
    </>
  )
}
