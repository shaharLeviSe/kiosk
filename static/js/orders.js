const ORDER_DIV_CLASS = "orderDiv";

function sendRequest(reqData, successCB, errorCB) {
	$.ajax(reqData.url, {
		method: reqData.method,
		data: reqData.data,
		success: function (data, textStatus, jqXHR) {
			if (successCB) {
				successCB(data, textStatus, jqXHR)
			} else {
				console.log("data: " + data);
				console.log("textStatus: " + textStatus);
				console.log("jqXHR: " + jqXHR);
			}
		},
		error: function (xhr, status, error) {
			if (errorCB) {
				errorCB(xhr, status, error);
			} else {
				console.error("xhr: " + xhr);
				console.error("status: " + status);
				console.error("error: " + error);
			}
		}
	}
	);
}

function markOrderAsOpen(orderDiv) {
	var success = function () {
		orderDiv.find('.handled-button').css({ 'background-color': 'red' });
		orderDiv.find('h3').text('!לא טופל');
		orderDiv.attr('order-status', "open");
	};

	var phone = orderDiv.find(".orderPhone");
	phone = $(phone[0]);
	createStatusRequest("open", phone.text(), success);

}

function markOrderAsClose(orderDiv) {
	var price = orderDiv.find('.orderPrice');
	price = $(price[0])
	price = price.val();

	if (!price || !parseInt(price) || parseInt(price) < 1) {
		alert("order should have valid price before closing");
		return;
	}

	var success = function () {
		orderDiv.find('.handled-button').css({ 'background-color': 'green' });
		orderDiv.find('h3').text('!טופל');
		orderDiv.attr('order-status', "close");
	};

	var phone = orderDiv.find(".orderPhone");
	phone = $(phone[0]);
	var orderPrice = orderDiv.find(".orderPrice");
	orderPrice = $(orderPrice[0]).val();
	console.log("updating order with new price : '" + orderPrice + "'");
	createStatusRequest("close", phone.text(), orderPrice, success);
}

function createStatusRequest(status, phone, price, onSuccess) {
	var error = function () {
		alert("unable to save request");
	}

	var reqData = {};
	reqData.url = "/order/status";
	reqData.method = "post";

	reqData.data = { status: status, phone: phone, price: price };
	sendRequest(reqData, onSuccess, error);
}

function updatePriceForOrder(orderDiv) {
	var priceSpan = orderDiv.find('.orderPrice');
	priceSpan = $(priceSpan[0]);
	var price = priceSpan.text();
}

function createOrderDiv(orderDiv, order) {
	if (order.status === 'open') {
		orderDiv.find('.handled-button').css({ 'background-color': 'red' });
		orderDiv.find('h3').text('!לא טופל')
	} else if (order.status === 'close') {
		orderDiv.find('.handled-button').css({ 'background-color': 'green' });
		orderDiv.find('h3').text('!טופל')
		updatePriceForOrder(orderDiv);
	}

	var nameSpan = orderDiv.find('.orderName');
	nameSpan = $(nameSpan[0]);
	nameSpan.text(order.pname + " " + order.fname);

	var infoSpan = orderDiv.find('.orderInfo');
	infoSpan = $(infoSpan[0]);
	infoSpan.attr("order-info", JSON.stringify(order.info))

	var phoneSpan = orderDiv.find('.orderPhone');
	phoneSpan = $(phoneSpan[0]);
	phoneSpan.text(order.phone);

	var priceSpan = orderDiv.find('.orderPrice');
	priceSpan = $(priceSpan[0]);
	priceSpan.val(order.price);

	orderDiv.attr('class', ORDER_DIV_CLASS);
	orderDiv.attr('order-status', order.status);
	orderDiv.css({ 'display': 'table' });

	return orderDiv;
}

function onStopOrdersError(xhr, status, error) {
	alert('Orders not stopping. Problem!');
}

function stopOrdersToggle(stopOrders) {
	var reqData = {};
	reqData.url = '/ordersList/stop';
	reqData.method = 'post';
	reqData.data = { stopOrders: stopOrders };
	sendRequest(reqData, null, onStopOrdersError);
}

$(document).on('click', '.toggle-button', function () {
	$(this).toggleClass('toggle-button-selected');
	var classValue = $(this).attr('class');
	if (classValue == "toggle-button") {
		$(this).parent().css({ 'background-color': 'green' });
	} else {
		$(this).parent().css({ 'background-color': 'red' });
	}
});

$(document).on('click', '.orderInfo', function () {
	var orderInfo = JSON.parse($(this).attr('order-info'));
	alert(JSON.stringify(orderInfo, null, 4));
});


$(document).on('click', '.handled-button', function () {
	var orderDiv = $(this).parent();

	if (orderDiv.attr('order-status') === 'close') {
		markOrderAsOpen(orderDiv);
	} else {
		markOrderAsClose(orderDiv);
	}
});

$("#stopOrdersButton").click(function () {
	var status = $(this).text();
	if (status == "stopped") {
		stopOrdersToggle("enable");
		$(this).text("running");
		$(this).css({ 'background-color': 'green' });
	} else {
		stopOrdersToggle("disable");
		$(this).text("stopped");
		$(this).css({ 'background-color': 'red' });
	}
});

$(document).on('click', '.stop-button-selected', function () {
	$(this).attr('class', 'stop-button');
});

function addOrdersToDiv(ordersArray) {
	console.log("Found " + ordersArray.length + " orders!");
	var ordersDivElement = $("#ordersDiv");

	ordersDivElement.empty();

	ordersArray.forEach(function (order, i) {
		var orderDivClone = $('#orderDivTemplate').clone();
		orderDivClone = createOrderDiv(orderDivClone, order);
		ordersDivElement.append(orderDivClone);
	});
}

function onRefresh(ordersArray){
	addOrdersToDiv(ordersArray);
	calculateOrdersStatus(ordersArray);
}

function refreshPage() {
	var reqData = {};
	reqData.url = '/ordersList';
	reqData.method = 'get';
	sendRequest(reqData, onRefresh);

	reqData.url = '/ordersList/stop';
	reqData.method = 'get';

	sendRequest(reqData,
		function (data) {
			var button = $("#stopOrdersButton");
			if (data == "enable") {
				button.text("running");
				button.css({ 'background-color': 'green' });
			} else {
				button.text("stopped");
				button.css({ 'background-color': 'red' });
			}
		}
	);
}

refreshPage();
setInterval(function () {
	refreshPage();
}, 30000)