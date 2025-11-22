import S from "./serviceLinkCard.module.scss";
import MzButton from "@/app/common/components/atom/mzButton";
import Image from "next/image";
import useBreakpoint from "@/hooks/useBreakpoint";

interface ServiceLinkCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  imageSrc?: string;
  logo?: string;
  color?: string;
}

export default function ServiceLinkCard(props: ServiceLinkCardProps) {
  const {
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    imageSrc,
    logo,
    color,
  } = props;
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <div className={`${S.faqFormat} row`}>
      <div className={`${S.faqFormat__text} col-${isMobile ? 12 : 6}`}>
        {title && (
          <p className={S.faqFormat__text__title} style={{ color: color }}>
            {title}
          </p>
        )}
        {logo && <i className={logo} aria-hidden="true" />}
        <h3 className={S.faqFormat__text__subtitle}>{subtitle}</h3>
        <p className={S.faqFormat__text__description}>{description}</p>
        <MzButton
          size="Large"
          fill="white"
          stroke="Black"
          className={S.faqFormat__text__button}
          href={buttonHref}
        >
          {buttonText}
          <i className="icon__20_right_arrow" aria-hidden="true" />
        </MzButton>
      </div>
      <div className={`${S.faqFormat__image} col-${isMobile ? 12 : 6}`}>
        <Image
          src={imageSrc ?? ""}
          alt=""
          width={100}
          height={100}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
