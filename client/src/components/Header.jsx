import useGetTopProduct from "../hooks/admin/useGetTopProduct";
import ProductCarousel from "../pages/products/ProductCarousel";
import SmallProduct from "../pages/products/SmallProduct";
import Loader from "./Loader";

function Header() {
  const { isLoading, error, products } = useGetTopProduct();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden:sm:hidden">
          <div className="grid grid-cols-2">
            {products.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>

        <ProductCarousel />
      </div>
    </>
  );
}

export default Header;
