const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
var moment = require('moment'); // require
moment.locale('id');
const datatable = require("../../util/datatable");

const fs = require("fs");
const path = require("path");

var expressions = require("angular-expressions");
const { body, query, validationResult } = require("express-validator");
var assign = require("lodash/assign");

var bodyParser = require('body-parser');

const { Lapbul, Kegiatan, LiburNasional, Pegawai, Divisi, File} = require("../../models/model");
const { unset } = require("lodash");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let ttdKegiatanStart,ttdKegiatanEnd

module.exports = {
    
    // Get all
    list: async (req, res) => {

        let params = {where : {}}
        let mLapbul
        if(req.query.kode_pegawai!=undefined)
        {
            params.where.kode_pegawai = req.query.kode_pegawai;
        }
        if(req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined)
        {
            params.where.lapbul_periode = {
                [Op.gte]: req.query.tanggal_mulai,
                [Op.lte]: req.query.tanggal_selesai
            }
        }

        if(req.query.kode_pegawai!=undefined || (req.query.tanggal_mulai!=undefined && req.query.tanggal_selesai!=undefined))
        {
            mLapbul = await Lapbul.findAll(params);
        }
        else
        {
            mLapbul = await Lapbul.findAll({
                order: [
                    ['id_lapbul','DESC']
                ]
            });
        }

        res.json(mLapbul);
    },

    get_by_id: async (req, res) => {
        mLapbul = await Lapbul.findOne({
            where: {
                id_lapbul: req.params.id_lapbul
            }
        });
        res.json(mLapbul);
    },

    //Add new kegiatan
    create: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLapbul = await new Lapbul({
            ...req.body,
        }).save();

        res.json({
            status: true,
            statusCode: 200,
            message: "Lapbul " + mLapbul.lapbul_periode + " berhasil ditambah."
        });
    },

    update: async (req, res) => {
       const validation = validationResult(req);
        if (!validation.isEmpty()) {
          return error(res).validationError(validation.array());
        }
    
        await Lapbul.update(
          { ...req.body },
          { where: { id_lapbul: req.query.id_lapbul } }
        );
    
        res.json({
          status: true,
          statusCode: 200,
          message: "Lapbul " + req.query.id_lapbul + " berhasil diubah.",
        });
      },

      //Delete
    delete: async (req, res) => {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        await Lapbul.destroy({
            where: {
                id_lapbul: req.query.id_lapbul,
            },
        });
        res.send({
            status: true,
            message: req.query.id_lapbul + " berhasil dihapus.",
        });
    },

    // Datatable
    data: async (req, res) => {
        // if (!(await req.user.hasAccess(_module, "view"))) {
        //   return error(res).permissionError();
        // }

        var dataTableObj = await datatable(req.body);
        var count = await Lapbul.count();
        /**
         * where : {
                kode_pegawai : req.query.kode_pegawai
            },
         */
        var modules = await Lapbul.findAndCountAll({
            ...dataTableObj,
            include : [
                {
                    model : Pegawai,
                    as : "pegawai"
                }   
            ]
        });

        res.json({
        recordsFiltered: modules.count,
        recordsTotal: count,
        items: modules.rows,
        });
    },

    generate: async (req, res) => {

        //Get from database
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return error(res).validationError(validation.array());
        }

        const mLapbul = await Lapbul.findOne({
            raw: true,
            include: [
                {
                  model: Divisi,
                  as: "divisi",
                  attributes: ["template_lapbul"],
                }
            ],
            where: {
                id_lapbul: req.query.id_lapbul
            }
        });

        console.log(mLapbul)

        // define your filter functions here, for example
        // to be able to write {clientname | lower}
        expressions.filters.lower = function (input) {
            // Make sure that if your input is undefined, your
            // output will be undefined as well and will not
            // throw an error
            if (!input) return input;
            return input.toLowerCase();
        };

        //Get lapbul template
        let templateFile = 'template-smart-employee.docx';

        if(mLapbul['divisi.template_lapbul']!=null)
        {
            //Get file
            const mFile = await File.findOne({
                where: {
                    id: mLapbul['divisi.template_lapbul']
                }
            });

            if(mFile)
            {
                templateFile = '../../../public/uploads'+mFile.path;
            }
        }

        // Load the docx file as binary content
        const content = fs.readFileSync(
            path.resolve(__dirname, templateFile),
            "binary"
        );

        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: angularParser
        });

        //Jsonify nomor_halaman
        let halamanJson="";
        if(mLapbul.nomor_halaman !="" && mLapbul.nomor_halaman!=undefined){
            halamanJson=JSON.parse(mLapbul.nomor_halaman)
            mLapbul.nomor_halaman=halamanJson
        }

        let uraianPelaksanaan="";
        if(mLapbul.uraian_pelaksanaan !="" && mLapbul.uraian_pelaksanaan!=undefined){
            uraianPelaksanaan=JSON.parse(mLapbul.uraian_pelaksanaan)
            mLapbul.uraian_pelaksanaan=uraianPelaksanaan
        }

        //Jsonify kak
        let kakJson="";
        if(mLapbul.kak !="" && mLapbul.kak!=undefined){
            kakJson=JSON.parse(mLapbul.kak)
            mLapbul.kak=kakJson
        }

        let dateMoment = moment(mLapbul.lapbul_periode);
        let periodeBulan = dateMoment.format('MMMM');
        let periodeTahun = dateMoment.format('Y');

        if(periodeBulan || periodeTahun)
        {
            mLapbul.meta={};
        }

        if(periodeBulan)
        {
            mLapbul.meta.bulan=periodeBulan;
        }

        if(periodeTahun)
        {
            mLapbul.meta.tahun=periodeTahun;
        }

        let ttdDateSource = moment(mLapbul.tanggal_ttd);
        ttdDate = ttdDateSource.format('DD MMMM Y');
        if(ttdDate)
        {
            mLapbul.meta.tanggal_ttd=ttdDate;
        }

        //Get kegiatan
        if(mLapbul)
        {
            ttdKegiatanStart    = ttdDateSource.format('YYYY-MM')+'-'+'01';
            ttdKegiatanEnd      = ttdDateSource.format('YYYY-MM')+'-'+'30';

            const mKegiatan = await Kegiatan.findAll({
                raw: true,
                where: {
                    kode_pegawai: mLapbul.kode_pegawai,
                    tanggal_kegiatan: {
                        [Op.gte]: ttdKegiatanStart,
                        [Op.lte]: ttdKegiatanEnd
                    }
                },
                order: [
                    ['tanggal_kegiatan', 'ASC'],
                ]
            });

            const mLiburNasional = await LiburNasional.findAll({
                raw: true,
                where: {
                    tanggal: {
                        [Op.gte]: ttdKegiatanStart,
                        [Op.lte]: ttdKegiatanEnd
                    }
                },
                order: [
                    ['tanggal', 'ASC'],
                ]
            });

            if(mKegiatan)
            {
                let groupedKeg = groupKegByDate(mKegiatan,ttdKegiatanStart,ttdDateSource,mLiburNasional)
                mLapbul.kegiatan=groupedKeg;
            }
        }

        // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        doc.render(mLapbul);

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });

        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        //fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

        res.writeHead(200, {
            'Content-Type': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'Content-disposition': 'attachment;filename=' + "lapbul-generated.docx",
            'Content-Length': buf.length
        });
        res.end(buf);

    },

    poc: async (req, res) => {

        // define your filter functions here, for example
        // to be able to write {clientname | lower}
        expressions.filters.lower = function (input) {
            // Make sure that if your input is undefined, your
            // output will be undefined as well and will not
            // throw an error
            if (!input) return input;
            return input.toLowerCase();
        };

        // Load the docx file as binary content
        const content = fs.readFileSync(
            path.resolve(__dirname, "template-smart-employee.docx"),
            "binary"
        );

        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: angularParser
        });

        // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        doc.render(req.body);

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });

        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        //fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

        res.writeHead(200, {
            'Content-Type': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'Content-disposition': 'attachment;filename=' + "output.docx",
            'Content-Length': buf.length
        });
        res.end(buf);

    }
}

function angularParser(tag) {
    tag = tag
        .replace(/^\.$/, "this")
        .replace(/(’|‘)/g, "'")
        .replace(/(“|”)/g, '"');
    const expr = expressions.compile(tag);
    return {
        get: function (scope, context) {
            let obj = {};
            const scopeList = context.scopeList;
            const num = context.num;
            for (let i = 0, len = num + 1; i < len; i++) {
                obj = assign(obj, scopeList[i]);
            }
            return expr(scope, obj);
        },
    };
}

function groupKegByDate(data,ttdKegiatanStart,ttdDateSource,liburNasional)
{
    let byDate=[];
    let byDateObj=[]
    let byDateSorting=[]
    data.forEach(element => {
        //byDate[element.tanggal_kegiatan]=[];
        byDateSorting.push(element.tanggal_kegiatan);
    });

    liburNasional.forEach(element => {
        //byDate[element.tanggal_kegiatan]=[];
        let thisTanggal = moment(element.tanggal).format('YYYY-MM-DD');
        byDateSorting.push(thisTanggal);
    });

    let ttdMonth = ttdDateSource.format('MM');
    let firstWeekSat,firstWeekSun,thisMonth,weekEndList=[];

    for(i=0;i<5;i++){
        let addWeek=moment(ttdKegiatanStart).add(i,'week')
        thisMonth = addWeek.weekday(6).format('MM')
        if(thisMonth==ttdMonth)
        {
            firstWeekSat = addWeek.weekday(6).format('YYYY-MM-DD')
            firstWeekSun = addWeek.weekday(7).format('YYYY-MM-DD')
            //byDate[firstWeekSat]=[]
            byDateSorting.push(firstWeekSat);

            //byDate[firstWeekSun]=[]
            byDateSorting.push(firstWeekSun);
        }
    }

    byDateSorting.sort()
    byDateSorting =  Array.from(new Set(byDateSorting));

    byDateSorting.forEach(element => {
        byDate[element]=[]
    })
    
    data.forEach(element => {

        let formatTimeStart
        if(element.waktu_kegiatan_mulai)
        {
            formatTimeStart = moment(element.tanggal_kegiatan+' '+element.waktu_kegiatan_mulai).format('HH:mm');
        }
        else
        {
            formatTimeStart = '00:00'
        }

        let formatTimeEnd
        if(element.waktu_kegiatan_selesai)
        {
            formatTimeEnd = moment(element.tanggal_kegiatan+' '+element.waktu_kegiatan_selesai).format('HH:mm');
        }
        else
        {
            formatTimeEnd = '00:00'
        }


        let thisTanggal='('+formatTimeStart+' - '+formatTimeEnd+')\n'
        byDate[element.tanggal_kegiatan].push({
            tanggal: element.tanggal_kegiatan,
            description:thisTanggal+element.desc_kegiatan
        });
    });

    for(i=0;i<5;i++){
        let addWeek=moment(ttdKegiatanStart).add(i,'week')
        thisMonth = addWeek.weekday(6).format('MM')
        if(thisMonth==ttdMonth)
        {
            firstWeekSat = addWeek.weekday(6).format('YYYY-MM-DD')
            firstWeekSun = addWeek.weekday(7).format('YYYY-MM-DD')
            byDate[firstWeekSat]=[{
                tanggal : firstWeekSat,
                description : 'Libur'
            }]

            byDate[firstWeekSun]=[{
                tanggal : firstWeekSun,
                description : 'Libur'
            }]
        }
    }

    liburNasional.forEach(element => {
        //byDate[element.tanggal_kegiatan]=[];
        let thisTanggal = moment(element.tanggal).format('YYYY-MM-DD');
        
        if(!byDate[thisTanggal].length)
        {
            byDate[thisTanggal]=[{
                tanggal : thisTanggal,
                description : 'Libur'
            }];
        }
    });

    let theIndex=0
    let theIndexLampiran=0
    for(let xThis in byDate)
    {

        let indexSub=0
        let thisDesc="";
        for(let xThisSub in byDate[xThis])
        {
            thisDesc+=""+byDate[xThis][xThisSub].description+"\n\n";
            indexSub++;            
        }

        let dateMoment = moment(xThis);
        let periodeBulan = dateMoment.format('DD-MM-YYYY');

        let thisLampiran=""
        
        if(thisDesc!="Libur\n\n")
        {
            thisLampiran="Lampiran "+(theIndexLampiran+1)
            theIndexLampiran++;
        }

        byDateObj[theIndex] = {
            tanggal: periodeBulan,
            description: thisDesc,
            lampiran_number: thisLampiran
        }

        theIndex++
    }

    return byDateObj;
}