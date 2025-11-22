import S from "./boardEmpty.module.scss";
import Image from "next/image";
import emptyIcon from "@/public/icons/icon_104_detailEmpty.svg";

type BoardEmptyProps = {
  title?: string; // 아직 등록된 게시물이 없습니다.
  description?: string; // 새로운 소식으로 곧 찾아뵙겠습니다.
  searchValue?: string;
};

export default function BoardEmpty({
  title,
  description,
  searchValue,
}: BoardEmptyProps) {
  return (
    <div className={S.board__empty} role="status" aria-live="polite">
      <Image src={emptyIcon} alt="" width={104} height={104} />
      <span className={S.board__emptyText}>
        '{searchValue}' {title}
        <br /> {description}
      </span>
    </div>
  );
}
