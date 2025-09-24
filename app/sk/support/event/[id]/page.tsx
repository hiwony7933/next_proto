import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eventData } from "@/sample/data/event";
import MzButton from "@/app/common/components/ui/mzButton";

export default async function EventIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const item = eventData.find((ev) => ev.id === numericId);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <div>
        <div>{item.title}</div>
        <div>{item.date}</div>
        <div>
          <Image
            src={item.iamgePath}
            alt={item.title}
            width={800}
            height={460}
          />
        </div>
      </div>
      <MzButton fill="black" href="/sk/support/event">
        목록
      </MzButton>
    </div>
  );
}
