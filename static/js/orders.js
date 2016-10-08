function sendRequest(reqData, successCB){
	$.ajax(reqData.url, {
		method : reqData.method,
		data : reqData.data,
		success : successCB,
		error : function(xhr, status, error){
			console.error("xhr: " + xhr);
			console.error("status: " + status);
			console.error("error: " + error);
		}
	}
	);
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

$(document).on('click', '.toggle-button', function() {
    $(this).toggleClass('toggle-button-selected'); 
});

var reqData = {};
reqData.url = '/ordersList?date=20-9-2016';
reqData.method = 'get';
sendRequest(reqData, addOrdersToDiv);
