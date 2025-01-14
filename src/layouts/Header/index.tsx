import Link from "next/link";
import Input from "@/components/ui/Input";
import {
  Envelope,
  Phone,
  User,
  Search,
  Favorite,
  CartShopping,
  DownAngle,
  LogoFurniture,
} from "@/components/icons";
import HeaderNav from "./HeaderNav";
import UserHeader from "./UserHeader";
import UserAction from "./UserAction";

const menus = [
  {
    name: "Trang chủ",
    link: "#",
  },
  {
    name: "Sản phẩm",
    link: "#",
    icon: <DownAngle />,
  },
  {
    name: "Tin tức",
    link: "#",
  },
  {
    name: "Vouncher",
    link: "#",
  },
  {
    name: "Combo tặng thưởng",
    link: "#",
  },
  {
    name: "Sản phẩm bán chạy",
    link: "#",
  },
  {
    name: "Sản phẩm nổi bật",
    link: "#",
  },
];

const Header = () => {
  return (
    <header>
      <div className="bg-primary-900 text-white py-4 top-0 z-10 xl:block hidden">
        <div className="flex justify-between items-center">
          <div className="container-base flex justify-between">
            <div className="flex gap-20 items-center">
              <Link href="#" className="text-sm flex gap-1 items-center">
                <Envelope className="mr-1" /> Ecommerce@gmail.com
              </Link>

              <Link href="#" className="text-sm flex gap-1 items-center">
                <Phone className="mr-1" /> 0974659677
              </Link>
            </div>

            <div className="flex gap-1 items-center">
              <UserHeader />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden py-2 bg-white xl:block container-base">
        <div className="flex justify-between items-center">
          <Link href="/">
            <LogoFurniture />
          </Link>

          <div className="hidden gap-3 xl:flex">
            {menus.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex gap-1 items-center"
              >
                {item.name}
                {item.icon && item.icon}
              </Link>
            ))}
          </div>

          <Input
            variant="standard"
            placeholder="Tìm kiếm sản phẩm"
            error=""
            icon={<Search className="text-primary-900" />}
            className="xl:w-[230px] xxl:w-[320px]"
          />

          <div className="flex gap-5 items-center">
            <Link className="flex flex-col items-center" href="#">
              <Favorite fill="none" className="text-white w-7 h-7" />
              <span className="text-primary-900">Đã lưu</span>
            </Link>

            <Link className="flex flex-col items-center" href="/cart">
              <CartShopping className="text-primary-200 w-5 h-5 mt-1" />
              <span className="text-primary-900 mt-1">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white flex py-3 px-4 justify-between items-center xl:hidden relative">
        <HeaderNav menus={menus} />

        <Link href="/">
          <LogoFurniture className="text-primary-600 ml-8" />
        </Link>

        <UserAction />
      </div>
    </header>
  );
};

export default Header;
