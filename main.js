
document.getElementById('login-btn').addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === password) {
    alert('Login Successful');
  } else {
      alert('Please enter valid credentials!');
  }
});


//------------------------------------------

function initializeOrderPage() {
  const apiUrl = "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders";
  const orderBody = document.getElementById("orderBody");
  const newCheckbox = document.getElementById("new");
  const packedCheckbox = document.getElementById("packed");
  const inTransitCheckbox = document.getElementById("inTransit");
  const deliveredCheckbox = document.getElementById("delivered");

  // Add event listeners to checkboxes
  newCheckbox.addEventListener("change", updateOrderTable);
  packedCheckbox.addEventListener("change", updateOrderTable);
  inTransitCheckbox.addEventListener("change", updateOrderTable);
  deliveredCheckbox.addEventListener("change", updateOrderTable);

  // Fetch and populate order data on page load
  fetchAndPopulateOrders(apiUrl);

  // Fetch and populate order data
  async function fetchAndPopulateOrders(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const orders = await response.json();
      populateTable(orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Populate order data into the table
  function populateTable(orders) {
    orderBody.innerHTML = "";
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.orderDate}</td>
        <td>${order.orderTime}</td>
        <td>${order.amount}</td>
        <td>${order.orderStatus}</td>
      `;
      orderBody.appendChild(row);
    });
  }

  // Update the order table based on selected checkboxes
  function updateOrderTable() {
    const selectedStatuses = [];
    if (newCheckbox.checked) {
      selectedStatuses.push("New");
    }
    if (packedCheckbox.checked) {
      selectedStatuses.push("Packed");
    }
    if (inTransitCheckbox.checked) {
      selectedStatuses.push("InTransit");
    }
    if (deliveredCheckbox.checked) {
      selectedStatuses.push("Delivered");
    }
    // Fetch and populate orders with selected statuses
    const filteredApiUrl = `${apiUrl}?orderStatus=${selectedStatuses.join(
      ","
    )}`;
    fetchAndPopulateOrders(filteredApiUrl);
  }
}

document.addEventListener("DOMContentLoaded", initializeOrderPage);

//------------------------------------------------------------
// Function to fetch products from the backend
async function fetchProducts() {
  try {
    const response = await fetch(
      "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to filter products based on expiry and stock
function filterProducts(products, expiredChecked, lowStockChecked) {
  const currentDate = new Date();

  return products.filter((product) => {
    const isExpired = new Date(product.expiryDate) < currentDate;
    const isLowStock = product.stock < 100;

    if (expiredChecked && lowStockChecked) {
      return isExpired && isLowStock;
    } else if (expiredChecked) {
      return isExpired;
    } else if (lowStockChecked) {
      return isLowStock;
    } else {
      return true;
    }
  });
}

// Function to update the table with filtered products
function updateTable(products) {
  const tableBody = document.getElementById("orderBody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.medicineName}</td>
      <td>${product.medicineBrand}</td>
      <td>${product.expiryDate}</td>
      <td>${product.unitPrice}</td>
      <td>${product.stock}</td>
    `;
    tableBody.appendChild(row);
  });

  const productCount = document.getElementById("productCount");
  productCount.textContent = `Count: ${products.length}`;
}

// Function to handle checkbox changes and update the table
function handleCheckboxChange() {
  const expiredCheckbox = document.getElementById("expired");
  const lowStockCheckbox = document.getElementById("lowStock");

  expiredCheckbox.addEventListener("change", updateProductTable);
  lowStockCheckbox.addEventListener("change", updateProductTable);
}

// Function to update the product table based on checkbox filters
async function updateProductTable() {
  const expiredChecked = document.getElementById("expired").checked;
  const lowStockChecked = document.getElementById("lowStock").checked;

  const products = await fetchProducts();
  const filteredProducts = filterProducts(
    products,
    expiredChecked,
    lowStockChecked
  );
  updateTable(filteredProducts);
}

// Add event listener to page load
window.addEventListener("load", () => {
  updateProductTable(); // Fetch and update the product table on page load
  handleCheckboxChange(); // Attach event listeners to checkboxes
});

//----------------------------

// Function to fetch users from the backend
async function fetchUsers() {
  try {
    const response = await fetch(
      "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to update the user table
function updateUserTable(users) {
  const tableBody = document.getElementById("userTableBody");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td><img src="${user.profilePic}" alt="Avatar" /></td>
      <td>${user.fullName}</td>
      <td>${user.dob}</td>
      <td>${user.gender}</td>
      <td>${user.currentCity}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to handle search input and update the table
async function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const resetButton = document.getElementById("resetButton");

  searchInput.addEventListener("input", async () => {
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length >= 2) {
      const users = await fetchUsers();
      const searchResults = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      updateUserTable(searchResults);
    } else {
      updateUserTable([]); // Clear the table
    }
  });

  resetButton.addEventListener("click", async () => {
    searchInput.value = "";
    const users = await fetchUsers();
    updateUserTable(users);
  });
}

// Add event listener to page load
window.addEventListener("load", () => {
  fetchUsers().then(updateUserTable); // Fetch and update the user table on page load
  handleSearch(); // Attach event listeners to search input and reset button
});
