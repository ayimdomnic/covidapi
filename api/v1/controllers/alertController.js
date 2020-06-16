const Alert = require('../models/alertModel');
const {
    utilGetAll,
    utilCreate,
    utilGetOne,
    utilUpdate,
    utilDelete,
} = require('../helpers/utilService');

const AlertsController = {
    async create(req, res) {
        const { title, detail, time } = req.body;
        try {
            utilCreate(req, res, Alert, { title, detail, time });
        } catch (error) {
            res.status(422).json({
                error,
            });
        }
    },
    async getAll(req, res) {
        await utilGetAll(req, res, Alert);
    },
    async getOne(req, res) {
        const { id } = req.params;
        await utilGetOne(req, res, Alert, id);
    },
    async updateAlert(req, res) {
        const { title, detail } = req.body;
        const { id } = req.params;
        const values = { title, detail };
        try {
            utilUpdate(req, res, Alert, values, id);
        } catch (error) {
            res.status(422).json({
                error,
            });
        }
    },
    async deleteAlert(req, res) {
        const { id } = req.params;
        try {
            utilDelete(req, res, Alert, id);
        } catch (error) {
            res.status(422).json(error);
        }
    },
};
module.exports = AlertsController;
