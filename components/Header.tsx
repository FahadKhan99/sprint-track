import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserProfile from "./UserProfile";
import { checkUser } from "@/lib/checkUser";
import Loading from "./Loading";

const Header = async () => {
  await checkUser();
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex items-center justify-between ">
        <Link href="/">
          {/* <Image
            src="/logo2.png"
            alt="Logo"
            height={50}
            width={180}
            className="object-contain cursor-pointer"
          /> */}
          <span className="backdrop-blur-md bg-white/30 border border-white/10 rounded-2xl px-4 py-1 shadow-md text-[2rem] font-bold bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-300 bg-clip-text text-transparent leading-none cursor-pointer">
            SprintTrack
          </span>
        </Link>

        <div className="flex gap-4 items-center">
          <Link href={"/projects/create"}>
            <Button
              variant="destructive"
              className="flex items-center gap-2 cursor-pointer"
            >
              <PenBox size={18} />
              <span>Create Project</span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserProfile />
          </SignedIn>
        </div>
      </nav>
      <Loading />
    </header>
  );
};

export default Header;
