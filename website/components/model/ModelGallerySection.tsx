import Image from "next/image";
import { Camera } from "lucide-react";

const gallery = [
  { src: "/images/hero-light-premium.png", alt: "Premium SUV front three-quarter view", position: "object-center" },
  { src: "/images/exec-315ae8f6-92a4-4bda-98fb-600e5ac4029b.png", alt: "Premium car interior detail", position: "object-center" },
  { src: "/images/car-suv-close.jpg", alt: "SUV exterior close view", position: "object-center" },
];

export default function ModelGallerySection() {
  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="flex items-end justify-between gap-5">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Exterior and interior</p><h2 className="mt-2 text-[27px] font-semibold text-[#0c1a15] dark:text-white sm:text-[32px]">Explore the Harrier in detail</h2></div>
          <span className="hidden items-center gap-2 text-[10px] font-semibold text-[#5c7168] dark:text-white/50 sm:flex"><Camera size={14} /> 3 photos</span>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[1.45fr_.75fr]">
          <figure className="group relative min-h-[330px] overflow-hidden rounded-[8px] bg-[#e8eeea] sm:min-h-[480px]">
            <Image src={gallery[0].src} alt={gallery[0].alt} fill sizes="(max-width: 1024px) 100vw, 66vw" className={`object-cover ${gallery[0].position} transition-transform duration-700 group-hover:scale-[1.025]`} />
            <figcaption className="absolute bottom-4 left-4 rounded-[5px] bg-black/55 px-3 py-2 text-[9px] font-medium text-white backdrop-blur-md">Exterior design</figcaption>
          </figure>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {gallery.slice(1).map((image, index) => <figure key={image.src} className="group relative min-h-[230px] overflow-hidden rounded-[8px] bg-[#e8eeea]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw" className={`object-cover ${image.position} transition-transform duration-700 group-hover:scale-[1.035]`} /><figcaption className="absolute bottom-3 left-3 rounded-[5px] bg-black/55 px-3 py-2 text-[9px] font-medium text-white backdrop-blur-md">{index === 0 ? "Cabin comfort" : "Road presence"}</figcaption></figure>)}
          </div>
        </div>
      </div>
    </section>
  );
}
