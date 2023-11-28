const _module = "event";
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Event, Pegawai, Notifikasi } = require("../../models/model");


module.exports = {
    generate: async function () {

        const mEvent = await Event.findAll({
            where: {
                status_event: "PUBLIC",
                is_push_event: true,
                push_date_event: {
                    [Op.lte]: moment(),
                },
            },
        });

        const mEventIndividu = mEvent.filter((item) => {
            return item.kategori_event == "INDIVIDU";
        });

        if (mEventIndividu) {

            Promise.all(mEventIndividu.map(async (event) => {
                const update = await Event.update(
                    {
                        is_push_event: false,
                        updated_at: moment(),
                    },
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

                const tanggal_event = moment(event.tanggal_event).format("YYYY MMM DD") + " " + event.jammulai_event;
                const remider_notif1 = "Ada undangan buat kamu ✉ \nYuk datang ke " + event.nama_event + " pada " + tanggal_event + ". Tiada kesan tanpa kehadiranmu. ❤";
                const remider_notif2 = " It's The Day! \nJangan lupa hadir ke " + event.nama_event + ". See you there!";
                const remider_date1 = event.push_date_event;
                const remider_date2 = moment(tanggal_event);

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        reminder_title1_notifikasi: remider_notif1,
                        reminder_title2_notifikasi: remider_notif2,
                        reminder_date1_notifikasi: remider_date1,
                        reminder_date2_notifikasi: remider_date2,
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
                    {
                        is_push_event: false,
                        updated_at: moment(),
                    },
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

                const tanggal_event = moment(event.tanggal_event).format("YYYY MMM DD") + " " + event.jammulai_event;
                const remider_notif1 = "Ada undangan buat kamu ✉ \nYuk datang ke " + event.nama_event + " pada " + tanggal_event + ". Tiada kesan tanpa kehadiranmu. ❤";
                const remider_notif2 = " It's The Day! \nJangan lupa hadir ke " + event.nama_event + ". See you there!";
                const remider_date1 = event.push_date_event;
                const remider_date2 = moment(tanggal_event);

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        reminder_title1_notifikasi: remider_notif1,
                        reminder_title2_notifikasi: remider_notif2,
                        reminder_date1_notifikasi: remider_date1,
                        reminder_date2_notifikasi: remider_date2,
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
                    {
                        is_push_event: false,
                        updated_at: moment(),
                    },
                    { where: { id_event: event.id_event } }
                );

                const mPegawai = await Pegawai.findAll({
                    where: {
                        statusaktif_pegawai: "Aktif",
                    },
                    attributes: ["onesignal_id", "kode_pegawai", "namalengkap_pegawai"],
                });

                const tanggal_event = moment(event.tanggal_event).format("YYYY MMM DD") + " " + event.jammulai_event;
                const remider_notif1 = "Ada undangan buat kamu ✉ \nYuk datang ke " + event.nama_event + " pada " + tanggal_event + ". Tiada kesan tanpa kehadiranmu. ❤";
                const remider_notif2 = " It's The Day! \nJangan lupa hadir ke " + event.nama_event + ". See you there!";
                const remider_date1 = event.push_date_event;
                const remider_date2 = moment(tanggal_event);

                mPegawai.map(async (pegawai) => {
                    const mNotifikasi = await Notifikasi.create({
                        id_notifikasi: uuidv4(),
                        reminder_title1_notifikasi: remider_notif1,
                        reminder_title2_notifikasi: remider_notif2,
                        reminder_date1_notifikasi: remider_date1,
                        reminder_date2_notifikasi: remider_date2,
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
        }

        const mNotifikasi = await Notifikasi.findAll({
            limit: 100,
            where: {
                [Op.or]: [
                    {
                        reminder_date1_notifikasi: {
                            [Op.lte]: moment(),
                        },
                    },
                    {
                        reminder_date2_notifikasi: {
                            [Op.lte]: moment(),
                        },
                    }
                ],
            },
            order: [
                ['updatedAt', 'ASC'],
            ],

        });

        console.log(mNotifikasi)

        if (mNotifikasi) {

            Promise.all(mNotifikasi.map(async (notif) => {
                const onesignal_id = notif.onesignal_id_notifikasi;

                var include_subscription_ids = [];
                include_subscription_ids.push(onesignal_id);

                const _body = {
                    app_id: app_id,
                    include_subscription_ids: include_subscription_ids,
                    data: notif.data_notifikasi,
                    contents: {
                        en: notif.reminder_date1_notifikasi ? notif.reminder_title1_notifikasi : notif.reminder_title2_notifikasi,
                    },
                }

                console.log(_body);

                const requets = await axios({
                    method: 'post',
                    url: url,
                    data: _body,
                    headers: _headers
                }).then(async (res) => {
                    // console.log(res.status);
                    if (res.status == 200) {

                        if (notif.reminder_date1_notifikasi) {
                            const update = await Notifikasi.update({
                                send_date_notifikasi: moment(),
                                reminder_date1_notifikasi: null,
                                updatedAt: moment(),
                            }, {
                                where: {
                                    id_notifikasi: notif.id_notifikasi,
                                }
                            });
                        } else {
                            const update = await Notifikasi.update({
                                reminder_date2_notifikasi: null,
                                updatedAt: moment(),
                            }, {
                                where: {
                                    id_notifikasi: notif.id_notifikasi,
                                }
                            });
                        }
                    }
                }).catch((err) => {
                    // console.log(err);
                    console.log('error ')
                }).finally(async () => {
                    console.log("finally");

                    const update = await Notifikasi.update({
                        updatedAt: moment(),
                        onesignal_id_notifikasi: onesignal_id,
                    }, {
                        where: {
                            id_notifikasi: notif.id_notifikasi,
                        }
                    });

                });
            }));
        }
    }
}