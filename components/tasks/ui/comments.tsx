'use client';

import { Badge } from "@/components/ui/badge";
import AddComment from "@/components/tasks/ui/add-comment";
import { CommentWithAuthorDetails } from "@/utils/db-fns/tasks/types/comment-with-author-details";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Comments({
  taskId,
  comments,
  className,
}: {
  taskId: string;
  comments: CommentWithAuthorDetails[];
  className?: string;
}) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('rt_TaskComments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'TaskComments',
      }, () => {
        redirect(`/tasks/${taskId}`);
      });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase]);

  return (
    <Card className={className}>
      <CardHeader className={"flex flex-row gap-2.5"}>
        <h3 className={"text-lg font-medium"}>Comments</h3>
        <Badge
          variant="default"
          className={"rounded-full bg-ts-blue-200 border border-white text-foreground"}
        >
          {comments.length}
        </Badge>
      </CardHeader>
      <CardContent className={"flex flex-col gap-1.5"}>
        {comments.map((c) => (
          <div
            key={c.id}
            className={
              "bg-ts-blue-400 border border-ts-blue-300 rounded-lg flex flex-col gap-1.5 px-3 py-1.5"
            }
          >
            <h4 className={"opacity-75 text-sm font-medium"}>
              {c.authored_by!.fullName}
            </h4>
            <span className={"text-xs font-medium"}>
              {new Date(c.created_at).toLocaleString("en-GB")}
            </span>
            <p className={"text-sm"}>{c.content}</p>
          </div>
        ))}
        <AddComment taskId={taskId} />
      </CardContent>
    </Card>
  );
}
