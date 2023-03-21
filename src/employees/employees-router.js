const express = require('express');
const jsonParser = express.json();
const employeesRouter = express.Router();
const EmployeesService = require('./employees-service');
const path = require('path');

employeesRouter 
    .post('/', jsonParser, (req, res, next) => {
        const { name, location_id, password } = req.body;
        const newEmployee = {
            name: name,
            location_id: location_id
        }

        
    })
