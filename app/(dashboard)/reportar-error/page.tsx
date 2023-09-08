import { Card, CardContent } from "@/components/ui/card";
import { ErrorReportForm } from "@/components/forms/error-report-form";
import { Shell } from "@/components/shell";

export default function ErrorReportPage() {
  return (
    <Shell className="mt-2 max-w-[400px] md:mt-0" variant="sidebar">
      <section className="w-full pt-9">
        <h2 className="mb-6 text-2xl font-semibold ">Reportar un fallo</h2>
        <Card>
          <CardContent className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <ErrorReportForm />
          </CardContent>
        </Card>
      </section>
    </Shell>
  );
}
