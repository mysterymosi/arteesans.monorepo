export function DashboardPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  void title;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-5 py-4 md:gap-6 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
