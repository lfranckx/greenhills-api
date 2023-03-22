const xss = require('xss');
const Treeize = require('treeize');

const EmployeesService = {
    getAllEmployees(knex) {
        return knex.select('*').from('employees');
    },
    getAllEmployeesByLocation(knex, location_id) {
        console.log('getting all employees by location...', location_id);
        return knex
            .from('employees')
            .select('*')
            .where('location_id', location_id)
            .first();
    },
    getByEmployeeName(knex, name) {
        return knex
            .from('employees')
            .select('*')
            .where('name', name)
            first();
    },
    insertEmployee(db, newEmployee) {
        return db
            .insert(newEmployee)
            .into('employees')
            .returning('*')
            .then(([employee]) => employee);
    },
    updateEmployee(knex, id, newEmployeeFields) {
        return knex('employees')
            .where({ id })
            .update(newEmployeeFields);
    },
    deleteEmployee(knex, id) {
        return knex('employees')
            .where({ id })
            .delete();
    },
    serializeEmployees(employees) {
        console.log('running serializeEmployees()...', employees);
        return employees.map(this.serializeEmployee);
    },
    serializeEmployee(employee) {
        const employeeTree = new Treeize();
        const employeeData = employeeTree.grow([employee]).getData()[0];

        console.log('Serializing Employee...', employee);
        console.log('employeeData...', employeeData);
        return {
            id: employeeData.id,
            name: xss(employeeData.name),
            score: xss(employeeData.score),
            location_id: xss(employeeData.location_id),
            date_created: xss(employeeData.date_created)
        }
    }
};

module.exports = EmployeesService;