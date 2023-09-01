"use client";

import { AlertCircle } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NotificationsCardProps {
  title?: string;
  text?: string;
  className?: string;
}

export default function NotificationsCard({
  title,
  text,
  className,
}: NotificationsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-4 rounded-md">
          <AlertCircle className="h-10 w-10" />
          <div className="flex w-full flex-col gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="w-full">{text}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
