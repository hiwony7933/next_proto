import S from "./page.module.scss";
import ServiceSection from "./main/ServiceSection";
import AdtLogoSection from "./main/AdtLogoSection";

export default function Page() {
  return (
    <div className={S.container}>
      <SpacerSection />
      <ServiceSection />
      <SpacerSection look="accent" />
      <AdtLogoSection />
      <SpacerSection look="accent" />
    </div>
  );
}

const SpacerSection = ({ look = "default" }: { look?: "default" | "accent" }) => {
  const className = look === "accent" ? `${S.imsi} ${S.imsiAccent}` : S.imsi;
  const style =
    look === "accent"
      ? { height: "1660px", outline: "1px solid black", zIndex: 5 }
      : { height: "1660px" };

  return (
    <section className={className} style={style}>
      123
    </section>
  );
};
