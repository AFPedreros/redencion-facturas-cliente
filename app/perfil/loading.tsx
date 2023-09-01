import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <Loader2 className="h-12 w-12 animate-spin text-black" />
    </div>
  );
}
