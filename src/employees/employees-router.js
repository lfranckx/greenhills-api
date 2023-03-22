const express = require('express');
const jsonParser = express.json();
const employeesRouter = express.Router();
const EmployeesService = require('./employees-service');
const path = require('path');

employeesRouter 
    .route('/')
    .get((req, res, next) => {
        EmployeesService.getAllEmployees(req.app.get('db'))
        .then(employees => {
            res.json();
        })
        .catch(next);
    })
    .post('/', jsonParser, (req, res, next) => {
        const { name, location_id, password } = req.body;
        const newEmployee = {
            name: name,
            location_id: location_id
        }

        
    });

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
