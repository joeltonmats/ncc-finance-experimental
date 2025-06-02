import Image from "next/image";
import Link from "next/link";

export default function ErrorSection() {
  return (
    <section className="px-4 py-4 text-black sm:px-6 md:px-8">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 lg:grid-cols-1 lg:items-center">
        <div className="text-center text-xl leading-snug font-semibold sm:pt-8 sm:text-2xl lg:pt-0">
          Ops! Não encontramos a página...
        </div>

        <p className="mb-6 text-center text-black">
          E olha que exploramos o universo procurando por ela! <br />
          Que tal voltar e tentar novamente?
        </p>
        <div className="flex justify-center pb-8">
          <Link
            href="/"
            className="bg-brand-accent hover:bg-brand-accent/90 size-fit rounded-md px-6 py-2 text-white transition"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
      <div className="relative mx-auto h-fit min-h-56 w-full max-w-md rounded text-neutral-900 shadow-inner lg:h-80">
        <Image
          src="/assets/not-found/404.svg"
          alt="Ilustração 404"
          fill={true}
          priority={true}
        />
      </div>
    </section>
  );
}
