$(document)
		.ready(

				function() {
					$("#datepicker").datepicker();
					$('#inItemText').focus();
					var totalItems = 0;
					function addNewItem(cbId, itemText, deadline) {
						totalItems++;
						cbId = "";
						itemText = $('#inItemText').val();
						deadline = $('#datepicker').val();
						$('#inItemText').focus();
						if (!itemText || itemText == "" || itemText == " ") {
							return false;
						} else {

							$('#todoList')
									.append(
											'<li><input class="chkBox" type="checkbox" onclick="updateItemStatus(this)" id="cb_'
													+ totalItems
													+ '"/><span id="item_'
													+ totalItems
													+ '">'
													+ itemText + '</span></li>');
							$('#deadlineList').append(
									'<li class="center" id="dl_' + totalItems
											+ '"><span>' + deadline
											+ '</span></li>');
							$("#inItemText").val("");
						}
					}

					$("#inItemText").keyup(function(e) {
						if (e.keyCode == 13) {
							addNewItem();
							$("#inItemText").val("");
						}
					});

					$("#btnAdd").click(addNewItem);

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
