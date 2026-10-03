import ModelFaqSection from "@/components/model/ModelFaqSection";
import ModelFeaturesSection from "@/components/model/ModelFeaturesSection";
import ModelGallerySection from "@/components/model/ModelGallerySection";
import ModelHeroSection from "@/components/model/ModelHeroSection";
import ModelOverviewSection from "@/components/model/ModelOverviewSection";
import ModelOwnershipSection from "@/components/model/ModelOwnershipSection";
import ModelSpecificationsSection from "@/components/model/ModelSpecificationsSection";
import ModelVariantsSection from "@/components/model/ModelVariantsSection";

export default function ModelPage() {
  return (
    <main>
      <ModelHeroSection />
      <ModelOverviewSection />
      <ModelVariantsSection />
      <ModelFeaturesSection />
      <ModelSpecificationsSection />
      <ModelGallerySection />
      <ModelOwnershipSection />
      <ModelFaqSection />
    </main>
  );
}
