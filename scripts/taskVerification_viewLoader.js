let res = require('../shared/resources')
let Util = require('../core/util')

const util = new Util()

module.exports = class TaskVerification_ViewLoader {
  loadSelfCommitsVerificationData(tabledata) {
    let arrSelfCommitData = []
    let arrFields = ['TaskId', 'Title', 'Module']
    if (tabledata == undefined) {
      popupNotification("alert", "ERROR : No data received");
      return;
    }

    for (let outerIndex = 0; outerIndex < tabledata.length; outerIndex++) {
      let element = tabledata[outerIndex]
      let data = []
      data.push('')
      for (let index = 0; index < arrFields.length; index++) {
        data.push(element[arrFields[index]])
      }
      data.push('Self_Commit')
      arrSelfCommitData.push(data)
    }

    res['TASKVERIFICATION_SLFCOMMIT_TABLE'] = $('#tskv-selfcommits-table').DataTable({
      data: arrSelfCommitData,
      columns: [
        {},
        { title: 'TaskId', visible: false },
        { title: 'Title' },
        { title: 'Module' },
        { title: 'State', visible: false, data: 'Self_Commit', defaultContent: 'Self_Commit' },
        { title: 'Action' },
      ],
      pageLength: 5,
      lengthChange: false,
      columnDefs: [
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
        },
        {
          targets: -1,
          data: null,
          defaultContent:
            '<button id=\'tskv-ver-cmpl-btn\' class="btn btn-outline-success btn-sm btn-circle btn-circle-sm"><span class="material-icons">check_circle</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button><button id=\'tskv-selfcommit-task-open-btn\' class="btn btn-outline-primary btn-sm btn-circle btn-circle-sm"><span class="material-icons md-18">launch</span></button>',
          //'<button id=\'tskv-ver-cmpl-btn\' class="btn btn-outline-success btn-sm btn-circle btn-circle-sm"><span class="material-icons">check_circle</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button>',
        },
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child',
      },
      dom: '<"toolbar">frtip',
    })

    $('#tskv-selfcommits-table tbody').on('click', '#tskv-ver-cmpl-btn', function () {
      var data = res['TASKVERIFICATION_SLFCOMMIT_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsComplete', data)
    })

    $('#tskv-selfcommits-table tbody').on('click', '#tskv-ver-rej-btn', function () {
      var data = res['TASKVERIFICATION_SLFCOMMIT_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsRevert', data)
    })

    $('#tskv-selfcommits-table tbody').on('click', '#tskv-selfcommit-task-open-btn', function () {
      var data = res['TASKVERIFICATION_SLFCOMMIT_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tsb_OpenTaskDetails', data[1])
    })
  }

  loadSelfDeletesVerificationData(tabledata) {
    let arrSelfDeleteData = []
    let arrFields = ['TaskId', 'Title', 'Module']

    if (tabledata == undefined) {
      return 0;
    }

    for (let outerIndex = 0; outerIndex < tabledata.length; outerIndex++) {
      let element = tabledata[outerIndex]
      let data = []
      data.push('')
      for (let index = 0; index < arrFields.length; index++) {
        data.push(element[arrFields[index]])
      }
      data.push('Self_Delete')
      arrSelfDeleteData.push(data)
    }

    console.log(arrSelfDeleteData)
    res['TASKVERIFICATION_SLFDELETE_TABLE'] = $('#tskv-selfdeletes-table').DataTable({
      data: arrSelfDeleteData,
      columns: [
        {},
        { title: 'TaskId', visible: false },
        { title: 'Title' },
        { title: 'Module' },
        { title: 'State', visible: false, data: 'Self_Delete', defaultContent: 'Self_Delete' },
        { title: 'Action' },
      ],
      pageLength: 5,
      lengthChange: false,
      columnDefs: [
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
        },
        {
          targets: -1,
          data: null,
          defaultContent:
            '<button id=\'tskv-ver-del-btn\' class="btn btn-outline-warning btn-sm btn-circle btn-circle-sm"><span class="material-icons">delete</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button><button id=\'tskv-selfdelete-task-open-btn\' class="btn btn-outline-primary btn-sm btn-circle btn-circle-sm"><span class="material-icons md-18">launch</span></button>',
          //'<button id=\'tskv-ver-del-btn\' class="btn btn-outline-warning btn-sm btn-circle btn-circle-sm"><span class="material-icons">delete</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button>',
        },
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child',
      },
      dom: '<"toolbar">frtip',
    })


    $('#tskv-selfdeletes-table tbody').on('click', '#tskv-ver-del-btn', function () {
      var data = res['TASKVERIFICATION_SLFDELETE_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsDelete', data)
    })

    $('#tskv-selfdeletes-table tbody').on('click', '#tskv-ver-rej-btn', function () {
      var data = res['TASKVERIFICATION_SLFDELETE_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsRevert', data)
    })

    $('#tskv-selfdeletes-table tbody').on('click', '#tskv-selfdelete-task-open-btn', function () {
      var data = res['TASKVERIFICATION_SLFDELETE_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tsb_OpenTaskDetails', data[1])
    })
  }

  loadAssignmentSummaryData(data) {
    if (data == undefined) {
      popupNotification("alert", "ERROR : No data received");
      return;
    }

    let parentElement = document.getElementById('tskv-assign-summary-section')
    let newValue =
      parentElement.children[0].children[0].children[0].children[1].children[0]
    let inProgressValue =
      parentElement.children[1].children[0].children[0].children[1].children[0]
    let pendingCommitValue =
      parentElement.children[2].children[0].children[0].children[1].children[0]
    let pendingDeleteValue =
      parentElement.children[3].children[0].children[0].children[1].children[0]
    let completeValue =
      parentElement.children[4].children[0].children[0].children[1].children[0]
    let deleteValue =
      parentElement.children[5].children[0].children[0].children[1].children[0]

    let newCount = 0
    let inpCount = 0
    let pendCommitCount = 0
    let pendDeleteCount = 0
    let comlCount = 0
    let delCount = 0

    for (let index = 0; index < data.length; index++) {
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_COMPLETE']) {
        comlCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_DELETE']) {
        delCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS']) {
        inpCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW']) {
        newCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFCOMMIT']) {
        pendCommitCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFDELETE']) {
        pendDeleteCount = data[index]['count']
      }
    }

    newValue.innerHTML = newCount
    inProgressValue.innerHTML = inpCount
    pendingCommitValue.innerHTML = pendCommitCount
    pendingDeleteValue.innerHTML = pendDeleteCount
    completeValue.innerHTML = comlCount
    deleteValue.innerHTML = delCount
  }

  loadResourceUtilizationData(data) {
    if (data == undefined) {
      return 0;
    }
    let tabledata = util.convertArrayForDataTable(data)
    $('#tskv-resource-utilization-table').DataTable({
      data: tabledata,
      columns: [{ title: 'Name' }, { title: 'Total' }],
      pageLength: 5,
      lengthChange: false,
      searching: false,
      info: false,
    })
  }

  loaTaskdAssignmentData(data) {
    if (data == undefined) {
      popupNotification("alert", "ERROR : No data received");
      return 0;
    }
    let tabledata = util.convertArrayForDataTable(data)
    $('#tskv-assign-task-table').DataTable({
      data: tabledata,
      columns: [
        { title: 'Status' },
        { title: 'Assigned to' },
        { title: 'Title' },
        { title: 'End Date' },
      ],
      pageLength: 5,
      lengthChange: false,
    })
  }
}
