var ItemList = [];

$(document).ready(

		function() {
			$("#datepicker").datepicker();
			$('#inItemText').focus();

			function addNewItem(cbId, itemText, deadline) {
				var viewItem = {
					itemText : $('#inItemText').val(),
					deadline : $('#datepicker').val(),

				};
				ItemList.push(viewItem);

				$('#inItemText').focus();
				if (!viewItem.itemText || viewItem.itemText == ""
						|| viewItem.itemText == " ") {
					return false;
				} else {
					$.get('templateText.html', function(template) {
						var renderedText = Mustache.render(template, viewItem);
						$('#todoList').append(renderedText);
					})
					$.get('templateDead.html', function(template) {
						var renderedDead = Mustache.render(template, viewItem);
						$('#deadlineList').append(renderedDead);
					})

					$("#inItemText").val("");
					$("#datepicker").val("");
				}
			}

			$("#inItemText", "#datepicker").keyup(function(e) {
				if (e.keyCode == 13) {
					addNewItem();
					storeItems();
					$("#inItemText").val("");
					$("#datepicker").val("");
				}
			});
			$("#datepicker").keyup(function(e) {
				if (e.keyCode == 13) {
					addNewItem();
					storeItems();
					$("#inItemText").val("");
					$("#datepicker").val("");
				}
			});
			$("#btnAdd").click(addNewItem);
			$("#btnAdd").click(storeItems);

		});

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

function storeItems() {
	localStorage.ItemList = JSON.stringify(ItemList);
};

function loadItems() {
	var activeItems = [];
	if (localStorage.ItemList) {
		activeItems = JSON.parse(localStorage.ItemList);

	}
	return activeItems;
};

