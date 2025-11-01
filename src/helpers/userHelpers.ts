class UserHelpers {
    static getUserStatusColor = (lastActivity: number): 'success' | 'warning' | 'default' => {
        const seconds = Math.floor((Date.now() - lastActivity) / 1000);
        if (seconds < 5) return 'success';
        if (seconds < 60) return 'warning';
        return 'default';
    };

    static sortUsersByActivity = <T extends { id: string; lastActivity: number }>(
        users: T[],
        currentUserId: string
    ): T[] => {
        return [...users].sort((a, b) => {
            if (a.id === currentUserId) return -1;
            if (b.id === currentUserId) return 1;
            return b.lastActivity - a.lastActivity;
        });
    };

    static generateUsername = () => {
        const first = ["Alice", "Bob", "Charlie", "Diana"][Math.floor(Math.random() * 4)];
        const last = ["Smith", "Brown", "Lee", "Johnson"][Math.floor(Math.random() * 4)];

        return `${first} ${last}`;
    };
}

export { UserHelpers };