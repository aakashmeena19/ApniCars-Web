import type { Metadata } from "next";
import ModelPage from "@/components/model-premium/ModelPage";

export const metadata: Metadata = {
  title: "Tata Harrier - Price, Variants & Specifications | Apnicars",
  description: "Explore Tata Harrier prices, variants, features, specifications and ownership details.",
};

export default function Page() {
  return <ModelPage />;
}
