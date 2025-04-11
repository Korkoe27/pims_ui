import React from "react";
import { RxDashboard } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";


export const Sidebar_links = [
  {
    name: "dashboard",
    icon: <RxDashboard className="text-xl font-bold" />,
    path: "/",
  },
  {
    name: "patients",
    icon: <LuUsers2 className="text-xl font-bold" />,
    path: "/my-patients",
  },
  {
    name: "appointments",
    icon: <IoCalendarClearOutline className="text-xl font-bold" />,
    path: "/appointments",
  },
  
  // {
  //   name: "inventory",
  //   icon: <BsBoxSeam className="text-xl font-bold" />,
  //   path: "/inventory",
  // },
  // {
  //   name: "dispensary",
  //   icon: <MdOutlineRestorePage className="text-xl font-bold" />,
  //   path: "/dispensary",
  // },
];

export const Consultation_nav = [
  {name: "case history"},
  {name: "Oculo-Medical History"},
  {name: "visual acuity"},
  {name: "externals"},
  {name: "internals"},
  {name: "refraction"},
  {name: "extra tests"},
];
