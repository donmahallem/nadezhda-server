
export enum Scope {
    /**
     * Read history
     */
    HISTORY_READ = 1,
    /**
     * read black or white list
     */
    LISTS_READ = 2,
    LISTS_WRITE = 3,
    SUMMARY_READ = 4,
    SETTINGS_READ = 5,
}

export type Scopes = Scope[];