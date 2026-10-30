import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5500";

export const revalidate = 3600;

export default async function sitemap() {
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
  }

  const publicRoutes = [
    {
      path: "",
      changeFrequency: "monthly",
      priority: 1,
    },

    {
      path: "/about",
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      path: "/services",
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      path: "/products",
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      path: "/partnership",
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      path: "/contact",
      changeFrequency: "yearly",
      priority: 0.6,
    },

    {
      path: "/consultation",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const staticUrls = publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch the first page to discover the total number of pages.
  try {
    const { data: firstData } = await axios.get(`${apiUrl}/api/get-products`, {
      params: { page: 1, limit: 20 },
      timeout: 10000,
    });

    const products = [...firstData.products];
    const totalPages = firstData.pagination.totalPages;

    if (totalPages > 1) {
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) => index + 2).map(
          async (page) => {
            const { data } = await axios.get(`${apiUrl}/api/get-products`, {
              params: { page, limit: 20 },
              timeout: 10000,
            });

            return data.products;
          },
        ),
      );

      products.push(...remainingPages.flat());
    }

    const productUrls = products
      .filter((product) => product.slug)
      .map((product) => ({
        url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    return [...staticUrls, ...productUrls];
  } catch (error) {
    console.error(
      "Sitemap product fetch failed:",
      error.response?.status,
      error.message,
    );

    throw new Error("Unable to generate sitemap from product data.");
  }
}
