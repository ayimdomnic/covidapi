const error = require('./globalError');

const notFound = 'Nothing found!!';
async function utilCreate(req, res, Entity, Params = {}) {
    return Entity.create(Params)
        .then((entity) => {
            return res.status(201).json({ data: entity });
        })
        .catch((err) => {
            console.log(err);
            res.status(422).json(error);
        });
}
async function utilGetOne(req, res, Entity, id) {
    await Entity.findOne({
        where: {
            id,
        },
    })
        .then((entity) => {
            if (!entity) {
                res.status(404).json(notFound);
            } else {
                console.log(`retrived : ${JSON.stringify(entity, null, 2)}`);
                res.status(200).json(entity);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(422).json(error);
        });
}

async function utilGetAll(req, res, Entity) {
    // pagination
    let limit;
    let offset;
    if (req.query.count) {
        limit = req.query.count;
    }
    // This might be rendered useless
    // Leave it till refactoring and proper testing
    else if (req.query.count === null) {
        limit = 15;
    } else {
        limit = null;
    }

    if (req.query.page) {
        offset = 0 + (req.query.page - 1) * limit;
    } else {
        offset = 0;
    }

    return Entity.findAndCountAll({
        offset,
        limit,
        // order:
    })
        .then((entity) => {
            if (!entity) {
                res.status(404).json(notFound);
            }
            res.status(200).json({
                total: entity.count,
                per_page: parseInt(limit, 10),
                current_page: parseInt(req.query.page, 10),
                last_page: entity.count / parseInt(limit, 10),
                prev_page: parseInt(req.query.page, 10) - 1,
                next_page: parseInt(req.query.page, 10) + 1,
                from: parseInt(offset, 10) + 1,
                to: parseInt(req.query.page, 10) * limit,
                data: entity.rows,
            });
        })
        .catch((err) => {
            // we shall type print out errors to the console log.
            // for production
            console.log(err);
            res.status(422).json({
                message: error,
            });
        });
}

async function utilUpdate(req, res, Entity, Params = {}, id) {
    Entity.findOne({ where: { id } }).then((entity) => {
        if (!entity) {
            res.status(404).json(notFound);
        }
        console.log(`retrived : ${JSON.stringify(entity, null, 2)}`);
        Entity.update(Params, { where: { id }, returning: true, plain: true })
            .then((updatedEntity) => {
                res.status(200).json(updatedEntity);
            })
            .catch((err) => {
                res.status(422).json(error);
                console.log(err);
            });
    });
}

async function utilDelete(req, res, Entity, id) {
    Entity.findOne({ where: { id } }).then((entity) => {
        if (!entity) {
            res.status(404).json(notFound);
        }
        Entity.destroy({ where: { id }, returning: true, plain: true })
            .then(() => {
                res.status(200).json(`Successfully deleted the item with the id  ${id}`);
            })
            .catch((err) => {
                res.status(422).json(error);
                console.log(err);
            });
    });
}
module.exports = { utilGetAll, utilCreate, utilGetOne, utilUpdate, utilDelete };
