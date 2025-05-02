import React from "react";
import ProductCard from "../ui/custom-card";
import PRODUCTS from "@/constants/products";
import ImageBlur from "../common/ImageBlur";
import Link from "next/link";

const FeaturedDeals: React.FC = () => {
  return (
    <section className="hot-deals-section px-6 sm:px-20 py-10 space-y-8">
      <h2 className="section-title flex justify-between items-center">
        <span className="block text-2xl font-bold">Featured Products</span>
        <span className="flex text-[#00B207] gap-3 items-center">
          <Link href="/products" passHref>
            <span className="flex items-center gap-3">
              <span>View ALL </span>
              <span>
                <ImageBlur
                  src="/icons/more.png"
                  alt="more icon"
                  width={20}
                  height={20}
                />
              </span>
            </span>
          </Link>
        </span>
      </h2>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
          {PRODUCTS.slice(3, 8).map((product, index) => (
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
    </section>
  );
};

export default FeaturedDeals;
