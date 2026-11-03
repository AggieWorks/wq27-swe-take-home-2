'use client'
import { motion, useAnimationControls } from "framer-motion";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useMediaQuery } from 'usehooks-ts';

import { useUser } from "@/hooks/queries/user";
import { cn } from "@/lib/utils";

import LogoWithText from "../branding/logo-with-text";
import Filter from "../filter/filter";
import Search from "../search";
import Avatar from "./avatar-dropdown";
import SigninButton from "./signin-button";
import SubmitDeal from "./submit-deal"

export default function Header() {
    const [collapse, setCollapse] = useState(false)
    const parentRef = useRef<HTMLDivElement>(null)
    const widthRef = useRef<HTMLDivElement>(null)
    const [xOffset, setXOffset] = useState(0)
    const [animateX, setAnimateX] = useState(false) // variable stops x-position animations when screen size resizes, as those changes should be instant
    const [spacerMaxWidth, setSpacerMaxWidth] = useState(92)
    const controls = useAnimationControls();
    const smScreen = useMediaQuery('(min-width: 640px)')
    const lgScreen = useMediaQuery('(min-width: 1000px)')
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const hydrated = parentRef.current && widthRef.current;
    const { data: user } = useUser();

    // once the component is hydrated, all screen size values will be available to set the controls for the Search bar animation
    useEffect(() => {
        if (hydrated) {
            controls.start({
                width: smScreen 
                    ? (collapse ? "100%" : (lgScreen ? "44rem" : "30rem"))
                    : "100%",
                y: smScreen ? (collapse ? 0 : 81) : 0,
                x: smScreen ? (collapse ? 0 : xOffset) : 0
            });
        }
    }, [hydrated, smScreen, collapse, lgScreen, xOffset]);

    // create an event listener that toggles the collapsed state of the component when a scroll-position breakpoint is passed
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 20) {
                setCollapse(true);
                setAnimateX(true);
            } else {
                setCollapse(false);
            }
        };

        if (isHomePage) {
            if (hydrated) {
                setAnimateX(true)
            }
            handleScroll()
            window.addEventListener('scroll', handleScroll);
        } else {
            setCollapse(true);
            setAnimateX(true);
            window.removeEventListener('scroll', handleScroll);
            return;
        }
    
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // creates an event listener that recaclulate the xOffset of the Search bar when the window resizes
    // utilizes the width and position of the search bar's parent div, as it is more stable
    useEffect(() => {
        const updateOffset = () => {
            setAnimateX(false);
            if (!collapse && parentRef.current) {
                const rect = parentRef.current.getBoundingClientRect();
                const centerX = document.documentElement.clientWidth / 2;
                const elementCenterX = rect.left + rect.width / 2;
                setXOffset(centerX - elementCenterX);
            } else {
                setXOffset(0);
            }
        };
        window.addEventListener("resize", updateOffset);

        updateOffset()
        
        return () => {
            window.removeEventListener("resize", updateOffset);
        };
    }, []);

    // set the left spacer's max width equivalent to the width of the rightmost buttons div, which changes width when logged in
    useLayoutEffect(() => {
        if (!widthRef.current) return;

        const updateWidth = () => {
            setSpacerMaxWidth(widthRef.current!.offsetWidth);
        };

        updateWidth();
    }, [user]);

    // when left spacer max width val changes, correct the xOffset of the Search bar
    useLayoutEffect(() => {
        const updateOffset = () => {
            if (!collapse && parentRef.current) {
                const rect = parentRef.current.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const elementCenterX = rect.left + rect.width / 2;
                setXOffset(centerX - elementCenterX);
            } else {
                setXOffset(0);
            }
        };

        updateOffset()
    }, [spacerMaxWidth])
    
    return (
        <>
            <div className={cn(
                "h-[189px] sm:h-[236px]",
                !isHomePage && "h-[107px] sm:h-[107px]"
            )}
            />
            <header
                key={`header${smScreen ? "": "mobile"}`}
                className={cn(
                    "z-50 w-full fixed top-0 left-0 h-[200px] pt-[100px] px-6 flex flex-col items-center bg-white transition-all duration-700 ease-in-out",
                    "sm:h-[236px] sm:pt-12 sm:px-20",
                    collapse && isHomePage && "pt-[46px] h-[146px] sm:pt-12 sm:h-[156px]",
                    !isHomePage && "h-[107px] sm:h-[107px]"
                )}
            >
                <div className={cn(
                    "absolute top-12 z-30 pointer-events-none w-full flex flex-row justify-between items-center px-8 sm:px-20 mb-4",
                    "opacity-100 transition-all duration-700",
                    collapse && isHomePage && "opacity-0 sm:opacity-100",
                )}>
                    <div className={cn(
                        "pointer-events-auto",
                        collapse && isHomePage && "pointer-events-none",
                    )}>
                        <LogoWithText alt />
                    </div>
                    <div className={cn(
                        "sm:hidden pointer-events-auto",
                        collapse && "pointer-events-none",
                        !isHomePage && "hidden",
                    )}>
                        {!user ? <SigninButton /> : <Avatar user={user} />}
                    </div>
                </div>

                <div className="w-full flex flex-col items-center">
                    <div className="relative w-full flex flex-row justify-between items-center gap-6 sm:none">
                        <div className="hidden sm:flex flex-grow h-4" 
                            style={{maxWidth: spacerMaxWidth, minWidth: 92}}
                        />
                        <div
                            ref={parentRef}
                            className={cn(
                                "relative sm:static flex-grow max-w-full p-0",
                                "sm:flex-grow-0 sm:max-w-none sm:w-[28rem] min-w-0 flex justify-center items-center",
                                (hydrated || collapse || !isHomePage) && "sm:relative"
                            )}
                        >
                            <motion.div
                                initial={false}
                                animate={controls}
                                transition={{ 
                                    duration: animateX ? 0.62 : 0, 
                                    ease: "easeInOut" 
                                }}
                                className={cn(
                                    "absolute min-w-0 shrink w-full z-20",
                                    !hydrated && !collapse && isHomePage && "sm:left-1/2 sm:-translate-x-1/2 ",
                                    !hydrated && !collapse && isHomePage && "sm:translate-y-[81px] sm:w-[30rem] lg:w-[44rem]",
                                    !isHomePage && "hidden sm:flex"
                                )}
                            >
                                <Suspense fallback={null}>
                                  <Search />
                                </Suspense>
                            </motion.div>
                        </div>
                        <div 
                            ref={widthRef}
                            className={cn(
                                "h-[36px] sm:shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end pointer-events-auto z-30",
                                !isHomePage && "hidden sm:flex"
                            )}
                        >
                            <SubmitDeal />
                            <div className={cn(
                                "hidden sm:flex ml-4 opacity-100 transition-all duration-700 pointer-events-auto",
                                collapse && "opacity-0 sm:opacity-100",
                                collapse && "pointer-events-none sm:pointer-events-auto",
                            )}>
                                {!user ? <SigninButton /> : <Avatar user={user} />}
                            </div>
                        </div>
                    </div>
                    <p 
                        className={cn(
                            "hidden sm:flex lg:text-[1.125rem] text-center mb-[5rem] h-[20px] opacity-100 sm:text-[1rem] sm:pt-[0.5rem] lg:pt-0",
                            animateX && "transition-all duration-700",
                            collapse && "opacity-0 translate-y-[-36px]",
                            !isHomePage && "sm:hidden"
                        )}
                    >
                        Get first dibs on the best deals in Davis.
                    </p>
                    <div 
                        className={cn(
                            "w-full flex items-center justify-center pt-4 sm:pt-0",
                            animateX && "transition-all duration-700",
                            collapse && "sm:translate-y-[-81px]",
                            !isHomePage && "hidden"
                        )}
                    >
                        <Suspense fallback={null}>
                          <Filter />
                        </Suspense>
                    </div>
                </div>
            </header>
        </>
    )
}