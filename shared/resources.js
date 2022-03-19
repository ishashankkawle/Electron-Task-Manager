module.exports = {
  "FILE_NAME": "Task.xlsx",
  "SHEET_NAME": "TaskSheet",
  "FILE_PATH": "C:/Users/Shashank/Desktop/",
  "STR_MODULE": "Module",
  "STR_DATE": "Date",
  "STR_TASK": "Task",
  "STR_DESCRIPTION": "Description",
  "STR_IOB": "Issue or Bugs",
  //-------------------------------------------------------------------------
  // "STR_USERID": "250",
  // "STR_USERNAME": "Mandar",
  // "STR_ROLEID": "5",

  "STR_USERID": "240",
  "STR_USERNAME": "Shashank",
  "STR_ROLEID": "0",

  // "STR_USERID": "311",
  // "STR_USERNAME": "TEST User 1",
  // "STR_ROLEID": "0",
  //-------------------------------------------------------------------------

  "STR_BLOBDBNAME": "TSSTaskHistory",
  "STR_BLOBDBCOLLECTIONAME": "TSSTaskHistoryCollection",

  "ID_COLUMN_CONFIG": {
    "project_master": "ProjectId",
    "user_master": "UserId",
    "task_master": "TaskId",
    "module_master": "ModuleId",
    "type_master": "TypeId",
    "priority_master": "PriorityId",
  },
  "POPUP_NOTIFICATION_MAP": {
    "type": {
      "ERROR": "alert",
      "PARTIAL": "warning",
      "SUCCESS": "success"
    },
    "icon": {
      "alert": 'error',
      "success": 'check_circle_outline',
      "warning": 'warning',
      "info": 'info'
    },
    "background-color": {
      "alert": '#f8d7da',
      "success": '#77e65d',
      "warning": '#fff3cd',
      "info": '#d1ecf1'
    }
  },
  "TASKDATA_TABLE": {},
  "TASKVERIFICATION_SLFCOMMIT_TABLE": {},
  "TASKVERIFICATION_SLFDELETE_TABLE": {},
  "TASKVERIFICATION_RESOURCEUTILIZATION_TABLE": {},
  "TASKVERIFICATION_ASSIGNEDTASK_TABLE": {},
  "WORKFLOW": {
    "STR_WF_NEW": "New",
    "STR_WF_INPROGRESS": "In_Progress",
    "STR_WF_SELFCOMMIT": "Self_Commit",
    "STR_WF_SELFDELETE": "Self_Delete",
    "STR_WF_COMPLETE": "Complete",
    "STR_WF_DELETE": "Delete",
  },

  "STR_BASEPATH": "http://localhost:8082/api",
  "PostgresConnection": "postgres://uuktnljs:Bd-dHv74TDkC-XcBp5Sp-du4xiomzwo1@drona.db.elephantsql.com:5432/uuktnljs",
  "MongoClusterConnection": "mongodb+srv://ets_admin:adreno%40123@tsstaskcluster.8gnng.mongodb.net/ETMHistoryDatabase"

};

