"use client";

import Image, { ImageProps } from "next/image";

const cloudinaryLoader = ({ src, width }: { src: string; width: number }) => {
  if (src && src.includes('res.cloudinary.com')) {
    return src.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return src;
};

export default function CloudinaryImage(props: ImageProps) {
  return <Image loader={cloudinaryLoader} {...props} />;
}