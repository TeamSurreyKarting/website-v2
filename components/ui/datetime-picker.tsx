"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, CalendarIcon, ClockIcon } from "lucide-react";
import clsx from "clsx";

// The main DateTimePicker component
type DateTimePickerProps = {
  datetime?: Date;
  onDatetimeChange?: (date: Date) => void;
  intervalSeconds?: number;
  min?: Date;
  max?: Date;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  datetime,
  onDatetimeChange,
  intervalSeconds = 900,
  min,
  max,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date | undefined>(datetime);
  const [timeIsDirty, setTimeIsDirty] = useState<boolean>(datetime !== undefined);
  const [activeTab, setActiveTab] = useState<"date" | "time" | "summary">("date");

  const handleDateSelect = (value: Date | undefined) => {
    if (!value) return;

    setDateSelected(value);
  };

  const handleTimeSelect = (value: Date | undefined) => {
    if (!value) return;

    setDateSelected(value);
    setTimeIsDirty(true);
  };

  const handleSummarySubmit = () => {
    if (!dateSelected || !timeIsDirty || !onDatetimeChange) return;

    onDatetimeChange(dateSelected);
    setOpen(false);
  }

  const PickerContent = () => (
    <div className="p-4">
      {(() => {
        switch (activeTab) {
          case "date":
            return (
              <Calendar
                mode={"single"}
                selected={dateSelected}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const dateIsBeforeMin = (min && isBefore(date, startOfDay(min))) ?? false;
                  const dateIsAfterMax = (max && isAfter(date, endOfDay(max))) ?? false;

                  return dateIsBeforeMin || dateIsAfterMax;
                }}
              />
            );
          case "time":
            return (
              <TimeList
                intervalSeconds={intervalSeconds}
                dateSelected={dateSelected}
                onTimeSelect={handleTimeSelect}
                min={min}
                max={max}
              />
            );
          case "summary":
            return (
              <div className={"flex flex-col gap-2 mt-4 mb-8"}>
                <Button className={"w-full justify-start"} variant={"input"} onClick={() => setActiveTab("date")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateSelected ? format(dateSelected, "PPP") : <span>Pick a date</span>}
                </Button>
                <Button className={"w-full justify-start"} variant={"input"} onClick={() => setActiveTab("time")}>
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {dateSelected ? format(dateSelected, "HH:mm") : <span>Pick a date</span>}
                </Button>
              </div>
            )
        }
      })()}
      <Button
        className={"w-full mb-8 mt-4"}
        size={"lg"}
        disabled={
          (activeTab === "date" && !dateSelected) ||
          (activeTab === "time" && !timeIsDirty)
        }
        onClick={() => {
          switch (activeTab) {
            case "date":
              setActiveTab("time");
              break;
            case "time":
              setActiveTab("summary");
              break;
            case "summary":
              handleSummarySubmit();
              break;
          }
        }}
      >
        {(() => {
          switch (activeTab) {
            case "date":
              return "Pick Date"
            case "time":
              return "Pick Time"
            case "summary":
              return "Confirm Selection"
          }
        })()}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      variant="input"
      className={clsx('w-full justify-start text-left font-normal', {
        "text-muted-foreground": datetime
      })}
      onClick={() => setOpen(true)}
    >
      <CalendarClock className="mr-2" />
      {datetime ? format(datetime, "HH:mm PPP") : <span>Pick a date</span>}
    </Button>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <TriggerButton />
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle className={"flex flex-row gap-2 items-center"}>
                {(() => {
                  switch (activeTab) {
                    case "date":
                      return <CalendarIcon className="mr-2 h-4 w-4" />
                    case "time":
                      return <ClockIcon className="mr-2 h-4 w-4" />
                    case "summary":
                      return <CalendarClock className="mr-2 h-4 w-4" />
                  }
                })()}
                <span>
                  {(() => {
                    switch (activeTab) {
                      case "date":
                        return "Select Date"
                      case "time":
                        return "Select Time"
                      case "summary":
                        return "Review Date and Time"
                    }
                  })()}
                </span>
              </SheetTitle>
            </SheetHeader>
            <PickerContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
           <DialogTrigger asChild>
            <TriggerButton />
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle className={"flex flex-row gap-2 items-center"}>
                 {(() => {
                   switch (activeTab) {
                     case "date":
                       return <CalendarIcon className="mr-2 h-4 w-4" />
                     case "time":
                       return <ClockIcon className="mr-2 h-4 w-4" />
                     case "summary":
                       return <CalendarClock className="mr-2 h-4 w-4" />
                   }
                 })()}
                {(() => {
                  switch (activeTab) {
                    case "date":
                      return "Select Date"
                    case "time":
                      return "Select Time"
                    case "summary":
                      return "Review Date and Time"
                  }
                })()}
               </DialogTitle>
             </DialogHeader>
             <PickerContent />
           </DialogContent>
         </Dialog>
       )}
    </>
  );
};

type TimeListProps = {
  intervalSeconds: number;
  dateSelected?: Date;
  onTimeSelect: (value: Date) => void;
  min?: Date;
  max?: Date;
};

const TimeList: React.FC<TimeListProps> = ({ intervalSeconds, dateSelected, onTimeSelect }) => {
  const times: Date[] = [];
  let startOfDay = new Date();

  if (dateSelected) {
    startOfDay.setFullYear(dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate());
  }

  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  for (
    let currentTime = new Date(startOfDay);
    currentTime < endOfDay;
    currentTime = new Date(currentTime.getTime() + intervalSeconds * 1000)
  ) {
    times.push(new Date(currentTime));
  }

  const selectedTimeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedTimeRef.current) {
      selectedTimeRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [dateSelected]);

  return (
    <div className="flex flex-col gap-2 max-h-80 overflow-auto">
      {times.map((time, index) => {
        const isActive = time.getTime() === dateSelected?.getTime();

        return (
          <Button
            key={index}
            ref={isActive ? selectedTimeRef : null}
            variant={isActive ? "default" : "secondary"}
            onClick={() => onTimeSelect(time)}
          >
            {format(time, "p")}
          </Button>
        );
      })}
    </div>
  );
};
