import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  gameModeTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <div className="flex flex-row justify-evenly items-center min-h-[5vh] p-3 bg-black">
      <Link href="/">
        <p className="text-4xl font-ScoutCond-Bold font-bold">
          Ultimate Siegery
        </p>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <p>Game Modes</p>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Link href="/casual" legacyBehavior passHref>
                <NavigationMenuLink className={gameModeTriggerStyle()}>
                  Quick Match
                </NavigationMenuLink>
              </Link>
              <Link href="/standard" legacyBehavior passHref>
                <NavigationMenuLink className={gameModeTriggerStyle()}>
                  Standard
                </NavigationMenuLink>
              </Link>
              <Link href="/ranked" legacyBehavior passHref>
                <NavigationMenuLink className={gameModeTriggerStyle()}>
                  Ranked
                </NavigationMenuLink>
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/rules" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Rules
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
