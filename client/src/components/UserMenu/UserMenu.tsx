import type { Ref } from "react";
import { Fragment, forwardRef } from "react";
import styles from "./userMenu.module.css";
import { AccentButton } from "../Common/Buttons";
import { UserCircleIcon } from "@heroicons/react/24/outline";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const UserMenu = forwardRef(
  (
    props: {
      userMenu: Array<{ name: string; href: string; current: boolean }>;
    },
    forwardedRef: Ref<HTMLDivElement>
  ) => {
    return (
      <Fragment>
        <div ref={forwardedRef} className="bg-black rounded-lg">
          <div className={"text-white grid py-4 " + styles.userMenuGrid}>
            <div className="grid content-center justify-center ">
              <UserCircleIcon
                className={"stroke-1 text-gray-200 " + styles.userAvatarBig}
                aria-hidden="true"
              />
            </div>
            <div className="grid content-center">
              <div>
                <div className="text-base text-gray-100">
                  Zachariasz Jankowski
                </div>
                <div className="text-xs text-gray-200">
                  jankowski.zachariasz@gmail.com
                </div>
                <div className="mt-1">
                  <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Employee
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={"text-white grid " + styles.userMenuGrid}>
            <div></div>
            <div className="mb-5 mr-3">
              <AccentButton
                text="Manage account"
                handleClick={(event) => event.preventDefault()}
                href="#"
              ></AccentButton>
              <AccentButton
                text="Logout"
                handleClick={(event) => event.preventDefault()}
                href="#"
              ></AccentButton>
            </div>
          </div>
        </div>
        <br></br>
        <div className={"" + styles.userMenuScrollableNavigation}>
          <UserMenuNavigation navigation={props.userMenu}></UserMenuNavigation>
        </div>
      </Fragment>
    );
  }
);

const UserMenuNavigation = (props: {
  navigation: Array<{ name: string; href: string; current: boolean }>;
}) => {
  return (
    <Fragment>
      {props.navigation.map((item) => (
        <button
          onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
          }}
          key={item.name}
          className="text-slate-100  w-full hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          aria-current={item.current ? "page" : undefined}
        >
          <span className="float-left">{item.name}</span>
        </button>
      ))}
    </Fragment>
  );
};
