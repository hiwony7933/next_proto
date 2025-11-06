import MainHeroBanner from "@/app/cap/components/mainHeroBanner";

export default function Page() {
  const slideData = [
    {
      id: 1,
      title:
        "1보안의 경계를 넘어, 새로운 안전의 기준을 만듭니다.\nTotal Security Innovator, SK쉴더스",
      desc: "1여년의 보안 노하우와 최신 AI 기술이 만나 당신의 소중한 자산을 지킵니다. \n백만 고객이 신뢰한 ADT캡스, 이제 당신과 함께 합니다.",
      imageSrc: "/images/sk/mainBanner1.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 2,

      title:
        "2보안의 경계를 넘어, 새로운 안전의 기준을 만듭니다.\nTotal Security Innovator, SK쉴더스",
      desc: "2여년의 보안 노하우와 최신 AI 기술이 만나 당신의 소중한 자산을 지킵니다. \n백만 고객이 신뢰한 ADT캡스, 이제 당신과 함께 합니다.",
      imageSrc: "/images/sk/mainBanner2.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 3,

      title:
        "3보안의 경계를 넘어, 새로운 안전의 기준을 만듭니다.\nTotal Security Innovator, SK쉴더스",
      desc: "3여년의 보안 노하우와 최신 AI 기술이 만나 당신의 소중한 자산을 지킵니다. \n백만 고객이 신뢰한 ADT캡스, 이제 당신과 함께 합니다.",
      imageSrc: "/images/sk/mainBanner3.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 4,

      title:
        "4보안의 경계를 넘어, 새로운 안전의 기준을 만듭니다.\nTotal Security Innovator, SK쉴더스",
      desc: "4여년의 보안 노하우와 최신 AI 기술이 만나 당신의 소중한 자산을 지킵니다. \n백만 고객이 신뢰한 ADT캡스, 이제 당신과 함께 합니다.",
      imageSrc: "/images/sk/mainBanner4.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
    {
      id: 5,

      title:
        " 5보안의 경계를 넘어, 새로운 안전의 기준을 만듭니다.\nTotal Security Innovator, SK쉴더스",
      desc: "5여년의 보안 노하우와 최신 AI 기술이 만나 당신의 소중한 자산을 지킵니다. \n백만 고객이 신뢰한 ADT캡스, 이제 당신과 함께 합니다.",
      imageSrc: "/images/sk/mainBanner5.png",
      detailUrl: "#",
      downloadUrl: "#",
    },
  ];
  return (
    <div>
      <MainHeroBanner data={slideData} />
    </div>
  );
}
