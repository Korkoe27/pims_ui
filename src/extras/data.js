import React from 'react';
import { RxDashboard } from "react-icons/rx";
import { MdOutlineRestorePage } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { Dispensary } from '../pages';

export const Sidebar_links = [
    {
        name: 'Dashboard',
        icon: <RxDashboard/>,
        path: '/',
    },
    {
        name: 'Patients',
        icon: <LuUsers2/>,
        path: '/patients',
    },
    {
        name: 'Appointments',
        icon: <IoCalendarClearOutline/>,
        path: '/appointments',
    },
    {
        name: 'Inventory',
        icon: <BsBoxSeam/>,
        path: '/inventory',
    },
    {
        name: 'Dispensary',
        icon: <MdOutlineRestorePage/>,
        path: '/dispensary',
    },
];