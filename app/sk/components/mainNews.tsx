import S from "./mainNews.module.scss";
import useBreakpoint from "@/hooks/useBreakpoint";
import MzButton from "@/app/common/components/atom/mzButton";

import Link from "next/link";
import Image from "next/image";

interface NewsItem {
  date: string;
  title: string;
  href: string;
  hashTag: string[];
}

interface MainNewsProps {
  data: NewsItem[];
}

export default function MainNews({ data }: MainNewsProps) {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section className={`${S.news} ${"row"} layout__container`}>
      <div
        className={`${S.news__left} ${isMobile || isTablet ? "col-12" : "col-5"}`}
      >
        <div className={S.news__title}>SK 쉴더스 최신뉴스</div>
        <div className={S.news__desc}>
          최신 보안 동향과 위협정보를 한 눈에 확인하세요.
        </div>
        {!isMobile && !isTablet && (
          <div className={S.news__button}>
            <MzButton size="Large" className="button-more" fill="white">
              뉴스 더보기 &gt;
            </MzButton>
          </div>
        )}
      </div>
      <div
        className={`${S.news__right} ${isMobile || isTablet ? "col-12" : "col-7"}`}
      >
        <ul className={S.news__list}>
          {data.map((news, idx) => (
            <li key={`${news.date}-${idx}`}>
              <Link
                href={news.href}
                className={S.news__listItem}
                aria-label={`'${news.title}' 뉴스 상세 페이지`}
              >
                <div className={S.news__listLeft}>
                  <Image
                    src="/images/sk/demo.png"
                    alt={news.title}
                    width={224}
                    height={119}
                  />
                </div>
                <div className={S.news__listRight}>
                  <div className={S.news__listDate}>{news.date}</div>
                  <div className={S.news__listTitle}>{news.title}</div>
                  <div className={S.news__listHashTag}>
                    {news.hashTag.map((tag) => (
                      <span key={tag} className={S.news__listHashTagItem}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {isMobile ||
        (isTablet && (
          <MzButton size="Large" fill="white" full>
            뉴스 더보기 <i className="icon__20_right_arrow" />
          </MzButton>
        ))}
    </section>
  );
}
