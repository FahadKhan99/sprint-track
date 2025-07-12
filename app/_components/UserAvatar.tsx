import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types/types";
import React from "react";

const UserAvatar = ({ user }: { user: IUser }) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar>
        <AvatarImage
          src={user?.imageUrl ?? undefined}
          alt={user?.name || "User avatar"}
        />
        <AvatarFallback className="capitalize">
          {user?.name?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-muted-foreground">
        {user?.name || "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
