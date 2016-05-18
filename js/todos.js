var ItemList = [];

/**
 * Create one single Item Object("viewItem") with the values of the input
 * textfield as "ItemText", the value of datepicker as "deadline" and index
 * Number by getting the place in the "ItemList" Array
 */
function addNewItem() {

	var viewItem = {
		ItemListLength : ItemList.length,
		itemText : $('#inItemText').val(),
		deadline : $('#datepicker').val(),
	};
	if (!viewItem.itemText || viewItem.itemText == ""
			|| viewItem.itemText == " " || viewItem.deadline == "") {
		return false
	} else {
		ItemList.push(viewItem);
		buildItem(viewItem)

	}
	;
}
/**
 * First test if any value of "viewItem" is undefined. In that case nothing
 * happens. Otherwise construct the DOM Element for each "viewItem"and his
 * values by using MUSTACHE.js at the end the inputfield and datepicker will be
 * cleared
 */

function buildItem(viewItem) {

	$.get('templateText.html', function(template) {
		var renderedText = Mustache.render(template, viewItem);
		if (JSON.parse(localStorage.ItemList).length < ItemList.length) {
			renderedText = renderedText.replace('class="foo"',
					'class="animated fadeInRight"')
		}
		$('#todoList').append(renderedText);
	})
	$.get('templateDead.html', function(template) {
		var renderedDead = Mustache.render(template, viewItem);
		if (JSON.parse(localStorage.ItemList).length < ItemList.length) {
			renderedDead = renderedDead.replace('class="foo"',
					'class="animated fadeInRight"')
		}
		$('#deadlineList').append(renderedDead);

	})

	$("#inItemText").val("");
	$("#datepicker").val("");
	$('#inItemText').focus();
}

/*
 * Function to store the array of Items to LocalStorage by using JSON.stringify
 */
function storeItems() {
	localStorage.ItemList = JSON.stringify(ItemList);
};

/*
 * Clear the complete DoOM elements "#todoList & "#deadlineList" and refill them
 * with the Items, stored in the LocalStorage by using the function "buildItem"
 */
function buildStoredList() {
	$('#todoList').html("")
	$('#deadlineList').html("")
	ItemList = loadItems();
	for (var i = 0; i < ItemList.length; i++) {
		buildItem(ItemList[i])
	}
	storeItems()
}
/*
 * Function to reload all Items from the LocalStorage by using JSON.parse
 */
function loadItems() {
	var activeItems = [];
	if (localStorage.ItemList) {
		activeItems = JSON.parse(localStorage.ItemList);
	}
	return activeItems;
};
/*
 * Change the CSS of each Item when the checkbox will be toggled
 */
function updateItemStatus(x) {
	var cbId = $(x).attr("id").replace("cb_", "");
	var itemText = $("#item_" + cbId)
	if ($(x).is(":checked")) {
		itemText.css("text-decoration", "line-through");
		itemText.css("font-weight", "600");
		itemText.css("color", "#ccc")
	} else {
		itemText.css("text-decoration", "none");
		itemText.css("font-weight", "300");
		itemText.css("color", "#000")
	}
}

/*
 * function to get the absolute ID from each Item
 */
function getItemById(id) {
	for (var i = 0; i < ItemList.length; i++) {
		if (ItemList[i].id == id) {
			return ItemList[i];
		}
	}
}
/*
 * function to remove Items from the localStorage when deleted
 */
function removeItem(ItemId) {
	ItemList.splice(ItemId, 1);
	for (var i = 0; i < ItemList.length; i++) {
		ItemList[i].ItemListLength = i
	}

	$("#tmplText_" + ItemId).remove()
	$("#tmplDead_" + ItemId).remove()
	storeItems();

}
/**
 * Process at Document loading by getting the Items of LocalStorage and rebuild
 * the DOM
 */

$(document).ready(function() {
	$('#inItemText').focus();
	$("#datepicker").datepicker();
	$("#inItemText").keyup(function(e) {
		if (e.keyCode == 13) {
			addNewItem();
			$("#inItemText").val("");
			$("#datepicker").val("");
		}
	});
	$("#datepicker").keyup(function(e) {
		if (e.keyCode == 13) {
			addNewItem();
			$("#inItemText").val("");
			$("#datepicker").val("");
		}
	});
	buildStoredList()
})
