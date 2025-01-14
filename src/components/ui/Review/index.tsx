"use client";

import { useState } from "react";
import ReviewHeader from "./ReviewHeader";
import ReviewComment from "./ReviewComment";
import Pagination from "../Pagination";
import { ReviewCommentProps } from "./ReviewComment";

interface ReviewProps {
  dataReviews: {
    averageRating: number;
    ratings: {
      title: string;
      id: number;
      value: number;
    }[];
    comments: (ReviewCommentProps | Partial<ReviewCommentProps>)[];
  };
}

const Review = ({ dataReviews }: ReviewProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentComments = dataReviews.comments.slice(startIndex, endIndex);
  const onPaginationChange = (currentPage: number) => {
    setPage(currentPage);
  };
  const handleClickBtn = (ratingId: number) => {
    console.log(ratingId);
  };

  return (
    <>
      <ReviewHeader
        ratings={dataReviews.ratings}
        averageRating={dataReviews.averageRating}
        onClickBtn={handleClickBtn}
      />

      <div>
        {currentComments.map((comment) => (
          <ReviewComment key={comment.id} {...comment} />
        ))}
      </div>
      <Pagination
        total={dataReviews.comments.length}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={onPaginationChange}
      />
    </>
  );
};

export default Review;
