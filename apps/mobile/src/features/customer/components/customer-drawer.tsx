import { Image } from "expo-image";
import { AppDrawerShell, isCustomerHomePath, type DrawerContentProps } from "@/components/navigation";
import { HomeIcon } from "@/features/customer/components/home-icon";
import { icons } from "@/constants/icons";
import { newRequestRoute, routes } from "@/lib/routes";
import type { DrawerMenuItem } from "@/components/navigation/types";

export type CustomerDrawerContentProps = DrawerContentProps;

const CUSTOMER_MENU_ITEMS: DrawerMenuItem[] = [
  {
    key: "home",
    label: "Home",
    href: routes.customer.home,
    isActive: isCustomerHomePath,
    renderIcon: (active) => <HomeIcon active={active} />,
  },
  {
    key: "request",
    label: "Request",
    href: newRequestRoute(),
    isActive: (pathname) => pathname.includes("/request/new"),
    renderIcon: () => (
      <Image source={icons.plus} style={{ width: 18, height: 18 }} contentFit="contain" />
    ),
  },
  {
    key: "booking",
    label: "Booking",
    href: routes.customer.bookings,
    isActive: (pathname) => pathname.includes("/bookings"),
    renderIcon: () => (
      <Image source={icons.orderApprove} style={{ width: 18, height: 18 }} contentFit="contain" />
    ),
  },
];

/** Customer sidebar — Figma 8:1059 */
export function CustomerDrawerContent(props: CustomerDrawerContentProps) {
  return <AppDrawerShell {...props} items={CUSTOMER_MENU_ITEMS} signOutPlacement="footer" />;
}
