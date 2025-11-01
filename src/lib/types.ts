export enum SyncEventType {
    PARTICIPANT_JOIN = 'PARTICIPANT_JOIN',
    PARTICIPANT_LEAVE = 'PARTICIPANT_LEAVE',
    PARTICIPANT_UPDATE = 'PARTICIPANT_UPDATE',
    SEND_MESSAGE = 'SEND_MESSAGE',
    REMOVE_MESSAGE = 'REMOVE_MESSAGE',
    UPDATE_COUNTER = 'UPDATE_COUNTER',
    BEGIN_TYPING = 'BEGIN_TYPING',
    END_TYPING = 'END_TYPING',
    SYNC_STATE = 'SYNC_STATE',
    REQUEST_SYNC = 'REQUEST_SYNC'
}

export interface Participant {
    id: string;
    username: string;
    lastActivity: number;
    isTyping: boolean;
    tabId: string;
}

export interface Message {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: number;
    expiresAt?: number | undefined;
}

export interface CounterState {
    value: number;
    lastUpdatedBy: string | null;
    lastUpdatedAt: number | null;
}

export interface AppState {
    users: Participant[];
    messages: Message[];
    counter: CounterState;
    typingUsers: string[];
}

export type SyncMessage =
    | { type: SyncEventType.PARTICIPANT_JOIN; payload: Participant }
    | { type: SyncEventType.PARTICIPANT_LEAVE; payload: { userId: string } }
    | { type: SyncEventType.PARTICIPANT_UPDATE; payload: Partial<Participant> & { id: string } }
    | { type: SyncEventType.SEND_MESSAGE; payload: Message }
    | { type: SyncEventType.REMOVE_MESSAGE; payload: { messageId: string; userId: string } }
    | { type: SyncEventType.UPDATE_COUNTER; payload: { value: number; userId: string; username: string } }
    | { type: SyncEventType.BEGIN_TYPING; payload: { userId: string } }
    | { type: SyncEventType.END_TYPING; payload: { userId: string } }
    | { type: SyncEventType.SYNC_STATE; payload: AppState }
    | { type: SyncEventType.REQUEST_SYNC; payload: { requesterId: string } };

export type UserId = string;
export type MessageId = string;
export type TabId = string;
export type Timestamp = number;

export interface MessagePanelProps {
    messages: Message[];
    currentUserId: UserId;
    currentUsername: string;
    onSendMessage: (content: string, expiresInSeconds?: number) => void;
    onDeleteMessage: (messageId: MessageId) => void;
    onTyping: (isTyping: boolean) => void;
}

export interface CounterWidgetProps {
    counter: CounterState;
    onIncrement: () => void;
    onDecrement: () => void;
}

export interface ParticipantListProps {
    users: Participant[];
    currentUserId: UserId;
    typingUsers: string[];
}

export interface MultiTabSyncHook {
    users: Participant[];
    messages: Message[];
    counter: CounterState;
    typingUsers: string[];
    currentUserId: UserId;
    currentUsername: string;
    sendMessage: (content: string, expiresInSeconds?: number) => void;
    deleteMessage: (messageId: MessageId) => void;
    updateCounter: (increment: boolean) => void;
    markTyping: (isTyping: boolean) => void;
}