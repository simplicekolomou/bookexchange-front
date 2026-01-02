import type { UserProfile } from "./profile.types";
import type {GroupChat, Message} from "./message.types.ts";

export const me: UserProfile = {
    id: "2",
    firstName: "Moi",
    lastName: "Utilisateur",
    email: "",
    profilePicture: "",
    bio: "",
    adress: undefined,
    isVisible: true,
};

export const alice: UserProfile = {
    id: "1",
    firstName: "Alice",
    lastName: "Dupont",
    email: "",
    profilePicture: "",
    bio: "",
    adress: undefined,
    isVisible: true,
};

export const bob: UserProfile = {
    id: "3",
    firstName: "Bob",
    lastName: "Martin",
    email: "",
    profilePicture: "",
    bio: "",
    adress: undefined,
    isVisible: true,
};

export const mockUsers: Record<string, UserProfile> = {
    [me.id]: me,
    [alice.id]: alice,
    [bob.id]: bob,
};

export const mockChats: GroupChat[] = [
    {
        id: "gc1",
        chatType: "GROUP",
        name: "Chat de livres",
        members: [me, alice, bob],
        myMembership: {
            id: "m1",
            notification: true,
            user: me,
            groupChatId: "gc1",
        },
        notificationsEnabled: true,
        lastMessage: null,
    },
    {
        id: "gc2",
        chatType: "ONE_TO_ONE",
        get name() {
            const viewerId = this.myMembership?.user?.id ?? me.id;
            const other = this.members?.find(u => u.id !== viewerId) ?? this.members[0];
            return `${other.firstName} ${other.lastName}`;
        },
        members: [me, bob],
        myMembership: {
            id: "m2",
            notification: true,
            user: me,
            groupChatId: "gc2",
        },
        notificationsEnabled: true,
        lastMessage: null,
    },
];

export const mockMessagesByGroup: Record<string, Message[]> = {
    gc1: [
        {
            id: "1",
            content: "Bonjour! Je suis intéressé par votre livre.",
            sendTime: new Date(),
            sender: alice,
            isReadByMe: true,
            readByIds: [me.id],
        },
    ],
    gc2: [
        {
            id: "2",
            content: "Salut Bob 👋",
            sendTime: new Date(),
            sender: me,
            isReadByMe: true,
            readByIds: [me.id],
        },
    ],
};
