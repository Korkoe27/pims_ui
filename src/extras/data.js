import { RxDashboard } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdOutlineSchedule, MdOutlineLogout } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { ROLES } from "../constants/roles";

export const Sidebar_links = [
  {
    name: "dashboard",
    icon: <RxDashboard className="text-xl font-bold" />,
    path: "/",
    roles: "all",
    // Dashboard is general access → no permission check
  },
  {
    name: "appointments",
    icon: <IoCalendarClearOutline className="text-xl font-bold" />,
    path: "/appointments",
    roles: "all",
    accessKey: "canViewAppointments",
    permissionCode: "view_appointment",
  },
  {
    name: "clinic schedule",
    icon: <MdOutlineSchedule className="text-xl font-bold" />,
    path: "/clinic-schedule",
    roles: "all",
    accessKey: "canViewAppointments",
    permissionCode: "view_appointment",
  },
  {
    name: "patients",
    icon: <LuUsers className="text-xl font-bold" />,
    path: "/my-patients",
    roles: "all",
    accessKey: "canViewPatients",
    permissionCode: "view_patient",
  },
  {
    name: "pending reviews",
    icon: <HiOutlineClipboardList className="text-xl font-bold" />,
    path: "/pending-reviews",
    roles: [ROLES.LECTURER, ROLES.STUDENT],
    accessKey: "canGradeStudents", // Lecturer permission
    permissionCode: "view_grades",
  },
  {
    name: "absent request",
    icon: <MdOutlineLogout className="text-xl font-bold" />,
    path: "/absent-request",
    roles: [ROLES.STUDENT, ROLES.LECTURER, ROLES.COORDINATOR],
    accessKey: "canViewAppointments",
  },
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
