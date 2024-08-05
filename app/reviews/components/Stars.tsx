import React from 'react';
import Star from "../../../img/star.png";
import HalfStar from "../../../img/half_star.png";
import Image from 'next/image';

interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Image key={`full-${i}`} src={Star} width={20} alt='full star' />);
    }

    if (hasHalfStar) {
        stars.push(<Image key='half' src={HalfStar} width={20} alt='half star' />);
    }

    return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
