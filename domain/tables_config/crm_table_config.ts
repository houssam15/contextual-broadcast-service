export interface CrmTableConfig{
    /**
     * The name of the users table.
     * Default : "t_users2"
     */
    usersTable: string;

    /**
     * The name of the teams table which holds the manager_id
     * Default: "t_users_team"
     */
    teamsTable: string;

    /**
     * The name of the junction table linking users to teams.
     * Default: "t_users2_team_users"
     */
    teamUsersTable: string;
}

/**
 * Default tables names matching the current database schema.
 */
export const defaultCrmTableConfig: CrmTableConfig = {
    usersTable:  process.env.CRM_DB_USERS_TABLE ?? "t_users2",
    teamsTable:  process.env.CRM_DB_TEAMS_TABLE ?? 't_users2_team',
    teamUsersTable:  process.env.CRM_DB_TEAM_USERS_TABLE ?? "t_users2_team_users"
}
