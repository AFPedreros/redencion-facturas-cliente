import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { UpdateProfileForm } from "@/components/forms/update-profile-form";
import { Shell } from "@/components/shell";

export default function ProfilePage() {
  return (
    <Shell className="mt-2 max-w-[400px] md:mt-0" variant="sidebar">
      <section className="w-full pt-9">
        <h2 className="mb-6 text-2xl font-semibold ">Mi cuenta</h2>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardContent className="grid gap-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                </div>
                <UpdateProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent className="grid gap-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                </div>
                <UpdatePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </Shell>
  );
}
