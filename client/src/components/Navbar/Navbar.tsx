import { Fragment, useState, useContext } from "react";
import ReactSVG from 'react-svg';
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import anonUser from '../../icons/anon-user.jpg'
import styles from './styles.module.css'
import { AppContext } from '../../utils/context'

const navigation = [
  { name: "1Dashboard", href: "#", current: true },
  { name: "2Team", href: "#", current: false },
  { name: "3Projects", href: "#", current: false },
  { name: "1Dashboard", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: true },
  // { name: "2Team", href: "#", current: false },
  // { name: "3Projects", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: true },
  // { name: "2Team", href: "#", current: false },
  // { name: "3Projects", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: true },
  // { name: "2Team", href: "#", current: false },
  // { name: "3Projects", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: true },
  // { name: "2Team", href: "#", current: false },
  // { name: "3Projects", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: true },
  // { name: "2Team", href: "#", current: false },
  // { name: "3Projects", href: "#", current: false },
  // { name: "1Dashboard", href: "#", current: false },
];
//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function IndexPage() {
  const { setIsScrollLocked, isScrollLocked } = useContext(AppContext);
  const [isMobileNavigationMenuOpen, seIsMobileNavigationMenuOpen] = useState(false);
  const [isUserMenuOpen, seIsUserMenuOpen] = useState(false);

  const toggleMobileNavigationMenu = () => {
    seIsUserMenuOpen(false)
    setIsScrollLocked(!isMobileNavigationMenuOpen);
    seIsMobileNavigationMenuOpen(!isMobileNavigationMenuOpen);
  }

  const toggleUserMenu = () => {
    seIsMobileNavigationMenuOpen(false)
    seIsUserMenuOpen(!isUserMenuOpen);
  }

  const toggleMobileUserMenu = () => {
    seIsMobileNavigationMenuOpen(false)
    setIsScrollLocked(!isUserMenuOpen);
    seIsUserMenuOpen(!isUserMenuOpen);
  }


  return (
        <>
          <div className={classNames("bg-gray-800", styles.navbarZIndex)}>
            <nav className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-14 sm:h-16 items-center justify-between">

                <div className="flex flex-1 items-center sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="pl-1 block h-8 w-auto lg:hidden"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                    <img
                      className="pl-1 hidden h-8 w-auto lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
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
                </div>
                <div className="absolute inset-y-0 right-10 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  {/* <button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={toggleUserMenu}>
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={anonUser.src}
                          alt=""
                        />
                  </button> */}
                  <ProfileButton
                    additionalClasses="hidden sm:block"
                    onClickHandler={toggleUserMenu}
                    additionalAvatarClasses="h-8 w-8"
                  ></ProfileButton>
                  <ProfileButton
                    additionalClasses="sm:hidden"
                    onClickHandler={toggleMobileUserMenu}
                    additionalAvatarClasses="h-8 w-8"
                  ></ProfileButton>
                  <Menu as="div" className="relative ml-3 z-10">
                    <div>
                      
                    </div>
                    <Transition
                      as={Fragment}
                      show={isUserMenuOpen}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute hidden sm:block right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <button className="inline-flex items-center justify-center rounded-md p-1 mr-1 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => toggleMobileNavigationMenu()}>
                    <span className="sr-only">Open main menu</span>
                    {isMobileNavigationMenuOpen ? (
                      <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </nav>
          </div>
          {isMobileNavigationMenuOpen?(
            <div className={classNames("sm:hidden w-full bg-gray-900", styles.navbarOverlay)}>
              <div className={classNames("space-y-1 px-2 pb-3 pt-2", styles.navbarOverlayMenu)}>
                {navigation.map((item) => (
                  <button
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
                  </button>
                ))}
              </div>
            </div>
          ):''}

          {isUserMenuOpen?(
            <div className={classNames("sm:hidden w-full bg-gray-900", styles.navbarOverlay)}>
              <div className={classNames("space-y-1 px-2 pb-3 pt-2", styles.navbarOverlayMenu)}>
                <h1>This is your awesome user menu</h1>
              </div>
            </div>
          ):''}
        </>
  );
}

export const ProfileButton = (props : {
  onClickHandler : ()=> void, 
  additionalClasses: string
  additionalAvatarClasses: string
}) =>{
  return (
    <Fragment>
      <button className={classNames(props.additionalClasses, "flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800")}
        onClick={() => props.onClickHandler()}>
            <span className="sr-only">Open user menu</span>
            <img className={classNames(props.additionalAvatarClasses, "rounded-full ")}
              src={anonUser.src}
              alt=""
            />
      </button>
    </Fragment>
  )
}