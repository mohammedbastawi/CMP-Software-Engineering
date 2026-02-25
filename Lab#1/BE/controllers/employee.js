const employee = [
  { id: '1', name: 'Mohamed Sayed' },
];

exports.getEmployees = async (req, res, next) => {
  res.status(200).json({ data: employee });
};

exports.deleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  const index = employee.findIndex((emp) => emp.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  employee.splice(index, 1);
  res.status(200).json({ message: 'Employee deleted successfully' });
};

exports.createEmployee = async (req, res, next) => {
  const { id, name } = req.body;
  const exists = employee.find((emp) => emp.id === String(id));
  if (exists) {
    return res.status(400).json({ message: 'Employee with this ID already exists' });
  }
  const newEmployee = { id: String(id), name };
  employee.push(newEmployee);
  res.status(201).json({ data: newEmployee });
};

exports.updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const emp = employee.find((emp) => emp.id === id);
  if (!emp) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  emp.name = name;
  res.status(200).json({ data: emp });
};