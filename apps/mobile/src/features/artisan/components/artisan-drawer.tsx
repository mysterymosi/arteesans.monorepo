import { Image } from "expo-image";
import { router } from "expo-router";
import {
  AppDrawerShell,
  isArtisanHomePath,
  type DrawerContentProps,
  type DrawerMenuItem,
} from "@/components/navigation";
import { HomeIcon } from "@/features/customer/components/home-icon";
import { icons } from "@/constants/icons";
import { routes } from "@/lib/routes";
import { useAuthActions } from "@/providers/auth-provider";

export type ArtisanDrawerContentProps = DrawerContentProps;

const ARTISAN_NAV_ITEMS: Omit<DrawerMenuItem, "onPress">[] = [
  {
    key: "home",
    label: "Home",
    href: routes.artisan.home,
    isActive: isArtisanHomePath,
    renderIcon: (active) => <HomeIcon active={active} />,
  },
  {
    key: "jobs",
    label: "Jobs",
    href: routes.artisan.jobs,
    isActive: (pathname) => pathname.includes("/jobs"),
    renderIcon: () => (
      <Image source={icons.orderApprove} style={{ width: 20, height: 20 }} contentFit="contain" />
    ),
  },
  {
    key: "chat",
    label: "Chat",
    href: routes.artisan.chat,
    isActive: (pathname) => pathname.includes("/chat"),
    renderIcon: () => (
      <Image source={icons.chat} style={{ width: 20, height: 20 }} contentFit="contain" />
    ),
  },
  {
    key: "earnings",
    label: "Earnings",
    href: routes.artisan.earnings,
    isActive: (pathname) => pathname.includes("/earnings"),
    renderIcon: () => (
      <Image source={icons.walletMoney} style={{ width: 20, height: 20 }} contentFit="contain" />
    ),
  },
];

/** Artisan sidebar — Figma 36:3471 */
export function ArtisanDrawerContent(props: ArtisanDrawerContentProps) {
  const { signOut } = useAuthActions();

  const items: DrawerMenuItem[] = [
    ...ARTISAN_NAV_ITEMS,
    {
      key: "logout",
      label: "Log Out",
      tone: "danger",
      isActive: () => false,
      renderIcon: () => (
        <Image source={icons.logout} style={{ width: 20, height: 20 }} contentFit="contain" />
      ),
      onPress: async () => {
        await signOut();
        router.replace(routes.auth.welcome);
      },
    },
  ];

  return <AppDrawerShell {...props} items={items} signOutPlacement="inline" />;
}
