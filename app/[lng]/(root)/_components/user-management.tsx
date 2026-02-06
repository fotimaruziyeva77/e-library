"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/use-auth";
import useTranslate from "@/hooks/use-translate";
import Cookies from "js-cookie";
import { ChevronDown, CircleUserRound, LogOutIcon } from "lucide-react";
import Link from "next/link";

function UserManagment() {
  const { data } = useAuth();
  const logOut = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user_id");
    Cookies.remove("phone_number");
    window.location.reload();
  };
  const t = useTranslate();
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="border-none outline-none active:border-none active:outline-none flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className="w-full min-h-full object-cover"
              src={data?.photo_path}
            />
            <AvatarFallback>
              {(data?.first_name && data.first_name.slice(0, 1)) || ""}
              {(data?.last_name && data.last_name.slice(0, 1)) || ""}
            </AvatarFallback>
          </Avatar>
          <ChevronDown size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuLabel className="block lg:hidden">
            {data?.first_name} {data?.last_name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="block lg:hidden" />
          <DropdownMenuItem className="font-semibold">
            <Link href={"/profile"} className="flex gap-1">
              <CircleUserRound /> {t("navbar.profileSettins")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-semibold text-red-600"
            onClick={logOut}
          >
            <LogOutIcon className="rotate-180" />
            {t("navbar.exit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserManagment;
