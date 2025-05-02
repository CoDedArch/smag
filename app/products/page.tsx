"use client";

import React from "react";
import PostCard from "@/components/ui/posts-card";
import ProductCard from "@/components/ui/custom-card";
import ImageBlur from "@/components/common/ImageBlur";
import SearchComp from "@/components/ui/search-comp";
import PRODUCTS from "@/constants/products";

const ProductsPage = () => {
  const posts = [
    {
      date: "April 20th, 2025",
      heading: "New Vegetables and Flowers",
      text: "We're excited to share that our farm is now offering a new selection of vegetables. They are all grown organically and taste amazing. We have also added a few new flowers to the mix. Come visit us this weekend at the farmers' market in town.",
    },
    {
      date: "April 20th, 2025",
      heading: "Fresh Strawberries",
      imageUrl: "/images/post1.png",
      text: "We just harvested some delicious strawberries from our farm. They are sweet and juicy, perfect for making jam or eating on their own. Come visit us at the farmers' market this weekend to get your hands on these tasty treats!",
    },
    {
      date: "April 20th, 2025",
      heading: "Fresh Strawberries",
      imageUrl: "/images/post1.png",
      text: "We just harvested some delicious strawberries from our farm. They are sweet and juicy, perfect for making jam or eating on their own. Come visit us at the farmers' market this weekend to get your hands on these tasty treats!",
    },
  ];

  const tabs = [
    "All",
    "Vegetables",
    "Fruits",
    "Herbs",
    "Mushrooms",
    "Nuts",
    "Honey",
    "Eggs",
    "Cheese",
    "Meat",
    "Flowers",
  ];

  return (
    <div className="flex flex-col lg:flex-row pt-10 px-4 lg:px-10 mt-30">
      <div className="posts w-full lg:w-1/4 lg:pr-4 space-y-5 mb-6 lg:mb-0">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            date={post.date}
            imageUrl={post.imageUrl}
            heading={post.heading}
            text={post.text}
          />
        ))}
      </div>
      <section className="w-full lg:w-3/4">
        <div className="flex justify-end mb-6">
          <SearchComp />
        </div>

        <div className="products">
          <header className="flex flex-wrap justify-between gap-2">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab ${
                  tab === "All"
                    ? "bg-[#028F02] text-white w-auto px-4 py-2 rounded-md border cursor-pointer"
                    : "hover:text-[#028F02] cursor-pointer transition-all"
                }`}
              >
                {tab}
              </button>
            ))}
          </header>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product, index) => (
               <ProductCard
               key={index}
               imageUrl={product.imageUrl}
               name={product.name}
               price={product.price}
               rating={product.rating}
               discount={product.discount}
               imageAlt={product.imageAlt}
               farmer={product.farmer}
               category={product.category}
               tags={product.tags}
               description={product.description}
               additionalInfo={product.additionalInfo}
             />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center my-10">
          <ImageBlur
            src="/icons/featured_products.png"
            alt="featured products"
            width={280}
            height={280}
            className="mr-2"
          />
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
