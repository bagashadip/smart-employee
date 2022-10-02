const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

var expressions = require("angular-expressions");
var assign = require("lodash/assign");

var bodyParser = require('body-parser');

const { Lapbul} = require("../../models/model");

module.exports = {
    
    // Get all
    list: async (req, res) => {
        const mLapbul = await Lapbul.findAll();
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
            message: "Lapbul " + mKegiatan.periode + " berhasil ditambah."
        });
    },

    generate: async (req, res) => {

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