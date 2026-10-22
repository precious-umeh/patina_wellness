import ProductDetails from "@/app/components/products/ProductDetails";

export const metadata = {
  title: "Product Details",
  description: "Explore product details from Patina Wellness Solutions.",
};

async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
}

export default ProductDetailsPage;
