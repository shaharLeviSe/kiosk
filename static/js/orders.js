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
	for (var i=0; i<ordersArray.length; i++){
		var orderDiv = createOrderDiv(ordersArray[i]);
		ordersDivElement.append(orderDiv);
	}
}

function createOrderDiv(order) {
	var orderDiv = createBaseOrderDiv();
	var orderInfoDiv = createOrderInfoDiv(order);
	orderDiv.append(orderInfoDiv);
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

function createBaseOrderDiv() {
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

$(document).on('click', '.toggle-button-selected', function() {
	$(this).attr('class', 'toggle-button'); 
});

$(document).on('click', '.stop-button', function() {
	$(this).attr('class', 'stop-button-selected'); 
	stopOrdersToggle("disable");
});

$(document).on('click', '.stop-button-selected', function() {
	$(this).attr('class', 'stop-button'); 
	stopOrdersToggle("enable");
});

var reqData = {};
reqData.url = '/ordersList?date=20-9-2016';
reqData.method = 'get';
sendRequest(reqData, addOrdersToDiv);

reqData.url = '/ordersList/stop';
sendRequest(reqData, getOrdersStop);
