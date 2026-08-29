import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { InkLine } from "../ui/InkLine";
import { Reveal } from "@/components/shared/reveal";
import type { DemoConfig } from "../demo-config";

function buildValueProps(config: DemoConfig) {
  const location = config.contact.address.district ?? config.contact.address.city;
  return [
    {
      title: "Tek Elden Üretim",
      body: `${config.services.length} farklı kategoride, farklı tedarikçilerle uğraşmadan tek adresten çözüm.`,
    },
    {
      title: "Kişiye Özel Tasarım",
      body: "Kurumsal ya da bireysel; fikrinizi birlikte ürüne dönüştürüyoruz.",
    },
    {
      title: `${location}'nin Merkezinde`,
      body: `${config.contact.address.line1} içinde, kolay ulaşılabilir bir konumdayız.`,
    },
    {
      title: "Az Adetten Toplu Siparişe",
      body: "İhtiyacınıza uygun ölçekte, esnek üretim kapasitesi.",
    },
  ];
}

export function WhyUs({ config }: { config: DemoConfig }) {
  const valueProps = buildValueProps(config);

  return (
    <Section id="neden-biz" ariaLabel="Neden Biz">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal>
          <Eyebrow>Neden Biz</Eyebrow>
          <h2 className="text-display-2 mt-6 font-display text-text">
            İşinizi büyütürken markanızın arkasında duruyoruz.
          </h2>
          <p className="text-body-lg mt-6 max-w-md text-muted">{config.meta.description}</p>
        </Reveal>

        <ul className="flex flex-col gap-8">
          {valueProps.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <li className="flex gap-5">
                <InkLine orientation="vertical" className="mt-1 h-auto self-stretch" />
                <div>
                  <h3 className="font-display text-xl text-text">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
