config_qrcode = {
  qrCodeData: `000201010212262400069704890110010010865652045912530370454{total_length}{totalv}5802VN5919Cong ty CP Traphaco6005HANOI62{additional_information_length}{sid_length}{sid}{storeID_length}{storeID}{expDate_referenceID_length}{expDate_referenceID}{terminalID_length}{terminalID}{note_length}{note}6304`,
  qrCodeDataFis: `0002010102122624000697042301100104128565520457345303{curr_code}54{total_length}{totalv}5802VN5935CONG TY TNHH HE THONG THONG TIN FPT6005HANOI62{additional_information_length}{storeID_length}{storeID}{terminalID_length}{terminalID}{note_length}{note}6304`//{terminalID_length}{terminalID}
}


// =====================================
// ====     Ham GEN qrcode            ==
// =====================================




    paymentQrcode: async (data) => {
        const taxc = data.uc.split(".")[0]
        let crc_check, additional_information_length, qrData, totalv, total_length, curr_code, referenceID, expDate, expDate_referenceID, expDate_referenceID_length
        let sid, sid_length, storeID_length, storeID, terminalID_length, terminalID, note, note_length
        if ((["0100108656", "0104128565-998"]).includes(taxc)) {
            qrData = config_qrcode.qrCodeData
            totalv = data.totalv
            total_length = String(totalv.toString().length).padStart(2, "0")
            sid = data.c3 == undefined ? data.c3 = '' : data.c3
            sid_length = sid.length == 0 ? '' : "01" + String(sid.length).padStart(2, "0")
            storeID = data.c1 == undefined ? data.c1 = '' : data.c1
            storeID_length = storeID.length == 0 ? '' : "03" + String(storeID.length).padStart(2, "0")
            referenceID = data.c3 == undefined ? '' : data.c3
            expDate = `01${moment(data.idt).add(1, 'years').format('YY')}12311200`  //5031121200
            terminalID = data.c2 == undefined ? data.c2 = '' : data.c2
            terminalID_length = terminalID.length == 0 ? '' : "07" + String(terminalID.length).padStart(2, "0")
            note = "tthd-" + Number(data.seq) + data.serial
            note_length = '08' + String(note.length).padStart(2, "0")
            //cong them 4 trong do 2 so là id 2 so la do dai
            //check khi c1,c2 rong
            expDate_referenceID = expDate + referenceID
            expDate_referenceID_length = "05" + String(expDate_referenceID.length).padStart(2, "0")
            let storeID_check, terminalID_check, expDate_referenceID_check
            storeID_check = storeID.length == 0 ? 0 : 4 + Number(storeID.length)
            terminalID_check = terminalID.length == 0 ? 0 : 4 + Number(terminalID.length)
            expDate_referenceID_check = expDate_referenceID.length == 0 ? 0 : 4 + Number(expDate_referenceID.length)
            additional_information_length = 4 + Number(sid.length) + storeID_check + terminalID_check + 4 + Number(note.length) + expDate_referenceID_check
            qrData = qrData.replace("{total_length}", total_length)
            qrData = qrData.replace("{totalv}", totalv)
            qrData = qrData.replace("{sid}", sid)
            qrData = qrData.replace("{sid_length}", sid_length)
            qrData = qrData.replace("{storeID_length}", storeID_length)
            qrData = qrData.replace("{storeID}", storeID)
            qrData = qrData.replace("{expDate_referenceID_length}", expDate_referenceID_length)
            qrData = qrData.replace("{expDate_referenceID}", expDate_referenceID)
            qrData = qrData.replace("{terminalID_length}", terminalID_length)
            qrData = qrData.replace("{terminalID}", terminalID)
            qrData = qrData.replace("{note_length}", note_length)
            qrData = qrData.replace("{note}", note)
            qrData = qrData.replace("{additional_information_length}", additional_information_length)
        } else if ((["0104128565", "2222222222", "0104128565-999"]).includes(taxc)) {
            const inv_creator = data.uc.split(".")[1]
            // let seq, seq_length, item_code = ''
            qrData = config_qrcode.qrCodeDataFis
            curr_code = data.curr == 'VND' ? 704 : data.curr == 'USD' ? 840 : ''
            totalv = data.totalv
            total_length = String(totalv.toString().length).padStart(2, "0")
            // seq = data.seq == undefined ? data.seq = '' : data.seq
            // seq_length = seq.length == 0 ? '' : "01" + String(seq.length).padStart(2, "0")
            storeID = "PB6HN"
            storeID_length = storeID.length == 0 ? '' : "03" + String(storeID.length).padStart(2, "0")
            // for (let item of data.items) {
            //     item_code += item.code
            // }
            terminalID = inv_creator
            terminalID_length = storeID.length == 0 ? '' : "07" + String(terminalID.length).padStart(2, "0")
            note = data.btax + "-" + data.form + data.serial + "-" + data.seq//item_code
            note_length = '08' + String(note.length).padStart(2, "0")
            let storeID_check, terminalID_check
            terminalID_check = terminalID.length == 0 ? 0 : 4 + Number(terminalID.length)
            storeID_check = storeID.length == 0 ? 0 : 4 + Number(storeID.length)
            additional_information_length = storeID_check + terminalID_check + 4 + Number(note.length) //4 + Number(seq.length) + 
            qrData = qrData.replace("{curr_code}", curr_code)
            qrData = qrData.replace("{total_length}", total_length)
            qrData = qrData.replace("{totalv}", totalv)
            // qrData = qrData.replace("{seq}", seq)
            // qrData = qrData.replace("{seq_length}", seq_length)
            qrData = qrData.replace("{storeID_length}", storeID_length)
            qrData = qrData.replace("{storeID}", storeID)
            qrData = qrData.replace("{terminalID_length}", terminalID_length)
            qrData = qrData.replace("{terminalID}", terminalID)
            qrData = qrData.replace("{note_length}", note_length)
            qrData = qrData.replace("{note}", note)
            qrData = qrData.replace("{additional_information_length}", additional_information_length)
        }
        //checksum dam bao tinh toan ven cua du lieu
        //do thư vien tu bo so 0 o dau cua chuoi ->> dung padStart
        //ngan hang vcb hdh ios crc phai la chu in hoa
        crc_check = crc.crc16ccitt(qrData).toString(16).padStart(4, "0").toUpperCase()
        let qrDataCheck = qrData + crc_check
        const result = await Qrcode.toDataURL(qrDataCheck)
        return result
    },