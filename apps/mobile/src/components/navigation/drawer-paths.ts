export function isCustomerHomePath(pathname: string): boolean {
  return (
    pathname === "/(customer)/(stack)" ||
    pathname === "/(customer)/(stack)/" ||
    pathname.endsWith("/(customer)/(stack)") ||
    pathname.endsWith("/(customer)/(stack)/index")
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
