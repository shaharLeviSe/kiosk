function sendRequest(reqData, successCB, errorCB){
	$.ajax(reqData.url, {
		method : reqData.method,
		data : reqData.data,
		success : function(data, textStatus, jqXHR){
			if (successCB){
				successCB(data, textStatus, jqXHR)
			}else{
				console.log("data: " + data);
				console.log("textStatus: " + textStatus);
				console.log("jqXHR: " + jqXHR);	
			}
		},
		error : function(xhr, status, error){
			if (errorCB){
				errorCB(xhr, status, error);
			}else{
				console.error("xhr: " + xhr);
				console.error("status: " + status);
				console.error("error: " + error);
			}
		}
	}
	);
}

var getOrdersStop = function(data){
	if (data == "disable"){
		alert(data);
		$('#stopOrdersButton').attr('class', 'stop-button-selected');
	}
	
}

var addOrdersToDiv = function(ordersArray){
	var ordersDivElement = $("#ordersDiv");
	ordersArray.forEach(function(order, i){
		var orderDivClone = $('#orderDivTemplate').clone();
		orderDivClone = createOrderDiv(orderDivClone, order);
		ordersDivElement.append(orderDivClone);
	});
}

function markOrderAsOpen(orderDiv){
	orderDiv.find('.handled-button').css({'background-color': 'red'});
	orderDiv.find('h3').text('!לא טופל');
	orderDiv.attr('order-status', "open");
}

function markOrderAsClose(orderDiv){
	var price = orderDiv.find('.orderPrice');
	price = $(price[0])
	price = price.val();

	console.log(parseInt(price))
	if (!price || !parseInt(price) || parseInt(price) < 1){
		alert("order should have valid price before closing");
		return;
	}

	orderDiv.find('.handled-button').css({'background-color': 'green'});
	orderDiv.find('h3').text('!טופל');
	orderDiv.attr('order-status', "close");
}

function createOrderDiv(orderDiv, order) {
	// var orderDiv = createBaseOrderDiv(order.status);
	// var orderInfoDiv = createOrderInfoDiv(order);
	// orderDiv.append(orderInfoDiv);
	
	if (order.status === 'open'){
		orderDiv.find('.handled-button').css({'background-color': 'red'});
		orderDiv.find('h3').text('!לא טופל')
	}else if (order.status === 'close'){ 
		orderDiv.find('.handled-button').css({'background-color': 'green'});
		orderDiv.find('h3').text('!טופל')
	}

	orderDiv.attr('order-status', order.status);
	orderDiv.css({'display': 'table'});

	return orderDiv;
}

function createOrderInfoDiv(order){
	var orderDiv = $("<div class='orderInfoDiv'></div>");
	var idP = $("<p>id: "+order.id+"</p>");
	var userP = $("<p>private name: "+order.pname+", family name: "+order.fname+", phone: "+order.phone+"</p>");
	var infoP = $("<p>info:<br>"+order.info.toString()+"</p>");
	var commentsP = $("<p>comments:<br>"+order.comments+"</p>");
	orderDiv.append(idP, userP, infoP, commentsP);

	return orderDiv;
}

function createBaseOrderDiv(orderStatus) {
	var orderDiv = $("<div class='orderDiv'></div>"); 

	var toggleButtonText = "<div class='toggle-button'>"
	+"<button></button>"
	+"</div>";
	var toggleButton = $(toggleButtonText);

	orderDiv.append(toggleButton);

	return orderDiv;
}

function onStopOrdersError(xhr, status, error){
	alert('Orders not stopping. Problem!');
}

function stopOrdersToggle(stopOrders){
	reqData.url = '/ordersList/stop';
	reqData.method = 'post';
	reqData.data = {stopOrders: stopOrders};
	sendRequest(reqData, null, onStopOrdersError);
}

$(document).on('click', '.toggle-button', function() {
	$(this).toggleClass('toggle-button-selected'); 
	var classValue = $(this).attr('class');
	if (classValue == "toggle-button"){
		$(this).parent().css({'background-color': 'green'});
	}else{
		$(this).parent().css({'background-color': 'red'});
	}
});

$(document).on('click', '.stop-button', function() {
	$(this).attr('class', 'stop-button-selected'); 
	stopOrdersToggle("disable");
});

$(document).on('click', '.handled-button', function() {
	var orderDiv = $(this).parent();

	if (orderDiv.attr('order-status') === 'close'){
		markOrderAsOpen(orderDiv);
	}else { 
		markOrderAsClose(orderDiv);
	}
});

$(document).on('click', '.stop-button-selected', function() {
	$(this).attr('class', 'stop-button'); 
	stopOrdersToggle("enable");
});

var reqData = {};
reqData.url = '/ordersList?date=20-9-2016';
reqData.method = 'get';
sendRequest(reqData, addOrdersToDiv);

// reqData.url = '/ordersList/stop';
// sendRequest(reqData, getOrdersStop);
