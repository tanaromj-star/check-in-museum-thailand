/**
 * Curated dataset of museums across Thailand.
 *
 * Sourced from Wikipedia (English + Thai):
 * - https://en.wikipedia.org/wiki/List_of_museums_in_Thailand
 * - https://th.wikipedia.org/wiki/รายชื่อพิพิธภัณฑ์ในประเทศไทย
 *
 * Coordinates are approximate (city/precinct level). See ADR-0001 for the
 * QR check-in mechanism that references these museums.
 */

export type MuseumCategory =
  | "history"
  | "art"
  | "archaeology"
  | "natural-history"
  | "science"
  | "culture"
  | "war-memory"
  | "royal"
  | "ethnography"
  | "medicine"
  | "transport"
  | "religion";

export interface Museum {
  id: string;
  name_thai: string;
  name_english: string;
  description_thai: string;
  description_english: string;
  province_thai: string;
  province_english: string;
  category: MuseumCategory;
  latitude: number;
  longitude: number;
  address_thai?: string;
  address_english?: string;
}

export const museumCategories: Record<
  MuseumCategory,
  { th: string; en: string }
> = {
  history: { th: "ประวัติศาสตร์", en: "History" },
  art: { th: "ศิลปะ", en: "Art" },
  archaeology: { th: "โบราณคดี", en: "Archaeology" },
  "natural-history": { th: "ธรรมชาติวิทยา", en: "Natural History" },
  science: { th: "วิทยาศาสตร์", en: "Science" },
  culture: { th: "วัฒนธรรม", en: "Culture" },
  "war-memory": { th: "อนุสรณ์สงคราม", en: "War Memory" },
  royal: { th: "พระราชวัง/ราชวงศ์", en: "Royal" },
  ethnography: { th: "ชาติพันธุ์วิทยา", en: "Ethnography" },
  medicine: { th: "การแพทย์", en: "Medicine" },
  transport: { th: "คมนาคม", en: "Transport" },
  religion: { th: "ศาสนา", en: "Religion" },
};

export const museums: Museum[] = [
  {
    id: "national-museum-bangkok",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ พระนคร",
    name_english: "National Museum Bangkok",
    description_thai:
      "พิพิธภัณฑ์แห่งชาติที่ใหญ่ที่สุดในประเทศไทย จัดแสดงโบราณวัตถุและงานศิลปะตั้งแต่สมัยก่อนประวัติศาสตร์จนถึงรัตนโกสินทร์ ตั้งอยู่ในพระราชวังหน้า ใกล้พระบรมมหาราชวัง",
    description_english:
      "The largest national museum in Thailand, displaying artifacts and art from prehistory to the Rattanakosin era. Located in the Wang Na (Front Palace) near the Grand Palace.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "history",
    latitude: 13.7434,
    longitude: 100.4924,
    address_thai: "ถนนหน้าพระลาน แขวงพระบรมมหาราชวัง เขตพระนคร",
    address_english: "Na Phra Lan Rd, Phra Borom Maha Ratchawang, Phra Nakhon",
  },
  {
    id: "museum-siam",
    name_thai: "พิพิธภัณฑ์สยาม",
    name_english: "Museum Siam",
    description_thai:
      "พิพิธภัณฑ์เชิงโต้ตอบที่บอกเล่าเรื่องราวของคนไทยและตัวตนของสยาม ผ่านนิทรรศการที่ทันสมัย ตั้งอยู่ในอาคารกระทรวงพาณิชย์เดิมริมแม่น้ำเจ้าพระยา",
    description_english:
      "An interactive museum telling the story of the Thai people and Siamese identity through modern exhibitions. Housed in the former Ministry of Commerce building on the Chao Phraya River.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "culture",
    latitude: 13.7229,
    longitude: 100.5128,
    address_thai: "ถนนสนามไชย แขวงพระบรมมหาราชวัง เขตพระนคร",
    address_english: "Sanam Chai Rd, Phra Nakhon",
  },
  {
    id: "jim-thompson-house",
    name_thai: "พิพิธภัณฑ์บ้านไทย จิม ทอมป์สัน",
    name_english: "Jim Thompson House Museum",
    description_thai:
      "บ้านไม้สไตล์ไทยของจิม ทอมป์สัน ชาวอเมริกันผู้ฟื้นฟูอุตสาหกรรมไหมไทย จัดแสดงศิลปะเอเชียตะวันออกเฉียงใต้และของสะสมส่วนตัวที่งดงาม",
    description_english:
      "Thai-style teak house of Jim Thompson, the American who revived the Thai silk industry. Displays Southeast Asian art and his exquisite personal collection.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "art",
    latitude: 13.7525,
    longitude: 100.5267,
    address_thai: "ถนนพระรามที่ 6 แขวงวังใหม่ เขตปทุมวัน",
    address_english: "Rama VI Rd, Wang Mai, Pathum Wan",
  },
  {
    id: "vimanmek-mansion",
    name_thai: "พิพิธภัณฑ์พระที่นั่งวิมานเมฆ",
    name_english: "Vimanmek Mansion Museum",
    description_thai:
      "วังไม้สักที่ใหญ่ที่สุดในโลก สร้างโดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว จัดแสดงเครื่องราชูปโภคภัณฑ์และของส่วนพระองค์",
    description_english:
      "The world's largest golden teakwood mansion, built by King Chulalongkorn. Displays royal household items and personal belongings.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "royal",
    latitude: 13.7649,
    longitude: 100.5044,
    address_thai: "ถนนอุณุกรกิจ แขวงดุสิต เขตดุสิต",
    address_english: "Uthong Nai Rd, Dusit",
  },
  {
    id: "suan-pakkad-palace",
    name_thai: "พิพิธภัณฑ์วังสวนผักกาด",
    name_english: "Suan Pakkad Palace Museum",
    description_thai:
      "วังเก่าของเจ้าพระยาพระคลัง (เฮนรี ดันน์) จัดแสดงโบราณวัตถุและงานศิลปะไทยตั้งแต่สมัยก่อนประวัติศาสตร์จนถึงบายก",
    description_english:
      "Former palace displaying Thai antiques and fine art from prehistoric to Ban Chiang periods, set in traditional gardens.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "art",
    latitude: 13.7619,
    longitude: 100.5332,
    address_thai: "ถนนศรีอยุธยา แขวงทุ่งพญาไท เขตพญาไท",
    address_english: "Sri Ayutthaya Rd, Phaya Thai",
  },
  {
    id: "royal-barges-museum",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ เรือพระราชพิธี",
    name_english: "National Museum of Royal Barges",
    description_thai:
      "โรงเรือพระราชพิธีที่จัดแสดงเรือพระราชพิธีที่สวยงามและประดับประดาอย่างวิจิตร ใช้ในพระราชพิธีสำคัญของชาติ",
    description_english:
      "Royal barge house displaying the ornately decorated ceremonial barges used in important state ceremonies.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "transport",
    latitude: 13.7656,
    longitude: 100.4881,
    address_thai: "คลองบางกอกใหญ่ แขวงอรุณอมรินทร์ เขตบางกอกใหญ่",
    address_english: "Bangkok Noi Canal, Arun Ammarin, Bangkok Noi",
  },
  {
    id: "siriraj-medical-museum",
    name_thai: "พิพิธภัณฑ์การแพทย์ศิริราช",
    name_english: "Siriraj Medical Museum",
    description_thai:
      "พิพิธภัณฑ์การแพทย์ที่โรงพยาบาลศิริราช จัดแสดงประวัติการแพทย์ไทย อวัยวะมนุษย์ และความก้าวหน้าทางการแพทย์",
    description_english:
      "Medical museum at Siriraj Hospital displaying the history of Thai medicine, human organs, and medical advances.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "medicine",
    latitude: 13.7597,
    longitude: 100.4853,
    address_thai: "ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย",
    address_english: "Wang Lang Rd, Siriraj, Bangkok Noi",
  },
  {
    id: "queen-sirikit-textiles",
    name_thai: "พิพิธภัณฑ์ผ้า ในสมเด็จพระนางเจ้าสิริกิติ์",
    name_english: "Queen Sirikit Museum of Textiles",
    description_thai:
      "พิพิธภัณฑ์ผ้าที่จัดแสดงเครื่องแต่งกายและผ้าไหมไทย อยู่ในอาคารกระทรวงพาณิชย์เดิม ภายในพระราชวังตากสิน",
    description_english:
      "Textile museum displaying Thai royal attire and silk, housed in the former Ministry of Commerce building at Grand Palace.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "culture",
    latitude: 13.7466,
    longitude: 100.4914,
    address_thai: "ถนนหน้าพระลาน แขวงพระบรมมหาราชวัง เขตพระนคร",
    address_english: "Na Phra Lan Rd, Phra Nakhon",
  },
  {
    id: "moca-bangkok",
    name_thai: "พิพิธภัณฑ์ศิลปะไทยร่วมสมัย (MOCA)",
    name_english: "Museum of Contemporary Art (MOCA)",
    description_thai:
      "พิพิธภัณฑ์ศิลปะร่วมสมัยที่จัดแสดงผลงานศิลปะไทยและเอเชีย ตั้งแต่คริสต์ศตวรรษที่ 17 จนถึงปัจจุบัน ในอาคาร 5 ชั้น",
    description_english:
      "Contemporary art museum displaying Thai and Asian art from the 17th century to the present in a five-story building.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "art",
    latitude: 13.8409,
    longitude: 100.5572,
    address_thai: "ถนนกำแพงเพชร 6 แขวงถนนนครเชียงใหม่ เขตหลักสี่",
    address_english: "Kamphaeng Phet 6 Rd, Lak Si",
  },
  {
    id: "bangkokian-museum",
    name_thai: "พิพิธภัณฑ์ชาวบางกอก",
    name_english: "Bangkokian Museum",
    description_thai:
      "พิพิธภัณฑ์เล็ก ๆ ในย่านบางลำพู จัดแสดงวิถีชีวิตของชาวกรุงเทพฯ ในอดีต ผ่านบ้านไม้เก่าและของใช้ในชีวิตประจำวัน",
    description_english:
      "A small museum in Bang Lamphu displaying the lifestyle of old Bangkok through traditional wooden houses and everyday objects.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "culture",
    latitude: 13.7695,
    longitude: 100.5025,
    address_thai: "ถนนเจริญกรุง แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์",
    address_english: "Charoen Krung Rd, Samphanthawong",
  },
  {
    id: "ancient-siam",
    name_thai: "เมืองโบราณ",
    name_english: "Ancient Siam",
    description_thai:
      "สวนวัฒนธรรมกลางแจ้งที่ใหญ่ที่สุดในโลก จำลองสถานที่สำคัญและอนุสาวรีย์ของไทยทุกภูมิภาค ไว้ในที่เดียว",
    description_english:
      "The world's largest outdoor cultural park, featuring miniature replicas of Thailand's important monuments from every region in one place.",
    province_thai: "สมุทรปราการ",
    province_english: "Samut Prakan",
    category: "culture",
    latitude: 13.5438,
    longitude: 100.6294,
    address_thai: "ถนนสุขุมวิท อำเภอบางพู้",
    address_english: "Sukhumvit Rd, Bang Pu",
  },
  {
    id: "erawan-museum",
    name_thai: "พิพิธภัณฑ์ช้างเผือก (พิพิธภัณฑ์อิระวัน)",
    name_english: "Erawan Museum",
    description_thai:
      "พิพิธภัณฑ์ที่โดดเด่นด้วยรูปปั้นช้างเผือกสามเศียษขนาดมหึมา ภายในจัดแสดงศิลปะและโบราณวัตถุที่สะสมโดยคุณหญิงลิ้นจี่ เสถียรสุวรรณ",
    description_english:
      "A museum famous for its giant three-headed elephant sculpture. Inside displays art and antiques collected by Lek Viriyaphant.",
    province_thai: "สมุทรปราการ",
    province_english: "Samut Prakan",
    category: "art",
    latitude: 13.6466,
    longitude: 100.6075,
    address_thai: "ถนนสุขุมวิท อำเภอเมือง",
    address_english: "Sukhumvit Rd, Mueang",
  },
  {
    id: "chiang-mai-national-museum",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ เชียงใหม่",
    name_english: "Chiang Mai National Museum",
    description_thai:
      "พิพิธภัณฑ์แห่งชาติที่จัดแสดงประวัติศาสตร์และโบราณคดีของภาคเหนือ โดยเฉพาะอารยธรรมล้านนา ตั้งอยู่ใจกลางเชียงใหม่",
    description_english:
      "National museum displaying the history and archaeology of northern Thailand, especially Lanna civilization. Located in central Chiang Mai.",
    province_thai: "เชียงใหม่",
    province_english: "Chiang Mai",
    category: "history",
    latitude: 18.7883,
    longitude: 98.9853,
    address_thai: "ถนนห้วยแก้ว อำเภอเมือง",
    address_english: "Huay Kaew Rd, Mueang",
  },
  {
    id: "lanna-folklife-museum",
    name_thai: "พิพิธภัณฑ์พิณิตพานิชย์ล้านนา (พิพิธภัณฑ์วิถีชีวิตล้านนา)",
    name_english: "Lanna Folklife Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงวิถีชีวิตและวัฒนธรรมล้านนา ตั้งอยู่ในอาคารศาลหลวงเก่าริมสามเหลี่ยมเมืองเชียงใหม่",
    description_english:
      "Museum displaying Lanna lifestyle and culture, housed in the old provincial court building near the Three Kings Monument.",
    province_thai: "เชียงใหม่",
    province_english: "Chiang Mai",
    category: "culture",
    latitude: 18.7862,
    longitude: 98.9749,
    address_thai: "ถนนพระปกเกล้า อำเภอเมือง",
    address_english: "Prapokkloa Rd, Mueang",
  },
  {
    id: "highland-people-discovery",
    name_thai: "พิพิธภัณฑ์เรียนรู้ชาวเขา",
    name_english: "Highland People Discovery Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงวัฒนธรรมและวิถีชีวิตของชาวเขาในประเทศไทย แต่ละเผ่าพันธุ์ บนดอยสุเทพ",
    description_english:
      "Museum displaying the culture and lifestyles of Thailand's highland hill tribes, on Doi Suthep.",
    province_thai: "เชียงใหม่",
    province_english: "Chiang Mai",
    category: "ethnography",
    latitude: 18.8026,
    longitude: 98.9167,
    address_thai: "ดอยสุเทพ อำเภอเมือง",
    address_english: "Doi Suthep, Mueang",
  },
  {
    id: "oub-kham-museum",
    name_thai: "พิพิธภัณฑ์อุบคำ",
    name_english: "Oub Kham Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงงานศิลปะและวัตถุโบราณของล้านนาและวัฒนธรรมที่เกี่ยวข้องกับราชสำนักล้านนา",
    description_english:
      "Museum displaying Lanna art and antiquities related to the Lanna royal court culture.",
    province_thai: "เชียงราย",
    province_english: "Chiang Rai",
    category: "culture",
    latitude: 19.9105,
    longitude: 99.8406,
    address_thai: "ถนนพหลโยธิน อำเภอเมือง",
    address_english: "Phaholyothin Rd, Mueang",
  },
  {
    id: "chao-sam-phraya",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ เจ้าสามพระยา",
    name_english: "Chao Sam Phraya National Museum",
    description_thai:
      "พิพิธภัณฑ์แห่งชาติในจังหวัดพระนครศรีอยุธยา จัดแสดงโบราณวัตถุที่ขุดค้นพบในกรุงสุพรรณภูมิและพระราชวังโบราณ",
    description_english:
      "National museum in Ayutthaya displaying artifacts excavated from ancient stupas and palace sites.",
    province_thai: "พระนครศรีอยุธยา",
    province_english: "Ayutthaya",
    category: "archaeology",
    latitude: 14.3692,
    longitude: 100.5877,
    address_thai: "ถนนอุทยาน อำเภอพระนครศรีอยุธยา",
    address_english: "Uthayan Rd, Phra Nakhon Si Ayutthaya",
  },
  {
    id: "phu-wiang-dinosaur",
    name_thai: "พิพิธภัณฑ์ไดโนเสาร์ภูเวียง",
    name_english: "Phu Wiang Dinosaur Museum",
    description_thai:
      "พิพิธภัณฑ์ไดโนเสาร์ที่ตั้งอยู่ในพื้นที่ขุดค้นพบซากดึกดำบรรพ์จริง จัดแสดงโครงกระดูกไดโนเสาร์ที่ค้นพบในจังหวัดขอนแก่น",
    description_english:
      "Dinosaur museum at the actual fossil excavation site, displaying dinosaur skeletons discovered in Khon Kaen.",
    province_thai: "ขอนแก่น",
    province_english: "Khon Kaen",
    category: "natural-history",
    latitude: 16.4419,
    longitude: 102.836,
    address_thai: "อำเภอภูเวียง",
    address_english: "Phu Wiang District",
  },
  {
    id: "sirindhorn-museum",
    name_thai: "พิพิธภัณฑ์สิรินธร",
    name_english: "Sirindhorn Museum",
    description_thai:
      "พิพิธภัณฑ์ไดโนเสาร์และซากดึกดำบรรพ์ที่ใหญ่ที่สุดในภาคตะวันออกเฉียงเหนือ จัดแสดงซากดึกดำบรรพ์ที่ค้นพบที่ภูกุ่มขาว จังหวัดกาฬสินธุ์",
    description_english:
      "The largest dinosaur and fossil museum in northeastern Thailand, displaying fossils found at Phu Kum Khao, Kalasin.",
    province_thai: "กาฬสินธุ์",
    province_english: "Kalasin",
    category: "natural-history",
    latitude: 16.3879,
    longitude: 103.5098,
    address_thai: "อำเภอสหัสขัณฑ์",
    address_english: "Sahatsakhan District",
  },
  {
    id: "khon-kaen-national-museum",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ ขอนแก่น",
    name_english: "Khon Kaen National Museum",
    description_thai:
      "พิพิธภัณฑ์แห่งชาติที่จัดแสดงประวัติศาสตร์และโบราณคดีของภาคตะวันออกเฉียงเหนือ ตั้งแต่สมัยก่อนประวัติศาสตร์จนถึงวัฒนธรรมทวารวดี",
    description_english:
      "National museum displaying the history and archaeology of northeastern Thailand from prehistoric to Dvaravati periods.",
    province_thai: "ขอนแก่น",
    province_english: "Khon Kaen",
    category: "history",
    latitude: 16.4419,
    longitude: 102.836,
    address_thai: "ถนนลำพูน อำเภอเมือง",
    address_english: "Lampun Rd, Mueang",
  },
  {
    id: "nakhon-si-thammarat-museum",
    name_thai: "พิพิธภัณฑสถานแห่งชาติ นครศรีธรรมราช",
    name_english: "Nakhon Si Thammarat National Museum",
    description_thai:
      "พิพิธภัณฑ์แห่งชาติที่จัดแสดงศิลปะและโบราณคดีของภาคใต้ รวมถึงพระพุทธรูปและวัตถุโบราณสมัยศรีวิชัย",
    description_english:
      "National museum displaying southern Thai art and archaeology, including Buddha images and Srivijaya-period artifacts.",
    province_thai: "นครศรีธรรมราช",
    province_english: "Nakhon Si Thammarat",
    category: "archaeology",
    latitude: 8.4334,
    longitude: 99.9622,
    address_thai: "ถนนศรีธรรมา อำเภอเมือง",
    address_english: "Si Thamma Rd, Mueang",
  },
  {
    id: "hellfire-pass",
    name_thai: "พิพิธภัณฑ์ช่องเขาขาด",
    name_english: "Hellfire Pass Memorial Museum",
    description_thai:
      "อนุสรณ์สถานที่รำลึกถึงเชลยศึกและกรรมกรที่เสียชีวิตในการสร้างทางรถไฟไทย-พม่า สมัยสงครามโลกครั้งที่ 2",
    description_english:
      "Memorial museum commemorating the prisoners of war and laborers who died building the Thailand-Burma Railway during WWII.",
    province_thai: "กาญจนบุรี",
    province_english: "Kanchanaburi",
    category: "war-memory",
    latitude: 14.0227,
    longitude: 99.5328,
    address_thai: "อำเภอไทรโยค",
    address_english: "Sai Yok District",
  },
  {
    id: "jeath-war-museum",
    name_thai: "พิพิธภัณฑ์อักษะเชลยศึก (JEATH)",
    name_english: "JEATH War Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงประวัติของเชลยศึกที่ถูกกักขังระหว่างการสร้างสะพานข้ามแม่น้ำแควและทางรถไฟมรณะ",
    description_english:
      "Museum displaying the history of prisoners of war held during the construction of the Bridge over the River Kwai and the Death Railway.",
    province_thai: "กาญจนบุรี",
    province_english: "Kanchanaburi",
    category: "war-memory",
    latitude: 14.0227,
    longitude: 99.5328,
    address_thai: "ถนนแสงชูโต อำเภอเมือง",
    address_english: "Saeng Chuto Rd, Mueang",
  },
  {
    id: "phuket-thai-hua",
    name_thai: "พิพิธภัณฑ์ภูเก็ตไทยหัว",
    name_english: "Phuket Thai Hua Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงประวัติศาสตร์ของชาวจีนฮกเกี้ยนในภูเก็ต ในอาคารโรงเรียนจีนเก่าแก่อายุกว่า 100 ปี",
    description_english:
      "Museum displaying the history of Hokkien Chinese in Phuket, housed in a century-old Chinese school building.",
    province_thai: "ภูเก็ต",
    province_english: "Phuket",
    category: "history",
    latitude: 7.8804,
    longitude: 98.3923,
    address_thai: "ถนนกระบี่ อำเภอเมือง",
    address_english: "Krabi Rd, Mueang",
  },
  {
    id: "tsunami-museum",
    name_thai: "พิพิธภัณฑ์สึนามิระหว่างประเทศ",
    name_english: "International Tsunami Museum",
    description_thai:
      "พิพิธภัณฑ์ที่รำลึกถึงเหตุการณ์สึนามิปี 2547 ที่ภาคใต้ของไทย จัดแสดงภาพและเรื่องราวของผู้ที่ได้รับผลกระทบ",
    description_english:
      "Museum commemorating the 2004 tsunami in southern Thailand, displaying photos and stories of those affected.",
    province_thai: "พังงา",
    province_english: "Phang Nga",
    category: "history",
    latitude: 8.4486,
    longitude: 98.5268,
    address_thai: "อำเภอตะกั่วป่า",
    address_english: "Takua Pa District",
  },
  {
    id: "national-science-museum",
    name_thai: "พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ",
    name_english: "National Science Museum",
    description_thai:
      "พิพิธภัณฑ์วิทยาศาสตร์และเทคโนโลยีที่จัดแสดงนิทรรศการเชิงโต้ตอบ สำหรับเยาวชนและครอบครัว ในอาคารรูปทรงเรขาคณิต",
    description_english:
      "Science and technology museum with interactive exhibitions for youth and families, in a geometric building.",
    province_thai: "ปทุมธานี",
    province_english: "Pathum Thani",
    category: "science",
    latitude: 14.0208,
    longitude: 100.525,
    address_thai: "ถนนเลียบคลองห้า อำเภอคลองหลวง",
    address_english: "Khlong Luang District",
  },
  {
    id: "thai-human-imagery",
    name_thai: "พิพิธภัณฑ์หุ่นขี้ผึ้งไทย",
    name_english: "Thai Human Imagery Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงหุ่นขี้ผึ้งของบุคคลสำคัญทางประวัติศาสตร์และศาสนา รวมถึงวิถีชีวิตไทยในอดีต",
    description_english:
      "Museum displaying wax figures of important historical and religious figures, and scenes of traditional Thai life.",
    province_thai: "นครปฐม",
    province_english: "Nakhon Pathom",
    category: "history",
    latitude: 13.821,
    longitude: 100.045,
    address_thai: "ถนนเพชรเกษม อำเภอนครชัยศรี",
    address_english: "Pet Kasem Rd, Nakhon Chai Si",
  },
  {
    id: "king-prajadhipok",
    name_thai: "พิพิธภัณฑ์พระบาทสมเด็จพระปกเกล้าเจ้าอยู่หัว",
    name_english: "King Prajadhipok Museum",
    description_thai:
      "พิพิธภัณฑ์ที่จัดแสดงพระราชประวัติและเครื่องราชูปโภคภัณฑ์ของรัชกาลที่ 7 ในอาคารสไตล์ฝรั่งเศสกลางกรุงเทพฯ",
    description_english:
      "Museum displaying the biography and royal belongings of King Rama VII, in a French-style building in central Bangkok.",
    province_thai: "กรุงเทพมหานคร",
    province_english: "Bangkok",
    category: "royal",
    latitude: 13.7525,
    longitude: 100.5044,
    address_thai: "ถนนพรานนก แขวงเสาชิงช้า เขตพระนคร",
    address_english: "Phran Nok Rd, Sao Ching Cha, Phra Nakhon",
  },
];

/** Get a museum by its id. */
export function getMuseumById(id: string): Museum | undefined {
  return museums.find((m) => m.id === id);
}

/** Unique provinces sorted alphabetically (English). */
export function getProvinces(): { thai: string; english: string }[] {
  const seen = new Map<string, { thai: string; english: string }>();
  for (const m of museums) {
    if (!seen.has(m.province_english)) {
      seen.set(m.province_english, {
        thai: m.province_thai,
        english: m.province_english,
      });
    }
  }
  return [...seen.values()].sort((a, b) =>
    a.english.localeCompare(b.english),
  );
}
