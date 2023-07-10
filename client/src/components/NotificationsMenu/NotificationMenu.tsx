import type { Ref } from "react";
import { Fragment, forwardRef } from "react";
import styles from "./notificationsMenu.module.css";
import { AccentButton } from "../Common/Buttons";
import { UserCircleIcon } from "@heroicons/react/24/outline";

//@ts-ignore
function classNames(...classes) { return classes.filter(Boolean).join(" ");}

export type Notification = { message: string, read: boolean };

export const NotificationMenu = forwardRef((props: { notifications:  Array<Notification>},
    forwardedRef : Ref<HTMLDivElement>) => {
    return (
        <div className={"overflow-auto " + styles.userMenuScrollableNavigation} ref={forwardedRef}>
            <Notifications notifications={props.notifications}></Notifications>
        </div>
    );
  });

  const Notifications = (props: {
    notifications: Array<Notification>;
  }) => {
    return (
      <Fragment>
        {props.notifications.map((item, key) => (
          <button
            onMouseDown = {(event: React.MouseEvent<HTMLElement>) => { event.preventDefault()}}
            key={key}
            className="text-slate-100  w-full hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
          ><span className="float-left">{item.message}</span>
            
          </button>
        ))}
      </Fragment>
    );
  };