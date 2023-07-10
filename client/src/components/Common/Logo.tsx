import { Fragment } from "react";
import logo from "../../icons/logo.svg";

export const LogoNavbar = (props: { href?: string }) => {
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

  export const LogoBig = (props: { href?: string }) => {
    return (
      <Fragment>
        <a href={props.href}>
          <div className="inline-flex items-center justify-center ">
            <img
              className="pl-2 h-20 w-auto"
              src={logo.src}
              alt="Your Company"
            />
            <span className="text-turquoise-400 font-medium text-2xl font-sans pl-2 ">
              Cleanwave
            </span>
          </div>
        </a>
      </Fragment>
    );
  };