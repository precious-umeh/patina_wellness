import CartPage from "@/app/components/products/CartPage";

export const metadata = {
  title: "Your Cart",
  description:
    "Review your selected Patina wellness products before continuing to WhatsApp.",
};

function CartRoute() {
  return <CartPage />;
}

export default CartRoute;
