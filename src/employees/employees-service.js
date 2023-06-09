const xss = require('xss');
const Treeize = require('treeize');

const EmployeesService = {
    getAllEmployees(knex) {
        return knex
            .from('employees')
            .select('id', 'order_number', 'name', knex.raw('COALESCE(score, 0) as score'), 'location_id', 'date_created');
    },
    getAllEmployeesByLocation(knex, location_id) {
        return knex
            .from('employees')
            .select('id', 'order_number', 'name', knex.raw('COALESCE(score, 0) as score'), 'location_id', 'date_created')
            .where('location_id', location_id);
    },
    getById(knex, id) {
        return knex
            .from('employees')
            .select('id', 'order_number', 'name', knex.raw('COALESCE(score, 0) as score'), 'location_id', 'date_created')
            .where('id', id)
            .first();
    },
    insertEmployee(db, newEmployee) {
        const uuid = require('uuid').v4();
        const employeeWithUuid = { ...newEmployee, uuid };
        return db
            .insert(employeeWithUuid)
            .into('employees')
            .returning('*')
            .then(([employee]) => employee);
    },
    updateEmployee(knex, id, newEmployeeFields) {
        const uuid = require('uuid').v4();
        const employeeWithUuid = { ...newEmployeeFields, uuid };
        return knex('employees')
            .where({ id })
            .update(employeeWithUuid)
            .returning('*')
            .then(rows => rows[0]);
    },
    deleteEmployee(knex, id) {
        return knex('employees')
            .where({ id })
            .delete();
    },
    serializeEmployees(employees) {
        return employees.map(this.serializeEmployee);
    },
    serializeEmployee(employee) {
        const employeeTree = new Treeize();
        const employeeData = employeeTree.grow([employee]).getData()[0];
        return {
            id: employeeData.id,
            order_number: employeeData.order_number,
            name: xss(employeeData.name),
            score: xss(employeeData.score),
            location_id: xss(employeeData.location_id),
            date_created: xss(employeeData.date_created)
        };
    }
};

module.exports = EmployeesService;