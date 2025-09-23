"use client";
import React, { useState } from "react";
import Image from "next/image";
import S from "./imageNotice.module.scss";
import MzPagination from "../ui/mzPagination";
type Item = {
  id: number;
  title: string;
  date: string;
  iamgePath: string;
};

export default function ImageNotice({ items }: { items: Item[] }) {
  const eventData: Item[] = items || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(eventData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = eventData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className={S.eventList}>
      <div className={S.eventItemWrap}>
        {currentItems.map((item: Item, idx: number) => (
          <div className={S.eventItem} key={idx}>
            <Image
              src={item.iamgePath}
              alt={item.title}
              width={400}
              height={230}
            />
            <div>
              <h4>{item.title}</h4>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
      <MzPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}
