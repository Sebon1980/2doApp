var TaskList = [];
var elementTemplate = undefined;
var activeTask = undefined;

/**
 * Creates a new Task and adds it to the list of Tasks if valid.
 */
function addNewTask() {
	var viewTask = createNewTask($('#inTaskText').val(), $('#datepicker').val());
	if (!validateTask(viewTask)) {
		return;
	}

	TaskList.push(viewTask);
	var element = buildTask(viewTask);
	element.addClass('animated fadeInRight');
	$('#todoList').append(element);
	storeTask();

	$("#inTaskText").val("");
	$("#datepicker").val("");
	$('#inTaskText').focus();
}

/**
 * Crearte sa new Task with the given TaskText and deadline.
 * 
 * @param {string}
 *            TaskText The title of the Task
 * @param {string}
 *            deadline the deadline of the Task (format: MM/DD/YYYY)
 * @returns {Task} a new Task instance
 */
function createNewTask(TaskText, deadline) {
	return {
		id : TaskList.length,
		TaskText : TaskText,
		deadline : deadline,
		description : ""
	};
}

/**
 * Returns true if the given Task is valid
 * 
 * @param viewTask
 * @returns {Boolean}
 */
function validateTask(viewTask) {
	if (!viewTask.TaskText || viewTask.TaskText == ""
			|| viewTask.TaskText == " " || viewTask.deadline == "") {
		return false;
	}
	return true;
}

/**
 * First test if any value of "viewTask" is undefined. In that case nothing
 * happens. Otherwise construct the DOM Element for each "viewTask"and his
 * values by using MUSTACHE.js at the end the inputfield and datepicker will be
 * cleared
 */
function buildTask(viewTask) {
	var renderedText = Mustache.render(elementTemplate, viewTask);
	var element = $(renderedText);
	return element;
}

/*
 * Function to store the array of Tasks to LocalStorage by using JSON.stringify
 */
function storeTask() {
	localStorage.TaskList = JSON.stringify(TaskList);
};

/*
 * Clear the complete DoOM elements "#todoList & "#deadlineList" and refill them
 * with the Tasks, stored in the LocalStorage by using the function "buildTask"
 */
function buildStoredList() {
	$('#todoList').html("")
	$('#deadlineList').html("")
	TaskList = loadTask();
	for (var i = 0; i < TaskList.length; i++) {
		TaskList[i].animate = "none"
		$('#todoList').append(buildTask(TaskList[i]));
	}
	storeTask()
}
/*
 * Function to reload all Tasks from the LocalStorage by using JSON.parse
 */
function loadTask() {
	var activeTask = [];
	if (localStorage.TaskList) {
		activeTask = JSON.parse(localStorage.TaskList);
	}
	return activeTask;
};
/*
 * Change the CSS of each Task when the checkbox will be toggled
 */
function updateTaskStatus(x) {
	var cbId = $(x).attr("id").replace("cb_", "");
	var TaskText = $("#task_" + cbId)
	if ($(x).is(":checked")) {
		TaskText.css("text-decoration", "line-through");
		TaskText.css("font-weight", "600");
		TaskText.css("color", "#ccc")
	} else {
		TaskText.css("text-decoration", "none");
		TaskText.css("font-weight", "300");
		TaskText.css("color", "#fff")
	}
}

/*
 * function to get the absolute ID from each Task
 */
function getTaskById(id) {
	for (var i = 0; i < TaskList.length; i++) {
		if (TaskList[i].id == id) {
			return TaskList[i];
		}
	}
}
/*
 * function to remove Tasks from the localStorage when deleted
 */
function removeTask(taskId) {
	TaskList.splice(taskId, 1);
	for (var i = 0; i < TaskList.length; i++) {
		TaskList[i].id = i
	}

	var element = $("#tmplText_" + taskId);
	var modal = $("#modal_" + taskId);

	element.addClass('animated fadeOutRight');
	element
			.one(
					'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
					function() {
						element.remove();
						modal.remove();
						buildStoredList()
					});
	storeTask();
	
}

/**
 * Process at Document loading by getting the Tasks of LocalStorage and rebuild
 * the DOM
 */
$(document).ready(function() {
	$('#myModal').on('show.bs.modal', function(e) {
		activeTask = getTaskById(e.relatedTarget.dataset.taskid);
		$('#myModalLabel').html(activeTask.TaskText);
		$('#newDescrip').val(activeTask.description);
		$('#myModalDeadline').html(activeTask.deadline);
	});

	$('#btnSaveDetails').click(function() {
		if ($('#newTitle').val() != "") {
			activeTask.TaskText = $('#newTitle').val();
		}
		if ($('#newDatepicker').val() != "") {
			activeTask.deadline = $('#newDatepicker').val();
		}
		if ($('#newDescrip').val() != "") {
			activeTask.description = $('#newDescrip').val();
		}
		storeTask();
		buildStoredList()

	});
	
	$('#btnDel').click(function() {
		$(function() {
			$('#myModal').modal('toggle')
		});
		removeTask(activeTask.id)
		
	});


	$.get('templateText.html', function(template) {
		elementTemplate = template;
		$("#newDatepicker").datepicker();
		$('#inTaskText').focus();
		$("#datepicker").datepicker();
		$("#inTaskText").keyup(function(e) {
			if (e.keyCode == 13) {
				addNewTask();
				$("#inTaskText").val("");
				$("#datepicker").val("");
			}
		});
		$("#datepicker").keyup(function(e) {
			if (e.keyCode == 13) {
				addNewTask();
				$("#inTaskText").val("");
				$("#datepicker").val("");
			}
		});
		buildStoredList()
	});

})
