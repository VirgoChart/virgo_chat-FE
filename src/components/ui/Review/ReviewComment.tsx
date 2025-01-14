import Image from "next/image";
import RatingStar from "../RatingStar";

export interface ReviewCommentProps {
  avatar?: string;
  id?: number;
  name?: string;
  rating?: number;
  time?: string;
  content?: string;
  images?: string[];
}

const ReviewComment = ({
  avatar,
  name,
  rating,
  time,
  content,
  images,
}: ReviewCommentProps) => {
  return (
    <div className="mt-2 border-b border-white-200">
      <div className="flex items-center gap-4 px-4">
        <Image
          src={
            avatar ??
            "https://s3-alpha-sig.figma.com/img/06eb/f564/51fa0301816c267bde5cd9715bb3bda9?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fi2w4Sku02QCw6qLtKF3RHuWjPQf68Pyuf-3RF6l7NRYlHqMdKD2w-mVQzm-R7872oOASl5lrFqIp5rca0Y~dd6fw8kb3Y~8tMg3HzsrLprWM8u3g64qGAsBBJWjSOvCvqVVhnn3-WWJs3uAjUJI00cbxe85eAKjNaZuwoPUihFmJ3rAfR-VGsKouGlaGSNMW-sq8PLxxUimWq2uIX~XX8m0rBREPLdkqLgpkSmGoTPiVp0uIDqzhkujvx8bgDkqCV8ledsTVTyANNfQLdBvDAcCq5QxXd97rYrcrOfFP12ZwXIl8~WPLsQA7CE9kvuv6~Mwe3M1AJ6IK-BPZMeyHQ__"
          }
          alt="User Img"
          width={300}
          height={300}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <p className="text-base mb-1">{name}</p>
          <RatingStar rating={rating} classStar="mx-0.5" />
          <p className="text-sm text-dark-400 mt-1">{time}</p>
        </div>
      </div>

      <div className="mt-2 mb-4 ml-16 px-4">
        <p className="font-light mb-2">{content}</p>
        <div className="flex flex-wrap mb-2">
          {images?.map((imgUrl, idx) => (
            <Image
              key={idx}
              src={imgUrl}
              alt="category item"
              width={300}
              height={300}
              className="w-24 h-24 mr-4 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;
