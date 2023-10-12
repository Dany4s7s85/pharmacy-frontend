import React from 'react';

function StarRating({ value = 1 }) {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <button type="button" key={index}>
          <span
            className="material-icons-outlined"
            style={{
              color: `${index < value ? '#ffb400' : '#cccccc'}`,
            }}>
            {index + 1 <= value ? 'star' : 'star_outline'}
          </span>
        </button>
      ))}
    </div>
  );
}

export default StarRating;
