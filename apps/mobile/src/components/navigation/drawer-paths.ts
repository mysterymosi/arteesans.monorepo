export function isCustomerHomePath(pathname: string): boolean {
  return (
    pathname === "/(customer)" ||
    pathname === "/(customer)/" ||
    pathname.endsWith("/(customer)") ||
    pathname.endsWith("/(customer)/index")
  );
}

export function isArtisanHomePath(pathname: string): boolean {
  return (
    pathname === "/(artisan)" ||
    pathname === "/(artisan)/" ||
    pathname.endsWith("/(artisan)") ||
    pathname.endsWith("/(artisan)/index")
  );
}
