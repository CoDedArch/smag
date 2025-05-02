"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCardProps } from "@/types/custom-card";
import ImageBlur from "../common/ImageBlur";

/**
 * `ProductCard` is a reusable React component that displays a product card with details such as
 * an image, name, price, discount, rating, and an "Add to Cart" button. It supports customization
 * through props and is styled to adapt to light and dark themes.
 *
 * @component
 * @param {ProductCardProps} props - The props for the `ProductCard` component.
 * @param {string} [props.className] - Additional CSS classes to apply to the card container.
 * @param {string} props.imageUrl - The URL of the product image to display.
 * @param {string} props.name - The name of the product.
 * @param {number} props.price - The price of the product in USD.
 * @param {number} props.rating - The rating of the product (0 to 5).
 * @param {number} [props.discount] - The discount percentage applied to the product (optional).
 * @param {string} [props.imageAlt=""] - Alternative text for the product image.
 * @param {boolean} [props.imagePriority=false] - Determines if the product image should be prioritized for loading.
 * @param {React.Ref<HTMLDivElement>} ref - A React ref to access the card's root DOM element.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Additional HTML attributes to apply to the card container.
 *
 *
 * @example
 * ```tsx
 * <ProductCard
 *   className="custom-class"
 *   imageUrl="/path/to/image.jpg"
 *   name="Sample Product"
 *   price={29.99}
 *   rating={4.5}
 *   discount={10}
 *   imageAlt="Sample Product Image"
 *   imagePriority={true}
 * />
 * ```
 *
 * @remarks
 * - The component uses `Intl.NumberFormat` to format prices and discounts.
 * - The `rating` prop is displayed as a combination of filled and empty stars.
 * - The "Add to Cart" button is disabled if the product is already in the cart.
 * - The component supports hover effects for enhanced interactivity.
 *
 * @see {@link https://react.dev/reference/react/forwardRef | React.forwardRef}
 */
const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      price,
      rating,
      discount,
      imageAlt = "",
      isHotDeal = false,
      endDate,
      productsRemaining,
      category,
      tags,
      farmer,
      description,
      additionalInfo,
      ...props
    },
    ref
  ) => {
    const [isInCart, setIsInCart] = React.useState(false);
    const [showAddedNotification, setShowAddedNotification] =
      React.useState(false);
    const [activePrice, setActivePrice] = React.useState<"unit" | "bulk">(
      "unit"
    );
    const [showOverlay, setShowOverlay] = React.useState(() => {
      if (typeof window !== "undefined") {
        const overlayVisible = localStorage.getItem("overlayVisible");
        return overlayVisible === "true";
      }
      return false;
    });
    const [quantity, setQuantity] = React.useState(1);
    const [hotDealExpired, setHotDealExpired] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    const [activeTab, setActiveTab] = React.useState<
      "description" | "additionalInfo"
    >("description");
    const defaultEndDate = React.useMemo(
      () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      []
    );

    React.useEffect(() => {
      const overlayVisible = localStorage.getItem("overlayVisible");
      console.log("Current overlayVisible in localStorage:", overlayVisible);
    }, [showOverlay]);

    // Also add a log when the component mounts
    React.useEffect(() => {
      const initialValue = localStorage.getItem("overlayVisible");
      console.log("Initial overlayVisible from localStorage:", initialValue);
    }, []);

    const effectiveEndDate = React.useMemo(
      () => endDate || defaultEndDate,
      [endDate, defaultEndDate]
    );

    React.useEffect(() => {
      localStorage.setItem("overlayVisible", showOverlay.toString());
    }, [showOverlay]);

    const handleAddToCart = () => {
      const cartItem = {
        id: props.id || Date.now().toString(),
        name,
        price,
        discountedPrice: price * (1 - (discount || 0) / 100),
        quantity,
        imageUrl,
        category,
        farmer,
      };

      const existingCart =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("cart") || "[]")
          : [];

      const existingItemIndex = existingCart.findIndex(
        (item: { id: string }) => item.id === cartItem.id
      );

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(existingCart));
      }

      setIsInCart(true);
      setShowAddedNotification(true);
      setShowOverlay(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowAddedNotification(false);
      }, 3000);

      console.log(`${name} added to cart`);
    };

    // Add this useEffect to initialize cart state from localStorage
    React.useEffect(() => {
      if (typeof window !== "undefined") {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        type CartItem = {
          id: string;
          name: string;
          price: number;
          quantity: number;
          imageUrl: string;
          category?: string;
          farmer?: string;
        };
        const isProductInCart = existingCart.some(
          (item: CartItem) => item.name === name
        );
        setIsInCart(isProductInCart);
      }
    }, [name]);

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

    const discountedPrice = discount
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price * (1 - discount / 100))
      : null;

    React.useEffect(() => {
      if (!isHotDeal) return;

      // Debugging logs
      const updateCountdown = () => {
        const now = new Date();
        const difference = effectiveEndDate.getTime() - now.getTime();

        if (difference <= 0) {
          console.log("Countdown expired!");
          setHotDealExpired(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        // Calculate time units
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        setTimeLeft({
          days,
          hours: hours % 24,
          minutes: minutes % 60,
          seconds: seconds % 60,
        });
      };

      // Initial call
      updateCountdown();

      // Set up interval
      const intervalId = setInterval(updateCountdown, 1000);
      console.log("Interval set with ID:", intervalId);

      // Cleanup
      return () => {
        console.log("Clearing interval with ID:", intervalId);
        clearInterval(intervalId);
      };
    }, [effectiveEndDate, isHotDeal]);

    return (
      <div
        ref={ref}
        className={cn(
          "group relative overflow-hidden border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950",
          isInCart
            ? "border-[#2C742F] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            : "border-gray-200",
          className
        )}
        {...props}
      >
        {showAddedNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-[100000] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{name} added to cart!</span>
          </div>
        )}
        {/* Discount tag */}
        {/* Discount and Hot Deal Tags */}
        {discount && (
          <div
            className={cn(
              "absolute left-4 top-4 z-10 flex gap-3 transition-opacity",
              showOverlay ? "opacity-0" : "opacity-100"
            )}
          >
            {/* Discount Tag - Always shown if discount exists */}
            <div className="rounded-sm bg-[#EA4B48] py-1 px-2 text-sm text-white">
              Sale {discount}%
            </div>

            {/* Hot Deal Tag - Only shown if isHotDeal is true */}
            {isHotDeal && (
              <div className="rounded-sm bg-[#2388FF] py-1 px-2 text-sm text-white">
                Hot Deal
              </div>
            )}
          </div>
        )}

        {!isHotDeal && (
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              aria-label={`Add ${name} to cart`}
              className={cn(
                "flex h-10 w-10 items-center cursor-pointer justify-center rounded-full transition-colors bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 group-hover:opacity-100 opacity-0"
              )}
            >
              <ImageBlur
                src="/icons/heart.png"
                alt="heart icon"
                width={20}
                height={20}
              />
            </button>
            <button
              aria-label={`View ${name}`}
              className={cn(
                "flex h-10 w-10 items-center cursor-pointer justify-center rounded-full transition-colors bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 group-hover:opacity-100 opacity-0"
              )}
              onClick={() => {
                setShowOverlay(true);
                localStorage.setItem("overlayVisible", "true");
              }}
            >
              <ImageBlur
                src="/icons/eye.png"
                alt="eye icon"
                width={20}
                height={20}
              />
            </button>

            {showOverlay && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[100000] pt-20  sm:pt-30">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl sm:pt-0 max-h-[90vh] overflow-y-auto">
                  {/* Close button */}
                  <button
                    className="sticky top-2 right-2 ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl hover:bg-gray-200 rounded-full p-1 transition-all z-10"
                    onClick={() => {
                      setShowOverlay(false);
                      localStorage.removeItem("overlayVisible");
                    }}
                  >
                    ✕
                  </button>

                  <div className="flex flex-col lg:flex-row gap-6 p-4">
                    {/* Left Section: Small Images - Horizontal on mobile */}
                    <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                      {[imageUrl, imageUrl, imageUrl].map((url, index) => (
                        <ImageBlur
                          key={index}
                          src={url || "/images/Image.png"}
                          alt={`${name} thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded-md min-w-[80px]"
                        />
                      ))}
                    </div>

                    {/* Middle Section: Main Image */}
                    <div className="flex-1 order-1 lg:order-2">
                      <ImageBlur
                        src={imageUrl || "/images/Image.png"}
                        alt={imageAlt || `${name} image`}
                        width={400}
                        height={400}
                        className="object-cover rounded-md w-full max-h-[300px] lg:max-h-[400px]"
                      />
                    </div>

                    {/* Right Section: Product Details */}
                    <div className="flex-1 space-y-4 order-3">
                      <h2 className="text-lg font-bold">{name}</h2>
                      <div className="flex gap-4">
                        <button
                          className={cn(
                            "px-4 py-2 rounded-md",
                            activePrice === "unit"
                              ? "bg-[#2CA22C] text-white"
                              : "dark:bg-gray-700 text-[#80C780] dark:text-gray-300"
                          )}
                          onClick={() => setActivePrice("unit")}
                        >
                          Unit Price
                        </button>
                        <button
                          className={cn(
                            "px-4 py-2 rounded-md",
                            activePrice === "bulk"
                              ? "bg-[#2CA22C] text-white"
                              : "dark:bg-gray-700 text-[#80C780] dark:text-[#80C780]"
                          )}
                          onClick={() => setActivePrice("bulk")}
                        >
                          Bulk Price
                        </button>
                      </div>
                      <div>
                        {discountedPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-500">
                              {discountedPrice}
                            </span>
                            <span className="text-gray-500 line-through dark:text-gray-400">
                              {formattedPrice}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-900 dark:text-gray-50">
                            {formattedPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {productsRemaining} pieces left
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          className="px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          onClick={() =>
                            setQuantity((prev) => Math.max(prev - 1, 1))
                          }
                        >
                          -
                        </button>
                        <span className="text-lg font-bold">{quantity}</span>
                        <button
                          className="px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          onClick={() => setQuantity((prev) => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="w-full px-4 py-2 bg-[#2CA22C] text-white rounded-md hover:bg-green-600 cursor-pointer transition-all transform active:scale-95"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </button>
                      <div>
                        <h3 className="text-sm font-bold">
                          Category:
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {category || "Not specified"}
                          </span>
                        </h3>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Tags:</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tags?.join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <ImageBlur
                          src="/images/Ellipse.png"
                          alt="Farmer"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <span className="text-sm font-bold">{farmer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Second Card: Description and Additional Info */}
                  <div className="mt-6 p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={cn(
                          "px-4 py-2 rounded-md",
                          activeTab === "description"
                            ? "bg-gray-200 text-gray-900"
                            : "dark:bg-gray-700 dark:text-gray-300"
                        )}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                      <button
                        className={cn(
                          "px-4 py-2 rounded-md",
                          activeTab === "additionalInfo"
                            ? "bg-gray-200 text-gray-900"
                            : "dark:bg-gray-700 dark:text-gray-300"
                        )}
                        onClick={() => setActiveTab("additionalInfo")}
                      >
                        Additional Information
                      </button>
                    </div>
                    <div className="mt-4">
                      {activeTab === "description" && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {description ||
                            "This product is a high-quality item designed to meet your needs and expectations. Crafted with precision and care, it offers exceptional value and performance. Whether you're looking for something functional, stylish, or both, this product is sure to impress. It is made from premium materials to ensure durability and longevity, making it a reliable choice for everyday use or special occasions. The design is both modern and timeless, blending seamlessly into any setting or lifestyle. This product is versatile and can be used in a variety of ways, providing you with flexibility and convenience."}
                        </p>
                      )}
                      {activeTab === "additionalInfo" && (
                        <ul className="text-sm text-gray-500 dark:text-gray-400">
                          {additionalInfo &&
                          Object.keys(additionalInfo).length > 0 ? (
                            Object.entries(additionalInfo).map(
                              ([key, value]) => (
                                <li key={key}>
                                  (<strong>{key}:</strong>) {value}
                                </li>
                              )
                            )
                          ) : (
                            <ul className="mt-10">
                              <li>
                                This product is crafted with the utmost care and
                                attention to detail, ensuring it meets the
                                highest standards of quality and performance.
                              </li>
                              <li>
                                <strong>Category:</strong>{" "}
                                {category || "Not specified"}
                              </li>
                              <li>
                                <strong>Tags:</strong>{" "}
                                {tags?.join(", ") || "No tags available"}
                              </li>
                              <li>
                                <strong>Weight:</strong>{" "}
                                {additionalInfo?.weight || "Not specified"}
                              </li>
                            </ul>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image section */}
        <div className="relative aspect-square overflow-hidden">
          <ImageBlur
            src={imageUrl ? imageUrl : "/images/Image.png"}
            alt={imageAlt || `${name} image`}
            width={300}
            height={350}
            className="object-cover transition-all group-hover:scale-105 w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* actions section for a hot deal product */}
        {isHotDeal && (
          <div className="flex gap-3 justify-center px-1.5 pt-40 sm:pt-0">
            <button
              aria-label={`add ${name} to favourites`}
              className={cn(
                "flex h-10 w-10 items-center cursor-pointer justify-center rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 group-hover:opacity-100 opacity-0"
              )}
            >
              <ImageBlur
                src="/icons/heart.png"
                alt="heart icon"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
              className={cn(
                "flex h-10 w-1/2 space-x-5 items-center text-sm cursor-pointer justify-center rounded-full transition-colors",
                isInCart
                  ? "add-to-cart-bg text-white hover:bg-green-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              <span> Add to Cart</span>
              <ImageBlur
                src={!isInCart ? "/icons/bag.png" : "/icons/bag-white.png"}
                alt="bag icon"
                width={20}
                height={20}
              />
            </button>
            <button
              aria-label={`View ${name}`}
              className={cn(
                "flex h-10 w-10 items-center cursor-pointer justify-center rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 group-hover:opacity-100 opacity-0"
              )}
            >
              <ImageBlur
                src="/icons/eye.png"
                alt="eye icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}

        {/* Details section */}
        <div className={`${!isHotDeal ? "px-4 py-2" : ""} `}>
          <div
            className={cn(
              " gap-2",
              isHotDeal
                ? "flex flex-col items-center justify-center mt-6 w-full"
                : "justify-between flex items-center"
            )}
          >
            <div className={cn(isHotDeal ? "space-y-1" : "")}>
              <h3
                className={`line-clamp-1 text-sm font-medium ${
                  !isInCart ? "text-gray-900" : "isInCart-name-color"
                }  dark:text-gray-50`}
              >
                {name}
              </h3>
              <div>
                {discountedPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{discountedPrice}</span>
                    <span className="text-gray-500 line-through dark:text-gray-400">
                      {formattedPrice}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900 dark:text-gray-50">
                    {formattedPrice}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-1 ${
                  isHotDeal ? "-ml-3" : ""
                }`}
              >
                <span className="text-md text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
                  ))}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ({rating.toFixed(1)} {isHotDeal ? "Feedback" : ""})
                </span>
              </div>
            </div>
            {/* Add to cart button for non-hot deal products 
             This button is only shown when the product is not a hot deal
            */}
            {!isHotDeal && (
              <button
                onClick={handleAddToCart}
                aria-label={`Add ${name} to cart`}
                className={cn(
                  "flex h-10 w-10 items-center cursor-pointer justify-center rounded-full transition-colors",
                  isInCart
                    ? "add-to-cart-bg text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <ImageBlur
                  src={!isInCart ? "/icons/bag.png" : "/icons/bag-white.png"}
                  alt="bag icon"
                  width={20}
                  height={20}
                />
              </button>
            )}
            {isHotDeal && !hotDealExpired ? (
              <div className="pb-4">
                <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                  Hurry up! Offer ends In:
                </p>
                <ul className="flex gap-10">
                  <li className="flex flex-col items-center">
                    <span> {timeLeft.days} </span>
                    <span>DAYS</span>
                  </li>
                  <div className="flex gap-5">
                    <li className="flex flex-col items-center">
                      <span> {timeLeft.hours} </span>
                      <span>HOURS</span>
                    </li>
                    <li>:</li>
                    <li className="flex flex-col items-center">
                      <span> {timeLeft.minutes} </span>
                      <span>MINS</span>
                    </li>
                    <li>:</li>
                    <li className="flex flex-col items-center">
                      <span> {timeLeft.seconds} </span>
                      <span>SECS</span>
                    </li>
                  </div>
                </ul>
              </div>
            ) : (
              isHotDeal && (
                <p className="text-red-500 font-bold">Deal has expired</p>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "productsCard";

export default ProductCard;
