import { images, cardItems, customerDatas } from "../ui-kits/fetchData";
import { Percent, Guarantee, Exchange } from "@/components/icons";
import Carousel from "@/components/ui/Carousel";
import Category from "@/components/ui/Category";
import CardItemSlider from "@/components/ui/CardItemSlider";
import ProductPolicy from "../../components/ui/ProductPolicy";
import CustomerReview from "@/components/ui/CustomerReview";

const policiesHome = [
  {
    Icon: Guarantee,
    title: "Chất lượng đảm bảo",
    description: "Bảo hành đến 730 ngày",
  },
  {
    Icon: Percent,
    title: "Thanh toán",
    description: "Giảm giá khi thanh toán online",
  },
  {
    Icon: Exchange,
    title: "Đổi trả dễ dàng",
    description: "Miễn phí đổi trả trong 7 ngày",
    isLastItem: true,
  },
];

const Home = () => {
  return (
    <main>
      <Carousel images={images} timeAnimation={5000} className="w-full" />

      <div className="container-base">
        <Category />

        <CardItemSlider title="Sản phẩm khuyến mãi" cardItems={cardItems} />
        <CardItemSlider title="Bán chạy" cardItems={cardItems} />
        <CardItemSlider title="Kệ tủ" cardItems={cardItems} />
      </div>

      <ProductPolicy policies={policiesHome} />
      <CustomerReview
        title="Phản hồi của khách hàng"
        customerDatas={customerDatas}
      />
    </main>
  );
};

export default Home;
