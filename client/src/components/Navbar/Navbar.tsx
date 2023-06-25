import { Fragment, useState, useContext, forwardRef, useRef, useEffect, useCallback } from "react";
import type { Ref, MouseEvent  } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon, BellIcon } from "@heroicons/react/24/outline";
import styles from "./navbar.module.css";
import { AppContext } from "../../utils/context";
import { UserMenu } from "../UserMenu/UserMenu";
import { NotificationMenu } from "../NotificationsMenu/NotificationMenu";
import logo from "../../icons/logo.svg";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Services", href: "/services", current: false },
  { name: "About us", href: "#", current: false },
  { name: "Order cleaning", href: "#", current: false },
];

const userMenuNavigation = [
  { name: "Order history", href: "/services", current: false },
  { name: "Jobs", href: "#", current: false },
  { name: "Order history", href: "/services", current: false },
];

const userNotifications = [
  { message: "Order history", read: false },
  { message: "Order history2", read: false },
  { message: "Order history3", read: false },
  { message: "Order history4", read: false },
  { message: "Order history5", read: false },
  { message: "Order history6", read: false },
  { message: "Order history7", read: false },
  { message: "Order history", read: false },
  { message: "Order history2", read: false },
  { message: "Order history3", read: false },
  { message: "Order history4", read: false },
  { message: "Order history5", read: false },
  { message: "Order history6", read: false },
  { message: "Order history7", read: false },
];

//@ts-ignore
function classNames(...classes) { return classes.filter(Boolean).join(" ");}

export default function IndexPage() {
  const { setIsScrollLocked } = useContext(AppContext);
  const [isMobileNavigationMenuOpen, seIsMobileNavigationMenuOpen] = useState(false);
  const [isUserMenuOpen, seIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, seIsNotificationMenuOpen] = useState(false);

  const DesktopUserMenuRef :React.RefObject<HTMLInputElement> = useRef(null);
  DesktopUserMenuRef.current;

  const autoFocus = useCallback((element : HTMLDivElement) => {
    if (element) {
      element.focus();
    }
  }, []);

  const closeAllMenues = () => {
    seIsUserMenuOpen(false);
    seIsMobileNavigationMenuOpen(false);
    seIsNotificationMenuOpen(false);
  }

  const toggleMobileNavigationMenu = () => {
    closeAllMenues();
    setIsScrollLocked(!isMobileNavigationMenuOpen);
    seIsMobileNavigationMenuOpen(!isMobileNavigationMenuOpen);
  };

  const toggleUserMenu = (desiredState? :boolean) => {
    if(desiredState === true || desiredState === false){
      closeAllMenues();
      seIsUserMenuOpen(desiredState);
      return;
    }
    closeAllMenues();
    seIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileUserMenu = (desiredState? :boolean) => {
    if(desiredState === true || desiredState === false){
      closeAllMenues();
      setIsScrollLocked(desiredState);
      seIsUserMenuOpen(desiredState);
      return;
    }
    closeAllMenues();
    setIsScrollLocked(!isUserMenuOpen);
    seIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleNotificationMenu = (desiredState? :boolean) => {
    if(desiredState === true || desiredState === false){
      closeAllMenues();
      seIsNotificationMenuOpen(desiredState);
      return;
    }
    closeAllMenues();
    seIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  const toggleMobileNotificationMenu = (desiredState? :boolean) => {
    if(desiredState === true || desiredState === false){
      closeAllMenues();
      setIsScrollLocked(desiredState);
      seIsNotificationMenuOpen(desiredState);
      return;
    }
    closeAllMenues();
    setIsScrollLocked(!isNotificationMenuOpen);
    seIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  return (
    <>
      <div className={classNames("bg-gray-800", styles.navbarZIndex)}>
        <nav className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex h-14 sm:h-16">
            <div className="flex flex-1 items-center sm:justify-start">
              <Logo href="/"></Logo>
              <DesktopNavigation navigation={navigation}></DesktopNavigation>
            </div>
            <div className="inset-y-0 right-0 flex justify-center items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              {/* Notifications */}
              <FloatingMenu
                isUserMenuOpen={isNotificationMenuOpen}
                hideItselfMobile={()=>toggleMobileNotificationMenu(false)} 
                hideItselfDesktop={()=>toggleNotificationMenu(false)}>
                <NotificationMenu notifications={userNotifications}/>
              </FloatingMenu>
              <NavigationIconButton
                additionalClasses="hidden sm:block hover:bg-gray-700 hover:text-white"
                onClickHandler={toggleNotificationMenu}
                additionalIconClasses={classNames("h-7 w-7 stroke-1.5",styles.bellIconDimensions)}
                Icon = {BellIcon}
                onMouseDown={(event)=>{if(isNotificationMenuOpen)event.preventDefault();}}
                isActive={isNotificationMenuOpen}
              ></NavigationIconButton>
              <NavigationIconButton
                additionalClasses="sm:hidden"
                onClickHandler={toggleMobileNotificationMenu}
                additionalIconClasses={classNames("h-7 w-7 stroke-1",styles.bellIconDimensions)}
                Icon = {BellIcon}
                onMouseDown={(event)=>{if(isNotificationMenuOpen)event.preventDefault();}}
                isActive={isNotificationMenuOpen}
              ></NavigationIconButton>

              {/* User Menu */}
              <FloatingMenu
                isUserMenuOpen={isUserMenuOpen}
                hideItselfMobile={()=>toggleMobileUserMenu(false)} 
                hideItselfDesktop={()=>toggleUserMenu(false)}>
                <UserMenu userMenu={userMenuNavigation} ></UserMenu>
              </FloatingMenu>
              <NavigationIconButton
                additionalClasses="hidden sm:block hover:bg-gray-700 hover:text-white"
                onClickHandler={toggleUserMenu}
                additionalIconClasses="h-8 w-8 stroke-1.5"
                onMouseDown={(event)=>{if(isUserMenuOpen)event.preventDefault();}}
                isActive={isUserMenuOpen}
                Icon = {UserCircleIcon}
              ></NavigationIconButton>
              <NavigationIconButton
                additionalClasses="sm:hidden"
                onClickHandler={toggleMobileUserMenu}
                additionalIconClasses="h-8 w-8 stroke-1"
                onMouseDown={(event)=>{if(isUserMenuOpen)event.preventDefault();}}
                isActive={isUserMenuOpen}
                Icon = {UserCircleIcon}
              ></NavigationIconButton>

              <Toggler isMenuOpen={isMobileNavigationMenuOpen}toggleMenu={toggleMobileNavigationMenu}></Toggler>
            </div>
          </div>
        </nav>
      </div>

      {isMobileNavigationMenuOpen ? (
        <Fragment>
          <div className={classNames("sm:hidden w-full bg-gray-900",styles.navbarOverlay)}>
            <div className={classNames("space-y-1 px-2 pb-3 pt-2",styles.navbarOverlayMenu )}>
              <MobileNavigation navigation={navigation}></MobileNavigation>
            </div>
          </div>
        </Fragment>
      ) : ( "")}

    </>
  );
}

const Logo = (props: { href?: string }) => {
  return (
    <Fragment>
      <a href={props.href}>
        <div className="flex flex-shrink-0 items-center">
          <img
            className="pl-2 block h-10 w-auto"
            src={logo.src}
            alt="Your Company"
          />
          <span className="text-turquoise-100 text-lg font-medium font-sans pl-2 mr-5">
            Cleanwave
          </span>
        </div>
      </a>
    </Fragment>
  );
};

const DesktopNavigation = (props: {
  navigation: Array<{ name: string; href: string; current: boolean }>;
}) => {
  return (
    <Fragment>
      <div className="hidden sm:ml-6 sm:block">
        <div className="flex space-x-4">
          {props.navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

const MobileNavigation = (props: {
  navigation: Array<{ name: string; href: string; current: boolean }>;
}) => {
  return (
    <Fragment>
      {props.navigation.map((item) => (
        <a
        href={item.href}
          key={item.name}
          className={classNames(
            item.current
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white",
            "block rounded-md px-3 py-2 text-base font-medium"
          )}
          aria-current={item.current ? "page" : undefined}
        >
          {item.name}
        </a>
      ))}
    </Fragment>
  );
};

const Toggler = (props: { 
  toggleMenu: () => void, 
  isMenuOpen: boolean
}) => {
  return (
    <Fragment>
      <button
        className={classNames(
          "sm:hidden inline-flex items-center justify-center rounded-md p-1 mr-3 text-gray-400",
          props.isMenuOpen?('bg-gray-700 text-white'):('')
        )}
        onClick={() => props.toggleMenu()}
      >
        <span className="sr-only">Open main menu</span>
        {props.isMenuOpen ? (
          <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
        )}
      </button>
    </Fragment>
  );
};

const NavigationIconButton = (props: {
  onClickHandler: () => void,
  onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void,
  additionalClasses: string,
  additionalIconClasses: string,
  isActive?: boolean,
  Icon: React.ForwardRefExoticComponent<any>
}) => {
  return (
    <Fragment>
      <button
        className={classNames(
          props.additionalClasses,
          "inline-flex items-center justify-center rounded-md p-1 mr-1 text-gray-400",
          props.isActive?('bg-gray-700 text-white'):('')
        )}
        onClick = {() => props.onClickHandler()}
        unselectable="on"
        onMouseDown = {props.onMouseDown? props.onMouseDown : ()=>{}}
      >
        <span className="sr-only">Open user menu</span>
        <props.Icon className={classNames(props.additionalIconClasses, "rounded-full")} aria-hidden="true" />
      </button>
    </Fragment>
  );
};

const FloatingMenu = (props: React.PropsWithChildren<{
  isUserMenuOpen: boolean,
  hideItselfMobile: ()=>void,
  hideItselfDesktop: ()=>void,
}>) => {
  
  const autoFocus = useCallback((element : HTMLDivElement) => {
    if (element) {
      element.focus();
    }
  }, []);

  return (
    <span>
      {/* Desktop */}
      <span className="hidden sm:block">
      <Transition
        as={Fragment}
        show={props.isUserMenuOpen}>
      <div tabIndex={0} 
        ref={autoFocus} 
        onClick={event=>{event.stopPropagation();}}
        onBlur={props.hideItselfDesktop}
        className={"ml-3 w-96 z-10 space-y-1 p-2 pb-0 shadow-google rounded-lg bg-gray-900 absolute top-16 right-0"}>
        <div className="">
          {props.children}
        </div>
      </div>
    </Transition>
      </span>
        {/* Mobile */}
      <span className="sm:hidden">
        <Transition
        as={Fragment}
        show={props.isUserMenuOpen}>
          <div className={classNames("w-full", styles.navbarUserOverlay)} >
            <div tabIndex={0} ref={autoFocus} onBlur={props.hideItselfMobile} 
            onClick={event=>{event.stopPropagation()}} 
            className={classNames("space-y-1 p-2 rounded-lg bg-gray-900 m-3 shadow-google", )}>
              {props.children}
            </div>
          </div>
        </Transition>
      </span>
    </span>
  );
};

