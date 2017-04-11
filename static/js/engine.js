var PHONE_REGEX = /^\d{10}$/;  

$('#orderForm').on("click", ".submitOrderButton", function() {
	var orderData = createOrderData();
	var isValid = validateData(orderData);
	if (isValid){
		placeOrder(orderData);
	}
})

var validateData = function(orderData){
	var alertMsg = ""; 
	if(!orderData.phone || !orderData.phone.match(PHONE_REGEX)){
		alertMsg += "טלפון לא תקין\n";
	}
	if(!orderData.info){
		alertMsg += "לא בוצעה הזמנה\n";
	}
	if(!orderData.pname){
		alertMsg += "לא הוזן שם פרטי\n";
	}
	if(!orderData.fname){
		alertMsg += "לא הוזן שם משפחה\n";
	}
	if (alertMsg === ""){
		return true;
	}else{
		alert(alertMsg);
		return false;
	}
}

var placeOrder = function(orderData){
	var reqData = {};
	reqData.url = '/order';
	reqData.data = orderData;
	reqData.method = 'post';
	sendOrderRequest(reqData);
}

var createOrderData = function(){
	var orderData = {
		phone: $('#orderPhone').val(),
		info: $('#orderInfo').val(),
		comments: $('#orderComments').val(), 
		pname: $('#orderPName').val(),
		fname: $('#orderFName').val(),
	}
	return orderData;
}

var sendOrderRequest = function(reqData){
	$.ajax(reqData.url, {
		method : reqData.method,
		data : reqData.data,
		success : function(data, textStatus, jqXHR){
			alert("ההזמנה בוצעה!");
			$.mobile.changePage("#mainPage");
		},
		error : function(jqXHR, textStatus, errorThrown){
			alert(jqXHR);
			alert(textStatus);
			alert(errorThrown);
			alert("משהו השתבש...\n אנא נסה/י שוב.");
		}
	});
}

var setNoOrdersDiv = function(){
	var clone = $("#orderFormOffTemplate").clone();
	$("#orderForm").append(clone);
}

var setOrdersDiv = function(){
	var clone = $("#orderFormOnTemplate").clone();
	
	var pname = clone.find("input[name=pname]").first().prop("id", "orderPName");
	var fname = clone.find("input[name=fname]").first().prop("id", "orderFName");
	var orderInfo = clone.find("textarea.orderInfo").first().prop("id", "orderInfo");
	var pname = clone.find("input[name=fphone]").first().prop("id", "orderPhone");
	
	clone.css({"display":"block"});
	$("#orderForm").append(clone);
}

$.ajax('/ordersList/stop', {
	method : "get",
	success : function(data, textStatus, jqXHR){
		if (data == "disable"){
				//$('#orderForm').hide();
				setNoOrdersDiv();
			}else{
				setOrdersDiv();
			}
		}
	})