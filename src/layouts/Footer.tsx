import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  LogoFurniture,
  Instagram,
  Facebook,
  Twitter,
} from "@/components/icons";

const aboutCategories = [
  { name: "Trang chủ", link: "#" },
  { name: "Sản phẩm", link: "#" },
  { name: "Tin tức", link: "#" },
  { name: "Voucher", link: "#" },
  { name: "Combo giảm giá", link: "#" },
];

const customerSupportCategories = [
  { name: "Điều khoản - Điều kiện", link: "#" },
  { name: "Chính sách đổi trả", link: "#" },
  { name: "Chính sách hỗ trợ", link: "#" },
  { name: "Chính sách bảo mật", link: "#" },
];

const copyright = [
  {
    name: "Cao Tiến Hải",
    linkfb: "https://www.facebook.com/hai.tan.288",
    icon: <Facebook />,
    phone: "0973481940",
  },
  {
    name: "Đặng Quân Bảo",
    linkfb: "https://www.facebook.com/bao.ang.361413",
    icon: <Facebook />,
    phone: "0974659677",
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#C5B3E2]">
      <div className="py-5">
        <div className="flex flex-col justify-center gap-10 container-base xl:flex-row">
          <div className="flex items-start flex-col gap-5">
            <Link href="#" className="text-6xl font-bold text-primary">
              VirgoChat
            </Link>

            <div>
              <p>Liên hệ với chúng tôi</p>
              <p className="text-primary font-medium pt-2">
                Địa chỉ: Hưng Chính, Vinh, Nghệ An
              </p>
            </div>

            <div>
              <p className="pb-2">Theo dõi chúng tôi tại</p>
              <div className="flex gap-3 items-center">
                <Link href="">
                  <Facebook />
                </Link>

                <Link href="https://www.instagram.com/tien_hai_2808/">
                  <Instagram />
                </Link>

                <Link href="">
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 p-5 bg-gray-100 rounded-md shadow-md">
            <div className="text-2xl font-semibold text-gray-600">
              Copyright:
            </div>
            <div className="flex flex-col gap-2">
              {copyright.map((person, index) => (
                <div key={index} className="flex items-center gap-2 text-lg">
                  {person.icon}
                  <a
                    href={person.linkfb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {person.name}
                  </a>
                  <span className="text-gray-600 ml-2">({person.phone})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-t-3 border-white py-2 flex items-center justify-center">
        <div>
          <p className="text-primary text-sm md:text-base mx-auto">
            For any support or help, you can contact us via our Facebook
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
