"use client";

import React, { useMemo } from "react";
import { ParticipantListProps } from "../lib/types";
import { User } from "lucide-react";
import { UserHelpers } from "../helpers/userHelpers";
import { TimeHelpers } from "../helpers/timeHelpers";
import { cn } from "../helpers/cn";

const UsersList = ({
  users,
  currentUserId,
  typingUsers,
}: ParticipantListProps) => {
  const sortedUsers = useMemo(
    () => UserHelpers.sortUsersByActivity(users, currentUserId),
    [users, currentUserId]
  );

  const getStatusColor = (statusColor: "success" | "warning" | "default") => {
    if (statusColor === "success") return "bg-green-500";
    if (statusColor === "warning") return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex-grow p-6 overflow-auto">
        <div className="flex items-center mb-6">
          <User className="mr-3 text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Users</h2>
          <span className="ml-2 px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
            {users.length}
          </span>
        </div>

        <div className="border-t border-gray-200 mb-6" />

        <ul className="p-0 space-y-0">
          {sortedUsers.map((user, index) => {
            const isTyping = typingUsers.includes(user.id);
            const isCurrentUser = user.id === currentUserId;
            const statusColor = UserHelpers.getUserStatusColor(
              user.lastActivity
            );
            const statusColorClass = getStatusColor(statusColor);

            return (
              <React.Fragment key={user.id}>
                <li className="px-1 py-4 flex items-start">
                  <div className="relative mr-3 flex-shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        isCurrentUser ? "bg-blue-600" : "bg-gray-500"
                      )}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        isTyping ? "bg-yellow-500" : statusColorClass
                      )}
                      title={isTyping ? "Typing" : "Online"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={cn(
                          "text-sm text-gray-900",
                          isCurrentUser ? "font-bold" : "font-normal"
                        )}
                      >
                        {user.username}
                      </span>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 text-xs font-medium border border-blue-600 text-blue-600 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">
                      {isTyping ? (
                        <span className="text-yellow-600">Typing...</span>
                      ) : (
                        TimeHelpers.formatRelativeTime(user.lastActivity)
                      )}
                    </span>
                  </div>
                </li>
                {index < sortedUsers.length - 1 && (
                  <li className="border-t border-gray-100 ml-12 my-1" />
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export { UsersList };
