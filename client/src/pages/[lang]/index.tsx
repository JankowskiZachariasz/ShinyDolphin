import { trpc } from "../../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useContext } from "react";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import type { LabelsUsage } from "../../../../server/src/metadata/Label";
import { supportedLocales } from "../../middleware";
import { getFilesystemLabelsForRoute } from "../../utils/labelProvider";
import Navbar from "../../components/Navbar/Navbar";
import { AppContext } from "../../utils/context";
import styles from "./styles.module.css";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function IndexPage({
  labels,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // 💡 Tip: CMD+Click (or CTRL+Click) on `greeting` to go to the server definition
  const [xdText, setXdText] = useState("Nie było calla");
  const [sub, setSub] = useState(45.7);
  const { isScrollLocked } = useContext(AppContext);

  const client = trpc.useContext().client;
  const { data: session } = useSession();
  const email = session?.user?.email;
  //@ts-ignore

  async function fetchXd() {
    console.log(window.location.href);
    //let txt = await client.greeting.objects.Account.query({name: 'Ihhhhaaaa'},{
    //@ts-ignore
    //context:{token: session?.user?.token}});
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50"></header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Data to enrich your online business
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat aliqua.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <p className="p-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id ipsam cupiditate, illum iure non blanditiis fugit dolorum veritatis error possimus voluptas placeat, ducimus distinctio in consequatur, fugiat consequuntur soluta incidunt!</p>
        <p className="p-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id ipsam cupiditate, illum iure non blanditiis fugit dolorum veritatis error possimus voluptas placeat, ducimus distinctio in consequatur, fugiat consequuntur soluta incidunt!</p>
        <p className="p-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id ipsam cupiditate, illum iure non blanditiis fugit dolorum veritatis error possimus voluptas placeat, ducimus distinctio in consequatur, fugiat consequuntur soluta incidunt!</p>
        <p className="p-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id ipsam cupiditate, illum iure non blanditiis fugit dolorum veritatis error possimus voluptas placeat, ducimus distinctio in consequatur, fugiat consequuntur soluta incidunt!</p>
      </div>
    </div>
  );
}

const PAGE_ROUTE = "/{0}" as const;

type Labels = {
  [key in keyof (typeof LabelsUsage)[typeof PAGE_ROUTE]]: string;
};

export const getStaticProps: GetStaticProps<{ labels: Labels }> = async (
  request
) => {
  return {
    props: {
      labels: getFilesystemLabelsForRoute(PAGE_ROUTE, request.params?.lang),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<string> = [];
  supportedLocales.forEach((supportedLocale) => {
    paths.push(PAGE_ROUTE.replace("{0}", supportedLocale));
  });
  return { paths, fallback: true };
};
