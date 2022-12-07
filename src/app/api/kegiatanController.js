const _ = require("lodash");
const { body, query, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const error = require("../../util/errors");
const datatable = require("../../util/datatable");
const { Kegiatan, Absensi, Pegawai, File, Divisi, Asn} = require("../../models/model");
const uuid = require("uuid");

const Op = Sequelize.Op;

module.exports = {
    // Get all
    list: async (req, res) => {
        const mKegiatan = await Kegiatan.findAll({
            attributes: ["id_kegiatan", "foto_kegiatan", "desc_kegiatan",  "nama_kegiatan", "tanggal_kegiatan", "kode_pegawai","waktu_kegiatan_mulai","waktu_kegiatan_selesai"],
        });
        res.json(mKegiatan);
    },

    //Get by kode pegawai and date
    get: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatan = await Kegiatan.findAll({
            where: {
                kode_pegawai: req.query.kode_pegawai,
                tanggal_kegiatan: {
                    [Op.gte]: req.query.tanggal_mulai,
                    [Op.lte]: req.query.tanggal_selesai
                }
            },
            include: [
                {
                    model: File,
                    as: "foto",
                    attributes: ["name", "path", "extension", "size"],
                },
            ],
            order: [
                ['tanggal_kegiatan','DESC'],
                ['waktu_kegiatan_mulai','DESC']
            ]
        });
        res.json(mKegiatan);
    },

    detail: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatan = await Kegiatan.findOne({
            where: {
                id_kegiatan: req.query.id_kegiatan
            },
            include: [
                {
                    model: File,
                    as: "foto",
                    attributes: ["name", "path", "extension", "size"],
                },
            ],
        });
        res.json(mKegiatan);
    },

    //Add new kegiatan
    create: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mKegiatanGet = await Kegiatan.findOne({
            where: {
                tanggal_kegiatan: req.body.tanggal_kegiatan,
                kode_pegawai: req.body.kode_pegawai,
            }
        });

        let processInsert=false;

        if (!mKegiatanGet) {
            if(req.body.foto_kegiatan==undefined || req.body.foto_kegiatan==null || req.body.foto_kegiatan==""){
                processInsert=false;
            }else{
                processInsert=true;
            }
        } else {
            processInsert=true;
        }

        if(processInsert)
        {
            const id = uuid.v4();

            const mKegiatan = await new Kegiatan({
                ...req.body, id_kegiatan: id
            }).save();
    
            res.json({
                status: true,
                statusCode: 200,
                message: "Kegiatan " + mKegiatan.nama_kegiatan + " berhasil ditambah."
            });
        }
        else
        {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Foto kegiatan minimal 1 dalam satu hari",
            });
        }
        
    },

    //Update kegiatan
    update: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await Kegiatan.update(
            { ...req.body },
            { where: { id_kegiatan: req.query.id_kegiatan } }
        );

        res.json({
            status: true,
            statusCode: 200,
            message: "Kegiatan " + req.query.id_kegiatan + " berhasil diubah.",
        });
    },

    //Delete
    delete: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await Kegiatan.destroy({
            where: {
                id_kegiatan: req.query.id_kegiatan,
            },
        });
        res.send({
            status: true,
            message: req.query.id_kegiatan + " berhasil dihapus.",
        });
    },

    // Datatable
    data: async (req, res) => {
        // if (!(await req.user.hasAccess(_module, "view"))) {
        //   return error(res).permissionError();
        // }

        var dataTableObj = await datatable(req.body);
        var count = await Kegiatan.count();
        /**
         * where : {
                kode_pegawai : req.query.kode_pegawai
            },
         */
        var modules = await Kegiatan.findAndCountAll({
            ...dataTableObj,
            include : [
                {
                    model : File,
                    as: "foto",
                    attributes: ["name", "path", "extension", "size"],
                },
                {
                    model : Pegawai,
                    as: "pegawai"
                },
            ]
        });

        res.json({
            recordsFiltered: modules.count,
            recordsTotal: count,
            items: modules.rows,
        });
    },

    //Validate
    validate: (type) => {
        return type
    }
};