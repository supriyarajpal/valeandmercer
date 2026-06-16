export type Property = {
  id: string
  slug: string
  status: "For Sale" | "To Let"
  price: string
  address: string
  area: string
  postcode: string
  beds: number
  baths: number
  sqft: number
  epc: string
  image: string
  tag: string | null
  featured?: boolean
}
export const properties: Property[] = [
  { id:"1", slug:"carlyle-square-chelsea", status:"For Sale", price:"3,200,000", address:"14 Carlyle Square", area:"Chelsea", postcode:"SW3", beds:4, baths:3, sqft:2840, epc:"B", image:"/images/prop1.jpg", tag:"Featured", featured:true },
  { id:"2", slug:"pembridge-villas-notting-hill", status:"To Let", price:"5,800 pcm", address:"Pembridge Villas", area:"Notting Hill", postcode:"W11", beds:3, baths:2, sqft:1760, epc:"C", image:"/images/prop2.jpg", tag:null, featured:true },
  { id:"3", slug:"onslow-gardens-south-kensington", status:"For Sale", price:"1,950,000", address:"Onslow Gardens", area:"South Kensington", postcode:"SW7", beds:2, baths:2, sqft:1240, epc:"B", image:"/images/prop3.jpg", tag:"New", featured:true },
]
