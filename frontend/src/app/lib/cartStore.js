const CART_STORAGE_KEY = "patina_guest_cart_v1";
const EMPTY_CART = Object.freeze([]);

let cartSnapshot = EMPTY_CART;
let storageInitialized = false;

const subscribers = new Set();

function areCartItemsEqual(firstCart, secondCart) {
  if (firstCart.length !== secondCart.length) return false;

  return firstCart.every((item, index) => {
    const other = secondCart[index];

    return (
      item.productId === other.productId &&
      item.slug === other.slug &&
      item.name === other.name &&
      item.price === other.price &&
      item.imageUrl === other.imageUrl &&
      item.stock === other.stock &&
      item.quantity === other.quantity
    );
  });
}

function normalizeCart(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        item.productId &&
        typeof item.slug === "string" &&
        item.slug,
    )
    .map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: String(item.name || "Product"),
      price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
      imageUrl: String(item.imageUrl || ""),
      stock: Math.max(0, Math.floor(Number(item.stock) || 0)),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    }));
}

function readStoredCart() {
  try {
    const storedValue = localStorage.getItem(CART_STORAGE_KEY);
    return normalizeCart(JSON.parse(storedValue || "[]"));
  } catch {
    return [];
  }
}

function getCartSnapShot() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  if (!storageInitialized) {
    cartSnapshot = readStoredCart();
    storageInitialized = true;
  }

  return cartSnapshot;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function notifySubscribers() {
  subscribers.forEach((listener) => listener());
}

function subscribe(listener) {
  subscribers.add(listener);

  if (typeof window === "undefined") {
    return () => subscribers.delete(listener);
  }

  function handleStorageChange(event) {
    if (event.key !== CART_STORAGE_KEY && event.key !== null) {
      return;
    }

    cartSnapshot = readStoredCart();
    storageInitialized = true;

    listener();
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    subscribers.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function commitCart(nextCart) {
  const normalizedCart = normalizeCart(nextCart);

  // Avoid storage writes and subscriber notifications when nothing changed.
  if (areCartItemsEqual(cartSnapshot, normalizedCart)) {
    return;
  }

  cartSnapshot = normalizedCart;
  storageInitialized = true;

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartSnapshot));
    }
  } catch (error) {
    // Keep the cart usable for this session if the browser storage fails.
    console.error("Persist Guest Cart Error:", error);
  }

  notifySubscribers();
}

function addToCart(product, quantity = 1) {
  const productId = String(product?._id || "");
  const slug = String(product?.slug || "");
  const stock = Math.max(0, Math.floor(Number(product?.stock) || 0));
  const requestedQuantity = Math.floor(Number(quantity));

  if (!productId || !slug) {
    return { ok: false, message: "This product cannot be added to the cart." };
  }

  if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
    return { ok: false, message: "Please select a valid quantity." };
  }

  if (stock < 1) {
    return { ok: false, message: "This product is currently out of stock." };
  }

  const currentCart = getCartSnapShot();
  const existingItem = currentCart.find((item) => item.productId === productId);

  const nextQuantity = (existingItem?.quantity || 0) + requestedQuantity;

  if (nextQuantity > stock) {
    return {
      ok: false,
      message: `Only ${stock} unit${stock === 1 ? "" : "s"} currently available.`,
    };
  }

  const imageUrl = product.images?.find((image) => image?.url)?.url || "";

  const updatedItem = {
    productId,
    slug,
    name: product.name || "Product",
    price: Number(product.price) || 0,
    imageUrl,
    stock,
    quantity: nextQuantity,
  };

  commitCart([
    ...currentCart.filter((item) => item.productId !== productId),
    updatedItem,
  ]);

  return {
    ok: true,
    message: `${product.name || "Product"} added to your cart.`,
  };
}

function updateCartQuantity(productId, quantity, maxStock) {
  const currentCart = getCartSnapShot();
  const item = currentCart.find(
    (entry) => entry.productId === String(productId),
  );

  if (!item) return;

  const stockLimit =
    maxStock === undefined
      ? item.stock
      : Math.max(0, Math.floor(Number(maxStock) || 0));

  if (stockLimit < 1) return;

  const requestedQuantity = Math.floor(Number(quantity));

  if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
    return;
  }

  const nextQuantity = Math.min(requestedQuantity, stockLimit);

  commitCart(
    currentCart.map((entry) =>
      entry.productId === String(productId)
        ? { ...entry, quantity: nextQuantity, stock: stockLimit }
        : entry,
    ),
  );
}

function refreshCartItem(product) {
  const productId = String(product?._id || "");

  if (!productId) return;

  const currentCart = getCartSnapShot();
  const existingItem = currentCart.find((item) => item.productId === productId);

  // Don't add a product that isn't already in the cart.
  if (!existingItem) return;

  const imageUrl = product.images?.find((image) => image?.url)?.url || "";

  const updatedItem = {
    ...existingItem,
    slug: String(product.slug || existingItem.slug),
    name: String(product.name || "Product"),
    price: Number.isFinite(Number(product.price))
      ? Number(product.price)
      : existingItem.price,
    imageUrl,
    stock: Math.max(0, Math.floor(Number(product.stock) || 0)),
  };

  // Preserve quantity; only update the product's current details.
  commitCart(
    currentCart.map((item) =>
      item.productId === productId ? updatedItem : item,
    ),
  );
}

function removeFromCart(productId) {
  const currentCart = getCartSnapShot();

  commitCart(
    currentCart.filter((item) => item.productId !== String(productId)),
  );
}

function clearCart() {
  commitCart([]);
}

export {
  addToCart,
  clearCart,
  getCartSnapShot,
  getServerCartSnapshot,
  refreshCartItem,
  removeFromCart,
  subscribe,
  updateCartQuantity,
};
