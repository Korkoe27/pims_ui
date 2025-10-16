import { RxDashboard } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers } from 'react-icons/lu';
import { MdOutlineSchedule, MdOutlineLogout } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { ROLES } from "../constants/roles";

export const Sidebar_links = [
  {
    name: "dashboard",
    icon: <RxDashboard className="text-xl font-bold" />,
    path: "/",
    roles: "all",
  },
  {
    name: "appointments",
    icon: <IoCalendarClearOutline className="text-xl font-bold" />,
    path: "/appointments",
    roles: "all",
  },
  {
    name: "clinic schedule",
    icon: <MdOutlineSchedule className="text-xl font-bold" />,
    path: "/clinic-schedule",
    roles: "all",
  },
  
  {
    name: "patients",
    icon: <LuUsers className="text-xl font-bold" />,
    path: "/my-patients",
    roles: "all",
  },
  // {
  //   name: "my portal",
  //   icon: <BiUserCircle className="text-xl font-bold" />,
  //   path: "/my-portal",
  //   roles: [ROLES.STUDENT],
  // },
  // {
  //   name: "My Cases",
  //   icon: <MdAssignment className="text-xl font-bold" />,
  //   path: "/my-cases",
  //   roles: [ROLES.STUDENT, ROLES.LECTURER],
  // },
  // {
  //   name: "My Scores",
  //   icon: <MdLeaderboard className="text-xl font-bold" />,
  //   path: "/my-scores",
  //   roles: [ROLES.STUDENT],
  // },
  {
    name: "pending reviews",
    icon: <HiOutlineClipboardList className="text-xl font-bold" />,
    path: "/pending-reviews",
    roles: [ROLES.LECTURER, ROLES.STUDENT],
  },
  {
    name: "absent request",
    icon: <MdOutlineLogout className="text-xl font-bold" />,
    path: "/absent-request",
    roles: [ROLES.STUDENT, ROLES.LECTURER, ROLES.COORDINATOR],
  },
  // {
  //   name: "reports",
  //   icon: <HiOutlineDocumentReport className="text-xl font-bold" />,
  //   path: "/reports",
  //   roles: [ROLES.STUDENT, ROLES.LECTURER, ROLES.COORDINATOR],
  // },
  // {
  //   name: "inventory",
  //   icon: <BsBoxSeam className="text-xl font-bold" />,
  //   path: "/inventory",
  //   roles: "all",
  // },
  // {
  //   name: "pharmacy",
  //   icon: <GiPill className="text-xl font-bold" />,
  //   path: "/pharmacy",
  //   roles: [ROLES.ADMINISTRATOR, ROLES.PHARMACY, ROLES.STUDENT],
  // },
  // {
  //   name: "billing",
  //   icon: <MdOutlinePayment className="text-xl font-bold" />,
  //   path: "/billing",
  //   roles: [ROLES.FINANCE, ROLES.ADMINISTRATOR, ROLES.STUDENT],
  // },
];


export const Consultation_nav = [
  { name: "case history" },
  { name: "Oculo-Medical History" },
  { name: "visual acuity" },
  { name: "externals" },
  { name: "internals" },
  { name: "refraction" },
  { name: "extra tests" },
];
