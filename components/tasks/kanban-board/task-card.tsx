"use client";

import { Database } from "@/database.types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import clsx from "clsx";
import { MdSupervisedUserCircle } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaGripLines,
  FaUsers,
} from "react-icons/fa6";
import { TbSubtask } from "react-icons/tb";
import { GoCommentDiscussion } from "react-icons/go";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  task,
  authedUserId,
}: {
  task: Database["public"]["Views"]["TaskDetailsView"]["Row"];
  authedUserId: string | undefined;
}) {
  const dueAt = task.due_at ? new Date(task.due_at) : null;
  const isPastDue = dueAt ? new Date() > dueAt : false;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `draggable-${task.id}`,
      data: {
        type: "Task",
        task,
      },
    });
  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        " bg-ts-blue-600 rounded-md border border-ts-blue-200 overflow-hidden",
        {
          "border-ts-gold": isDragging,
        },
      )}
      style={dragStyle}
      {...attributes}
      {...listeners}
    >
      <Link href={`/tasks/${task.id}`}>
        <div
          className={
            "bg-ts-blue-400 p-2  hover:bg-ts-gold hover:text-ts-blue flex flex-row items-center justify-between group transition"
          }
        >
          <h4>{task.title}</h4>
          <LuExternalLink className={"opacity-0 group-hover:opacity-100"} />
        </div>
      </Link>
      <p className={"p-2 text-white opacity-75"}>{task.description}</p>
      {!task.parent_task && (
        <div
          className={
            "m-2 p-2 flex flex-row gap-2 items-center justify-center text-white opacity-75 bg-ts-blue-500 border border-ts-blue-300 rounded-sm w-fit"
          }
        >
          <TbSubtask />
          <span>
            {task.subtasks_completed} / {task.subtasks_total}
          </span>
        </div>
      )}
      <Separator className={"bg-ts-blue-100 mt-2"} />
      <div
        className={
          "p-2 flex flex-wrap gap-2 *:rounded-sm *:bg-ts-blue-500 *:border *:border-ts-blue-300 *:p-1 *:px-2 *:text-white *:opacity-75 *:flex *:gap-2 *:items-center *:justify-center *:text-sm"
        }
      >
        <div>
          {task.priority === "Low" && <FaChevronDown />}
          {task.priority === "Medium" && <FaGripLines />}
          {task.priority === "High" && <FaChevronUp />}
          <span>{task.priority}</span>
        </div>
        {task.assignees && (
          <span>
            <FaUsers />
            {task.assignees.length}
          </span>
        )}
        {task.primarily_responsible_person_id && (
          <span
            className={clsx({
              "bg-ts-gold-950":
                task.primarily_responsible_person_id === authedUserId,
            })}
          >
            <MdSupervisedUserCircle />
            {task.primarily_responsible_person_id === authedUserId
              ? "Me"
              : task.primarily_responsible_person_full_name}
          </span>
        )}
        <span>
          <GoCommentDiscussion />
          {task.comment_count}
        </span>
        {task.due_at && (
          <span
            className={clsx({
              "bg-red-950": isPastDue,
            })}
          >
            <FaClock />
            {new Date(task.due_at).toLocaleString("en-GB")}
          </span>
        )}
      </div>
    </div>
  );
}
