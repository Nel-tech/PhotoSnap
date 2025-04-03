import Nav from "@/components/Nav"
import HeroSection from "./HeroSection"
import PricingTable from "./PricingTable"
import PricingComparison from "./PricingComparison"
function page() {
  return (
    <div>
        <Nav/>
        <HeroSection/>
        <PricingTable/>
        <PricingComparison/>
    </div>
  )
}

export default page