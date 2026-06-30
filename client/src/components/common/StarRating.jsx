import { useState } from "react";
import { FiStar } from "react-icons/fi";

const StarRating = ({ rating = 0, onChange, readonly = false, size = "md" }) => {
  const [hovered, setHovered] = useState(0);

  const sizes = { sm: 16, md: 24, lg: 32 };
  const starSize = sizes[size];

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
          >
            <FiStar
              size={starSize}
              className={filled ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
