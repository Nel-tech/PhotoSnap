import Nav from "@/components/Nav"
import HeroSection from "./HeroSection"
import PricingTable from "./PricingTable"
import PricingComparison from "./PricingComparison"
import Footer from "@/components/Footer"
function page() {
  return (
    <div>
        <Nav/>
        <HeroSection/>
        <PricingTable/>
        <PricingComparison/>
        <Footer/>
    </div>
  )
}

export default page