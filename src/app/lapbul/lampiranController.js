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

var html_to_pdf = require('html-pdf-node');

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

        //res.json(returnLampiran);

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            font: '12px',
            footer: {
                height: "28mm",
                contents: {
                    
                    2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                   
                }
            }
        };

        let dateMoment = moment();
        let periodeBulan = dateMoment.format('DDMMYYHHmmss');

        var document = {
        html: html,
        data: {
            users: returnLampiran,
        },
        path: "../public/uploads/lampiran-"+req.query.kode_pegawai+"-"+periodeBulan+".pdf",
        type: "",
        };

        pdf
        .create(document, options)
        .then((res) => {
            console.log(res);
            //res.json(returnLampiran);
        })
        .catch((error) => {
            console.error(error);
        });

    },

    generateNew:  async (req, res) => {

        let options = { format: 'A4' };
        // Example of options with args //
        // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

        let fileThis = { content: "<h1>Welcome to html-pdf-node</h1>" };
        
        html_to_pdf.generatePdf(fileThis, options).then(pdfBuffer => {
            console.log("PDF Buffer:-", pdfBuffer);

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=name.Pdf')
            res.setHeader('Content-Length', pdfBuffer.length)
            return res.end(pdfBuffer)
            //return res.send(pdfBuffer);
        });

    },

}