import {
  FaRegSmile,
  FaRegSadCry,
  FaRegAngry,
  FaHeart,
  FaThumbsUp,
} from "react-icons/fa";

const reactionOptions = [
  { type: "like", icon: <FaThumbsUp className="text-blue-500" /> },
  { type: "love", icon: <FaHeart className="text-red-500" /> },
  { type: "sad", icon: <FaRegSadCry className="text-yellow-500" /> },
  { type: "angry", icon: <FaRegAngry className="text-red-700" /> },
  { type: "haha", icon: <FaRegSmile className="text-yellow-400" /> },
];

export default reactionOptions;
