"use client";

import React, { useCallback } from "react";
import { useCollaborativeSession } from "../hooks/useCollaborativeSession";
import { UsersList } from "./UsersList";
import { CollaborativeCounter } from "./Counter";
import { Chat } from "./Chat";

const CrossTabCollaborationDashboard = () => {
    const {
        users,
        messages,
        counter,
        typingUsers,
        currentUserId,
        currentUsername,
        sendMessage,
        deleteMessage,
        updateCounter,
        markTyping,
    } = useCollaborativeSession();

    const handleIncrement = useCallback(() => updateCounter(true), [updateCounter]);
    const handleDecrement = useCallback(() => updateCounter(false), [updateCounter]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-600 text-white shadow-md">
                <div className="px-6 py-4">
                    <h1 className="text-xl font-semibold">
                        Collaboration Dashboard
                    </h1>
                </div>
            </nav>

            <div className="container mx-auto px-8 py-10 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-120px)]">
                    <div className="w-full md:w-[300px] flex-shrink-0">
                        <UsersList users={users} currentUserId={currentUserId} typingUsers={typingUsers} />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 min-w-0">
                            <CollaborativeCounter
                                counter={counter}
                                onIncrement={handleIncrement}
                                onDecrement={handleDecrement}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <Chat
                                messages={messages}
                                currentUserId={currentUserId}
                                currentUsername={currentUsername}
                                onSendMessage={sendMessage}
                                onDeleteMessage={deleteMessage}
                                onTyping={markTyping}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossTabCollaborationDashboard;