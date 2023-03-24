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
    .post(jsonParser, (req, res, next) => {
        const { name, location_id, score, password } = req.body;
        console.log('.post route / req body...', req.body);

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
                
                console.log('inserting newEmployee...', newEmployee);
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
        console.log('req params...', req.params);
        const { location_id } = req.params;
        EmployeesService.getAllEmployeesByLocation(req.app.get('db'), location_id)
        .then(employees => {
            console.log('Sending Employees to Serialize...', employees);
            res.json(EmployeesService.serializeEmployees(employees));
        })
        .catch(next);
    })

// requests for specific employee
employeesRouter
    .route('/:id')
    .all(checkEmployeeExists)
    .get(requireAuth, jsonParser, (req, res, next) => {
        const { id } = req.params;
        EmployeesService.getById(req.app.get('db'), id)
            .then(employee => {
                if (!employee) {
                    return res.status(404).json({
                        error: { message: 'Employee not found' }
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

                const employeeToUpdate = { id, order_number, name, score, location_id };
                const numOfValues = Object.values(employeeToUpdate).filter(Boolean).length;
                if (numOfValues === 0)
                    return (res.status(400).json({
                        error: {
                            message: `Request body must contain id, order_number, name, score, or location_id`
                        }
                    }));
        
                console.log('Updating Employee by ID...', id);
                console.log('employeeToUpdate data...', employeeToUpdate);
        
                EmployeesService.updateEmployee(
                    req.app.get('db'),
                    id,
                    employeeToUpdate
                )
                .then(numRowsAffected => {
                    res.json(numRowsAffected).status(204).end();
                })
                .catch(next);
            });
        })
        .catch(next)
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
    console.log('checkLocationExists req.params...', req.params);
    try {
        const location = await EmployeesService.getAllEmployeesByLocation(
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
    console.log('checekEmployeeExists req.params...', req.params);
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