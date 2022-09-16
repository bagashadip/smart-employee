const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Kegiatan } = require("../../models/model");

const Op = Sequelize.Op;

module.exports = {
    // List
    list: async (req, res) => {
        const mKegiatan = await Kegiatan.findAll({
            //"desc_kegiatan",
            attributes: ["id_kegiatan", "foto_kegiatan",  "nama_kegiatan", "tanggal_kegiatan", "kode_pegawai"],
        });
        res.json(mKegiatan);
    },
    validate: (type) => {
        return type
    }
};