
// Inventory Management System

// Array to store all inventory items
const inventory = [];
// Array to store all transaction logs (add, edit, sale, restock, delete)
const transactionLogs = [];
// Array to store unique item categories
const categories = [];
// Object to store custom fields for items
const customFields = {};

function handleCommand(command, args) {
  // Handle add, edit, and remove item commands
  if (["add", "edit", "removeItem"].includes(command)) {
    // Add a new item to inventory
    if (command === "add") {
      const item = {
        name: args[0],
        category: args[1],
        quantity: Number(args[2]),
        price: Number(args[3]),
        unit: args[4],
        addedAt: new Date(),
        customFields: args[5] || {}
      };
      inventory.push(item);
      if (!categories.includes(args[1])) categories.push(args[1]);
      transactionLogs.push({ type: "add", item });
    // Edit an existing item by index
    } else if (command === "edit" && inventory[args[0]]) {
      transactionLogs.push({ type: "edit", old: inventory[args[0]], new: args.slice(1) });
      inventory[args[0]] = {
        ...inventory[args[0]],
        name: args[1],
        category: args[2],
        quantity: Number(args[3]),
        price: Number(args[4]),
        unit: args[5],
        customFields: args[6] || {}
      };
    // Remove an item by index, with low-stock alert if needed
    } else if (command === "removeItem" && inventory[args[0]]) {
      const removedItem = inventory[args[0]]; // Store removed item for logging
      if (removedItem.quantity < 10) {
        console.log(`**ALERT: Item ${removedItem.name} is below 10 units! Current quantity: ${removedItem.quantity}**`);
      }
      transactionLogs.push({ type: "delete", item: removedItem });
      inventory.splice(args[0], 1); // Remove item from inventory
    }
    // Print dashboard summary after add/edit/remove
    printDashboard();
  }
  // Import multiple items at once
  if (command === "import") args[0].forEach(x => handleCommand("add", [x.name, x.category, x.quantity, x.price, x.unit]));
  // Add a new custom field
  if (command === "addField" && !customFields[args[0]]) customFields[args[0]] = null;
  // Update a custom field for a specific item
  if (command === "updateCustomField") {
    const item = inventory.find(x => x.name === args[0]);
    if (item) item.customFields[args[1]] = args[2];
  }
  // Handle selling and restocking items
  if (["sell", "restock"].includes(command)) {
    for (let item of inventory) {
      if (item.name === args[0]) {
        // Sell an item and trigger low-stock alert if needed
        if (command === "sell" && item.quantity >= args[1]) {
          item.quantity -= args[1];
          transactionLogs.push({ type: "sale", item, quantitySold: args[1], date: new Date() });
          console.log(`Sold ${args[1]} ${item.unit} of ${item.name}`);
          if (item.quantity < 10) {
            console.log(`**ALERT: Item ${item.name} is below 10 units! Current quantity: ${item.quantity}**`);
          }
        }
        // Restock an item
        if (command === "restock") {
          item.quantity += args[1];
          transactionLogs.push({ type: "restock", item, quantityRestocked: args[1], date: new Date() });
          console.log(`Restocked ${args[1]} ${item.unit} of ${item.name}`);
        }
        break;
      }
    }
  }
  // Search inventory by name, category, or price
  if (command === "search") {
    const results = inventory.filter(x => [x.name, x.category, x.price].some(v => v.toString().toLowerCase().includes(args[0].toLowerCase())));
    console.log(results);
  }
  // View all inventory items
  if (command === "viewInventory") console.log("=== Inventory ===", inventory);
  // Export inventory as CSV
  if (command === "exportAll") {
    const csv = [
      "Name,Category,Quantity,Price,Unit,AddedAt",
      ...inventory.map(x => [x.name, x.category, x.quantity, x.price, x.unit, x.addedAt].join(","))
    ].join("\n");
    console.log("CSV:\n" + csv);
  }
  // View all transaction logs
  if (command === "viewAllTransactions") console.log("Transactions:\n", transactionLogs);
  // View how many days ago each item was added
  if (command === "viewItemAges") {
    const ages = inventory.map(x => `${x.name}: ${Math.floor((new Date() - new Date(x.addedAt)) / 86400000)}d`).join('\n');
    console.log(ages);
  }
}

function printDashboard() {
  const total = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);
  console.log(`=== Dashboard ===\nItems: ${inventory.length}\nTotal: $${total}\nCategories: ${categories.join(', ')}`);
}









// Command-line interface for testing and interacting with the inventory system
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function mapUserCommand(cmd) {
  const map = {
    add: "add",
    edit: "edit",
    rmI: "removeItem",
    Imprt: "import",
    addFld: "addField",
    udCFld: "updateCustomField",
    Sale: "sell",
    rstck: "restock",
    srch: "search",
    vwI: "viewInventory",
    xprtAll: "exportAll",
    vwAllT: "viewAllTransactions",
    vwIAg: "viewItemAges"
  };
  return map[cmd] || cmd;
}

function commandLoop() {
  rl.question("Enter command: ", (line) => {
    if (line.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }
    try {
      const parts = line.split(" ");
      const command = mapUserCommand(parts[0]);
      const args = parts.slice(1).map((v, i) => (i === 2 || i === 3 || i === 1 && ["sell", "restock"].includes(command)) ? Number(v) : v);
      handleCommand(command, args);
    } catch (e) {
      console.log("Error:", e.message);
    }
    commandLoop();
  });
}

commandLoop();