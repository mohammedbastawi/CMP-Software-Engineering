function fetchEmployees() {
  fetch('http://localhost:3000/api/v1/employee')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('dataTable')
      tableBody.innerHTML = ''
      const list = data.data
      list.forEach(item => {
        const row = document.createElement('tr')

        const idCell = document.createElement('td')
        idCell.textContent = item.id
        row.appendChild(idCell)

        const nameCell = document.createElement('td')
        nameCell.textContent = item.name
        row.appendChild(nameCell)

        const deleteCell = document.createElement('td')
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm')
        // add event listener to delete button
        deleteButton.addEventListener('click', () => deleteEmployee(item.id))
        deleteCell.appendChild(deleteButton)
        row.appendChild(deleteCell)

        tableBody.appendChild(row)
      })
    })
    .catch(error => console.error(error))
}

// add event listener to submit (create) button
document.getElementById('employeeForm').addEventListener('submit', function (e) {
  e.preventDefault()
  createEmployee()
})

// add event listener to update button
document.getElementById('updateEmployeeForm').addEventListener('submit', function (e) {
  e.preventDefault()
  updateEmployee()
})

function createEmployee() {
  // get data from input fields
  const name = document.getElementById('name').value.trim()
  const id = document.getElementById('id').value.trim()

  // send data to BE
  fetch('http://localhost:3000/api/v1/employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message)
        return
      }
      // clear form fields
      document.getElementById('employeeForm').reset()
      // call fetchEmployees
      fetchEmployees()
    })
    .catch(error => console.error(error))
}

function deleteEmployee(id) {
  // send id to BE
  fetch(`http://localhost:3000/api/v1/employee/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(() => {
      // call fetchEmployees
      fetchEmployees()
    })
    .catch(error => console.error(error))
}

function updateEmployee() {
  // get data from input fields
  const id = document.getElementById('updateId').value.trim()
  const name = document.getElementById('updateName').value.trim()

  // send data to BE
  fetch(`http://localhost:3000/api/v1/employee/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message)
        return
      }
      // clear form fields
      document.getElementById('updateEmployeeForm').reset()
      // call fetchEmployees
      fetchEmployees()
    })
    .catch(error => console.error(error))
}

fetchEmployees()
