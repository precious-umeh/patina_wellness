import PageHero from "@/app/components/shared/PageHero";
import ProductsListing from "./ProductsListing";

export const metadata = {
  title: "Wellness Products",
  description:
    "Explore Patina Wellness Solutions' wellness products and find options that fit your needs.",
};

function ProductsPage() {
  return (
    <main>
      <PageHero
        eyebrow="The Patina Product Collection"
        title="Explore Our Wellness Products"
        description="Discover products selected to support your wellness journey. Explore the collection and find the options that meet your needs."
      />

      <ProductsListing />
    </main>
  );
}

export default ProductsPage;
