const _module = "event";
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Event, Pegawai, Notifikasi } = require("../../models/model");

module.exports = {
    generate: async function () {
        // console.log("masuk dalam cron");

        const mEvent = await Event.findAll({
            where: {
                status_event: "PUBLIC",
                is_push_event: true,
                push_date_event: {
                    [Op.lte]: moment().format("YYYY-MM-DD hh:mm:ss"),
                },
            },
        });

        Promise.all(mEvent.map(async (event) => {
            // const update = await Event.update(
            //     { is_push_event: false },
            //     { where: { id_event: item.id_event } }
            // );

            const mNotifikasi = await Notifikasi.create({
                id_notifikasi: uuidv4(),
                judul_notifikasi: event.judul_event ?? 'test',
                konten_notifikasi: event.konten_event ?? 'test',
                ikon_notifikasi: event.ikon_event ?? 'test',
                gambar_notifikasi: event.gambar_event ?? 'test',
                tipe_notifikasi: "EVENT-" + event.kategori_event,
                data_notifikasi: event ?? {},
                send_date_notifikasi: null,
                is_read_notifikasi: false,
                data_user_notifikasi: {},
                onesignal_id_notifikasi: 'test',
            });

        }));





        // if (mEventAll) {
        //     Promise.all(mEventAll.map(async (item) => {

        //         const update = await Event.update(
        //             { is_push_event: false },
        //             { where: { id_event: item.id_event } }
        //         );

        //         const mPegawai = await Pegawai.findAll({
        //             where: {
        //                 status_pegawai: "Aktif",
        //             },
        //             attributes: ["onesignal_id_pegawai", "kode_pegawai", "namalengkap_pegawai"],
        //         });

        //         mPegawai.map(async (pegawai) => {
        //             const mNotifikasi = await Notifikasi.create({
        //                 id_notifikasi: uuidv4(),
        //                 judul_notifikasi: item.judul_event,
        //                 konten_notifikasi: item.konten_event,
        //                 ikon_notifikasi: item.ikon_event,
        //                 gambar_notifikasi: item.gambar_event,
        //                 tipe_notifikasi: "EVENT-" + item.kategori_event,
        //                 data_notifikasi: item,
        //                 send_date_notifikasi: null,
        //                 is_read_notifikasi: false,
        //                 data_user_notifikasi: pegawai,
        //                 onesignal_id_notifikasi: mPegawai.onesignal_id_notifikasi ?? null,
        //             });
        //             console.log(mNotifikasi);
        //         });

        //     }));
        // }

        // const mEventDivisi = mEvent.filter((item) => {
        //     return item.kategori_event == "DIVISI";
        // });

        // if (mEventDivisi) {

        //     Promise.all(mEventDivisi.map(async (item) => {
        //         const update = await Event.update(
        //             { is_push_event: false },
        //             { where: { id_event: item.id_event } }
        //         );

        //         if (update) {
        //             const listDivisi = item.recipient_event.split(",");

        //             const mPegawai = await Pegawai.findAll({
        //                 where: {
        //                     status_pegawai: "Aktif",
        //                     kode_divisi: {
        //                         [Op.in]: listDivisi,
        //                     },
        //                 },
        //             });

        //             mPegawai.map(async (pegawai) => {
        //                 const mNotifikasi = await Notifikasi.create({
        //                     id_notifikasi: uuidv4(),
        //                     judul_notifikasi: item.judul_event,
        //                     konten_notifikasi: item.konten_event,
        //                     ikon_notifikasi: item.ikon_event,
        //                     gambar_notifikasi: item.gambar_event,
        //                     tipe_notifikasi: "EVENT-" + item.kategori_event,
        //                     data_notifikasi: item,
        //                     send_date_notifikasi: null,
        //                     is_read_notifikasi: false,
        //                     data_user_notifikasi: pegawai,
        //                     onesignal_id_notifikasi: mPegawai.onesignal_id_notifikasi ?? null,
        //                 });
        //             });
        //         }

        //     }));
        // }

        // const mEventIndividu = mEvent.filter((item) => {
        //     return item.kategori_event == "INDIVIDU";
        // });

        // if (mEventIndividu) {
        //     Promise.all(mEventIndividu.map(async (item) => {

        //         const update = await Event.update(
        //             { is_push_event: false },
        //             { where: { id_event: item.id_event } }
        //         );

        //         if (update) {
        //             const listPegawai = item.recipient_event.split(",");
        //             const mPegawai = await Pegawai.findAll({
        //                 where: {
        //                     status_pegawai: "Aktif",
        //                     kode_pegawai: {
        //                         [Op.in]: listPegawai,
        //                     },
        //                 },
        //             });


        //             mPegawai.map(async (pegawai) => {
        //                 const mNotifikasi = await Notifikasi.create({
        //                     id_notifikasi: uuidv4(),
        //                     judul_notifikasi: item.judul_event,
        //                     konten_notifikasi: item.konten_event,
        //                     ikon_notifikasi: item.ikon_event,
        //                     gambar_notifikasi: item.gambar_event,
        //                     tipe_notifikasi: "EVENT-" + item.kategori_event,
        //                     data_notifikasi: item,
        //                     send_date_notifikasi: null,
        //                     is_read_notifikasi: false,
        //                     data_user_notifikasi: pegawai,
        //                     onesignal_id_notifikasi: mPegawai.onesignal_id_notifikasi ?? null,
        //                 });
        //             });
        //         }
        //     }));
        // }
    },
    send: async function () {
        const url = "https://onesignal.com/api/v1/notifications";
        const app_id = 'c91e6f62-6f33-4822-8a98-060ccf4b00e8';
        const _headers = {
            'Authorization': 'OWMyNzRmNWMtZDNhNi00YTM1LTgyYzItOTgxYmRiYmFlODU1',
            'Content-Type': 'application/json',
        }

        const mNotifikasi = await Notifikasi.findAll({
            limit: 5,
            where: {
                send_date_notifikasi: null,
                is_read_notifikasi: false,
            },
        });

        // if (mNotifikasi) {

        //     Promise.all(mNotifikasi.map(async (item) => {

        //         const _body = {
        //             app_id: app_id,
        //             included_segments: ["EVENT"],
        //             data: {
        //                 foo: "bar",
        //             },
        //             contents: {
        //                 en: "English Message",
        //             },
        //         }

        //         const requets = await axios.post(url,
        //             {
        //                 headers: _headers
        //             },
        //             _body
        //         ).catch((err) => {
        //             console.log(err);
        //         });

        //         if (requets) {
        //             const update = await Notifikasi.update({
        //                 send_date_notifikasi: moment().format("YYYY-MM-DD hh:mm:ss"),
        //             }, {
        //                 where: {
        //                     id_notifikasi: item.id_notifikasi,
        //                 }
        //             });
        //         }
        //     }));
        // }
    }
}