/**
 * ศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ
 * Google Apps Script API + Auto Setup
 */
const APP = {
  PROP_SHEET_ID: "CENTER_SHEET_ID",
  PROP_FOLDER_ID: "CENTER_FOLDER_ID",
  PROP_ADMIN_HASH: "ADMIN_PASSWORD_HASH",
  PROP_SETUP_KEY: "SETUP_KEY",
  TOKEN_TTL: 21600,
  SHEETS: {
    SETTINGS: "Site_Settings",
    DIMENSIONS: "5_Dimensions",
    TIMELINE: "Timeline",
    STATS: "Quick_Stats",
    BACKUPS: "Backups",
    LOGS: "Activity_Log",
  },
  MAX_BACKUPS: 10,
};

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "health";
  if (action === "health")
    return json_({
      ok: true,
      data: { status: "online", app: "ศพอ. วัดสี่แยกสมเด็จ" },
    });
  return handle_({
    action: action,
    payload: e.parameter || {},
    token: e.parameter.token || "",
  });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return handle_(body);
  } catch (err) {
    return json_({
      ok: false,
      message: "ข้อมูลคำขอไม่ถูกต้อง: " + err.message,
    });
  }
}

function handle_(req) {
  try {
    const action = req.action;
    if (action === "getPublicData")
      return json_({ ok: true, data: getPublicData_() });
    if (action === "login")
      return json_({
        ok: true,
        data: login_(req.payload && req.payload.password),
      });
    requireAuth_(req.token);
    if (action === "getAdminData")
      return json_({ ok: true, data: getAllData_() });
    if (action === "saveAll") {
      saveAll_(req.payload || {});
      return json_({ ok: true, data: { saved: true } });
    }
    if (action === "uploadImage")
      return json_({ ok: true, data: uploadImage_(req.payload || {}) });
    if (action === "getBackups")
      return json_({ ok: true, data: listBackups_() });
    if (action === "restoreBackup")
      return json_({
        ok: true,
        data: restoreBackup_(req.payload && req.payload.id),
      });
    if (action === "getActivityLog")
      return json_({ ok: true, data: listActivityLog_() });
    if (action === "organizeAlbumFolders")
      return json_({ ok: true, data: organizeAlbumFolders_() });
    throw new Error("ไม่พบคำสั่ง API ที่ร้องขอ");
  } catch (err) {
    return json_({ ok: false, message: err.message });
  }
}

/** รันครั้งแรกหนึ่งครั้ง แล้วดู URL และรหัสผ่านเริ่มต้นใน Execution log */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss, folder;
  const oldSheetId = props.getProperty(APP.PROP_SHEET_ID);
  const oldFolderId = props.getProperty(APP.PROP_FOLDER_ID);
  ss = oldSheetId
    ? SpreadsheetApp.openById(oldSheetId)
    : SpreadsheetApp.create("ฐานข้อมูล ศพอ. วัดสี่แยกสมเด็จ");
  folder = oldFolderId
    ? DriveApp.getFolderById(oldFolderId)
    : DriveApp.createFolder("ศพอ_วัดสี่แยกสมเด็จ_เว็บไซต์");
  props.setProperty(APP.PROP_SHEET_ID, ss.getId());
  props.setProperty(APP.PROP_FOLDER_ID, folder.getId());
  props.setProperty(APP.PROP_SETUP_KEY, Utilities.getUuid());
  const initialPassword = "admin" + String(new Date().getFullYear() + 543);
  if (!props.getProperty(APP.PROP_ADMIN_HASH))
    props.setProperty(APP.PROP_ADMIN_HASH, hash_(initialPassword));

  const settings = ensureSheet_(ss, APP.SHEETS.SETTINGS, [
    "Key",
    "Value",
    "Description",
  ]);
  const dims = ensureSheet_(ss, APP.SHEETS.DIMENSIONS, [
    "ID",
    "Title",
    "Description",
    "Stat_Label",
    "Stat_Value",
    "Chart_JSON",
    "Images_JSON",
    "Updated_At",
  ]);
  const timeline = ensureSheet_(ss, APP.SHEETS.TIMELINE, [
    "Year",
    "Title",
    "Detail",
    "Sort_Order",
    "Active",
  ]);
  const stats = ensureSheet_(ss, APP.SHEETS.STATS, [
    "Label",
    "Value",
    "Suffix",
    "Sort_Order",
    "Active",
  ]);
  const backups = ensureSheet_(ss, APP.SHEETS.BACKUPS, [
    "ID",
    "Created_At",
    "Reason",
    "Data_JSON",
  ]);
  const logs = ensureSheet_(ss, APP.SHEETS.LOGS, [
    "Created_At",
    "Action",
    "Detail",
  ]);
  if (settings.getLastRow() === 1)
    settings.getRange(2, 1, 9, 3).setValues([
      [
        "centerName",
        "ศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ",
        "ชื่อศูนย์",
      ],
      [
        "slogan",
        "สืบสาน รักษา ต่อยอด: สร้างเยาวชนคุณภาพ ด้วยวิถีพุทธ",
        "คำขวัญ",
      ],
      [
        "history",
        "ศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ เป็นพื้นที่แห่งการเรียนรู้และการปลูกฝังศีลธรรมแก่เด็ก เยาวชน และประชาชน โดยบูรณาการหลักพุทธธรรมเข้ากับวิถีชีวิตและอัตลักษณ์ท้องถิ่น",
        "ประวัติโดยย่อ",
      ],
      ["logoUrl", "", "URL โลโก้"],
      ["bannerUrl", "", "URL แบนเนอร์"],
      ["historyImageUrl", "", "URL ภาพประวัติหลัก"],
      ["phone", "", "โทรศัพท์ติดต่อ"],
      ["facebookUrl", "", "Facebook"],
      [
        "historyFactsJSON",
        JSON.stringify(defaultHistoryFacts_()),
        "ข้อมูลการ์ดประวัติ JSON",
      ],
    ]);
  if (dims.getLastRow() === 1)
    dims.getRange(2, 1, 5, 8).setValues(defaultDimensions_());
  if (timeline.getLastRow() === 1)
    timeline.getRange(2, 1, 4, 5).setValues([
      [
        "พ.ศ. 2512",
        "ตั้งวัดสี่แยกสมเด็จ",
        "เริ่มวางรากฐานศาสนสถานและเป็นศูนย์รวมศรัทธาของชุมชน",
        1,
        true,
      ],
      [
        "พ.ศ. 2548",
        "จัดการศึกษาพระพุทธศาสนา",
        "ส่งเสริมการเรียนรู้หลักธรรมแก่เด็กและเยาวชนอย่างต่อเนื่อง",
        2,
        true,
      ],
      [
        "พ.ศ. 2560",
        "ขยายเครือข่ายชุมชน",
        "บูรณาการความร่วมมือกับบ้าน วัด โรงเรียน และหน่วยงานภาครัฐ",
        3,
        true,
      ],
      [
        "ปัจจุบัน",
        "ศูนย์เรียนรู้วิถีพุทธ",
        "พัฒนาการเรียนรู้เชิงรุก ควบคู่เทคโนโลยีและภูมิปัญญาท้องถิ่น",
        4,
        true,
      ],
    ]);
  if (stats.getLastRow() === 1)
    stats.getRange(2, 1, 4, 5).setValues([
      ["นักเรียน", 185, " คน", 1, true],
      ["ครูและบุคลากร", 24, " รูป/คน", 2, true],
      ["โครงการสำคัญ", 18, " โครงการ", 3, true],
      ["เครือข่ายความร่วมมือ", 12, " แห่ง", 4, true],
    ]);
  [settings, dims, timeline, stats, backups, logs].forEach(formatSheet_);
  const result = {
    spreadsheetUrl: ss.getUrl(),
    folderUrl: folder.getUrl(),
    initialAdminPassword: initialPassword,
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

/** เปลี่ยนรหัสผ่านหลังติดตั้ง: รัน setAdminPassword('รหัสใหม่') จาก Editor */
function setAdminPassword(newPassword) {
  if (!newPassword || String(newPassword).length < 8)
    throw new Error("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
  PropertiesService.getScriptProperties().setProperty(
    APP.PROP_ADMIN_HASH,
    hash_(String(newPassword)),
  );
  CacheService.getScriptCache().removeAll(["ADMIN_TOKENS"]);
  return "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว";
}

function getAllData_() {
  const ss = getSpreadsheet_();
  const settingsRows = rows_(ss.getSheetByName(APP.SHEETS.SETTINGS));
  const settings = {};
  settingsRows.forEach((r) => (settings[r.Key] = r.Value));
  const dimensions = rows_(ss.getSheetByName(APP.SHEETS.DIMENSIONS)).map(
    (r) => ({
      id: String(r.ID),
      title: r.Title,
      desc: r.Description,
      statLabel: r.Stat_Label,
      statValue: Number(r.Stat_Value) || 0,
      chartData: safeJson_(r.Chart_JSON, []),
      images: safeJson_(r.Images_JSON, []),
    }),
  );
  const historyFacts = safeJson_(
    settings.historyFactsJSON,
    defaultHistoryFacts_(),
  );
  const albums = safeJson_(settings.albumsJSON, defaultAlbums_());
  const personnel = safeJson_(settings.personnelJSON, defaultPersonnel_());
  const abbots = safeJson_(settings.abbotsJSON, defaultAbbots_());
  const monastics = safeJson_(settings.monasticsJSON, []);
  const missions = safeJson_(settings.missionsJSON, defaultMissions_());
  const projects = safeJson_(settings.projectsJSON, []);
  const awards = safeJson_(settings.awardsJSON, defaultAwards_());
  delete settings.historyFactsJSON;
  delete settings.albumsJSON;
  delete settings.personnelJSON;
  delete settings.abbotsJSON;
  delete settings.monasticsJSON;
  delete settings.missionsJSON;
  delete settings.projectsJSON;
  delete settings.awardsJSON;
  const timeline = rows_(ss.getSheetByName(APP.SHEETS.TIMELINE))
    .filter((r) => truthy_(r.Active))
    .sort((a, b) => Number(a.Sort_Order) - Number(b.Sort_Order))
    .map((r) => ({ year: r.Year, title: r.Title, detail: r.Detail }));
  const quickStats = rows_(ss.getSheetByName(APP.SHEETS.STATS))
    .filter((r) => truthy_(r.Active))
    .sort((a, b) => Number(a.Sort_Order) - Number(b.Sort_Order))
    .map((r) => ({
      label: r.Label,
      value: Number(r.Value) || 0,
      suffix: r.Suffix,
    }));
  ["logoUrl", "bannerUrl", "historyImageUrl"].forEach((k) => {
    if (settings[k]) settings[k] = publicImageUrl_(settings[k]);
  });
  dimensions.forEach((d) =>
    (d.images || []).forEach((im) => (im.url = publicImageUrl_(im.url))),
  );
  albums.forEach((a) => {
    a.coverUrl = publicImageUrl_(a.coverUrl);
    (a.images || []).forEach((im) => (im.url = publicImageUrl_(im.url)));
  });
  personnel.forEach((p) => (p.imageUrl = publicImageUrl_(p.imageUrl)));
  abbots.forEach((p) => (p.imageUrl = publicImageUrl_(p.imageUrl)));
  monastics.forEach((p) => (p.imageUrl = publicImageUrl_(p.imageUrl)));
  awards.forEach((a) => (a.imageUrl = publicImageUrl_(a.imageUrl)));
  return {
    settings: settings,
    historyFacts: historyFacts,
    albums: albums,
    personnel: personnel,
    abbots: abbots,
    monastics: monastics,
    missions: missions,
    projects: projects,
    awards: awards,
    dimensions: dimensions,
    timeline: timeline,
    quickStats: quickStats,
  };
}

function getPublicData_() {
  const data = getAllData_();
  ["albums", "personnel", "abbots", "monastics", "missions", "projects", "awards"].forEach(
    (key) =>
      (data[key] = (data[key] || []).filter((item) => item.status !== "draft")),
  );
  return data;
}

function saveAll_(data, options) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    options = options || {};
    if (!options.skipBackup)
      createBackup_(options.reason || "สำรองอัตโนมัติก่อนบันทึก");
    const ss = getSpreadsheet_(),
      settingsSheet = ss.getSheetByName(APP.SHEETS.SETTINGS),
      dimSheet = ss.getSheetByName(APP.SHEETS.DIMENSIONS),
      timelineSheet = ss.getSheetByName(APP.SHEETS.TIMELINE);
    const descriptions = {
      centerName: "ชื่อศูนย์",
      slogan: "คำขวัญ",
      history: "ประวัติโดยย่อ",
      logoUrl: "URL โลโก้",
      bannerUrl: "URL แบนเนอร์",
      historyImageUrl: "URL ภาพประวัติหลัก",
      mapAddress: "ที่อยู่สำหรับ Google Maps",
      phone: "โทรศัพท์ติดต่อ",
      facebookUrl: "Facebook",
    };
    const settings = data.settings || {};
    const sValues = Object.keys(descriptions).map((k) => [
      k,
      settings[k] || "",
      descriptions[k],
    ]);
    sValues.push([
      "historyFactsJSON",
      JSON.stringify(data.historyFacts || defaultHistoryFacts_()),
      "ข้อมูลการ์ดประวัติ JSON",
    ]);
    sValues.push([
      "albumsJSON",
      JSON.stringify(data.albums || []),
      "ข้อมูลอัลบั้มภาพ JSON",
    ]);
    sValues.push([
      "personnelJSON",
      JSON.stringify(data.personnel || []),
      "ข้อมูลบุคลากร JSON",
    ]);
    [
      ["abbotsJSON", data.abbots || defaultAbbots_(), "ข้อมูลทำเนียบเจ้าอาวาส JSON"],
      ["monasticsJSON", data.monastics || [], "ข้อมูลพระภิกษุสามเณร JSON"],
      ["missionsJSON", data.missions || defaultMissions_(), "ข้อมูล 6 พันธกิจ JSON"],
      ["projectsJSON", data.projects || [], "ข้อมูลโครงการและกิจกรรม JSON"],
    ].forEach(function (item) {
      sValues.push([item[0], JSON.stringify(item[1]), item[2]]);
    });
    sValues.push([
      "awardsJSON",
      JSON.stringify(data.awards || []),
      "ข้อมูลรางวัล JSON",
    ]);
    if (settingsSheet.getLastRow() > 1)
      settingsSheet
        .getRange(2, 1, settingsSheet.getLastRow() - 1, 3)
        .clearContent();
    settingsSheet.getRange(2, 1, sValues.length, 3).setValues(sValues);
    const dims = (data.dimensions || []).map((d) => [
      d.id,
      d.title,
      d.desc || "",
      d.statLabel || "",
      Number(d.statValue) || 0,
      JSON.stringify(d.chartData || []),
      JSON.stringify(d.images || []),
      new Date(),
    ]);
    if (dimSheet.getLastRow() > 1)
      dimSheet.getRange(2, 1, dimSheet.getLastRow() - 1, 8).clearContent();
    if (dims.length) dimSheet.getRange(2, 1, dims.length, 8).setValues(dims);
    const timeline = (data.timeline || []).map((t, i) => [
      t.year || "",
      t.title || "",
      t.detail || "",
      i + 1,
      true,
    ]);
    if (timelineSheet.getLastRow() > 1)
      timelineSheet
        .getRange(2, 1, timelineSheet.getLastRow() - 1, 5)
        .clearContent();
    if (timeline.length)
      timelineSheet.getRange(2, 1, timeline.length, 5).setValues(timeline);
    logActivity_(options.action || "SAVE", "บันทึกข้อมูลเว็บไซต์สำเร็จ");
  } finally {
    lock.releaseLock();
  }
}

function createBackup_(reason) {
  const ss = getSpreadsheet_(),
    sh = ensureSheet_(ss, APP.SHEETS.BACKUPS, [
      "ID",
      "Created_At",
      "Reason",
      "Data_JSON",
    ]);
  const id =
    "BKP-" +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || "Asia/Bangkok",
      "yyyyMMdd-HHmmss",
    ) +
    "-" +
    Utilities.getUuid().slice(0, 6);
  sh.appendRow([
    id,
    new Date(),
    reason || "สำรองข้อมูล",
    JSON.stringify(getAllData_()),
  ]);
  const count = sh.getLastRow() - 1;
  if (count > APP.MAX_BACKUPS) sh.deleteRows(2, count - APP.MAX_BACKUPS);
  return id;
}

function listBackups_() {
  const sh = getSpreadsheet_().getSheetByName(APP.SHEETS.BACKUPS);
  return rows_(sh)
    .map((r) => ({
      id: String(r.ID),
      createdAt: r.Created_At,
      reason: r.Reason,
    }))
    .reverse();
}

function restoreBackup_(id) {
  if (!id) throw new Error("กรุณาเลือกชุดสำรอง");
  const row = rows_(getSpreadsheet_().getSheetByName(APP.SHEETS.BACKUPS)).find(
    (r) => String(r.ID) === String(id),
  );
  if (!row) throw new Error("ไม่พบชุดสำรองที่เลือก");
  createBackup_("สำรองอัตโนมัติก่อนกู้คืน " + id);
  saveAll_(safeJson_(row.Data_JSON, {}), {
    skipBackup: true,
    action: "RESTORE",
  });
  logActivity_("RESTORE", "กู้คืนข้อมูลจาก " + id);
  return { restored: true, id: id };
}

function logActivity_(action, detail) {
  const sh = ensureSheet_(getSpreadsheet_(), APP.SHEETS.LOGS, [
    "Created_At",
    "Action",
    "Detail",
  ]);
  sh.appendRow([new Date(), action || "SYSTEM", detail || ""]);
  if (sh.getLastRow() > 501) sh.deleteRows(2, sh.getLastRow() - 501);
}

function listActivityLog_() {
  const sh = getSpreadsheet_().getSheetByName(APP.SHEETS.LOGS);
  return rows_(sh)
    .slice(-100)
    .reverse()
    .map((r) => ({
      createdAt: r.Created_At,
      action: r.Action,
      detail: r.Detail,
    }));
}

function uploadImage_(p) {
  if (!p.data || !p.name || !p.type || !/^image\//.test(p.type))
    throw new Error("รองรับเฉพาะไฟล์รูปภาพ");
  const bytes = Utilities.base64Decode(p.data);
  if (bytes.length > 8 * 1024 * 1024)
    throw new Error("ไฟล์ต้องมีขนาดไม่เกิน 8 MB");
  const root = DriveApp.getFolderById(
    PropertiesService.getScriptProperties().getProperty(APP.PROP_FOLDER_ID),
  );
  let folderName = "ตั้งค่าเว็บไซต์";
  if (p.kind === "dimension") folderName = "ผลงาน_" + p.dimensionId;
  if (p.kind === "albumCover" || p.kind === "albumImage") {
    const album = getAllData_().albums.find(
      (x) => String(x.id) === String(p.dimensionId),
    );
    folderName = album
      ? cleanFolderName_((album.date || "ไม่ระบุปี") + "_" + album.title)
      : "อัลบั้ม_" + p.dimensionId;
  }
  if (p.kind === "personnel") folderName = "ทำเนียบบุคลากร";
  if (p.kind === "abbot") folderName = "ทำเนียบเจ้าอาวาส";
  if (p.kind === "monastic") folderName = "ทำเนียบพระภิกษุสามเณร";
  if (p.kind === "award") folderName = "รางวัลที่ได้รับ";
  const folder = getOrCreateFolder_(root, folderName);
  const duplicate = findDuplicateFile_(folder, p.name, bytes.length);
  if (duplicate)
    throw new Error(
      "พบไฟล์ชื่อและขนาดเดียวกันในระบบแล้ว กรุณาตรวจสอบก่อนอัปโหลดซ้ำ",
    );
  const file = folder.createFile(Utilities.newBlob(bytes, p.type, p.name));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const url = "https://lh3.googleusercontent.com/d/" + file.getId() + "=w2000";
  const data = getAllData_();
  if (p.kind === "logo") data.settings.logoUrl = url;
  else if (p.kind === "banner") data.settings.bannerUrl = url;
  else if (p.kind === "history") data.settings.historyImageUrl = url;
  else if (p.kind === "dimension") {
    const d = data.dimensions.find((x) => x.id === p.dimensionId);
    if (!d) throw new Error("ไม่พบหมวดผลงาน");
    d.images = d.images || [];
    d.images.push({
      url: url,
      caption: "ภาพผลการดำเนินงาน",
      fileId: file.getId(),
    });
  } else if (p.kind === "albumCover" || p.kind === "albumImage") {
    const a = data.albums.find((x) => x.id === p.dimensionId);
    if (!a) throw new Error("ไม่พบอัลบั้มภาพ");
    if (p.kind === "albumCover") a.coverUrl = url;
    else {
      a.images = a.images || [];
      a.images.push({ url: url, caption: "ภาพกิจกรรม", fileId: file.getId() });
      if (!a.coverUrl) a.coverUrl = url;
    }
  } else if (p.kind === "personnel") {
    const person = data.personnel.find((x) => x.id === p.dimensionId);
    if (!person) throw new Error("ไม่พบบุคลากร");
    person.imageUrl = url;
  } else if (p.kind === "abbot" || p.kind === "monastic") {
    const list = p.kind === "abbot" ? data.abbots : data.monastics;
    const person = list.find((x) => x.id === p.dimensionId);
    if (!person) throw new Error("ไม่พบรายนามในทำเนียบ");
    person.imageUrl = url;
  } else if (p.kind === "award") {
    const award = data.awards.find((x) => x.id === p.dimensionId);
    if (!award) throw new Error("ไม่พบรายการรางวัล");
    award.imageUrl = url;
  } else throw new Error("ประเภทการอัปโหลดไม่ถูกต้อง");
  saveAll_(data, { reason: "สำรองก่อนอัปโหลดภาพ " + p.name, action: "UPLOAD" });
  logActivity_("UPLOAD", "อัปโหลดภาพ " + p.name + " ไปยัง " + folderName);
  return { url: url, fileId: file.getId() };
}

function findDuplicateFile_(folder, name, size) {
  const it = folder.getFilesByName(name);
  while (it.hasNext()) {
    const f = it.next();
    if (Number(f.getSize()) === Number(size)) return f;
  }
  return null;
}

/**
 * เปลี่ยนเฉพาะชื่อโฟลเดอร์อัลบั้มเดิมให้ตรงกับหน้าเว็บไซต์
 * ไม่ลบ ไม่ย้าย และไม่อัปโหลดรูปภาพซ้ำ
 */
function organizeAlbumFolders_() {
  const root = DriveApp.getFolderById(
    PropertiesService.getScriptProperties().getProperty(APP.PROP_FOLDER_ID),
  );
  const albums = getAllData_().albums || [];
  let renamed = 0;
  albums.forEach(function (album) {
    const oldName = "อัลบั้ม_" + album.id;
    const targetName = cleanFolderName_(
      (album.date || "ไม่ระบุปี") + "_" + (album.title || oldName),
    );
    const oldFolders = root.getFoldersByName(oldName);
    if (oldFolders.hasNext()) {
      oldFolders.next().setName(targetName);
      renamed++;
    }
  });
  logActivity_(
    "ORGANIZE_FOLDERS",
    "จัดชื่อโฟลเดอร์อัลบั้มสำเร็จ " + renamed + " โฟลเดอร์",
  );
  return { renamed: renamed, total: albums.length };
}

function cleanFolderName_(name) {
  return String(name || "อัลบั้ม")
    .replace(/[\\/:*?"<>|#%{}]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function login_(password) {
  const expected = PropertiesService.getScriptProperties().getProperty(
    APP.PROP_ADMIN_HASH,
  );
  if (!expected) throw new Error("กรุณารัน setup() ก่อนใช้งาน");
  if (!password || hash_(String(password)) !== expected) {
    Utilities.sleep(500);
    throw new Error("รหัสผ่านไม่ถูกต้อง");
  }
  const token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put("token_" + token, "1", APP.TOKEN_TTL);
  return { token: token, expiresIn: APP.TOKEN_TTL };
}
function requireAuth_(token) {
  if (!token || CacheService.getScriptCache().get("token_" + token) !== "1")
    throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
}
function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(
    APP.PROP_SHEET_ID,
  );
  if (!id) throw new Error("ยังไม่ได้ติดตั้งระบบ กรุณารัน setup()");
  return SpreadsheetApp.openById(id);
}
function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0)
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sh;
}
function formatSheet_(sh) {
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, sh.getLastColumn())
    .setBackground("#800020")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sh.autoResizeColumns(1, sh.getLastColumn());
}
function rows_(sh) {
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues(),
    h = values.shift();
  return values
    .filter((r) => r.some((v) => v !== ""))
    .map((r) => {
      const o = {};
      h.forEach((k, i) => (o[k] = r[i]));
      return o;
    });
}
function safeJson_(s, fallback) {
  try {
    return JSON.parse(String(s || ""));
  } catch (e) {
    return fallback;
  }
}
function truthy_(v) {
  return v === true || String(v).toLowerCase() === "true" || String(v) === "1";
}
function hash_(s) {
  return Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      s,
      Utilities.Charset.UTF_8,
    ),
  );
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function getOrCreateFolder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function publicImageUrl_(url) {
  if (!url) return "";
  const s = String(url);
  let m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!m) m = s.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return m ? "https://lh3.googleusercontent.com/d/" + m[1] + "=w2000" : s;
}
function defaultDimensions_() {
  const names = [
    ["education", "ด้านการจัดการศึกษาและวิชาการ", "ผู้เรียน", 185],
    ["community", "ด้านโครงการและกิจกรรมเพื่อชุมชน", "โครงการ", 18],
    ["network", "ด้านการประชุมและเครือข่ายความร่วมมือ", "เครือข่าย", 12],
    ["place", "ด้านอาคารสถานที่และภูมิทัศน์", "พื้นที่เรียนรู้", 8],
    ["management", "ด้านการบริหารจัดการและบุคลากร", "บุคลากร", 24],
  ];
  return names.map((x, i) => [
    x[0],
    x[1],
    "ข้อมูลผลการดำเนินงานของ" + x[1],
    x[2],
    x[3],
    JSON.stringify([
      { name: "2567", value: 55 + i * 4 },
      { name: "2568", value: 72 + i * 5 },
      { name: "2569", value: 88 + i * 6 },
    ]),
    "[]",
    new Date(),
  ]);
}
function defaultHistoryFacts_() {
  return [
    {
      icon: "map",
      label: "ที่ตั้ง",
      value: "บ้านสี่แยกสมเด็จ หมู่ที่ 6 จังหวัดกาฬสินธุ์",
    },
    { icon: "landmark", label: "เนื้อที่", value: "11 ไร่ 2 งาน 80 ตารางวา" },
    { icon: "calendar", label: "ปีที่ตั้งวัด", value: "พ.ศ. 2512" },
    { icon: "landmark", label: "วิสุงคามสีมา", value: "พ.ศ. 2517 ขนาด 40 × 80 เมตร" },
    { icon: "book", label: "พระปริยัติธรรม", value: "แผนกธรรมและแผนกบาลี" },
    {
      icon: "education",
      label: "ศูนย์ศึกษาวันอาทิตย์",
      value: "เปิดสอนตั้งแต่ พ.ศ. 2550",
    },
    {
      icon: "building",
      label: "อาคารและสถานที่",
      value: "พร้อมรองรับการศึกษาและชุมชน",
    },
  ];
}
function defaultAlbums_() {
  return [
    {
      id: "album-1",
      title: "กิจกรรมอบรมคุณธรรม จริยธรรม",
      date: "พ.ศ. 2569",
      description:
        "กิจกรรมส่งเสริมคุณธรรมและการเรียนรู้วิถีพุทธสำหรับเด็กและเยาวชน",
      coverUrl: "",
      images: [],
    },
  ];
}
function defaultPersonnel_() {
  return [
    {
      id: "person-1",
      name: "พระครูอุดมธรรมวุฒิ",
      position: "เจ้าอาวาสวัดสี่แยกสมเด็จ",
      description: "ผู้บริหารศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์วัดสี่แยกสมเด็จ",
      imageUrl: "",
    },
  ];
}
function defaultAbbots_() {
  return [
    {
      id: "abbot-current",
      name: "พระครูอุดมธรรมวุฒิ",
      position: "เจ้าอาวาสวัดสี่แยกสมเด็จ",
      period: "เจ้าอาวาสรูปปัจจุบัน",
      description: "บริหารกิจการวัดและงานคณะสงฆ์ตามหลักพระธรรมวินัยและธรรมาภิบาล",
      imageUrl: "",
      status: "published",
    },
    {
      id: "abbot-first",
      name: "พระครูสุนทรสีลสิกข์",
      position: "อดีตเจ้าอาวาส",
      period: "เจ้าอาวาสรูปแรก",
      description: "ผู้วางรากฐานการพัฒนาวัดสี่แยกสมเด็จ",
      imageUrl: "",
      status: "published",
    },
  ];
}
function defaultMissions_() {
  return [
    ["governance", "การปกครองคณะสงฆ์", "บริหารงานคณะสงฆ์อย่างเป็นระบบ โปร่งใส และยึดพระธรรมวินัย", "งาน/โครงการ"],
    ["religious-study", "การศาสนศึกษา", "ส่งเสริมการศึกษาพระปริยัติธรรมและพัฒนาศาสนทายาท", "ผู้เรียน"],
    ["education-support", "การศึกษาสงเคราะห์", "สนับสนุนเด็ก เยาวชน และประชาชนให้เข้าถึงโอกาสทางการศึกษา", "ผู้รับประโยชน์"],
    ["propagation", "การเผยแผ่พระพุทธศาสนา", "เผยแผ่หลักธรรมผ่านกิจกรรม ชุมชน และสื่อดิจิทัล", "กิจกรรม"],
    ["public-utilities", "การสาธารณูปการ", "ดูแลศาสนสถาน อาคาร ภูมิทัศน์ และศาสนสมบัติ", "รายการพัฒนา"],
    ["public-welfare", "การสาธารณสงเคราะห์", "เกื้อกูลชุมชน บรรเทาความเดือดร้อน และสร้างเครือข่ายจิตอาสา", "ผู้รับประโยชน์"],
  ].map(function (row) {
    return { id: row[0], title: row[1], description: row[2], statValue: 0, statLabel: row[3], status: "published" };
  });
}
function defaultAwards_() {
  return [
    {
      id: "award-1",
      title: "ผลงานและรางวัลของศูนย์",
      year: "พ.ศ. 2569",
      organization: "",
      description: "รวบรวมผลงานเชิงประจักษ์และรางวัลที่ศูนย์ได้รับ",
      imageUrl: "",
    },
  ];
}
