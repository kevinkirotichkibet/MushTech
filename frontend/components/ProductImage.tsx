import Mushroom from './Mushroom';

// Shows the product photo when one is set in the database, else the drawn illustration.
export default function ProductImage({ imageUrl, variety, alt }: { imageUrl?: string; variety: string; alt: string }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={alt} className="photo" loading="lazy" decoding="async" />;
  }
  return <Mushroom variety={variety} />;
}
