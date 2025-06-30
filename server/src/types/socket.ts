export enum SocketEvent {
    // User
    JOIN_REQUEST = "join-request",
    JOIN_ACCEPTED = "join-accepted",
    USER_JOINED = "user-joined",
    USER_DISCONNECTED = "user-disconnected",
    USERNAME_EXISTS = "username-exists",
    USER_OFFLINE = "user-offline",
    USER_ONLINE = "user-online",

    // File
    SYNC_FILE_STRUCTURE = "sync-file-structure",
    DIRECTORY_CREATED = "directory-created",
    DIRECTORY_UPDATED = "directory-updated",
    DIRECTORY_RENAMED = "directory-renamed",
    DIRECTORY_DELETED = "directory-deleted",
    FILE_CREATED = "file-created",
    FILE_UPDATED = "file-updated",
    FILE_RENAMED = "file-renamed",
    FILE_DELETED = "file-deleted",

    // Code
    TYPING_START = "typing-start",
    TYPING_PAUSE = "typing-pause",

    // Chat
    SEND_MESSAGE = "send-message",
    RECEIVE_MESSAGE = "receive-message",
    
}

export type SocketId = string;