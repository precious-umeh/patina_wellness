import Image from "next/image";

function BrandLoader() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="bg-primary animate-glow absolute inset-0 h-24 w-24 rounded-full blur-2xl" />

        <Image
          src="/Patina_Logo_Icon.png"
          alt="Patina Logo Icon"
          width={100}
          height={70}
          priority
          className="animate-breathe relative h-12 w-auto"
        />
      </div>
    </div>
  );
}

export default BrandLoader;
