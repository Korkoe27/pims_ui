import React from 'react';
import { RxDashboard } from "react-icons/rx";
import { MdOutlineRestorePage } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { Dispensary } from '../pages';

export const Sidebar_links = [
    {
        name: 'dashboard',
        icon: <RxDashboard/>,
        path: '/',
    },
    {
        name: 'patients',
        icon: <LuUsers2/>,
        path: '/patients',
    },
    {
        name: 'appointments',
        icon: <IoCalendarClearOutline/>,
        path: '/appointments',
    },
    {
        name: 'inventory',
        icon: <BsBoxSeam/>,
        path: '/inventory',
    },
    {
        name: 'dispensary',
        icon: <MdOutlineRestorePage/>,
        path: '/dispensary',
    },
];