import { RxDashboard } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdOutlineSchedule, MdOutlineLogout } from "react-icons/md";
import { HiOutlineClipboardList, HiOutlineDocumentReport } from "react-icons/hi";

// Each link is now controlled by backend access keys (e.g., canViewAppointments)
export const Sidebar_links = [
  {
    name: "dashboard",
    icon: <RxDashboard className="text-xl font-bold" />,
    path: "/",
    // permissionKey: "canViewDashboard", // ✅ backend decides
  },
  {
    name: "appointments",
    icon: <IoCalendarClearOutline className="text-xl font-bold" />,
    path: "/appointments",
    permissionKey: "canViewAppointments",
  },
  {
    name: "clinic schedule",
    icon: <MdOutlineSchedule className="text-xl font-bold" />,
    path: "/clinic-schedule",
    permissionKey: "canViewClinicSchedule",
  },
  {
    name: "patients",
    icon: <LuUsers className="text-xl font-bold" />,
    path: "/my-patients",
    permissionKey: "canViewPatients",
  },
  {
    name: "pending reviews",
    icon: <HiOutlineClipboardList className="text-xl font-bold" />,
    path: "/pending-reviews",
    permissionKey: "canGradeStudents", // students & lecturers get this if allowed
  },
  {
    name: "absent request",
    icon: <MdOutlineLogout className="text-xl font-bold" />,
    path: "/absent-request",
    permissionKey: "canViewAbsentRequests",
  },
  {
    name: "reports",
    icon: <HiOutlineDocumentReport className="text-xl font-bold" />,
    path: "/reports",
    permissionKey: "canViewReports",
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
