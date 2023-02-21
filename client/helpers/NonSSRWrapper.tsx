import dynamic from "next/dynamic";
import React, {ReactNode} from "react";

interface NonSSRProps{
    children: ReactNode;
}

const NonSSRWrapper = ({children} : NonSSRProps) => (
    <>{children}</>
)
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
    ssr: false
})