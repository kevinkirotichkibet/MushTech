// Renders the product photo. With no photo it renders nothing: no generic placeholder art.
export default function ProductImage({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  if (!imageUrl) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageUrl} alt={alt} className="photo" loading="lazy" decoding="async" />;
}
