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
import "@styles/navbar.css";

export function Navbar() {
  return (
    <div className="navbar">
      <Link href="/">
        <p className="navbar-logo font-ScoutCond-BoldItalic">
          Ultimate Siegery
        </p>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Game Modes </NavigationMenuTrigger>
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
