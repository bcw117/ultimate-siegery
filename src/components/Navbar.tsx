import Link from "next/link";
import ThemeSwitch from "@/components/ThemeSwitch";
import localFont from "next/font/local";
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
          <NavigationMenuItem>
            <ThemeSwitch />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    // <div className={ScoutItalic.className + " navbar"}>
    //   <Link href="/">
    //     <p className="navbar-logo font-The-Blast">Ultimate Siegery</p>
    //   </Link>

    //   <ul className="navMenu">
    //     <li>
    //       <Link href="/casual">Quick Match</Link>
    //     </li>
    //     <li>
    //       <Link href="/standard">Standard</Link>
    //     </li>
    //     <li>
    //       <Link href="/ranked">Ranked</Link>
    //     </li>
    //     <li>
    //       <Link href="/rules">Rules</Link>
    //     </li>
    //
    //   </ul>
    // </div>
  );
}
