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
            res.json(EmployeesService.serializeEmployees(employees));
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
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
            if (!dbUser)
                return res.status(400).json({
                    message: 'Username not found'
                });
            return AuthService.comparePasswords(password, dbUser.manager_password)
            .then(compareMatch => {
                if (!compareMatch)
                    return res.status(400).json({
                        message: 'Incorrect password',
                    });
                    
                for (const [key, value] of Object.entries(newEmployee))
                    if (value === null)
                        return res.status(400).json({
                            message: `Missing ${key} in request body`
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
    .get(requireAuth, (req, res, next) => {
        const { location_id } = req.params;
        EmployeesService.getAllEmployeesByLocation(req.app.get('db'), location_id)
        .then(employees => {
            res.json(EmployeesService.serializeEmployees(employees));
        })
        .catch(next);
    });

// requests for employee by id
employeesRouter
    .route('/:id')
    .all(checkEmployeeExists)
    .get(requireAuth, jsonParser, (req, res, next) => {
        const { id } = req.params;
        EmployeesService.getById(req.app.get('db'), id)
            .then(employee => {
                if (!employee) {
                    return res.status(404).json({
                        message: 'Employee was not found'
                    });
                }
                res.json(EmployeesService.serializeEmployee(employee));
            })
            .catch(next);
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { id, order_number, name, score, location_id, password } = req.body;
        AuthService.getUserWithUsername(
            req.app.get('db'),
            req.user.username
        )
        .then(dbUser => {
            if (!dbUser)
                return res.status(400).json({
                    message: 'Username not found'
                });
            
            return AuthService.comparePasswords(password, dbUser.manager_password)
            .then(compareMatch => {
                if (!compareMatch)
                    return res.status(400).json({
                        message: 'Incorrect password',
                    });

                const employeeToUpdate = { id, order_number, name, score, location_id };
                const numOfValues = Object.values(employeeToUpdate).filter(Boolean).length;
                if (numOfValues === 0)
                    return (res.status(400).json({
                        message: `Request body must contain id, order_number, name, score, or location_id`
                    }));
        
                EmployeesService.updateEmployee(
                    req.app.get('db'),
                    id,
                    employeeToUpdate
                )
                .then(updatedEmployee => {
                    res.json(updatedEmployee).status(200);
                })
                .catch(next);
            });
        })
        .catch(next)
    })
    .delete(requireAuth, jsonParser, (req, res, next) => {
        EmployeesService.deleteEmployee(
            req.app.get('db'),
            req.params.id
        )
        .then(numRowsAffected => {
            res.json(numRowsAffected).status(204).end();
        })
        .catch(next);
    });

async function checkLocationExists(req, res, next) {
    try {
        const location = await EmployeesService.getAllEmployeesByLocation(
            req.app.get('db'),
            req.params.location_id
        );

        if (!location)
            return res.status(404).json({
                message: `This location does not exist.`
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
                message: `This employee does not exist.`
            });

        res.employee = employee;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = employeesRouter;