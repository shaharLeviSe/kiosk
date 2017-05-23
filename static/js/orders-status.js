function calculateOrdersStatus(ordersArray){
    var statusDiv = require('#statusDiv');
    var priceSum = 0;
    var handledSum = 0;
    var totalOrders = 0;

	ordersArray.forEach(function (order, i) {
		var orderDivClone = $('#orderDivTemplate').clone();
		orderDivClone = createOrderDiv(orderDivClone, order);
		ordersDivElement.append(orderDivClone);
	});
}