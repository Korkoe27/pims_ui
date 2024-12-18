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
        path: '/my-patients',
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

export const getConsultationNav = (appointmentId) => [
    {
        name: 'case history',
        link: `/case-history/${appointmentId}`
    },
    {
        name: 'visual acuity',
        link: `/visual-acuity/${appointmentId}`
    },
    {
        name: 'externals',
        link: `/externals/${appointmentId}`
    },
    {
        name: 'internals',
        link: `/internals/${appointmentId}`
    },
    {
        name: 'refraction',
        link: `/refraction/${appointmentId}`
    },
    {
        name: 'extra tests',
        link: `/extra-tests/${appointmentId}`
    },
];




