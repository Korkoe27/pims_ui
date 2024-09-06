import React from 'react';
import { RxDashboard } from "react-icons/rx";
import { MdOutlineRestorePage } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";

export const Sidebar_links = [
    {
        name: 'dashboard',
        icon: <RxDashboard className='text-xl font-bold'/>,
        path: '/',
    },
    {
        name: 'patients',
        icon: <LuUsers2 className='text-xl font-bold'/>,
        path: '/patients',
    },
    {
        name: 'appointments',
        icon: <IoCalendarClearOutline className='text-xl font-bold'/>,
        path: '/appointments',
    },
    {
        name: 'inventory',
        icon: <BsBoxSeam className='text-xl font-bold'/>,
        path: '/inventory',
    },
    {
        name: 'dispensary',
        icon: <MdOutlineRestorePage className='text-xl font-bold'/>,
        path: '/dispensary',
    },
];


