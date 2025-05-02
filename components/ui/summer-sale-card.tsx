import React from "react";
import ImageBlur from "../common/ImageBlur";

const SummerSaleCard: React.FC = () => {
  return (
    <div
      className="flex items-center justify-end bg-cover bg-center p-5 rounded-lg text-white/80 w-full h-72 mt-10 shadow-md"
      style={{ backgroundImage: 'url("/images/summer.jpg")' }}
    >
      <div className="sm:mr-10 space-y-20 bg-black/50 sm:bg-inherit">
        <h1 className="text-sm font-bold m-0">SUMMER SALE</h1>
        <h2 className="text-4xl font-semibold my-2 text-white/90">
          <span className="text-[#FF8A00]">37%</span> OFF
        </h2>
        <p className="my-2 text-sm w-[350px] text-white/70">
          Free on all your order, Free Shipping and 30 days money-back guarantee
        </p>
        <button className="bg-[#00B207] flex items-center gap-2 text-white px-4 py-2 rounded-full cursor-pointer text-base">
          <span>Shop Now</span>
          <span>
            <ImageBlur
              src="/icons/more-white.png"
              alt="more icon"
              width={20}
              height={20}
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SummerSaleCard;
