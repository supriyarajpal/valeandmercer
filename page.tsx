import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedProperties from '@/components/FeaturedProperties'
import BuyingSection from '@/components/BuyingSection'
import ValuationStrip from '@/components/ValuationStrip'
import AboutStrip from '@/components/AboutStrip'
import BlogSection from '@/components/BlogSection'
import GetInTouch from '@/components/GetInTouch'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <BuyingSection />
      <ValuationStrip />
      <AboutStrip />
      <BlogSection />
      <GetInTouch />
      <Footer />
    </main>
  )
}
