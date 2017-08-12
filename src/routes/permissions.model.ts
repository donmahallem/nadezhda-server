export enum Permissions {
    /**
     * Read history
     */
    USER_CREATE = 1,
    USER_DELETE = 2,
    USER_MODIFY = 4,
    USER_ALL = Permissions.USER_CREATE | Permissions.USER_DELETE | Permissions.USER_MODIFY,
    LIST_CREATE = 8,
    LIST_DELETE = 16,
    LIST_ALL = Permissions.LIST_CREATE | Permissions.LIST_DELETE
}