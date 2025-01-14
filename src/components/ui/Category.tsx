import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/apis/home";

interface ICategoryItem {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
}

export default async function Category() {
  const response = await getCategory();

  return (
    <div className="my-12">
      <h1 className="mt-12 text-2xl text-primary-900 text-center uppercase font-medium">
        Sản phẩm nổi bật
      </h1>
      <p className="text-center mt-2 font-thin mb-8">
        Xem những sản phẩm đang thịnh hành ngay bây giờ
      </p>
      <div className="grid gap-x-12 gap-y-4 md:gap-x-20 md:gap-y-6 grid-cols-3 md:grid-cols-6">
        {response?.data.data.map((item: ICategoryItem) => (
          <CategoryItem
            key={item._id}
            _id={item._id}
            name={item.name}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

const CategoryItem = ({ _id, name, imageUrl }: ICategoryItem) => {
  return (
    <div className="flex flex-col hover:underline">
      <div className="aspect-square rounded-full border-2 border-primary-900 overflow-hidden flex-grow">
        <Image
          src={imageUrl || ""}
          alt={name}
          width={300}
          height={300}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>

      <Link
        href={`/${_id}`}
        className="mt-4 mb-2 text-center text-base md:text-xl"
      >
        {name}
      </Link>
    </div>
  );
};
