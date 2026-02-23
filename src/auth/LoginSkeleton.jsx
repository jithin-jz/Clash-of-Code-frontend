import React from "react";
import {
    SkeletonBase,
    SkeletonPage,
    SkeletonCard,
    SkeletonText,
    SkeletonButton
} from "../common/SkeletonPrimitives";

const LoginSkeleton = () => {
    return (
        <SkeletonPage className="flex items-center justify-center min-h-screen bg-[#060a11] overflow-hidden">
            {/* Decorative ambient blobs to match the actual login page */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[440px] px-4">
                {/* Branding placeholder */}
                <div className="flex justify-center mb-8">
                    <SkeletonText width="180px" height="1.75rem" className="bg-white/5" />
                </div>

                {/* Main login card placeholder */}
                <SkeletonCard className="p-8 pb-10 rounded-[2.5rem] border border-white/10 bg-[#0f1b2e]/60 backdrop-blur-3xl shadow-[0_32px_80px_-15px_rgba(0,0,0,0.5)]">
                    <div className="space-y-6">
                        {/* Input field placeholder */}
                        <div className="space-y-2">
                            <SkeletonBase className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/10" />
                        </div>

                        {/* Action button placeholder */}
                        <SkeletonButton className="h-14 bg-white/[0.05] border border-white/10 text-transparent" />

                        {/* Divider */}
                        <div className="relative flex items-center justify-center py-4">
                            <div className="absolute inset-x-0 h-px bg-white/[0.05]" />
                            <div className="relative bg-[#0f1b2e] px-4">
                                <SkeletonText width="100px" height="0.6rem" className="opacity-40" />
                            </div>
                        </div>

                        {/* Social logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <SkeletonBase className="h-14 rounded-2xl border border-white/5 bg-white/[0.02]" />
                            <SkeletonBase className="h-14 rounded-2xl border border-white/5 bg-white/[0.02]" />
                        </div>
                    </div>
                </SkeletonCard>

                {/* Copyright placeholder */}
                <div className="mt-8 flex justify-center">
                    <SkeletonText width="140px" height="0.6rem" className="opacity-20" />
                </div>
            </div>
        </SkeletonPage>
    );
};

export default LoginSkeleton;
