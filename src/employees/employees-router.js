const express = require('express');
const jsonParser = express.json();
const employeesRouter = express.Router();
const EmployeesService = require('./employees-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('../auth/auth-service');

employeesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        EmployeesService.getAllEmployees(req.app.get('db'))
        .then(employees => {
            console.log('Sending Employees to Serialize...', employees);
            res.json(EmployeesService.serializeEmployees(employees));
        })
        .catch(next);
    })
    .post('/', jsonParser, (req, res, next) => {
        const { name, location_id, score, password } = req.body;
        const newEmployee = {
            name: name,
            score: score,
            location_id: location_id,
        }

        AuthService.getUserWithUsername(
            req.app.get('db'),
            req.user.username
        )
        .then(dbUser => {
            console.log('dbUser...', dbUser);
            if (!dbUser)
                return res.status(400).json({
                    error: 'Username not found'
                });
            
            return AuthService.comparePasswords(password, dbUser.password)
            .then(compareMatch => {
                console.log('compareMatch...', compareMatch);
                if (!compareMatch)
                    return res.status(400).json({
                        error: 'Incorrect password',
                    });
                
                for (const [key, value] of Object.entries(newEmployee))
                    if (value === null)
                        return res.status(400).json({
                            error: `Missing ${key} in request body`
                        });
                
                return EmployeesService.insertEmployee(
                    req.app.get('db'),
                    newEmployee
                )
                .then(employee => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${employee.id}`))
                        .json(EmployeesService.serializeEmployee(employee));
                })
                .catch(next);
            });
        })
        .catch(next);
    });

// get employees by location
employeesRouter
    .route('/location/:location_id')
    .all(checkLocationExists)
    .get(requireAuth, (req, res) => {
        console.log('req body...', req.body);
        const { location_id } = req.body;
        EmployeesService.getAllEmployeesByLocation(req.app.get('db'), location_id)
        .then(employees => {
            console.log('Sending Employees to Serialize...', employees);
            res.json(EmployeesService.serializeEmployees(employees));
        })
        .catch(next);
    })

// updates to specific employee
employeesRouter
    .route('/:id')
    .all(checkEmployeeExists)
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { id, name, score, location_id } = req.body;
        const employeeToUpdate = { id, name, score, location_id };
        const numOfValues = Object.values(employeeToUpdate).filter(Boolean).length;

        if (numOfValues === 0)
            return (res.status(400).json({
                error: {
                    message: `Request body must contain id, name, score, or location_id`
                }
            }));

        console.log('Updating Employee ID...', id);
        console.log('New Employee Data', employeeToUpdate);

        EmployeesService.updateEmployee(
            req.app.get('db'),
            id,
            employeeToUpdate
        )
        .then(numRowsAffected => {
            res.json(numRowsAffected).status(204).end();
        })
        .catch(next);
    })
    .delete(requireAuth, jsonParser, (req, res, next) => {
        console.log('Deleting Employee by Id...', req.params.id);
        EmployeesService.deleteEmployee(
            req.app.get('db'),
            req.params.id
        )
        .then(numRowsAffected => {
            res.json(numRowsAffected).status(204).end();
        })
        .catch(next);
    })


async function checkLocationExists(req, res, next) {
    try {
        const location = await EmployeesService.getByLocation(
            req.app.get('db'),
            req.params.location_id
        );

        if (!location)
            return res.status(404).json({
                error: `This location does not exist.`
            });
        
        res.location = location;
        next();
    } catch(error) {
        next(error);
    }
}

async function checkEmployeeExists(req, res, next) {
    try {
        const employee = await EmployeesService.getById(
            req.app.get('db'),
            req.params.id
        );

        if (!employee)
            return res.status(404).json({
                error: `This employee does not exist.`
            });

        res.employee = employee;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = employeesRouter;