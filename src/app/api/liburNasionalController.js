const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { LiburNasional } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
    // Get all
    list: async (req, res) => {
        const mLiburNasional = await LiburNasional.findAll({
            attributes: ["id_liburnasional", "tahun", "tanggal",  "nama_liburnasional"],
        });
        res.json(mLiburNasional);
    },

    // Datatable
    data: async (req, res) => {
        // if (!(await req.user.hasAccess(_module, "view"))) {
        //   return error(res).permissionError();
        // }

        var dataTableObj = await datatable(req.body);
        var count = await LiburNasional.count();
        var modules = await LiburNasional.findAndCountAll({
            ...dataTableObj,
        });

        res.json({
        recordsFiltered: modules.count,
        recordsTotal: count,
        items: modules.rows,
        });
    },

    //Get by kode pegawai and date
    get: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLiburNasional = await LiburNasional.findAll({
            where: {
                id_liburnasional: req.query.id_liburnasional
            }
        });
        res.json(mLiburNasional);
    },

    //Add new kegiatan
    create: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLiburNasional = await new LiburNasional({
            ...req.body,
        }).save();

        res.json({
            status: true,
            statusCode: 200,
            message: "Libur nasional " + mLiburNasional.nama_liburnasional + " berhasil ditambah."
        });
    },

    //Update kegiatan
    update: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await LiburNasional.update(
            { ...req.body },
            { where: { id_liburnasional: req.query.id_liburnasional } }
        );

        res.json({
            status: true,
            statusCode: 200,
            message: "Libur nasional " + req.query.id_liburnasional + " berhasil diubah.",
        });
    },

    //Delete
    delete: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await LiburNasional.destroy({
            where: {
                id_liburnasional: req.query.id_liburnasional,
            },
        });
        res.send({
            status: true,
            message: req.query.id_liburnasional + " berhasil dihapus.",
        });
    },

    //Validate
    validate: (type) => {
        return type
    }
};