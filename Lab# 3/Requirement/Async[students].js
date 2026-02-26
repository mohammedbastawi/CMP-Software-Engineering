const processOrderNotWorking = (orderId) => {
  if (!orderId) {
    console.log("Invalid order ID", orderId);
    return;
  }
  let orderDetails;
  setTimeout(() => {
    console.log("Fetched order details for order ID:", orderId);
    orderDetails = { orderId, status: "Processed" };
  }, 1000);

  return orderDetails;
};

// As you can see this code did not behave as expected
let initOrderId = 100;
const newOrder = processOrderNotWorking(initOrderId);
console.log("Order details:", newOrder);

// --------------------------------------------------------------------
// PROMISES
// --------------------------------------------------------------------

//TODO: How many parameters should this function take? --> 1 parameter: orderId
const processOrderPromise = (orderId) => {
  //TODO: Implement a function using a promises to fetch order details and return the order after fetching [2 Marks]
  //TODO: Handle invalid order ID [1 Mark]
  return new Promise((resolve, reject) => {
    if (!orderId) {
      reject("Invalid order ID: " + orderId);
      return;
    }

    setTimeout(() => {
      console.log("Fetching order details for order ID:", orderId);
      const orderDetails = { orderId, status: "Processed" };
      resolve(orderDetails);
    }, 1000);
  });
};

//TODO: Call processOrderPromise() properly to console log the returned order details and catch any errors [1 Mark]
processOrderPromise(initOrderId)
  .then((order) => console.log("Order details:", order))
  .catch((error) => console.log("Error:", error));

// --------------------------------------------------------------------
// ASYNC / AWAIT
// --------------------------------------------------------------------

const processOrderAwait = async (orderId) => {
  //Handle error [1 Mark]
  try {
    //[HINT]: Use the promise from processOrderPromise [1 Mark]
    const order = await processOrderPromise(orderId);
    //[NOTE]: You do not have to return any value, console log here
    console.log("Order details:", order);
  } catch (error) {
    console.log("Error:", error);
  }
};

//TODO: Call processOrderAwait()
processOrderAwait(initOrderId);


