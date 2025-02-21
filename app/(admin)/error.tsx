"use client";

import { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function formatErrorMessage(error: string) {
  try {
    return <code>{JSON.parse(error)}</code>;
  } catch {
    return error;
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const performRetry = () => {
    setIsRetrying(true);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>{formatErrorMessage(error.message)}</CardDescription>
      </CardHeader>
      <CardFooter>
        <LoadingButton
            onClick={performRetry}
            loading={isRetrying}
          >
          <FaRedo />
          Retry
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
