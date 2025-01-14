import dynamic from "next/dynamic";
import Carousel from "@/components/ui/Carousel";
import ProductHeader from "./_component/ProductHeader";
import ProductContactSocial from "./_component/ProductContactSocial";
import ItemPrice from "@/components/ui/ItemPrice";
import ProductPolicy from "../../../components/ui/ProductPolicy";
import ProductForm from "./_component/ProductForm";
import { Clock, Group, HeartInsurance } from "@/components/icons";
import ProductDescription from "./_component/ProductDescription";
import Review from "@/components/ui/Review";
import { dataReview } from "@/app/ui-kits/fetchData";

const policies = [
  {
    Icon: HeartInsurance,
    title: "Cam kết 1 đổi 1",
    description: "Trong 30 ngày",
  },
  {
    Icon: Group,
    title: "100% Uy tín",
    description: "Các loại gỗ cao cấp",
  },
  {
    Icon: Clock,
    title: "Giao hàng toàn quốc",
    description: "Giao hành nhanh chóng",
    isLastItem: true,
  },
];

const images = [
  "https://i.imgur.com/ZKyYNAH.png",
  "https://images.unsplash.com/photo-1653832919710-348081cb9e87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://i.imgur.com/ZKyYNAH.png",
  "https://images.unsplash.com/photo-1653832919710-348081cb9e87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const productData = {
  title: "HỆ TỦ BẾP MOHO KITCHEN DÒNG MIX (HỆ TỦ BẾP KẾT HỢP)",
  rating: 4.9,
  numberReview: 50,
  totalSold: 147,
  status: "Còn hàng",
  price: 2000000,
  discount: 10,
  colors: [
    "rgba(219, 188, 180, 1)",
    "rgba(211, 205, 199, 1)",
    "rgba(51, 73, 108, 1)",
  ],
  flashDealEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  totalFavorite: 345,
  descriptionHtml: `<div class="text-base mb-6">
        <h2 class="text-xl mt-2 mb-1">1/ Thông số kỹ thuật</h2>
        <p class="font-thin">
          Vòng tay Trầm Hương Lá Bùa Tây Tạng Nam được chế tác từ thân gỗ trầm
          hương từ 10 đến 14 năm tích trầm nguồn gốc từ Lào. Vòng tay thường sẽ
          có từ 13 đến 17 hạt (có thể thay đổi theo mong muốn khách hàng) hạt
          trầm. Số hạt sẽ được chọn dựa trên quy tắc của vòng luân hồi “sinh –
          lão – bệnh – tử” nhằm đem lại may mắn cho gia chủ. Nên chọn số hạt là
          số chia cho 4 dư 1. Theo đó, hạt cuối cùng sẽ rơi vào chữ “sinh”. Vòng
          tay trầm hương tỏa hương thơm gần như vĩnh cửu, giúp người đeo xua tan
          cảm giác mệt mỏi, u sầu, giải tỏa stress cũng như xoa dịu những nỗi
          buồn trong cuộc sống.
          <br />
          Vòng Trầm Hương Tây Tạng – sự kết hợp độc đáo, hài hòa giữa Trầm hương
          và charm lá bùa Tây Tạng mang ý nghĩ đặc biệt của Phật giáo – mở mang
          tâm thức từ bi, bác ái, đem lại nhiều phước lành cho bản thân và lan
          tỏa năng lượng tích cực cho mọi người xung quanh.
        </p>
      </div>
      <div class="text-base mb-6">
        <h2 class="text-xl mt-2 mb-1">2/ Chi tiết vật liệu</h2>
        <p class="font-thin">
          1 chiếc vòng tay trầm hương tự nhiên, hộp đựng với chất liệu cao cấp
          phiên bản chào mừng 40 năm thành lập TMH Thẻ thành viên sang trọng của
          Thiên Mộc Hương (member card), Giấy hướng dẫn bảo quản vòng tay để
          chiếc vòng phát huy hết tác dụng phong thuỷ của nó. Ngoài ra, đi kèm
          với hộp đựng cao cấp còn có set hạt và dây dự phòng.
          <br /> Dây và hạt để khách hàng có thể dễ dàng thay dây, thay hạt
          trong trường hợp muốn nới rộng hoặc thu nhỏ chiếc vòng tay thật vừa
          vặn nhất. Thẻ Member card giúp khách hàng có thể đến bất kì cửa hàng
          nào của thiên Mộc Hương để được bảo hành sản phẩm (thay dây – đánh
          bóng hạt) miễn phí trọn đời.
        </p>
      </div>
      <div class="text-base mb-6">
        <h2 class="text-xl mt-2 mb-1">3/ Đặc điểm nổi bật</h2>
        <p class="font-thin">
          Lá bùa vàng – Mạng Thổ .<br />
          Câu thần chú “Om Mani Pame Hum” nổi tiếng và rất linh ứng của Bồ Tát
          Quán Thế Âm, được biết đến như là một thần chú hộ mệnh sử dụng phổ
          biến nhất trong Phật giáo. Sáu âm tiết trong câu thần chú tượng trưng
          cho 6 pháp ba-la-mật và gắn liền với 6 món trí tuệ. Tất cả đều là
          những phẩm chất thanh cao, thuần khiết của Đức Phật. Nam libero
          tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
          minus id quod maxime placeat facere possimus, omnis voluptas assumenda
          est, omnis dolor repellendus. Temporibus autem quibusdam et aut
          officiis debitis aut rerum necessitatibus saepe eveniet ut et
          voluptates repudiandae sint et molestiae non recusandae. Itaque earum
          rerum
        </p>
      </div>`,
};

const FlashDeal = dynamic(() => import("@/components/ui/FlashDeal"), {
  ssr: false,
});

export interface IProduct {
  colors: string[];
  flashDealEndTime: Date;
}

const Product = () => {
  return (
    <div className="container-base">
      <div className="mt-10 block xl:flex">
        <Carousel
          images={images}
          isShowImageBottom={true}
          className="mb-8 xl:w-1/2"
        />

        <div className="mb-8 xl:px-8 xl:w-1/2">
          <ProductHeader
            title={productData.title}
            rating={productData.rating}
            numberReview={productData.numberReview}
            totalSold={productData.totalSold}
            status={productData.status}
          />
          <div className="h-16">
            <FlashDeal endTime={productData.flashDealEndTime} />
          </div>

          <ItemPrice
            price={productData.price}
            discount={productData.discount}
            currentPriceClass="text-xl"
            isShowDiscountPrice={true}
          />

          <ProductForm productData={productData} />
          <ProductContactSocial totalFavorite={productData.totalFavorite} />
        </div>
      </div>

      <ProductPolicy policies={policies} />

      <ProductDescription descriptionHtml={productData.descriptionHtml} />

      <Review dataReviews={dataReview} />
    </div>
  );
};

export default Product;
