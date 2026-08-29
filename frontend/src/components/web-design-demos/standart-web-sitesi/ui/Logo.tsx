import Image from "next/image";
import { demoAsset } from "../assets";

export function Logo({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image src={demoAsset(src)} alt={alt} width={1536} height={666} priority={priority} className={className} />
  );
}
