import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  placeholder?: string; // optional low-res or svg placeholder
};

const LazyImage: React.FC<Props> = ({ src, alt, className, srcSet, sizes, width, height, placeholder, ...rest }) => {
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      // allow caller to pass styles and other attributes
      {...rest}
    />
  );
};

export default LazyImage;
