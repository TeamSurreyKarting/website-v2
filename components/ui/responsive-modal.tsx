
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ReactNode, useEffect, useState } from "react";

export function ResponsiveModal({
  trigger,
  title,
  description,
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  trigger?: ReactNode,
  title: string,
  description?: string,
  children?: ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
}) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Sync internal state with external prop if provided
  useEffect(() => {
    if (externalOpen !== undefined) {
      setInternalOpen(externalOpen);
    }
  }, [externalOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
        {trigger !== undefined && (
          <DialogTrigger asChild>
            {trigger || <Button variant="outline">Open</Button>}
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={internalOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {trigger || <Button variant="outline">Open</Button>}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        { (children) && (
          <div className={"mx-4"}>
            {children}
          </div>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
