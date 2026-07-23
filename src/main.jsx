import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  DatabaseBackup,
  ChevronRight,
  Eye,
  GraduationCap,
  History,
  Image,
  Images,
  Landmark,
  LogOut,
  MapPin,
  Menu,
  Network,
  Phone,
  Search,
  Share2,
  Save,
  Settings,
  ShieldCheck,
  ScrollText,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
  HeartHandshake,
  Megaphone,
  Wrench,
  HandCoins,
  FileText,
  Activity,
  GripVertical,
  Link as LinkIcon,
  Paperclip,
  Video,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

const API_URL = import.meta.env.VITE_GAS_API_URL || "";
const OFFICIAL_LOGO = "/assets/center-logo.png";
const templeAlert = Swal.mixin({
  customClass: {
    popup: "temple-alert",
    confirmButton: "temple-alert-confirm",
    cancelButton: "temple-alert-cancel",
  },
  buttonsStyling: false,
  reverseButtons: true,
});
const confirmAction = async ({
  title,
  text,
  confirmText = "ยืนยันดำเนินการ",
  icon = "warning",
}) => {
  const result = await templeAlert.fire({
    title,
    html: `<div class="alert-seal">ธ</div><p>${text}</p>`,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
  });
  return result.isConfirmed;
};
const confirmDelete = (label = "รายการนี้") =>
  confirmAction({
    title: `ลบ${label}หรือไม่?`,
    text: "รายการจะถูกนำออกเมื่อกดบันทึกการเปลี่ยนแปลง และระบบจะสร้างชุดสำรองก่อนบันทึกอัตโนมัติ",
    confirmText: "นำรายการออก",
  });
const dimensions = [
  {
    id: "education",
    title: "ด้านการจัดการศึกษาและวิชาการ",
    icon: BookOpen,
    desc: "ส่งเสริมการเรียนรู้พระพุทธศาสนาอย่างเป็นระบบ ควบคู่คุณธรรมและทักษะชีวิต",
  },
  {
    id: "community",
    title: "ด้านโครงการและกิจกรรมเพื่อชุมชน",
    icon: CalendarDays,
    desc: "สร้างกิจกรรมเชิงสร้างสรรค์ เชื่อมวัด เยาวชน ครอบครัว และชุมชน",
  },
  {
    id: "network",
    title: "ด้านการประชุมและเครือข่ายความร่วมมือ",
    icon: Network,
    desc: "ประสานพลังเครือข่ายเพื่อพัฒนาการศึกษาพระพุทธศาสนาอย่างยั่งยืน",
  },
  {
    id: "place",
    title: "ด้านอาคารสถานที่และภูมิทัศน์",
    icon: Building2,
    desc: "จัดสภาพแวดล้อมให้สะอาด ปลอดภัย สงบ และเอื้อต่อการเรียนรู้",
  },
  {
    id: "management",
    title: "ด้านการบริหารจัดการและบุคลากร",
    icon: Users,
    desc: "บริหารด้วยหลักธรรมาภิบาลและพัฒนาบุคลากรให้มีคุณภาพ",
  },
];
const fallback = {
  settings: {
    centerName: "ศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ",
    slogan: "สืบสาน รักษา ต่อยอด: สร้างเยาวชนคุณภาพ ด้วยวิถีพุทธ",
    logoUrl: "",
    bannerUrl: "",
    historyImageUrl: "",
    history:
      "ศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ เป็นพื้นที่แห่งการเรียนรู้และการปลูกฝังศีลธรรมแก่เด็ก เยาวชน และประชาชน โดยบูรณาการหลักพุทธธรรมเข้ากับวิถีชีวิตและอัตลักษณ์ท้องถิ่น",
  },
  historyFacts: [
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
  ],
  timeline: [
    {
      year: "พ.ศ. 2512",
      title: "ตั้งวัดสี่แยกสมเด็จ",
      detail: "เริ่มวางรากฐานศาสนสถานและเป็นศูนย์รวมศรัทธาของชุมชน",
    },
    {
      year: "พ.ศ. 2548",
      title: "จัดการศึกษาพระพุทธศาสนา",
      detail: "ส่งเสริมการเรียนรู้หลักธรรมแก่เด็กและเยาวชนอย่างต่อเนื่อง",
    },
    {
      year: "พ.ศ. 2560",
      title: "ขยายเครือข่ายชุมชน",
      detail: "บูรณาการความร่วมมือกับบ้าน วัด โรงเรียน และหน่วยงานภาครัฐ",
    },
    {
      year: "ปัจจุบัน",
      title: "ศูนย์เรียนรู้วิถีพุทธ",
      detail: "พัฒนาการเรียนรู้เชิงรุก ควบคู่เทคโนโลยีและภูมิปัญญาท้องถิ่น",
    },
  ],
  quickStats: [
    { label: "นักเรียน", value: 185, suffix: " คน" },
    { label: "ครูและบุคลากร", value: 24, suffix: " รูป/คน" },
    { label: "โครงการสำคัญ", value: 18, suffix: " โครงการ" },
    { label: "เครือข่ายความร่วมมือ", value: 12, suffix: " แห่ง" },
  ],
  albums: [
    {
      id: "album-1",
      title: "กิจกรรมอบรมคุณธรรม จริยธรรม",
      date: "พ.ศ. 2569",
      description:
        "กิจกรรมส่งเสริมคุณธรรมและการเรียนรู้วิถีพุทธสำหรับเด็กและเยาวชน",
      coverUrl: "",
      images: [],
    },
  ],
  personnel: [
    {
      id: "person-1",
      name: "พระครูอุดมธรรมวุฒิ",
      position: "เจ้าอาวาสวัดสี่แยกสมเด็จ",
      description: "ผู้บริหารศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์วัดสี่แยกสมเด็จ",
      imageUrl: "",
    },
  ],
  abbots: [
    {
      id: "abbot-current",
      name: "พระครูอุดมธรรมวุฒิ",
      position: "เจ้าอาวาสวัดสี่แยกสมเด็จ",
      period: "เจ้าอาวาสรูปปัจจุบัน",
      description: "บริหารกิจการวัดและงานคณะสงฆ์ตามหลักพระธรรมวินัยและธรรมาภิบาล",
      imageUrl: "",
    },
    {
      id: "abbot-first",
      name: "พระครูสุนทรสีลสิกข์",
      position: "อดีตเจ้าอาวาส",
      period: "เจ้าอาวาสรูปแรก",
      description: "ผู้วางรากฐานการพัฒนาวัดสี่แยกสมเด็จ",
      imageUrl: "",
    },
  ],
  monastics: [],
  missions: [
    { id: "governance", title: "การปกครองคณะสงฆ์", description: "บริหารงานคณะสงฆ์อย่างเป็นระบบ โปร่งใส และยึดพระธรรมวินัย", statValue: 0, statLabel: "งาน/โครงการ" },
    { id: "religious-study", title: "การศาสนศึกษา", description: "ส่งเสริมการศึกษาพระปริยัติธรรมและพัฒนาศาสนทายาท", statValue: 0, statLabel: "ผู้เรียน" },
    { id: "education-support", title: "การศึกษาสงเคราะห์", description: "สนับสนุนเด็ก เยาวชน และประชาชนให้เข้าถึงโอกาสทางการศึกษา", statValue: 0, statLabel: "ผู้รับประโยชน์" },
    { id: "propagation", title: "การเผยแผ่พระพุทธศาสนา", description: "เผยแผ่หลักธรรมผ่านกิจกรรม ชุมชน และสื่อดิจิทัล", statValue: 0, statLabel: "กิจกรรม" },
    { id: "public-utilities", title: "การสาธารณูปการ", description: "ดูแลศาสนสถาน อาคาร ภูมิทัศน์ และศาสนสมบัติ", statValue: 0, statLabel: "รายการพัฒนา" },
    { id: "public-welfare", title: "การสาธารณสงเคราะห์", description: "เกื้อกูลชุมชน บรรเทาความเดือดร้อน และสร้างเครือข่ายจิตอาสา", statValue: 0, statLabel: "ผู้รับประโยชน์" },
  ],
  projects: [],
  awards: [
    {
      id: "award-1",
      title: "ผลงานและรางวัลของศูนย์",
      year: "พ.ศ. 2569",
      organization: "",
      description: "รวบรวมผลงานเชิงประจักษ์และรางวัลที่ศูนย์ได้รับ",
      imageUrl: "",
    },
  ],
  dimensions: dimensions.map((d, i) => ({
    ...d,
    statValue: [185, 18, 12, 8, 24][i],
    statLabel: [
      "ผู้เรียน",
      "โครงการ",
      "เครือข่าย",
      "พื้นที่เรียนรู้",
      "บุคลากร",
    ][i],
    chartData: [
      { name: "2567", value: 55 + i * 4 },
      { name: "2568", value: 72 + i * 5 },
      { name: "2569", value: 88 + i * 6 },
    ],
    images: [],
  })),
};

async function api(action, payload = {}, token = "") {
  if (!API_URL)
    return action === "getPublicData"
      ? fallback
      : Promise.reject(new Error("ยังไม่ได้กำหนด VITE_GAS_API_URL"));
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, payload, token }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");
  return data.data;
}
function Loader({ label = "กำลังโหลดข้อมูล..." }) {
  return (
    <div className="loader-wrap">
      <span className="gold-spinner" />
      <p>{label}</p>
    </div>
  );
}
function Counter({ value = 0, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let f = 0;
    const total = 45;
    const id = setInterval(() => {
      f++;
      setN(Math.round((value * f) / total));
      if (f >= total) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [value]);
  return (
    <>
      {n.toLocaleString("th-TH")}
      {suffix}
    </>
  );
}
function driveId(url = "") {
  const s = String(url);
  return s.match(/[?&]id=([\w-]+)/)?.[1] || s.match(/\/d\/([\w-]+)/)?.[1] || "";
}
function imageCandidates(url = "") {
  const id = driveId(url);
  return [
    ...new Set(
      [
        url,
        id && `https://drive.google.com/uc?export=view&id=${id}`,
        id &&
          `https://drive.usercontent.google.com/download?id=${id}&export=view&authuser=0`,
        id && `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
        id && `https://lh3.googleusercontent.com/d/${id}=s1600`,
      ].filter(Boolean),
    ),
  ];
}
function SmartImage({ src, ...props }) {
  const candidates = useMemo(() => {
      const list = imageCandidates(src);
      if (String(props.alt || "").includes("ตราศูนย์"))
        list.push(OFFICIAL_LOGO);
      return [...new Set(list)];
    }, [src, props.alt]),
    [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [src]);
  if (!candidates.length) return null;
  return (
    <img
      {...props}
      src={candidates[index]}
      onError={(e) => {
        props.onError?.(e);
        if (index < candidates.length - 1) setIndex(index + 1);
      }}
    />
  );
}
function Header({ admin = false, onLogout }) {
  const [open, setOpen] = useState(false),
    [logo, setLogo] = useState("");
  useEffect(() => {
    api("getPublicData")
      .then((d) => {
        const url = d?.settings?.logoUrl || "";
        setLogo(url);
        if (url) {
          const stable = imageCandidates(url)[1] || url;
          let icon = document.querySelector("link[rel='icon']");
          if (!icon) {
            icon = document.createElement("link");
            icon.rel = "icon";
            document.head.appendChild(icon);
          }
          icon.type = "image/png";
          icon.href = stable;
          let apple = document.querySelector("link[rel='apple-touch-icon']");
          if (!apple) {
            apple = document.createElement("link");
            apple.rel = "apple-touch-icon";
            document.head.appendChild(apple);
          }
          apple.href = stable;
        }
      })
      .catch(() => {});
  }, []);
  return (
    <header className="topbar">
      <a className="brand" href="/">
        {logo ? (
          <span className="brand-logo">
            <SmartImage
              src={logo}
              alt="ตราศูนย์ศึกษาพระพุทธศาสนาวันอาทิตย์ วัดสี่แยกสมเด็จ"
            />
          </span>
        ) : (
          <span className="brand-seal">ธ</span>
        )}
        <span>ศพอ. วัดสี่แยกสมเด็จ</span>
      </a>
      <nav className={open ? "open" : ""}>
        <a href={admin ? "#/" : "#history"}>หน้าหลัก</a>
        <a href="#dimensions">ผลการดำเนินงาน</a>
        {!admin && (
          <>
            <a href="#gallery">ภาพกิจกรรม</a>
            <a href="#temple-missions">6 พันธกิจ</a>
            <a href="#abbots">ทำเนียบเจ้าอาวาส</a>
            <a href="#monastics">พระภิกษุ–สามเณร</a>
            <a href="#personnel">ทำเนียบบุคลากร</a>
            <a href="#awards">รางวัล</a>
          </>
        )}
        {admin ? (
          <button className="nav-button" onClick={onLogout}>
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        ) : (
          <a className="admin-link" href="#/admin">
            <ShieldCheck size={17} />
            ผู้ดูแลระบบ
          </a>
        )}
      </nav>
      <button
        className="menu"
        onClick={() => setOpen(!open)}
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
function DimensionModal({ item, onClose }) {
  if (!item) return null;
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="ปิดหน้าต่าง">
          <X />
        </button>
        <p className="eyebrow">ผลการดำเนินงาน</p>
        <h2>{item.title}</h2>
        <div className="modal-stat">
          <strong>
            <Counter value={Number(item.statValue) || 0} />
          </strong>
          <span>{item.statLabel}</span>
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={item.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                name={item.statLabel || "ผลการดำเนินงาน"}
                dataKey="value"
                fill="#800020"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="gallery">
          {item.images?.length ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500 }}
              loop={item.images.length > 1}
            >
              {item.images.map((im, i) => (
                <SwiperSlide key={i}>
                  <img src={im.url} alt={im.caption || item.title} />
                  <p>{im.caption}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="empty-gallery">
              <Image size={38} />
              <p>ภาพผลงานจะปรากฏเมื่อผู้ดูแลอัปโหลดข้อมูล</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
const factIcons = {
  map: MapPin,
  landmark: Landmark,
  calendar: CalendarDays,
  book: BookOpen,
  education: GraduationCap,
  building: Building2,
};
function HistorySection({ data, s }) {
  const facts = data.historyFacts?.length
    ? data.historyFacts
    : fallback.historyFacts;
  return (
    <section id="history" className="section intro">
      <p className="eyebrow">รากฐานแห่งศรัทธา</p>
      <h2>ประวัติความเป็นมา</h2>
      <div className="history-feature">
        {s.historyImageUrl ? (
          <img src={s.historyImageUrl} alt="ประวัติวัดสี่แยกสมเด็จ" />
        ) : (
          <div className="history-image-placeholder">
            <Landmark />
          </div>
        )}
        <p className="lead">{s.history}</p>
      </div>
      <div className="history-facts">
        {facts.map((f, i) => {
          const Icon = factIcons[f.icon] || Landmark;
          return (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Icon />
              <div>
                <span>{f.label}</span>
                <strong>{f.value}</strong>
              </div>
            </motion.article>
          );
        })}
      </div>
      <h3 className="timeline-heading">เส้นทางแห่งการพัฒนา</h3>
      <div className="timeline">
        {(data.timeline || fallback.timeline).map((t, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>{t.year}</span>
            <h3>{t.title}</h3>
            <p>{t.detail}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
const missionIcons = [
  Landmark,
  BookOpen,
  GraduationCap,
  Megaphone,
  Wrench,
  HeartHandshake,
];
function TempleManagement({ data }) {
  const missions = data.missions?.length ? data.missions : fallback.missions;
  const abbots = data.abbots?.length ? data.abbots : fallback.abbots;
  const monastics = data.monastics || [];
  const projects = data.projects || [];
  const beneficiaries = missions.reduce(
    (sum, item) => sum + (Number(item.statValue) || 0),
    0,
  );
  return (
    <>
      <section id="temple-missions" className="section temple-platform">
        <p className="eyebrow">วัดบริหารจัดการดิจิทัล</p>
        <h2>ศูนย์กลางการบริหารงานวัดและคณะสงฆ์</h2>
        <p className="section-sub">
          วัดสี่แยกสมเด็จดำเนินงานครบทั้ง 6 พันธกิจของคณะสงฆ์
          เชื่อมข้อมูล โครงการ หลักฐาน และผลลัพธ์ไว้ในระบบเดียว
        </p>
        <div className="executive-strip">
          <article><Activity /><strong>{projects.length}</strong><span>โครงการและกิจกรรม</span></article>
          <article><Users /><strong>{monastics.length}</strong><span>พระภิกษุ–สามเณร</span></article>
          <article><HandCoins /><strong>{beneficiaries}</strong><span>ผลลัพธ์รวมตามพันธกิจ</span></article>
          <article><FileText /><strong>6</strong><span>พันธกิจหลัก</span></article>
        </div>
        <div className="mission-grid">
          {missions.map((mission, index) => {
            const Icon = missionIcons[index] || Landmark;
            return (
              <motion.article key={mission.id} whileHover={{ y: -6 }}>
                <span className="mission-icon"><Icon /></span>
                <small>พันธกิจที่ {index + 1}</small>
                <h3>{mission.title}</h3>
                <p>{mission.description}</p>
                <strong>{Number(mission.statValue) || 0} {mission.statLabel}</strong>
              </motion.article>
            );
          })}
        </div>
        {!!projects.length && (
          <div className="project-showcase">
            <div className="project-showcase-heading">
              <div><p className="eyebrow">หลักฐานเชิงประจักษ์</p><h3>โครงการและกิจกรรมสำคัญ</h3></div>
              <span>{projects.length} รายการ</span>
            </div>
            <div className="project-showcase-grid">
              {projects.map((project) => (
                <article key={project.id}>
                  <small>{project.period}</small>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <RelatedAssets assets={project.assets} />
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
      <section id="abbots" className="section tinted directory-section">
        <p className="eyebrow">สืบทอดศรัทธาและการบริหาร</p>
        <h2>ทำเนียบเจ้าอาวาส</h2>
        <div className="abbot-grid">
          {abbots.map((person) => (
            <article key={person.id}>
              <div className="portrait">
                {person.imageUrl ? <SmartImage src={person.imageUrl} alt={person.name} /> : <UserRound />}
              </div>
              <div>
                <small>{person.period}</small>
                <h3>{person.name}</h3>
                <strong>{person.position}</strong>
                <p>{person.description}</p>
                <RelatedAssets assets={person.assets} compact />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="monastics" className="section directory-section">
        <p className="eyebrow">ศาสนทายาทของวัด</p>
        <h2>ทำเนียบพระภิกษุ–สามเณร</h2>
        <p className="section-sub">เผยแพร่เฉพาะข้อมูลที่เหมาะสม ส่วนข้อมูลทะเบียนละเอียดสงวนไว้สำหรับผู้ดูแล</p>
        {monastics.length ? (
          <div className="monastic-grid">
            {monastics.map((person) => (
              <article key={person.id}>
                <div className="portrait">
                  {person.imageUrl ? <SmartImage src={person.imageUrl} alt={person.name} /> : <UserRound />}
                </div>
                <h3>{person.name}</h3>
                <strong>{person.rank || person.position}</strong>
                <p>{person.duty || person.description}</p>
                <RelatedAssets assets={person.assets} compact />
              </article>
            ))}
          </div>
        ) : (
          <div className="directory-empty"><Users /><p>ผู้ดูแลสามารถเพิ่มรายนามพระภิกษุ–สามเณรได้จากระบบหลังบ้าน</p></div>
        )}
      </section>
    </>
  );
}
function EvidenceSections({ data, s }) {
  const [album, setAlbum] = useState(null),
    [query, setQuery] = useState(""),
    [year, setYear] = useState("ทั้งหมด"),
    [showAllAlbums, setShowAllAlbums] = useState(false),
    [showAllAwards, setShowAllAwards] = useState(false),
    albums = data.albums || [],
    people = data.personnel || [],
    awards = data.awards || [];
  const years = [
    "ทั้งหมด",
    ...new Set(
      [...albums.map((a) => a.date), ...awards.map((a) => a.year)].filter(
        Boolean,
      ),
    ),
  ];
  const matches = (item) => {
    const text = Object.values(item).join(" ").toLowerCase();
    return (
      text.includes(query.trim().toLowerCase()) &&
      (year === "ทั้งหมด" || item.date === year || item.year === year)
    );
  };
  const filteredAlbums = albums.filter(matches);
  const filteredAwards = awards
    .filter(matches)
    .sort((a, b) =>
      String(b.year || "").localeCompare(String(a.year || ""), "th", {
        numeric: true,
      }),
    );
  const shareSite = async () => {
    const detail = {
      title: s.centerName,
      text: s.slogan,
      url: window.location.href.split("#")[0],
    };
    if (navigator.share) return navigator.share(detail);
    await navigator.clipboard.writeText(detail.url);
    await templeAlert.fire({
      title: "คัดลอกลิงก์แล้ว",
      text: "พร้อมนำไปประชาสัมพันธ์ผ่าน Facebook หรือ LINE",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  };
  const mapQuery = encodeURIComponent(
    s.mapAddress || "วัดสี่แยกสมเด็จ ตำบลสมเด็จ อำเภอสมเด็จ จังหวัดกาฬสินธุ์",
  );
  return (
    <>
      <section id="gallery" className="section evidence-section">
        <p className="eyebrow">ภาพแห่งความภาคภูมิใจ</p>
        <h2>ภาพโครงการและกิจกรรม</h2>
        <p className="section-sub">
          รวบรวมหลักฐานการดำเนินงานเป็นแฟ้มอัลบั้ม
          สามารถแตะเพื่อเปิดชมภาพทั้งหมดได้
        </p>
        <div className="public-tools" aria-label="ค้นหาและกรองผลงาน">
          <label>
            <Search />
            <input
              type="search"
              value={query}
              placeholder="ค้นหากิจกรรม รางวัล หรือคำสำคัญ"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            aria-label="กรองตามปี"
          >
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="album-grid">
          {(showAllAlbums ? filteredAlbums : filteredAlbums.slice(0, 6)).map((a) => (
            <motion.button
              key={a.id}
              whileHover={{ y: -6 }}
              onClick={() => setAlbum(a)}
            >
              <div className="album-cover">
                {a.coverUrl ? (
                  <img src={a.coverUrl} alt={`ภาพปก ${a.title}`} loading="lazy" />
                ) : (
                  <Images />
                )}
                <span>{a.images?.length || 0} ภาพ</span>
              </div>
              <div>
                <small>{a.date}</small>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <strong>
                  เปิดแฟ้มอัลบั้ม <ChevronRight />
                </strong>
              </div>
            </motion.button>
          ))}
        </div>
        {filteredAlbums.length > 6 && (
          <button
            className="outline-button center-button"
            onClick={() => setShowAllAlbums((value) => !value)}
          >
            {showAllAlbums
              ? "แสดงรายการแนะนำ"
              : `ดูอัลบั้มทั้งหมด (${filteredAlbums.length})`}
          </button>
        )}
      </section>
      <section id="personnel" className="section tinted">
        <p className="eyebrow">พลังขับเคลื่อนศูนย์</p>
        <h2>ทำเนียบบุคลากร</h2>
        <div className="people-grid">
          {people.map((p) => (
            <article key={p.id}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} loading="lazy" />
              ) : (
                <div className="person-placeholder">
                  <UserRound />
                </div>
              )}
              <h3>{p.name}</h3>
              <strong>{p.position}</strong>
              <p>{p.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="awards" className="section evidence-section">
        <p className="eyebrow">ผลงานเชิงประจักษ์</p>
        <h2>รางวัลที่ได้รับ</h2>
        <div className="award-grid">
          {(showAllAwards ? filteredAwards : filteredAwards.slice(0, 6)).map((a) => (
            <article key={a.id}>
              {a.imageUrl ? (
                <img src={a.imageUrl} alt={a.title} loading="lazy" />
              ) : (
                <div className="award-placeholder">
                  <Award />
                </div>
              )}
              <div>
                <span>{a.year}</span>
                <h3>{a.title}</h3>
                <strong>{a.organization}</strong>
                <p>{a.description}</p>
              </div>
            </article>
          ))}
        </div>
        {filteredAwards.length > 6 && (
          <button
            className="outline-button center-button"
            onClick={() => setShowAllAwards((value) => !value)}
          >
            {showAllAwards
              ? "แสดงรายการแนะนำ"
              : `ดูรางวัลทั้งหมด (${filteredAwards.length})`}
          </button>
        )}
      </section>
      <section id="contact" className="map-section">
        <div>
          <p className="eyebrow light">เดินทางมาร่วมเรียนรู้</p>
          <h2>สถานที่ตั้งศูนย์</h2>
          <p>
            {s.mapAddress ||
              "วัดสี่แยกสมเด็จ เลขที่ 171 บ้านสี่แยกสมเด็จ หมู่ที่ 6 ตำบลสมเด็จ อำเภอสมเด็จ จังหวัดกาฬสินธุ์"}
          </p>
          <a
            className="gold-button"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin /> เปิดเส้นทางใน Google Maps
          </a>
          <div className="contact-actions">
            {s.phone && (
              <a href={`tel:${s.phone}`}>
                <Phone /> {s.phone}
              </a>
            )}
            {s.facebookUrl && (
              <a href={s.facebookUrl} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
            <button onClick={shareSite}>
              <Share2 /> แชร์เว็บไซต์
            </button>
          </div>
        </div>
        <iframe
          title="แผนที่วัดสี่แยกสมเด็จ"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
        />
      </section>
      <AnimatePresence>
        {album && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setAlbum(null)}
          >
            <motion.div
              className="modal album-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                className="close"
                onClick={() => setAlbum(null)}
                aria-label="ปิดอัลบั้มภาพ"
              >
                <X />
              </button>
              <p className="eyebrow">แฟ้มอัลบั้มภาพ</p>
              <h2>{album.title}</h2>
              <p>{album.description}</p>
              {album.images?.length ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                >
                  <>
                    {album.images.map((im, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={im.url}
                          alt={im.caption || album.title}
                          loading="lazy"
                        />
                        <p>{im.caption}</p>
                      </SwiperSlide>
                    ))}
                  </>
                </Swiper>
              ) : (
                <div className="empty-gallery">
                  <Images />
                  <p>ยังไม่มีภาพในอัลบั้มนี้</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
function PublicApp() {
  const [data, setData] = useState(null),
    [selected, setSelected] = useState(null);
  useEffect(() => {
    api("getPublicData")
      .then(setData)
      .catch(() => setData(fallback));
  }, []);
  if (!data) return <Loader />;
  const s = data.settings || fallback.settings;
  return (
    <>
      <Header />
      <main>
        <section
          className="hero"
          style={{ "--hero": s.bannerUrl ? `url(${s.bannerUrl})` : "none" }}
        >
          <div className="hero-overlay" />
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {s.logoUrl ? (
              <img className="logo" src={s.logoUrl} />
            ) : (
              <div className="logo-placeholder">ธ</div>
            )}
            <p className="eyebrow light">ยินดีต้อนรับสู่</p>
            <h1>{s.centerName}</h1>
            <p className="slogan">{s.slogan}</p>
            <a className="gold-button" href="#dimensions">
              ชมผลการดำเนินงาน <ChevronRight />
            </a>
          </motion.div>
        </section>
        <HistorySection data={data} s={s} />
        <TempleManagement data={data} />
        <section className="stats-band">
          <div className="quick-stats">
            {(data.quickStats || []).map((x, i) => (
              <article key={i}>
                <strong>
                  <Counter value={Number(x.value)} suffix={x.suffix} />
                </strong>
                <span>{x.label}</span>
              </article>
            ))}
          </div>
        </section>
        <section id="dimensions" className="section">
          <p className="eyebrow">ประจักษ์พยานแห่งการพัฒนา</p>
          <h2>ผลการดำเนินงาน 5 ด้าน</h2>
          <p className="section-sub">
            แตะที่การ์ดเพื่อดูสถิติ กราฟ และภาพกิจกรรมแบบ Interactive
          </p>
          <div className="dimension-grid">
            {(data.dimensions || fallback.dimensions).map((d, i) => {
              const meta =
                  dimensions.find((x) => x.id === d.id) || dimensions[i],
                Icon = meta.icon;
              return (
                <motion.button
                  key={d.id}
                  className="dimension-card"
                  whileHover={{ y: -7 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected({ ...meta, ...d })}
                >
                  <span className="card-number">0{i + 1}</span>
                  <Icon />
                  <h3>{d.title || meta.title}</h3>
                  <p>{d.desc || meta.desc}</p>
                  <span className="view">
                    เปิดดูรายละเอียด <ChevronRight />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>
        <EvidenceSections data={data} s={s} />
      </main>
      <footer>
        <strong>{s.centerName}</strong>
        <p>สืบสานพระพุทธศาสนา พัฒนาเยาวชน และสร้างสรรค์ชุมชนอย่างยั่งยืน</p>
        <div className="developer-credit">
          พัฒนาและออกแบบระบบโดย <b>พระมหาธงชัย วิลาสินี</b>
        </div>
      </footer>
      <AnimatePresence>
        {selected && (
          <DimensionModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function Dropzone({ label, onFile }) {
  const [drag, setDrag] = useState(false),
    multi = String(label).includes("เพิ่มภาพในอัลบั้ม");
  const send = async (files) => {
    const images = [...files].filter((f) => f.type.startsWith("image/"));
    for (const f of multi ? images : images.slice(0, 1)) await onFile(f);
  };
  return (
    <div
      className={`dropzone ${drag ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDrag(false);
        const files = multi
          ? await filesFromDrop(e)
          : [...e.dataTransfer.files];
        await send(files);
      }}
    >
      <Upload />
      <strong>{label}</strong>
      <span>
        {multi
          ? "ลากหลายรูปหรือทั้งโฟลเดอร์มาวางได้ทันที"
          : "ลากรูปมาวาง หรือแตะเพื่อเลือกไฟล์"}{" "}
        (JPG, PNG, WebP)
      </span>
      <div className="drop-actions">
        <label>
          {multi ? "เลือกรูปหลายไฟล์" : "เลือกไฟล์"}
          <input
            type="file"
            accept="image/*"
            multiple={multi}
            onChange={(e) => send(e.target.files)}
          />
        </label>
        {multi && (
          <label>
            เลือกทั้งโฟลเดอร์
            <input
              type="file"
              accept="image/*"
              multiple
              webkitdirectory=""
              directory=""
              onChange={(e) => send(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
function AssetDropzone({ onFiles, busy = false }) {
  const [drag, setDrag] = useState(false);
  const send = (files) => {
    const accepted = [...files].filter((file) =>
      /^(image\/|video\/|application\/pdf$|application\/msword$|application\/vnd\.openxmlformats-officedocument|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml)/.test(file.type),
    );
    if (accepted.length) onFiles(accepted);
  };
  return (
    <label
      className={`asset-dropzone ${drag ? "dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); send(e.dataTransfer.files); }}
    >
      <Paperclip />
      <strong>{busy ? "กำลังอัปโหลด..." : "เพิ่มภาพ เอกสาร หรือวิดีโอ"}</strong>
      <span>ลากไฟล์มาวาง หรือกดเลือกหลายไฟล์ (ไฟล์ละไม่เกิน 20 MB)</span>
      <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => send(e.target.files)} />
    </label>
  );
}
function RelatedAssets({ assets = [], compact = false }) {
  if (!assets.length) return null;
  return (
    <div className={`related-assets ${compact ? "compact" : ""}`}>
      {assets.map((asset, index) => (
        <a key={asset.fileId || asset.url || index} href={asset.url} target="_blank" rel="noreferrer">
          {String(asset.type || "").startsWith("image/") ? (
            <SmartImage src={asset.url} alt={asset.title || "ภาพประกอบ"} />
          ) : String(asset.type || "").startsWith("video/") ? <Video /> : <FileText />}
          <span>{asset.title || asset.name || `ไฟล์แนบ ${index + 1}`}</span>
        </a>
      ))}
    </div>
  );
}
async function filesFromDrop(event) {
  const items = [...(event.dataTransfer.items || [])],
    out = [];
  async function walk(entry) {
    if (entry.isFile)
      return new Promise((resolve) =>
        entry.file((f) => {
          if (f.type.startsWith("image/")) out.push(f);
          resolve();
        }),
      );
    if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((resolve) => reader.readEntries(resolve));
        for (const child of batch) await walk(child);
      } while (batch.length);
    }
  }
  for (const item of items) {
    const entry = item.webkitGetAsEntry?.();
    if (entry) await walk(entry);
  }
  if (!out.length)
    [...event.dataTransfer.files].forEach(
      (f) => f.type.startsWith("image/") && out.push(f),
    );
  return out;
}
function MultiDropzone({ label, onFiles, busy = false }) {
  const [drag, setDrag] = useState(false);
  const choose = (e) => {
    const files = [...e.target.files].filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length) onFiles(files);
    e.target.value = "";
  };
  return (
    <div
      className={`multi-dropzone ${drag ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDrag(false);
        const files = await filesFromDrop(e);
        if (files.length) onFiles(files);
      }}
    >
      <Upload />
      <strong>{busy ? "กำลังอัปโหลดภาพ..." : label}</strong>
      <span>ลากหลายรูปหรือทั้งโฟลเดอร์มาวางได้ทันที</span>
      <div>
        <label>
          เลือกรูปหลายไฟล์
          <input type="file" accept="image/*" multiple onChange={choose} />
        </label>
        <label>
          เลือกทั้งโฟลเดอร์
          <input
            type="file"
            accept="image/*"
            multiple
            webkitdirectory=""
            directory=""
            onChange={choose}
          />
        </label>
      </div>
    </div>
  );
}
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        data: String(r.result).split(",")[1],
      });
    r.onerror = reject;
    r.readAsDataURL(file);
  });
function AdminHistory({ data, setData, upload }) {
  const settings = data.settings || {},
    facts = data.historyFacts || [],
    timeline = data.timeline || [];
  const setSetting = (k, v) =>
    setData({ ...data, settings: { ...settings, [k]: v } });
  const setFact = (i, k, v) => {
    const a = [...facts];
    a[i] = { ...a[i], [k]: v };
    setData({ ...data, historyFacts: a });
  };
  const setTime = (i, k, v) => {
    const a = [...timeline];
    a[i] = { ...a[i], [k]: v };
    setData({ ...data, timeline: a });
  };
  return (
    <div className="admin-history">
      <section className="panel form-grid">
        <label className="full">
          ประวัติความเป็นมา
          <textarea
            rows="9"
            value={settings.history || ""}
            onChange={(e) => setSetting("history", e.target.value)}
          />
        </label>
        <div className="full">
          <Dropzone
            label="อัปโหลดภาพประวัติหลัก"
            onFile={(f) => upload(f, "history")}
          />
          {settings.historyImageUrl && (
            <img
              className="upload-preview history-preview"
              src={settings.historyImageUrl}
            />
          )}
        </div>
      </section>
      <section className="panel">
        <div className="section-admin-title">
          <div>
            <h2>การ์ดข้อมูลสำคัญ</h2>
            <p>เลือกไอคอนและแก้ข้อมูลที่ต้องการแสดงใต้ประวัติ</p>
          </div>
          <button
            className="secondary"
            onClick={() =>
              setData({
                ...data,
                historyFacts: [
                  ...facts,
                  {
                    icon: "landmark",
                    label: "หัวข้อใหม่",
                    value: "รายละเอียด",
                  },
                ],
              })
            }
          >
            + เพิ่มการ์ด
          </button>
        </div>
        <div className="fact-edit-grid">
          {facts.map((f, i) => (
            <article key={i}>
              <select
                value={f.icon || "landmark"}
                onChange={(e) => setFact(i, "icon", e.target.value)}
              >
                <option value="map">ที่ตั้ง</option>
                <option value="landmark">สถานที่สำคัญ</option>
                <option value="calendar">ปฏิทิน</option>
                <option value="book">การศึกษา</option>
                <option value="education">ผู้เรียน</option>
                <option value="building">อาคาร</option>
              </select>
              <input
                value={f.label || ""}
                placeholder="หัวข้อ"
                onChange={(e) => setFact(i, "label", e.target.value)}
              />
              <textarea
                rows="2"
                value={f.value || ""}
                placeholder="รายละเอียด"
                onChange={(e) => setFact(i, "value", e.target.value)}
              />
              <button
                className="icon-danger"
                onClick={async () => {
                  if (!(await confirmDelete("การ์ดข้อมูลนี้"))) return;
                  setData({
                    ...data,
                    historyFacts: facts.filter((_, x) => x !== i),
                  });
                }}
              >
                <Trash2 /> ลบ
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="section-admin-title">
          <div>
            <h2>เส้นเวลาประวัติ</h2>
            <p>เพิ่ม แก้ไข หรือลบเหตุการณ์สำคัญได้ตามจริง</p>
          </div>
          <button
            className="secondary"
            onClick={() =>
              setData({
                ...data,
                timeline: [
                  ...timeline,
                  {
                    year: "พ.ศ. ",
                    title: "เหตุการณ์ใหม่",
                    detail: "รายละเอียด",
                  },
                ],
              })
            }
          >
            + เพิ่มเหตุการณ์
          </button>
        </div>
        <div className="timeline-edit">
          {timeline.map((t, i) => (
            <article key={i}>
              <input
                value={t.year || ""}
                placeholder="ปี"
                onChange={(e) => setTime(i, "year", e.target.value)}
              />
              <input
                value={t.title || ""}
                placeholder="หัวข้อ"
                onChange={(e) => setTime(i, "title", e.target.value)}
              />
              <textarea
                rows="2"
                value={t.detail || ""}
                placeholder="รายละเอียด"
                onChange={(e) => setTime(i, "detail", e.target.value)}
              />
              <button
                className="icon-danger"
                onClick={async () => {
                  if (!(await confirmDelete("เหตุการณ์นี้"))) return;
                  setData({
                    ...data,
                    timeline: timeline.filter((_, x) => x !== i),
                  });
                }}
              >
                <Trash2 />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
function AdminContent({ data, setData, upload }) {
  const [sub, setSub] = useState("albums");
  const [query, setQuery] = useState("");
  const list = data[sub] || [];
  const visible = list
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      Object.values(item).some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    );
  const update = (i, k, v) => {
    const a = [...list];
    a[i] = { ...a[i], [k]: v };
    setData({ ...data, [sub]: a });
  };
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    setData({ ...data, [sub]: next });
  };
  const add = () => {
    const id = Date.now().toString();
    const item =
      sub === "albums"
        ? {
            id,
            title: "อัลบั้มใหม่",
            date: "พ.ศ. 2569",
            description: "",
            coverUrl: "",
            images: [],
          }
        : sub === "personnel"
          ? {
              id,
              name: "ชื่อบุคลากร",
              position: "ตำแหน่ง",
              description: "",
              imageUrl: "",
            }
          : {
              id,
              title: "ชื่อรางวัล",
              year: "พ.ศ. 2569",
              organization: "",
              description: "",
              imageUrl: "",
            };
    setData({ ...data, [sub]: [...list, item] });
  };
  return (
    <div>
      <section className="panel map-admin">
        <h2>แผนที่และที่ตั้ง</h2>
        <label>
          ที่อยู่สำหรับค้นหาใน Google Maps
          <input
            value={data.settings.mapAddress || ""}
            placeholder="วัดสี่แยกสมเด็จ เลขที่ 171..."
            onChange={(e) =>
              setData({
                ...data,
                settings: { ...data.settings, mapAddress: e.target.value },
              })
            }
          />
        </label>
      </section>
      <div className="content-tabs">
        <button
          className={sub === "albums" ? "active" : ""}
          onClick={() => setSub("albums")}
        >
          <Images />
          อัลบั้มภาพ
        </button>
        <button
          className={sub === "personnel" ? "active" : ""}
          onClick={() => setSub("personnel")}
        >
          <Users />
          บุคลากร
        </button>
        <button
          className={sub === "awards" ? "active" : ""}
          onClick={() => setSub("awards")}
        >
          <Award />
          รางวัล
        </button>
      </div>
      <section className="panel">
        <div className="section-admin-title">
          <div>
            <h2>
              {sub === "albums"
                ? "แฟ้มอัลบั้มภาพกิจกรรม"
                : sub === "personnel"
                  ? "ทำเนียบบุคลากร"
                  : "รางวัลที่ได้รับ"}
            </h2>
            <p>เพิ่ม แก้ไข ลบ และอัปโหลดภาพประกอบได้</p>
          </div>
          <button className="secondary" onClick={add}>
            + เพิ่มรายการ
          </button>
        </div>
        <label className="admin-search">
          ค้นหาในหมวดนี้
          <input
            type="search"
            value={query}
            placeholder="พิมพ์ชื่อ ปี หน่วยงาน หรือคำสำคัญ..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="content-edit-list">
          {visible.map(({ item, index: i }) => (
            <article key={item.id}>
              <div className="content-edit-image">
                {item.coverUrl || item.imageUrl ? (
                  <img src={item.coverUrl || item.imageUrl} />
                ) : (
                  <Image />
                )}
                <Dropzone
                  label="อัปโหลดภาพ"
                  onFile={(f) =>
                    upload(
                      f,
                      sub === "albums"
                        ? "albumCover"
                        : sub === "personnel"
                          ? "personnel"
                          : "award",
                      item.id,
                    )
                  }
                />
              </div>
              <div className="content-edit-fields">
                <div className="reorder-tools" aria-label="จัดลำดับรายการ">
                  <span>ลำดับที่ {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="เลื่อนขึ้น"
                  >
                    <ArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === list.length - 1}
                    aria-label="เลื่อนลง"
                  >
                    <ArrowDown />
                  </button>
                </div>
                {sub === "personnel" ? (
                  <>
                    <input
                      value={item.name || ""}
                      placeholder="ชื่อ–ฉายา/นามสกุล"
                      onChange={(e) => update(i, "name", e.target.value)}
                    />
                    <input
                      value={item.position || ""}
                      placeholder="ตำแหน่ง"
                      onChange={(e) => update(i, "position", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <input
                      value={item.title || ""}
                      placeholder={
                        sub === "albums" ? "ชื่ออัลบั้ม" : "ชื่อรางวัล"
                      }
                      onChange={(e) => update(i, "title", e.target.value)}
                    />
                    <input
                      value={(sub === "albums" ? item.date : item.year) || ""}
                      placeholder="ปี/วันที่"
                      onChange={(e) =>
                        update(
                          i,
                          sub === "albums" ? "date" : "year",
                          e.target.value,
                        )
                      }
                    />
                    {sub === "awards" && (
                      <input
                        value={item.organization || ""}
                        placeholder="หน่วยงานที่มอบ"
                        onChange={(e) =>
                          update(i, "organization", e.target.value)
                        }
                      />
                    )}
                  </>
                )}
                <textarea
                  rows="3"
                  value={item.description || ""}
                  placeholder="รายละเอียด"
                  onChange={(e) => update(i, "description", e.target.value)}
                />
                <label>
                  สถานะการเผยแพร่
                  <select
                    value={item.status || "published"}
                    onChange={(e) => update(i, "status", e.target.value)}
                  >
                    <option value="published">เผยแพร่บนเว็บไซต์</option>
                    <option value="draft">ฉบับร่าง — ซ่อนจากหน้าบ้าน</option>
                  </select>
                </label>
                {sub === "albums" && (
                  <>
                    <Dropzone
                      label={`เพิ่มภาพในอัลบั้ม (${item.images?.length || 0} ภาพ)`}
                      onFile={(f) => upload(f, "albumImage", item.id)}
                    />
                    <div className="mini-gallery">
                      {item.images?.map((im, ii) => (
                        <div key={ii}>
                          <img src={im.url} />
                          <input
                            value={im.caption || ""}
                            placeholder="คำบรรยาย"
                            onChange={(e) => {
                              const a = [...list],
                                imgs = [...item.images];
                              imgs[ii] = { ...im, caption: e.target.value };
                              a[i] = { ...item, images: imgs };
                              setData({ ...data, [sub]: a });
                            }}
                          />
                          <button
                            className="icon-danger"
                            onClick={async () => {
                              if (!(await confirmDelete("ภาพนี้"))) return;
                              const a = [...list];
                              a[i] = {
                                ...item,
                                images: item.images.filter((_, x) => x !== ii),
                              };
                              setData({ ...data, [sub]: a });
                            }}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <button
                  className="icon-danger delete-row"
                  onClick={async () => {
                    if (!(await confirmDelete("รายการนี้"))) return;
                    setData({ ...data, [sub]: list.filter((_, x) => x !== i) });
                  }}
                >
                  <Trash2 /> ลบรายการนี้
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
const registryMeta = {
  abbots: { title: "ทำเนียบเจ้าอาวาส", icon: Landmark, name: "ชื่อ–ฉายา", secondary: "ช่วงเวลาการดำรงตำแหน่ง" },
  monastics: { title: "ทะเบียนพระภิกษุ–สามเณร", icon: Users, name: "ชื่อ–ฉายา", secondary: "สมณศักดิ์/สถานะ" },
  missions: { title: "ข้อมูล 6 พันธกิจ", icon: Activity, name: "ชื่อพันธกิจ", secondary: "หน่วยนับผลลัพธ์" },
  projects: { title: "ทะเบียนโครงการและกิจกรรม", icon: FileText, name: "ชื่อโครงการ/กิจกรรม", secondary: "ปี/วันที่ดำเนินงาน" },
};
function AdminTempleRegistry({ data, setData, upload }) {
  const [section, setSection] = useState("abbots");
  const [dragged, setDragged] = useState(null);
  const meta = registryMeta[section];
  const list = data[section] || [];
  const update = (index, key, value) => {
    const next = [...list];
    next[index] = { ...next[index], [key]: value };
    setData({ ...data, [section]: next });
  };
  const add = () => {
    const base = { id: `${section}-${Date.now()}`, status: "published", description: "", imageUrl: "" };
    const item =
      section === "missions"
        ? { ...base, title: "ชื่อพันธกิจ", statValue: 0, statLabel: "รายการ" }
        : section === "projects"
          ? { ...base, title: "ชื่อโครงการ", period: "พ.ศ. 2569", missionId: "governance" }
          : { ...base, name: "ชื่อ–ฉายา", position: "", period: "", rank: "", duty: "" };
    setData({ ...data, [section]: [...list, item] });
  };
  const remove = async (index) => {
    if (!(await confirmDelete(meta.title))) return;
    setData({ ...data, [section]: list.filter((_, i) => i !== index) });
  };
  const move = (from, to) => {
    if (from === null || from === to) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setData({ ...data, [section]: next });
  };
  const uploadAssets = async (files, item) => {
    for (const file of files) await upload(file, "registryAsset", `${section}:${item.id}`);
  };
  const removeAsset = (itemIndex, assetIndex) => {
    const assets = [...(list[itemIndex].assets || [])];
    assets.splice(assetIndex, 1);
    update(itemIndex, "assets", assets);
  };
  return (
    <div>
      <div className="content-tabs registry-tabs">
        {Object.entries(registryMeta).map(([key, item]) => {
          const Icon = item.icon;
          return <button key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}><Icon />{item.title}</button>;
        })}
      </div>
      <section className="panel">
        <div className="section-admin-title">
          <div><h2>{meta.title}</h2><p>เพิ่ม แก้ไข จัดลำดับ และกำหนดสถานะเผยแพร่ได้จากหน้าเดียว</p></div>
          <button className="secondary" onClick={add}>+ เพิ่มรายการ</button>
        </div>
        <div className="registry-editor">
          {list.map((item, index) => (
            <article key={item.id} draggable
              className={dragged === index ? "sorting" : ""}
              onDragStart={() => setDragged(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { move(dragged, index); setDragged(null); }}
              onDragEnd={() => setDragged(null)}>
              <div className="drag-handle" title="ลากเพื่อสลับลำดับ"><GripVertical /><span>ลากจัดลำดับ</span></div>
              {section !== "missions" && (
                <div className="content-edit-image">
                  {item.imageUrl ? <SmartImage src={item.imageUrl} alt="" /> : <UserRound />}
                  {(section === "abbots" || section === "monastics") && (
                    <Dropzone label="อัปโหลดภาพ" onFile={(file) => upload(file, section === "abbots" ? "abbot" : "monastic", item.id)} />
                  )}
                </div>
              )}
              <div className="content-edit-fields">
                <small>ลำดับที่ {index + 1}</small>
                <input value={item.name || item.title || ""} placeholder={meta.name}
                  onChange={(e) => update(index, item.name !== undefined ? "name" : "title", e.target.value)} />
                {section === "missions" ? (
                  <div className="form-grid compact">
                    <label>ผลลัพธ์<input type="number" min="0" value={item.statValue || 0} onChange={(e) => update(index, "statValue", Number(e.target.value))} /></label>
                    <label>{meta.secondary}<input value={item.statLabel || ""} onChange={(e) => update(index, "statLabel", e.target.value)} /></label>
                  </div>
                ) : section === "projects" ? (
                  <div className="form-grid compact">
                    <label>{meta.secondary}<input value={item.period || ""} onChange={(e) => update(index, "period", e.target.value)} /></label>
                    <label>พันธกิจ
                      <select value={item.missionId || "governance"} onChange={(e) => update(index, "missionId", e.target.value)}>
                        {(data.missions || fallback.missions).map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                      </select>
                    </label>
                  </div>
                ) : (
                  <div className="form-grid compact">
                    <label>ตำแหน่ง/สถานะ<input value={item.position || item.rank || ""} onChange={(e) => update(index, section === "monastics" ? "rank" : "position", e.target.value)} /></label>
                    <label>{meta.secondary}<input value={item.period || ""} onChange={(e) => update(index, "period", e.target.value)} /></label>
                    {section === "monastics" && <label>หน้าที่รับผิดชอบ<input value={item.duty || ""} onChange={(e) => update(index, "duty", e.target.value)} /></label>}
                  </div>
                )}
                <textarea rows="3" value={item.description || ""} placeholder="รายละเอียดที่เหมาะสมสำหรับเผยแพร่" onChange={(e) => update(index, "description", e.target.value)} />
                {section !== "missions" && (
                  <div className="asset-manager">
                    <AssetDropzone onFiles={(files) => uploadAssets(files, item)} />
                    <div className="asset-editor-grid">
                      {(item.assets || []).map((asset, assetIndex) => (
                        <div key={asset.fileId || asset.url || assetIndex}>
                          {String(asset.type || "").startsWith("image/") ? <SmartImage src={asset.url} alt="" /> : <FileText />}
                          <input value={asset.title || asset.name || ""} aria-label="ชื่อไฟล์ที่แสดง"
                            onChange={(e) => {
                              const assets = [...(item.assets || [])];
                              assets[assetIndex] = { ...asset, title: e.target.value };
                              update(index, "assets", assets);
                            }} />
                          <a href={asset.url} target="_blank" rel="noreferrer"><LinkIcon /> เปิดไฟล์</a>
                          <button type="button" onClick={() => removeAsset(index, assetIndex)}><Trash2 /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <label>สถานะ
                  <select value={item.status || "published"} onChange={(e) => update(index, "status", e.target.value)}>
                    <option value="published">เผยแพร่บนเว็บไซต์</option>
                    <option value="draft">ฉบับร่าง/ข้อมูลภายใน</option>
                  </select>
                </label>
                <button className="icon-danger delete-row" onClick={() => remove(index)}><Trash2 /> ลบรายการ</button>
              </div>
            </article>
          ))}
          {!list.length && <p className="empty-state">ยังไม่มีข้อมูล กด “เพิ่มรายการ” เพื่อเริ่มบันทึก</p>}
        </div>
      </section>
    </div>
  );
}
function AdminSafety({ token, reload, setNotice }) {
  const [backups, setBackups] = useState([]);
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);
  const loadSafety = async () => {
    setBusy(true);
    try {
      const [backupRows, logRows] = await Promise.all([
        api("getBackups", {}, token),
        api("getActivityLog", {}, token),
      ]);
      setBackups(backupRows || []);
      setLogs(logRows || []);
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    loadSafety();
  }, []);
  const restore = async (backup) => {
    if (!(await confirmAction({
      title: "กู้คืนข้อมูลจากชุดสำรองนี้หรือไม่?",
      text: `ชุดสำรอง ${backup.id}<br>ระบบจะสำรองข้อมูลปัจจุบันไว้อีกหนึ่งชุดก่อนเริ่มกู้คืน เพื่อให้ย้อนกลับได้อย่างปลอดภัย`,
      confirmText: "สำรองและกู้คืน",
      icon: "question",
    }))) return;
    setBusy(true);
    try {
      await api("restoreBackup", { id: backup.id }, token);
      setNotice("กู้คืนข้อมูลสำเร็จแล้ว");
      await reload();
      await loadSafety();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const organizeFolders = async () => {
    if (!(await confirmAction({
      title: "จัดระเบียบโฟลเดอร์อัลบั้มหรือไม่?",
      text: "ระบบจะปรับเฉพาะชื่อโฟลเดอร์ให้ตรงกับเว็บไซต์ โดยไม่ลบหรือย้ายรูปภาพ",
      confirmText: "จัดระเบียบโฟลเดอร์",
      icon: "question",
    }))) return;
    setBusy(true);
    try {
      const result = await api("organizeAlbumFolders", {}, token);
      setNotice(
        `จัดชื่อโฟลเดอร์สำเร็จ ${result.renamed} จาก ${result.total} อัลบั้ม`,
      );
      await loadSafety();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const dateText = (value) =>
    value
      ? new Date(value).toLocaleString("th-TH", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";
  return (
    <div className="safety-grid">
      <section className="panel">
        <div className="section-admin-title">
          <div>
            <h2>
              <DatabaseBackup /> ชุดสำรองล่าสุด
            </h2>
            <p>ระบบเก็บอัตโนมัติสูงสุด 10 ชุด</p>
          </div>
          <button className="secondary" onClick={loadSafety} disabled={busy}>
            รีเฟรช
          </button>
        </div>
        <div className="safety-list">
          {backups.length ? (
            backups.map((b) => (
              <article key={b.id}>
                <div>
                  <strong>{b.reason}</strong>
                  <span>{dateText(b.createdAt)}</span>
                  <small>{b.id}</small>
                </div>
                <button
                  className="secondary"
                  onClick={() => restore(b)}
                  disabled={busy}
                >
                  กู้คืน
                </button>
              </article>
            ))
          ) : (
            <p className="empty-state">
              ยังไม่มีชุดสำรอง ชุดแรกจะสร้างเมื่อบันทึกข้อมูล
            </p>
          )}
        </div>
      </section>
      <section className="panel">
        <div className="section-admin-title">
          <div>
            <h2>
              <ScrollText /> ประวัติการทำงาน
            </h2>
            <p>แสดง 100 รายการล่าสุด</p>
          </div>
        </div>
        <div className="activity-list">
          {logs.length ? (
            logs.map((log, i) => (
              <article key={`${log.createdAt}-${i}`}>
                <span className="activity-badge">{log.action}</span>
                <div>
                  <strong>{log.detail}</strong>
                  <small>{dateText(log.createdAt)}</small>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">ยังไม่มีประวัติการทำงาน</p>
          )}
        </div>
      </section>
      <section className="panel folder-organizer">
        <div className="section-admin-title">
          <div>
            <h2>
              <Images /> จัดระเบียบคลังภาพ
            </h2>
            <p>
              เปลี่ยนชื่อโฟลเดอร์เดิมเป็น “ปี_ชื่ออัลบั้ม”
              โดยไม่ลบหรือย้ายรูปภาพ
            </p>
          </div>
          <button
            className="primary"
            onClick={organizeFolders}
            disabled={busy}
          >
            จัดชื่อโฟลเดอร์
          </button>
        </div>
      </section>
    </div>
  );
}
function AdminApp() {
  const [token, setToken] = useState(
      sessionStorage.getItem("adminToken") || "",
    ),
    [password, setPassword] = useState(""),
    [data, setData] = useState(null),
    [tab, setTab] = useState("settings"),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [savedSnapshot, setSavedSnapshot] = useState("");
  const load = () =>
    api("getAdminData", {}, token)
      .then((fresh) => {
        setData(fresh);
        setSavedSnapshot(JSON.stringify(fresh));
      })
      .catch((e) => {
        setNotice(e.message);
        setToken("");
      });
  useEffect(() => {
    if (token) load();
  }, [token]);
  const dirty = Boolean(
    data && savedSnapshot && JSON.stringify(data) !== savedSnapshot,
  );
  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api("login", { password });
      sessionStorage.setItem("adminToken", r.token);
      setToken(r.token);
      setNotice("เข้าสู่ระบบสำเร็จ");
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const save = async () => {
    setBusy(true);
    try {
      await api("saveAll", data, token);
      setNotice("บันทึกข้อมูลเรียบร้อยแล้ว");
      await load();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const upload = async (file, kind, dimensionId = "") => {
    setBusy(true);
    try {
      const encoded = await fileToBase64(file);
      const r = await api(
        "uploadImage",
        { ...encoded, kind, dimensionId },
        token,
      );
      setNotice(kind === "registryAsset" ? "เพิ่มไฟล์ประกอบเรียบร้อยแล้ว" : "อัปโหลดรูปภาพเรียบร้อยแล้ว");
      await load();
      return r;
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const logout = () => {
    sessionStorage.removeItem("adminToken");
    setToken("");
  };
  if (!token)
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={login}>
          <div className="login-icon">
            <ShieldCheck />
          </div>
          <p className="eyebrow">ระบบสำหรับเจ้าหน้าที่</p>
          <h1>เข้าสู่ระบบผู้ดูแล</h1>
          <p>จัดการข้อมูลเว็บไซต์ สถิติ และภาพผลการดำเนินงาน</p>
          <label>
            รหัสผ่าน
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </label>
          <button className="primary" disabled={busy}>
            {busy ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
          {notice && <p className="notice">{notice}</p>}
          <a href="#/">← กลับหน้าเว็บไซต์</a>
        </form>
      </div>
    );
  if (!data) return <Loader label="กำลังเตรียมระบบจัดการ..." />;
  const updateSetting = (k, v) =>
    setData({ ...data, settings: { ...data.settings, [k]: v } });
  return (
    <>
      <Header admin onLogout={logout} />
      <div className="admin-layout">
        <aside>
          <h2>แผงควบคุม</h2>
          <button
            className={`safety-nav ${tab === "safety" ? "active" : ""}`}
            onClick={() => setTab("safety")}
          >
            <DatabaseBackup />
            <span>สำรองและประวัติ</span>
            <small>ระบบใหม่</small>
          </button>
          <button
            className={tab === "settings" ? "active" : ""}
            onClick={() => setTab("settings")}
          >
            <Settings />
            การตั้งค่าเว็บไซต์
          </button>
          <button
            className={tab === "history" ? "active" : ""}
            onClick={() => setTab("history")}
          >
            <History />
            จัดการประวัติ
          </button>
          <button
            className={tab === "content" ? "active" : ""}
            onClick={() => setTab("content")}
          >
            <Images />
            สื่อ บุคลากร และรางวัล
          </button>
          <button
            className={tab === "temple" ? "active" : ""}
            onClick={() => setTab("temple")}
          >
            <Landmark />
            งานวัดและคณะสงฆ์
          </button>
          <button
            className={tab === "dimensions" ? "active" : ""}
            onClick={() => setTab("dimensions")}
          >
            <BarChart3 />
            ข้อมูล 5 ด้าน
          </button>
          <a href="#/" target="_blank">
            <Eye />
            ดูหน้าเว็บไซต์
          </a>
        </aside>
        <main className="admin-main">
          <div className="admin-heading">
            <div>
              <p className="eyebrow">ADMIN DASHBOARD</p>
              <h1>
                {tab === "settings"
                  ? "การตั้งค่าเว็บไซต์"
                  : tab === "history"
                    ? "จัดการประวัติและข้อมูลสำคัญ"
                    : tab === "content"
                      ? "สื่อ บุคลากร รางวัล และแผนที่"
                      : tab === "temple"
                        ? "ศูนย์บริหารงานวัดและคณะสงฆ์"
                      : tab === "dimensions"
                        ? "การจัดการข้อมูล 5 ด้าน"
                        : "ศูนย์ความปลอดภัยข้อมูล"}
              </h1>
            </div>
            <button
              className={`primary save ${dirty ? "has-changes" : ""}`}
              onClick={save}
              disabled={busy || !dirty}
            >
              <Save />{" "}
              {busy
                ? "กำลังดำเนินการ..."
                : dirty
                  ? "บันทึกการเปลี่ยนแปลง"
                  : "บันทึกแล้ว"}
            </button>
          </div>
          {notice && <div className="notice-bar">{notice}</div>}
          {tab === "settings" ? (
            <div className="panel form-grid">
              <label>
                ชื่อศูนย์
                <input
                  value={data.settings.centerName || ""}
                  onChange={(e) => updateSetting("centerName", e.target.value)}
                />
              </label>
              <label>
                สโลแกน
                <input
                  value={data.settings.slogan || ""}
                  onChange={(e) => updateSetting("slogan", e.target.value)}
                />
              </label>
              <label>
                โทรศัพท์ติดต่อ
                <input
                  value={data.settings.phone || ""}
                  placeholder="เช่น 08x-xxx-xxxx"
                  onChange={(e) => updateSetting("phone", e.target.value)}
                />
              </label>
              <label>
                Facebook
                <input
                  value={data.settings.facebookUrl || ""}
                  placeholder="https://www.facebook.com/..."
                  onChange={(e) =>
                    updateSetting("facebookUrl", e.target.value)
                  }
                />
              </label>
              <div>
                <Dropzone
                  label="อัปโหลดโลโก้ศูนย์"
                  onFile={(f) => upload(f, "logo")}
                />
                {data.settings.logoUrl && (
                  <img
                    className="upload-preview contain"
                    src={data.settings.logoUrl}
                  />
                )}
              </div>
              <div>
                <Dropzone
                  label="อัปโหลดภาพแบนเนอร์"
                  onFile={(f) => upload(f, "banner")}
                />
                {data.settings.bannerUrl && (
                  <img
                    className="upload-preview"
                    src={data.settings.bannerUrl}
                  />
                )}
              </div>
            </div>
          ) : tab === "history" ? (
            <AdminHistory data={data} setData={setData} upload={upload} />
          ) : tab === "content" ? (
            <AdminContent data={data} setData={setData} upload={upload} />
          ) : tab === "temple" ? (
            <AdminTempleRegistry data={data} setData={setData} upload={upload} />
          ) : tab === "dimensions" ? (
            <div className="admin-dimensions">
              {data.dimensions.map((d, idx) => (
                <section className="panel dimension-editor" key={d.id}>
                  <div className="editor-title">
                    <span>{idx + 1}</span>
                    <h2>{d.title}</h2>
                  </div>
                  <div className="form-grid compact">
                    <label>
                      ชื่อสถิติหลัก
                      <input
                        value={d.statLabel || ""}
                        onChange={(e) => {
                          const a = [...data.dimensions];
                          a[idx] = { ...d, statLabel: e.target.value };
                          setData({ ...data, dimensions: a });
                        }}
                      />
                    </label>
                    <label>
                      ตัวเลขสถิติ
                      <input
                        type="number"
                        value={d.statValue || 0}
                        onChange={(e) => {
                          const a = [...data.dimensions];
                          a[idx] = { ...d, statValue: Number(e.target.value) };
                          setData({ ...data, dimensions: a });
                        }}
                      />
                    </label>
                  </div>
                  <h3>ข้อมูลกราฟ</h3>
                  <div className="chart-rows">
                    {(d.chartData || []).map((row, ri) => (
                      <div key={ri}>
                        <input
                          value={row.name}
                          onChange={(e) => {
                            const a = [...data.dimensions],
                              c = [...d.chartData];
                            c[ri] = { ...row, name: e.target.value };
                            a[idx] = { ...d, chartData: c };
                            setData({ ...data, dimensions: a });
                          }}
                        />
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) => {
                            const a = [...data.dimensions],
                              c = [...d.chartData];
                            c[ri] = { ...row, value: Number(e.target.value) };
                            a[idx] = { ...d, chartData: c };
                            setData({ ...data, dimensions: a });
                          }}
                        />
                        <button
                          className="icon-danger"
                          onClick={async () => {
                            if (!(await confirmDelete("ข้อมูลกราฟนี้"))) return;
                            const a = [...data.dimensions];
                            a[idx] = {
                              ...d,
                              chartData: d.chartData.filter((_, x) => x !== ri),
                            };
                            setData({ ...data, dimensions: a });
                          }}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      className="secondary"
                      onClick={() => {
                        const a = [...data.dimensions];
                        a[idx] = {
                          ...d,
                          chartData: [
                            ...(d.chartData || []),
                            { name: "ปีใหม่", value: 0 },
                          ],
                        };
                        setData({ ...data, dimensions: a });
                      }}
                    >
                      + เพิ่มข้อมูลกราฟ
                    </button>
                  </div>
                  <Dropzone
                    label={`เพิ่มภาพผลงาน (ปัจจุบัน ${d.images?.length || 0} ภาพ)`}
                    onFile={(f) => upload(f, "dimension", d.id)}
                  />
                  <div className="thumb-grid">
                    {d.images?.map((im, ii) => (
                      <article key={ii}>
                        <img src={im.url} />
                        <input
                          placeholder="คำบรรยายภาพ"
                          value={im.caption || ""}
                          onChange={(e) => {
                            const a = [...data.dimensions],
                              imgs = [...d.images];
                            imgs[ii] = { ...im, caption: e.target.value };
                            a[idx] = { ...d, images: imgs };
                            setData({ ...data, dimensions: a });
                          }}
                        />
                        <button
                          className="icon-danger"
                          onClick={async () => {
                            if (!(await confirmDelete("ภาพผลงานนี้"))) return;
                            const a = [...data.dimensions];
                            a[idx] = {
                              ...d,
                              images: d.images.filter((_, x) => x !== ii),
                            };
                            setData({ ...data, dimensions: a });
                          }}
                        >
                          <Trash2 />
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <AdminSafety token={token} reload={load} setNotice={setNotice} />
          )}
        </main>
      </div>
    </>
  );
}
function ImageFallbackGuard() {
  useEffect(() => {
    const handle = (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const original = img.dataset.originalSrc || img.src,
        candidates = imageCandidates(original);
      if (
        img.classList.contains("logo") ||
        img.classList.contains("contain") ||
        img.closest(".brand-logo")
      )
        candidates.push(OFFICIAL_LOGO);
      const unique = [...new Set(candidates)],
        index = Number(img.dataset.fallbackIndex || 0) + 1;
      if (index < unique.length) {
        img.dataset.originalSrc = original;
        img.dataset.fallbackIndex = String(index);
        img.src = unique[index];
      }
    };
    document.addEventListener("error", handle, true);
    return () => document.removeEventListener("error", handle, true);
  }, []);
  return null;
}
function OfficialFavicon() {
  useEffect(() => {
    const apply = () => {
      let icon = document.querySelector("link[rel='icon']");
      if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
      }
      if (!icon.href.endsWith(OFFICIAL_LOGO)) icon.href = OFFICIAL_LOGO;
      let apple = document.querySelector("link[rel='apple-touch-icon']");
      if (!apple) {
        apple = document.createElement("link");
        apple.rel = "apple-touch-icon";
        document.head.appendChild(apple);
      }
      if (!apple.href.endsWith(OFFICIAL_LOGO)) apple.href = OFFICIAL_LOGO;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
function FixedHeroTitle() {
  useEffect(() => {
    const apply = () => {
      const title = document.querySelector(".hero h1");
      if (!title || title.dataset.fixedLines === "1") return;
      const name = title.textContent.trim(),
        marker = "วัดสี่แยกสมเด็จ",
        at = name.indexOf(marker);
      if (at < 0) return;
      const first = document.createElement("span"),
        second = document.createElement("span");
      first.className = "hero-title-line";
      second.className = "hero-title-line";
      first.textContent = name.slice(0, at).trim();
      second.textContent = name.slice(at).trim();
      title.replaceChildren(first, second);
      title.dataset.fixedLines = "1";
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
function Router() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const h = () => setHash(location.hash);
    addEventListener("hashchange", h);
    return () => removeEventListener("hashchange", h);
  }, []);
  return (
    <>
      <OfficialFavicon />
      <ImageFallbackGuard />
      <FixedHeroTitle />
      {hash.startsWith("#/admin") ? <AdminApp /> : <PublicApp />}
    </>
  );
}
createRoot(document.getElementById("root")).render(<Router />);
