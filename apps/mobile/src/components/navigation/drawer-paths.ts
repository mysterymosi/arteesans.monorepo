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
    pathname === "/(artisan)/(stack)" ||
    pathname === "/(artisan)/(stack)/" ||
    pathname.endsWith("/(artisan)/(stack)") ||
    pathname.endsWith("/(artisan)/(stack)/index")
  );
}
