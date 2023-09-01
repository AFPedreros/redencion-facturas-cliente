import { Shell } from "@/components/shell";

export default function AccountPage() {
  return (
    <Shell variant="sidebar">
      {/* <PageHeader id="account-header" aria-labelledby="account-header-heading">
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your account settings
        </PageHeaderDescription>
      </PageHeader> */}
      Título
      <section
        id="user-account-info"
        aria-labelledby="user-account-info-heading"
        className="w-full overflow-hidden"
      >
        {/* <UserProfile /> */}
        Facturas
      </section>
    </Shell>
  );
}
