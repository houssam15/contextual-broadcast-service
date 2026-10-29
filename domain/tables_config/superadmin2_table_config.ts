export interface Superadmin2TableConfig{
    /**
     * The name of the users table.
     */
    usersTable: string;

    /**
     * The name of the teams table which holds the manager_id
     */
    teamsTable: string;

    /**
     * The name of the junction table linking users to teams.
     */
    teamUsersTable: string;
}

/**
 * Default tables names matching the current database schema.
 */
export const defaultSuperadmin2TableConfig: Superadmin2TableConfig = {
    usersTable:  process.env.SUPERADMIN2_DB_USERS_TABLE ?? "t_user",
    teamsTable:  process.env.SUPERADMIN2_DB_TEAMS_TABLE ?? 't_user_team',
    teamUsersTable:  process.env.SUPERADMIN2_DB_TEAM_USERS_TABLE ?? "t_user_team_user"
}
