export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "bookjeok",
      alternateName: ["북적", "bookjeok"],
      url: "https://bookjeok.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://bookjeok.com/book/search?keyword={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: "중고마켓",
      url: "https://bookjeok.com/book/market",
    },
    {
      "@type": "SiteNavigationElement",
      name: "도서리뷰",
      url: "https://bookjeok.com/review",
    },
    {
      "@type": "SiteNavigationElement",
      name: "도서검색",
      url: "https://bookjeok.com/book/search",
    },
  ],
};
