import {
  Armchair,
  BadgeCheck,
  Camera,
  Gauge,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  SunMedium,
  type LucideIcon,
} from "lucide-react";

export const model = {
  brand: "Tata",
  name: "Harrier",
  tagline: "Commanding presence. Confidence for every road.",
  rating: "4.7",
  reviewCount: "1,248 reviews",
  price: "Rs. 15.00 - 26.50 Lakh",
  priceNote: "Indicative ex-showroom price",
  heroImage: "/images/hero-car.png",
};

export const quickSpecs = [
  { label: "Engine", value: "1956 cc" },
  { label: "Power", value: "170 PS" },
  { label: "Torque", value: "350 Nm" },
  { label: "Transmission", value: "6-speed MT / AT" },
  { label: "Seating", value: "5 seats" },
];

export const colors = [
  { name: "Seaweed Green", value: "#64796e" },
  { name: "Oberon Black", value: "#171d1b" },
  { name: "Lunar White", value: "#e9ece8" },
  { name: "Sunlit Yellow", value: "#c8a83f" },
];

export const variants = [
  { name: "Smart", transmission: "Manual", price: "Rs. 15.00 Lakh", note: "Essential safety and connected LED lighting" },
  { name: "Pure Plus", transmission: "Manual / Automatic", price: "Rs. 18.85 Lakh", note: "Panoramic sunroof and premium infotainment" },
  { name: "Adventure Plus", transmission: "Manual / Automatic", price: "Rs. 23.64 Lakh", note: "360-degree camera and terrain response" },
  { name: "Fearless Plus", transmission: "Automatic", price: "Rs. 26.50 Lakh", note: "ADAS, ventilated seats and JBL audio" },
];

export type ModelFeature = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export const features: ModelFeature[] = [
  { title: "Advanced safety", text: "Six airbags, electronic stability control and available ADAS.", icon: ShieldCheck },
  { title: "Panoramic sunroof", text: "A wide glass roof that opens up the cabin for every passenger.", icon: SunMedium },
  { title: "Premium comfort", text: "Ventilated front seats with powered adjustment and memory.", icon: Armchair },
  { title: "Digital cockpit", text: "A 12.3-inch touchscreen paired with a digital instrument display.", icon: MonitorSmartphone },
  { title: "Surround view", text: "A 360-degree camera makes tight city manoeuvres easier.", icon: Camera },
  { title: "Drive and terrain modes", text: "Selectable responses for city traffic and changing road surfaces.", icon: Gauge },
  { title: "JBL sound system", text: "A rich multi-speaker setup tuned for the Harrier cabin.", icon: Sparkles },
  { title: "Verified details", text: "Specifications are organised for clear variant comparison.", icon: BadgeCheck },
];

export const specifications = [
  {
    title: "Engine and transmission",
    rows: [
      ["Engine type", "2.0L Kryotec turbo diesel"],
      ["Displacement", "1956 cc, inline 4-cylinder"],
      ["Maximum power", "170 PS @ 3750 rpm"],
      ["Maximum torque", "350 Nm @ 1750-2500 rpm"],
      ["Transmission", "6-speed manual / 6-speed automatic"],
      ["Emission standard", "BS6 Phase 2"],
    ],
  },
  {
    title: "Dimensions and capacity",
    rows: [
      ["Length", "4605 mm"],
      ["Width", "1922 mm"],
      ["Height", "1718 mm"],
      ["Wheelbase", "2741 mm"],
      ["Boot space", "445 litres"],
      ["Fuel tank", "50 litres"],
    ],
  },
  {
    title: "Chassis and wheels",
    rows: [
      ["Front suspension", "Independent McPherson strut"],
      ["Rear suspension", "Semi-independent twist blade"],
      ["Front brakes", "Disc"],
      ["Rear brakes", "Disc on select variants"],
      ["Wheel sizes", "17, 18 or 19-inch alloys"],
      ["Spare wheel", "235/70 R16 steel"],
    ],
  },
];

export const faqs = [
  { question: "What is the Tata Harrier price range?", answer: "The indicative ex-showroom range shown here is Rs. 15.00 lakh to Rs. 26.50 lakh. Final pricing varies by variant, city, registration, insurance and available offers." },
  { question: "Is the Harrier available with an automatic transmission?", answer: "Yes. Select variants offer a 6-speed automatic transmission, while a 6-speed manual is also available across the range." },
  { question: "How many people can the Harrier seat?", answer: "The Harrier is a five-seat SUV with a spacious second row and a listed boot capacity of 445 litres." },
  { question: "Which variants include ADAS?", answer: "Advanced driver assistance features are offered on selected higher variants. Availability can differ by model year and transmission, so confirm the final equipment list before purchase." },
  { question: "Are all displayed specifications standard?", answer: "No. Equipment, wheel size, braking hardware and convenience features vary by variant. The specification table combines key details across the range." },
];
