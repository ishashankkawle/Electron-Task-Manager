const res = require('../shared/resources');

module.exports = class WorkflowOperations {

    async getNextWorkflowStatus(currentWorkflowStatus) {
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_NEW"]) {
            return res["WORKFLOW"]["STR_WF_INPROGRESS"];
        }
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_INPROGRESS"]) {
            return res["WORKFLOW"]["STR_WF_SELFCOMMIT"];
        }
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_SELFCOMMIT"]) {
            return res["WORKFLOW"]["STR_WF_COMPLETE"];
        }
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_SELFDELETE"]) {
            return res["WORKFLOW"]["STR_WF_DELETE"];
        }
    }
    async getPreviousWorkflowStatus(currentWorkflowStatus) {
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_SELFCOMMIT"]) {
            return res["WORKFLOW"]["STR_WF_INPROGRESS"];
        }
        if (currentWorkflowStatus == res["WORKFLOW"]["STR_WF_SELFDELETE"]) {
            return res["WORKFLOW"]["STR_WF_INPROGRESS"];
        }
    }

    async getStartingWorkflowState() {
        return res["WORKFLOW"]["STR_WF_INPROGRESS"];
    }


}