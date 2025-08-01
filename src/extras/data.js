import React from "react";
import { RxDashboard } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import {
  MdAssignment,
  MdOutlineSchedule,
  MdOutlineLogout,
} from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiUserCircle } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { ROLES } from "../constants/roles";

export const Sidebar_links = [
  {
    name: "dashboard",
    icon: <RxDashboard className="text-xl font-bold" />,
    path: "/",
    roles: "all",
  },
  {
    name: "patients",
    icon: <LuUsers2 className="text-xl font-bold" />,
    path: "/my-patients",
    roles: "all",
  },
  {
    name: "appointments",
    icon: <IoCalendarClearOutline className="text-xl font-bold" />,
    path: "/appointments",
    roles: "all",
  },
  {
    name: "my portal",
    icon: <BiUserCircle className="text-xl font-bold" />,
    path: "/my-portal",
    roles: [ROLES.STUDENT],
  },
  {
    name: "pending reviews",
    icon: <HiOutlineClipboardList className="text-xl font-bold" />,
    path: "/pending-reviews",
    roles: [ROLES.LECTURER],
  },
  {
    name: "case reviews",
    icon: <MdAssignment className="text-xl font-bold" />,
    path: "/case-reviews",
    roles: [ROLES.STUDENT],
  },
  {
    name: "clinic schedule",
    icon: <MdOutlineSchedule className="text-xl font-bold" />,
    path: "/clinic-schedule",
    roles: "all",
  },
  {
    name: "absent request",
    icon: <MdOutlineLogout className="text-xl font-bold" />,
    path: "/absent-request",
    roles: [ROLES.STUDENT, ROLES.LECTURER],
  },
  {
    name: "reports",
    icon: <HiOutlineDocumentReport className="text-xl font-bold" />,
    path: "/reports",
    roles: [ROLES.STUDENT, ROLES.LECTURER],
  },
];

// {
//   name: "My Patients",
//   icon: <IoCalendarClearOutline className="text-xl font-bold" />,
//   path: "/",
// },
// {
//   name: "Pending Appointments",
//   icon: <IoCalendarClearOutline className="text-xl font-bold" />,
//   path: "/",
// },

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

export const Consultation_nav = [
  { name: "case history" },
  { name: "Oculo-Medical History" },
  { name: "visual acuity" },
  { name: "externals" },
  { name: "internals" },
  { name: "refraction" },
  { name: "extra tests" },
];
