const _module = "event";
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Event, Pegawai } = require("../../models/model");

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

        const mEventAll = mEvent.filter((item) => {
            return item.kategori_event == "ALL";
        });

        if (mEventAll) {
            Promise.all(mEventAll.map(async (item) => {

                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: item.id_event } }
                );

                if (update) {
                    const mPegawai = await Pegawai.findAll({
                        where: {
                            status_pegawai: "Aktif",
                        },
                    });
                }

            }));
        }

        const mEventDivisi = mEvent.filter((item) => {
            return item.kategori_event == "DIVISI";
        });

        if (mEventDivisi) {

            Promise.all(mEventDivisi.map(async (item) => {
                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: item.id_event } }
                );

                if (update) {
                    const listDivisi = item.recipient_event.split(",");

                    const mPegawai = await Pegawai.findAll({
                        where: {
                            status_pegawai: "Aktif",
                            kode_divisi: {
                                [Op.in]: listDivisi,
                            },
                        },
                    });
                }

            }));
        }


        const mEventIndividu = mEvent.filter((item) => {
            return item.kategori_event == "INDIVIDU";
        });

        if (mEventIndividu) {
            Promise.all(mEventIndividu.map(async (item) => {

                const update = await Event.update(
                    { is_push_event: false },
                    { where: { id_event: item.id_event } }
                );

                if (update) {
                    const listPegawai = item.recipient_event.split(",");
                    const mPegawai = await Pegawai.findAll({
                        where: {
                            status_pegawai: "Aktif",
                            kode_pegawai: {
                                [Op.in]: listPegawai,
                            },
                        },
                    });
                }
            }));
        }
    },
    push: async function () {
        const url = "https://onesignal.com/api/v1/notifications";
        const app_id = 'c91e6f62-6f33-4822-8a98-060ccf4b00e8';
        const _headers = {
            'Authorization': 'OWMyNzRmNWMtZDNhNi00YTM1LTgyYzItOTgxYmRiYmFlODU1',
            'Content-Type': 'application/json',
        }

        const _body = {
            app_id: app_id,
            included_segments: ["EVENT"],
            data: {
                foo: "bar",
            },
            contents: {
                en: "English Message",
            },
        }

        const requets = await axios.post(url,
            {
                headers: _headers
            },
            _body
        ).catch((err) => {
            console.log(err);
        });

    }
}