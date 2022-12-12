var expressions = require("angular-expressions");
const { body, query, validationResult } = require("express-validator");
var assign = require("lodash/assign");
var bodyParser = require('body-parser');
const { Lapbul, Kegiatan, LiburNasional, Pegawai, Divisi, File} = require("../../models/model");
const { unset } = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var pdf = require("pdf-creator-node");
var fs = require("fs");
const path = require("path");

var moment = require('moment'); // require
moment.locale('id');

// Read HTML Template
var html = fs.readFileSync(path.resolve(__dirname, "template.html"), "utf8");

module.exports = {
    
    // Get all
    list: async (req, res) => {

        let params = {where : {}}
        let mLampiran
        if(req.query.kode_pegawai!=undefined)
        {
            params.where.kode_pegawai = req.query.kode_pegawai;
        }
        if(req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined)
        {
            params.where.tanggal_kegiatan = {
                [Op.gte]: req.query.tanggal_mulai,
                [Op.lte]: req.query.tanggal_selesai
            }
            params.where.foto_kegiatan = {
                [Op.not]: null
            }
            params.order = [
                ['tanggal_kegiatan','ASC']
            ]
            params.include = [
                {
                    model: File,
                    as: "foto",
                    attributes: ["name", "path", "extension", "size"],
                },
            ]
            params.raw = true
        }


        if(req.query.kode_pegawai!=undefined || (req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined))
        {
            mLampiran = await Kegiatan.findAll(params);
        }
        else
        {
            let paramThis = {
                order: [
                    ['tanggal_kegiatan','ASC']
                ],
                where: {
                    foto_kegiatan: {
                        [Op.not]: null, 
                    },
                },
                include: [
                    {
                        model: File,
                        as: "foto",
                        attributes: ["name", "path", "extension", "size"],
                    },
                ],
                raw: true
            }

            mLampiran = await Kegiatan.findAll(paramThis);
        }

        let byDate=[];
        let byDateIndex=[];
        let returnLampiran=[];

        mLampiran.forEach(element => {
            //byDate[element.tanggal_kegiatan]=[];
            byDate.push(element.tanggal_kegiatan);
        });

        byDate =  Array.from(new Set(byDate));

        byDate.forEach(element => {
            byDateIndex[element]=[]
        })

        mLampiran.forEach(element => {
            byDateIndex[element.tanggal_kegiatan].push(element)
        })

        for(let xThis in byDateIndex)
        {
            returnLampiran.push({
                tanggal_kegiatan: xThis,
                lampiran: byDateIndex[xThis]
            })
        }

        res.json(returnLampiran);
    },

    generate: async (req, res) => {

        let params = {where : {}}
        let mLampiran
        if(req.query.kode_pegawai!=undefined)
        {
            params.where.kode_pegawai = req.query.kode_pegawai;
        }
        if(req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined)
        {
            params.where.tanggal_kegiatan = {
                [Op.gte]: req.query.tanggal_mulai,
                [Op.lte]: req.query.tanggal_selesai
            }
            params.where.foto_kegiatan = {
                [Op.not]: null
            }
            params.order = [
                ['tanggal_kegiatan','ASC']
            ]
            params.include = [
                {
                    model: File,
                    as: "foto",
                    attributes: ["path"],
                },
            ]
            params.raw = true
        }


        if(req.query.kode_pegawai!=undefined || (req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined))
        {
            mLampiran = await Kegiatan.findAll(params);
        }
        else
        {
            let paramThis = {
                order: [
                    ['tanggal_kegiatan','ASC']
                ],
                where: {
                    foto_kegiatan: {
                        [Op.not]: null, 
                    },
                },
                include: [
                    {
                        model: File,
                        as: "foto",
                        attributes: ["path"],
                    },
                ],
                raw: true
            }

            mLampiran = await Kegiatan.findAll(paramThis);
        }

        let byDate=[];
        let byDateIndex=[];
        let returnLampiran=[];

        mLampiran.forEach(element => {
            //byDate[element.tanggal_kegiatan]=[];
            byDate.push(element.tanggal_kegiatan);
        });

        byDate =  Array.from(new Set(byDate));

        byDate.forEach(element => {
            byDateIndex[element]=[]
        })

        let thisUrl = req.protocol+"://"+req.headers.host;

        mLampiran.forEach(element => {
            let thisEl = element
            thisEl.foto_kegiatan_path = thisEl['foto.path']
            thisEl.base_url = thisUrl
            console.log(thisUrl+'/uploads'+thisEl['foto.path'])
            byDateIndex[element.tanggal_kegiatan].push(thisEl)
        })

        let i=0;
        for(let xThis in byDateIndex)
        {
            i+=1;
            returnLampiran.push({
                nomor : i,
                tanggal_kegiatan: xThis,
                lampiran: byDateIndex[xThis]
            })
        }

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "5mm",
            footer: {
                height: "10mm",
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                }
            }
        };

        let dateMoment = moment();
        let periodeBulan = dateMoment.format('DDMMYYHHmmss');
        const thePath="public/uploads/lampiran-"+req.query.kode_pegawai+"-"+periodeBulan+".pdf"
        var document = {
        html: html,
        data: {
            users: returnLampiran,
            thisUrl : thisUrl
        },
        path: thePath,
        type: "",
        };

        

        pdf
        .create(document, options)
        .then((response) => {
            var content = fs.readFileSync(thePath);

            //Save path to database

            //Download result
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename='+'lampiran-'+req.query.kode_pegawai+'-'+periodeBulan+'.pdf')
            res.setHeader('Content-Length', content.length)
            return res.end(content)
        })
        .catch((error) => {
            console.error(error);
        });

    }

}