"use client";

import { ComponentProps, useEffect, useRef } from "react";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CollectionItem {
  href?: string;
  [key: string]: any;
}

interface CollectionViewProps<TData extends CollectionItem> {
  data: TData[];
  renderItem: (item: TData) => React.ReactNode;
  fetchMore?: () => void;
}

export function CollectionView<TData extends CollectionItem>({ data, renderItem, fetchMore, className, ...props }: CollectionViewProps<TData> & ComponentProps<"div">) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().slice(-1)[0];
    if (lastItem && lastItem.index >= data.length - 1 && fetchMore) {
      fetchMore();
    }
  }, [virtualizer.getVirtualItems(), data.length, fetchMore]);

  return (
    <div
      ref={parentRef}
      className={cn("h-[70vh] overflow-auto", className)}
      {...props}
    >
      <div
        className="grid grid-cols-1 gap-4"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = data[virtualItem.index];
          const cardContent = (
            <Card className="p-4">
              <CardContent>{renderItem(item)}</CardContent>
            </Card>
          );

          return (
            <div
              key={virtualItem.index}
              // style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              {item.href ? (
                <Link href={item.href}>{cardContent}</Link>
              ) : (
                 cardContent
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WindowCollectionView<TData extends CollectionItem>({ data, renderItem, fetchMore, ...props }: CollectionViewProps<TData> & ComponentProps<"div">) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: data.length,
    estimateSize: () => 60,
    overscan: 5,
  });

  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().slice(-1)[0];
    if (lastItem && lastItem.index >= data.length - 1 && fetchMore) {
      fetchMore();
    }
  }, [virtualizer.getVirtualItems(), data.length, fetchMore]);

  return (
    <div
      ref={parentRef}
      {...props}
    >
      <div
        className="grid grid-cols-1 gap-4"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = data[virtualItem.index];
          const cardContent = renderItem(item);

          return (
            <div
              key={virtualItem.index}
              // style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              {item.href ? (
                <Link href={item.href}>{cardContent}</Link>
              ) : (
                 cardContent
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}