"use client";
import { Toaster as HotToaster, toast as hotToast, ToastBar } from "react-hot-toast";

// Custom toast utility to ensure only one toast at a time
export const toast = {
    success: (msg: string) => {
        hotToast.dismiss();
        hotToast.success(msg);
    },
    error: (msg: string) => {
        hotToast.dismiss();
        hotToast.error(msg);
    },
    loading: (msg: string) => {
        hotToast.dismiss();
        hotToast.loading(msg);
    },
    // Add more as needed
};

export default function Toaster() {
    return (
        <HotToaster position="top-center">
            {(t) => <ToastBar toast={t} />}
        </HotToaster>
    );
} 