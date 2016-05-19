var ItemList = [];
var elementTemplate = undefined;

/**
 * Creates a new item and adds it to the list of items if valid.
 */
function addNewItem() {
	var viewItem = createNewItem($('#inItemText').val(), $('#datepicker').val());
	if(!validateItem(viewItem)) {
		return;
	}
	
	ItemList.push(viewItem);
	var element = buildItem(viewItem);
	element.addClass('animated fadeInRight');
	$('#todoList').append(element);
	storeItems();
	
	$("#inItemText").val("");
	$("#datepicker").val("");
	$('#inItemText').focus();
}

/**
 * Crearte sa new Item with the given itemText and deadline.
 * 
 * @param {string} itemText The title of the item
 * @param {string} deadline the deadline of the item (format: MM/DD/YYYY)
 * @returns {Item} a new item instance
 */
function createNewItem(itemText, deadline) {
	return {
		id : ItemList.length,
		itemText : itemText,
		deadline : deadline
	};
}

/**
 * Returns true if the given item is valid
 * 
 * @param viewItem
 * @returns {Boolean}
 */
function validateItem(viewItem) {
	if (!viewItem.itemText || viewItem.itemText == ""
		|| viewItem.itemText == " " || viewItem.deadline == "") {
		return false;
	}
	return true;
}

/**
 * First test if any value of "viewItem" is undefined. In that case nothing
 * happens. Otherwise construct the DOM Element for each "viewItem"and his
 * values by using MUSTACHE.js at the end the inputfield and datepicker will be
 * cleared
 */
function buildItem(viewItem) {
	var renderedText = Mustache.render(elementTemplate, viewItem);
	var element = $(renderedText);
	return element;
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
		ItemList[i].animate = "none"
			$('#todoList').append(buildItem(ItemList[i]));
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
		ItemList[i].id = i
	}

	var element = $("#tmplText_" + ItemId);
	element.addClass('animated fadeOutRight');
	element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		element.remove();
	});
	storeItems();

}
/**
 * Process at Document loading by getting the Items of LocalStorage and rebuild
 * the DOM
 */

$(document).ready(function() {
	
	$.get('templateText.html', function(template) {
		elementTemplate = template;

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
	});
	
})
