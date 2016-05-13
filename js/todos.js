$(document).ready(

		function() {
			$("#datepicker").datepicker();

			$('#inItemText').focus();
			function addNewItem(cbId, itemText, deadline) {
				cbId = "";
				itemText = $('#inItemText').val();
				deadline = $('#datepicker').val();
				$('#inItemText').focus();
				if (!itemText || itemText == "" || itemText == " ") {
					return false;
				}

				$('#todoList').prepend(
						'<li><input type="checkbox"/><span>' + itemText
								+ '</span></li>');
				$('#deadlineList')
						.prepend(
								'<li class="center"><span>' + deadline
										+ '</span></li>');
			}

			$("#inItemText").keyup(function(e) {
				if (e.keyCode == 13) {
					addNewItem();
					$("#inItemText").val("");
				}
			});
			$("#btnAdd").click(addNewItem);
		});