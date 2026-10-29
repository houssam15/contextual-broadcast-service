//icall26_config.js
const {join} = require("node:path")
module.exports={
    default:{
        port:7001,
        database_path:join(__dirname,"../../../../../tmp/databases"), 
        debug:true,
        db_debug:true,
        timezone:"+01:00",
        application:"admin",
        small_img_size:{width:150,height:150},
        medium_img_size:{width:300,height:300},
        thumb_img_size:{width:600,height:600},
        sites_path:join(__dirname,"../../../sites"), 
        upload_path:"data/chatbox/uploads/users",
        //node_path:join(__dirname,"/../../../../../modules/20.9.0/nodeJs/node_modules"),
        //system_path:join(__dirname,"/../../../../../modules/20.9.0/system_modules/node_modules"),
        //node_path:join(__dirname,"../../../../../utils_nodejs/common/nodeJs/modules/20.9.0/nodeJs/node_modules"),        
        //system_path:join(__dirname,"../../../../../utils_nodejs/common/nodeJs/modules/20.9.0/system_modules/node_modules"),
        node_env: "dev",
        database: "site_portal",
        redis_host: "127.0.0.1",
        redis_port: "6379",
        redis_password: "your_redis_password",
        redis_db: 0,
        use_https: false,
        //user_type_repo: "superadmin2";
        //db_users_users_table: "zzzzzzz",
        //db_team_users_table: "dddddd",
        //db_teams_table: "rrrrrr",
        //db_users_table: "eeeeee",
        //db_user_connection_log_table: "xxxxxxxx"
    },
    dev:{
       database_path:join(__dirname,"../../../tmp/databases"), 
       sites_path:join(__dirname,"../../../sites"),
       database_path:join(__dirname,"../../../../tmp/databases"), 
       user_type_repo: "icall262",
       db_users_users_table: "t_user_user",
       db_team_users_table: "t_user_team_user",
       db_teams_table: "t_user_team",
       db_users_table: "t_user",
       db_user_connection_log_table: "t_user_connection_logs"
    },
    prod:{
        database_path:join(__dirname,"../../../../../../tmp/databases"), 
        sites_path:join(__dirname,"../../../../../sites"),
        host: "sales.ewebsolutionskech.com",
        use_https: true,
    }
}   
