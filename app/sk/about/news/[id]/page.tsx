import React from "react";
import { notFound } from "next/navigation";
import { listNoticeData } from "@/sample/data/listNotice";
import MzButton from "@/app/common/components/ui/mzButton";

export default async function EventIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const item = listNoticeData.find((ev) => ev.id === numericId);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <div>
        <div>{item.topflag ? "상단고정" : ""}</div>
        <div>{item.content}</div>
        <div>{item.date}</div>
        <div>
          <span>첨부파일</span>
          <span>파일명</span>
          <MzButton fill="black">다운로드</MzButton>
        </div>
        <div dangerouslySetInnerHTML={{ __html: item.deepContent ?? "" }}></div>
      </div>
      <MzButton fill="black" href="/sk/about/news">
        목록
      </MzButton>

      <table>
        <colgroup>
          <col width="100px" />
          <col width="150px" />
          <col width="100px" />
        </colgroup>
        <tbody>
          <tr>
            <td>이전글</td>
            <td>이미지영역</td>
            <td>
              <div>
                <p>아마도 카테고리</p>
                <p>아마도 제목</p>
                <p>아마도 날짜</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>다음글</td>
            <td>이미지영역</td>
            <td>
              <div>
                <p>아마도 카테고리</p>
                <p>아마도 제목</p>
                <p>아마도 날짜</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
