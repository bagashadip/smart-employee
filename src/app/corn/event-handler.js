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

        const mEventIndividu = mEvent.filter((item) => {
            return item.kategori_event == "INDIVIDU";
        });

        if (mEventIndividu) {

            Promise.all(mEventIndividu.map(async (event) => {
                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: event.id_event } }
                );
                const listPegawai = event.recipient_event.split(",");

                const mPegawai = await Pegawai.findAll({
                    where: {
                        statusaktif_pegawai: "Aktif",
                        kode_pegawai: {
                            [Op.in]: listPegawai,
                        },
                    },
                });

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        judul_notifikasi: event.judul_event ?? '',
                        konten_notifikasi: event.konten_event ?? '',
                        ikon_notifikasi: event.ikon_event ?? '',
                        gambar_notifikasi: event.gambar_event ?? '',
                        tipe_notifikasi: "EVENT-" + event.kategori_event,
                        data_notifikasi: event ?? {},
                        send_date_notifikasi: null,
                        is_read_notifikasi: false,
                        data_user_notifikasi: pegawai,
                        onesignal_id_notifikasi: pegawai.onesignal_id,
                    });
                });
            }))
        }

        const mEventDivisi = mEvent.filter((item) => {
            return item.kategori_event == "DIVISI";
        });

        if (mEventDivisi) {
            Promise.all(mEventDivisi.map(async (event) => {

                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: event.id_event } }
                );

                const listDivisi = event.recipient_event.split(",");

                const mPegawai = await Pegawai.findAll({
                    where: {
                        statusaktif_pegawai: "Aktif",
                        kode_divisi: {
                            [Op.in]: listDivisi,
                        },
                    },
                });

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        judul_notifikasi: event.judul_event ?? '',
                        konten_notifikasi: event.konten_event ?? '',
                        ikon_notifikasi: event.ikon_event ?? '',
                        gambar_notifikasi: event.gambar_event ?? '',
                        tipe_notifikasi: "EVENT-" + event.kategori_event,
                        data_notifikasi: event ?? {},
                        send_date_notifikasi: null,
                        is_read_notifikasi: false,
                        data_user_notifikasi: pegawai,
                        onesignal_id_notifikasi: pegawai.onesignal_id,
                    });
                });

            }));
        }

        const mEventAll = mEvent.filter((item) => {
            return item.kategori_event == "ALL";
        });

        if (mEventAll) {
            Promise.all(mEventAll.map(async (event) => {

                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: event.id_event } }
                );

                const mPegawai = await Pegawai.findAll({
                    where: {
                        statusaktif_pegawai: "Aktif",
                    },
                    attributes: ["onesignal_id", "kode_pegawai", "namalengkap_pegawai"],
                });

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        judul_notifikasi: event.judul_event ?? '',
                        konten_notifikasi: event.konten_event ?? '',
                        ikon_notifikasi: event.ikon_event ?? '',
                        gambar_notifikasi: event.gambar_event ?? '',
                        tipe_notifikasi: "EVENT-" + event.kategori_event,
                        data_notifikasi: event ?? {},
                        send_date_notifikasi: null,
                        is_read_notifikasi: false,
                        data_user_notifikasi: pegawai,
                        onesignal_id_notifikasi: pegawai.onesignal_id,
                    });
                });

            }));

        }

    },
    send: async function () {
        const url = "https://onesignal.com/api/v1/notifications";
        const app_id = 'c91e6f62-6f33-4822-8a98-060ccf4b00e8';
        const _headers = {
            'Authorization': 'Basic OWMyNzRmNWMtZDNhNi00YTM1LTgyYzItOTgxYmRiYmFlODU1',
            'Content-Type': 'application/json',
            'Cookie': '__cf_bm=i12naEj7K4.YSGqnGS2RvjBSMAPewkGg.RGTR9XAKpw-1699959519-0-ARfQqawtuIjnNr0b0idqsfMT1kP7Fc6i2nzzIBQW7xOHBBwDnjPasa3elW1xdyG6wJSk1il8tU6S5ZAK4qRGP78='
        }

        const mNotifikasi = await Notifikasi.findAll({
            limit: 50,
            where: {
                send_date_notifikasi: null,
                is_read_notifikasi: false,
            },
        });

        if (mNotifikasi) {
            Promise.all(mNotifikasi.map(async (notif) => {

                const _body = {
                    app_id: app_id,
                    included_segments: ["Subscribed Users"],
                    data: notif.data_notifikasi,
                    contents: {
                        en: notif.konten_notifikasi,
                    },
                }


                const requets = await axios({
                    method: 'post',
                    url: url,
                    data: _body,
                    headers: _headers
                }).catch((err) => {
                    // console.log(err);

                });

                const update = await Notifikasi.update({
                    send_date_notifikasi: moment().format("YYYY-MM-DD hh:mm:ss"),
                }, {
                    where: {
                        id_notifikasi: notif.id_notifikasi,
                    }
                });
            }));
        }
    }
}